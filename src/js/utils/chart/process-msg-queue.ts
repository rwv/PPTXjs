import { processSingleMsg } from "./process-single-msg";

/**
 * Process a queue of chart messages
 *
 * @param queue - Array of message objects with data property containing chart info
 * @returns True if any message was successfully processed, false otherwise
 */
export function processMsgQueue(queue: any[]): boolean {
  let anySucceeded = false;
  for (let i = 0; i < queue.length; i++) {
    if (processSingleMsg(queue[i].data)) {
      anySucceeded = true;
    }
  }
  return anySucceeded;
}
