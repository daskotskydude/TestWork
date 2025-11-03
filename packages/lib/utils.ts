/**
 * Utility functions for ProcureLink
 */

/**
 * Generate a SKU based on category/name and timestamp
 * Format: {PREFIX}-{TIMESTAMP}
 * Example: DAIRY-1730678400, VEG-1730678401
 */
export function generateSKU(categoryOrName: string): string {
  // Extract first 3-5 letters from category/name, uppercase
  const prefix = categoryOrName
    .replace(/[^a-zA-Z]/g, '') // Remove non-letters
    .substring(0, 5)
    .toUpperCase() || 'ITEM';
  
  // Use last 6 digits of timestamp for uniqueness
  const timestamp = Date.now().toString().slice(-6);
  
  return `${prefix}-${timestamp}`;
}

/**
 * Generate a sequential SKU for a list of existing items
 * Format: {PREFIX}-{NUMBER}
 * Example: DAIRY-001, DAIRY-002
 */
export function generateSequentialSKU(
  categoryOrName: string,
  existingItems: Array<{ sku?: string | null }>
): string {
  // Extract prefix
  const prefix = categoryOrName
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 5)
    .toUpperCase() || 'ITEM';
  
  // Find highest number for this prefix
  const existingSKUs = existingItems
    .map(item => item.sku)
    .filter((sku): sku is string => !!sku)
    .filter(sku => sku.startsWith(prefix + '-'));
  
  let maxNumber = 0;
  existingSKUs.forEach(sku => {
    const parts = sku.split('-');
    if (parts.length === 2) {
      const num = parseInt(parts[1], 10);
      if (!isNaN(num) && num > maxNumber) {
        maxNumber = num;
      }
    }
  });
  
  // Increment and format with leading zeros
  const nextNumber = (maxNumber + 1).toString().padStart(3, '0');
  return `${prefix}-${nextNumber}`;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(d);
}
