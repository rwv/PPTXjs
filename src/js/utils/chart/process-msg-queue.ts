import { processSingleMsg } from "./process-single-msg";

/**
 * Process a queue of chart messages
 *
 * @param messageQueue - Array of message objects with data property containing chart info
 * @returns True if at least one message was successfully processed, false otherwise
 */
export function processMsgQueue(messageQueue: Array<{ data: unknown }>): boolean {
  if (!Array.isArray(messageQueue) || messageQueue.length === 0) {
    return false;
  }
  let processedAny = false;
  for (const message of messageQueue) {
    if (processSingleMsg(message.data)) {
      processedAny = true;
    }
  }
  return processedAny;
}
