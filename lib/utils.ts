/**
 * Utility functions for Vouch Web POC
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date relative to now (e.g., "2 days ago")
 */
export function formatRelativeDate(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  }

  return then.toLocaleDateString();
}

/**
 * Format Instagram handle (remove @ if present)
 */
export function formatInstagramHandle(handle: string | null | undefined): string | null {
  if (!handle) return null;
  return handle.startsWith('@') ? handle.slice(1) : handle;
}

/**
 * Create Instagram URL from handle
 */
export function getInstagramUrl(handle: string | null | undefined): string | null {
  if (!handle) return null;
  const cleanHandle = formatInstagramHandle(handle);
  return cleanHandle ? `https://instagram.com/${cleanHandle}` : null;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format URL (add https:// if missing)
 */
export function formatUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Get shareable URL for request
 */
export function getRequestShareUrl(shareToken: string): string {
  if (typeof window === 'undefined') {
    return `https://vouch.app/request/${shareToken}`;
  }
  return `${window.location.origin}/request/${shareToken}`;
}

/**
 * Create WhatsApp share URL
 */
export function getWhatsAppShareUrl(text: string, url: string): string {
  const message = encodeURIComponent(`${text}\n\n${url}`);
  return `https://wa.me/?text=${message}`;
}
