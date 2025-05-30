
import { nanoid } from 'nanoid';

/**
 * Generates a unique ID for worker profiles
 * Format: MWAP-XXXXX-YYYY (where X is alphanumeric and Y is the current year)
 */
export const generateWorkerId = (): string => {
  const currentYear = new Date().getFullYear();
  const uniquePart = nanoid(5).toUpperCase();
  
  return `MWAP-${uniquePart}-${currentYear}`;
};

/**
 * Generate a random 4-digit OTP
 */
export const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};
