// Simple rate limiting queue
const queue: (() => Promise<void>)[] = [];
let processing = false;

const RATE_LIMIT = {
  requests: 2, // Maximum requests per interval
  interval: 1000, // Interval in milliseconds
};

let requestCount = 0;
let lastReset = Date.now();

export async function executeWithRateLimit<T>(
  fn: () => Promise<T>
): Promise<T> {
  // Reset counter if interval has passed
  if (Date.now() - lastReset > RATE_LIMIT.interval) {
    requestCount = 0;
    lastReset = Date.now();
  }

  // If we're under the limit, execute immediately
  if (requestCount < RATE_LIMIT.requests) {
    requestCount++;
    return fn();
  }

  // Otherwise, queue the request
  return new Promise((resolve, reject) => {
    queue.push(async () => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });

    processQueue();
  });
}

async function processQueue() {
  if (processing || queue.length === 0) return;
  
  processing = true;
  
  while (queue.length > 0) {
    // Reset counter if interval has passed
    if (Date.now() - lastReset > RATE_LIMIT.interval) {
      requestCount = 0;
      lastReset = Date.now();
    }

    // Process requests that fit within the rate limit
    while (requestCount < RATE_LIMIT.requests && queue.length > 0) {
      const request = queue.shift();
      if (request) {
        requestCount++;
        await request();
      }
    }

    // Wait for the next interval if there are more requests
    if (queue.length > 0) {
      await new Promise(resolve => 
        setTimeout(resolve, RATE_LIMIT.interval - (Date.now() - lastReset))
      );
    }
  }

  processing = false;
}