/**
 * LocalStorage utilities for tracking user's created requests
 * Enables "Your Requests" feature without authentication
 */

const MY_REQUESTS_KEY = 'vouch_my_requests';

export interface StoredRequest {
  token: string;
  createdAt: string;
}

/**
 * Get all request tokens created by this user (device-based)
 */
export function getMyRequestTokens(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(MY_REQUESTS_KEY);
    if (!stored) return [];

    const requests: StoredRequest[] = JSON.parse(stored);
    return requests.map(r => r.token);
  } catch (err) {
    console.error('Failed to get my requests:', err);
    return [];
  }
}

/**
 * Get all stored requests with metadata
 */
export function getMyRequests(): StoredRequest[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(MY_REQUESTS_KEY);
    if (!stored) return [];

    return JSON.parse(stored);
  } catch (err) {
    console.error('Failed to get my requests:', err);
    return [];
  }
}

/**
 * Add a new request token to the user's list
 */
export function addMyRequest(token: string): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getMyRequests();

    // Don't add duplicates
    if (existing.some(r => r.token === token)) {
      return;
    }

    // Add new request
    const updated: StoredRequest[] = [
      { token, createdAt: new Date().toISOString() },
      ...existing,
    ];

    // Keep only last 50 requests to avoid localStorage bloat
    const trimmed = updated.slice(0, 50);

    localStorage.setItem(MY_REQUESTS_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.error('Failed to save request:', err);
  }
}

/**
 * Remove a request token from the user's list
 */
export function removeMyRequest(token: string): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getMyRequests();
    const updated = existing.filter(r => r.token !== token);
    localStorage.setItem(MY_REQUESTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to remove request:', err);
  }
}

/**
 * Check if a request token belongs to this user
 */
export function isMyRequest(token: string): boolean {
  const tokens = getMyRequestTokens();
  return tokens.includes(token);
}

/**
 * Clear all stored requests (for testing/debugging)
 */
export function clearMyRequests(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(MY_REQUESTS_KEY);
  } catch (err) {
    console.error('Failed to clear requests:', err);
  }
}
