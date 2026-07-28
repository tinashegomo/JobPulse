const RETRYABLE_STATUSES = [429, 500, 502, 503, 504];
const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 1000;

/**
 * Check if an error is retryable.
 * @param {object} err
 * @returns {boolean}
 */
export function isRetryable(err) {
  const status = err?.status || err?.response?.status;
  return RETRYABLE_STATUSES.includes(status);
}

/**
 * Sleep for a given number of milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute an async function with automatic retry and exponential backoff.
 * @param {() => Promise<T>} fn - Async function to execute
 * @param {string} label - Label for log messages
 * @returns {Promise<T>}
 * @throws {Error} - Rethrows if all retries exhausted or error is not retryable
 */
export async function withRetry(fn, label = 'AI') {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      if (!isRetryable(err) || attempt === MAX_RETRIES) {
        throw err;
      }

      const delay = BACKOFF_BASE_MS * Math.pow(2, attempt - 1);
      console.warn(`[${label}] Attempt ${attempt} failed (status ${err?.status}), retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }

  throw lastError;
}
