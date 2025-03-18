/** utilitiy functions */

function fetchWithTimeout(url, options, timeout = 5000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), timeout)),
  ]);
}

export function fetchWithRetry(url, options, retries = 3, timeout = 5000) {
  function onError(err) {
    if (retries === 0) throw err;
    return fetchWithRetry(url, options, retries - 1, timeout);
  }

  return fetchWithTimeout(url, options, timeout).catch(onError);
}
