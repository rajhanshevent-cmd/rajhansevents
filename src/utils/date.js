import { BUSINESS_CONFIG } from './constants';

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
