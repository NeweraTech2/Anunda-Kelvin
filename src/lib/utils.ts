/**
 * Format numbers into Kenyan Shilling (KSh) currency string
 * e.g., 14999 -> "KSh 14,999"
 */
export function formatKSh(amount: number): string {
  return `KSh ${amount.toLocaleString('en-KE')}`;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(currentPrice: number, previousPrice?: number): number {
  if (!previousPrice || previousPrice <= currentPrice) return 0;
  return Math.round(((previousPrice - currentPrice) / previousPrice) * 100);
}

/**
 * Format date string into human friendly format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Slugify a string for clean URL paths
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Calculate countdown remaining time
 */
export function calculateTimeRemaining(targetIsoString: string) {
  const total = Date.parse(targetIsoString) - Date.now();
  if (total <= 0) {
    return { total: 0, hours: 0, minutes: 0, seconds: 0, days: 0 };
  }
  const seconds = Math.floor((total / 100) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { total, days, hours, minutes, seconds };
}
