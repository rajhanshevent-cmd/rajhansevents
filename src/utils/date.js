import { BUSINESS_CONFIG } from './constants.js';

const NUMBER_WORDS = {
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
  10: 'Ten',
  11: 'Eleven',
  12: 'Twelve',
  13: 'Thirteen',
  14: 'Fourteen',
  15: 'Fifteen',
  16: 'Sixteen',
  17: 'Seventeen',
  18: 'Eighteen',
  19: 'Nineteen',
  20: 'Twenty'
};

/**
 * Dynamically computes how many years Raj Hansh Events has been in service.
 * @param {string|number} [foundedInput] - Optional founding year or text from DB
 * @returns {{ count: number, word: string, text: string, label: string, since: string }}
 */
export function getServiceYears(foundedInput) {
  const currentYear = new Date().getFullYear();
  let foundedYear = BUSINESS_CONFIG.foundedYear || 2023;

  if (foundedInput) {
    const parsed = parseInt(String(foundedInput).replace(/\D/g, ''), 10);
    if (!isNaN(parsed) && parsed >= 1990 && parsed <= currentYear) {
      foundedYear = parsed;
    }
  }

  const count = Math.max(1, currentYear - foundedYear);
  const word = NUMBER_WORDS[count] || `${count}`;

  return {
    count,
    word,
    text: `${word} years`,
    label: `${count}+`,
    since: `SINCE ${foundedYear}`
  };
}

/**
 * Formats a date string, timestamp, or Date object into an organic relative time string (e.g., "2 weeks ago").
 * @param {string|Date|number} [dateInput]
 * @returns {string}
 */
export function getRelativeTime(dateInput) {
  if (!dateInput) return 'Recently';
  if (typeof dateInput === 'string' && (dateInput.includes('ago') || dateInput.includes('Recently'))) {
    return dateInput;
  }
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return typeof dateInput === 'string' ? dateInput : 'Recently';
  }
  const now = new Date();
  const diffInDays = Math.max(0, Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)));
  if (diffInDays <= 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }
  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
  const years = Math.floor(diffInDays / 365);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

