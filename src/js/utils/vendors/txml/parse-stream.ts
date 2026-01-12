import type { TXmlNode } from "./types";
import { tXml } from "./t-xml";

type StreamEmitter = {
  on: (event: string, handler: (data: unknown) => void) => StreamEmitter;
  emit: (event: string, data?: unknown) => void;
};

const createEmitter = (): StreamEmitter => {
  const listeners: Record<string, Array<(data: unknown) => void>> = {};
  const emitter: StreamEmitter = {
    on: (event, handler) => {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(handler);
      return emitter;
    },
    emit: (event, data) => {
      const handlers = listeners[event];
      if (!handlers) {
        return;
      }
      handlers.forEach((handler) => {
        handler(data);
      });
    },
  };
  return emitter;
};

const isEmitter = (value: unknown): value is StreamEmitter =>
  !!value &&
  typeof (value as StreamEmitter).on === "function" &&
  typeof (value as StreamEmitter).emit === "function";

const isReadableStream = (value: unknown): value is ReadableStream<Uint8Array> =>
  !!value && typeof (value as ReadableStream<Uint8Array>).getReader === "function";

const isAsyncIterable = (value: unknown): value is AsyncIterable<Uint8Array | string> =>
  !!value &&
  typeof (value as AsyncIterable<Uint8Array | string>)[Symbol.asyncIterator] === "function";

export const parseStream = (source: unknown, offsetOrCallback?: unknown): unknown => {
  let offset = 0;
  let callback: ((node: TXmlNode) => void) | undefined;

  if (typeof offsetOrCallback === "function") {
    callback = offsetOrCallback as (node: TXmlNode) => void;
  } else if (typeof offsetOrCallback === "string") {
    offset = offsetOrCallback.length + 2;
  } else if (typeof offsetOrCallback === "number") {
    offset = offsetOrCallback;
  }

  if (typeof source === "string") {
    throw new Error("parseStream expects a stream or async iterable, not a file path.");
  }

  let cursor = offset;
  let buffer = "";
  const decoder = typeof TextDecoder !== "undefined" ? new TextDecoder() : null;

  const appendChunk = (chunk: string | Uint8Array) => {
    if (typeof chunk === "string") {
      buffer += chunk;
      return;
    }
    if (decoder) {
      buffer += decoder.decode(chunk, { stream: true });
      return;
    }
    buffer += String(chunk);
  };

  const processBuffer = (emitter: StreamEmitter) => {
    let last = 0;
    for (;;) {
      const start = buffer.indexOf("<", cursor);
      if (start === -1) {
        if (last) {
          buffer = buffer.slice(last);
          cursor = 0;
        }
        return;
      }
      cursor = start + 1;
      const node = tXml({ xml: buffer, options: { pos: cursor, parseNode: true } });
      const nextPos = (node as { pos?: number }).pos;
      if (!nextPos || nextPos <= last) {
        if (last) {
          buffer = buffer.slice(last);
          cursor = 0;
        }
        return;
      }
      cursor = nextPos;
      if (cursor > buffer.length - 1) {
        if (last) {
          buffer = buffer.slice(last);
          cursor = 0;
        }
        return;
      }
      emitter.emit("xml", node);
      if (callback) {
        callback(node as TXmlNode);
      }
      last = cursor;
    }
  };

  if (isEmitter(source)) {
    source.on("data", (chunk: string | Uint8Array) => {
      appendChunk(chunk);
      processBuffer(source);
    });
    source.on("end", () => {
      source.emit("end");
    });
    return source;
  }

  const emitter = createEmitter();
  const consume = async () => {
    if (isReadableStream(source)) {
      const reader = source.getReader();
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          if (value) {
            appendChunk(value);
            processBuffer(emitter);
          }
        }
      } finally {
        reader.releaseLock();
      }
      emitter.emit("end");
      return;
    }

    if (isAsyncIterable(source)) {
      for await (const chunk of source) {
        appendChunk(chunk);
        processBuffer(emitter);
      }
      emitter.emit("end");
      return;
    }

    throw new Error("parseStream expects a stream or async iterable.");
  };

  void consume();
  return emitter;
};
