/**
 * Formatting utilities for dates, times, and file sizes.
 */

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Parses a date string like "1/5/25" or "01-05-2025" into a Date object.
 */
function parseDateStr(dateStr) {
  const parts = dateStr.split(/[/\-.]/);
  if (parts.length !== 3) return null;

  let [p1, p2, p3] = parts.map(Number);

  // Determine format: could be M/D/Y or D/M/Y
  // WhatsApp typically uses M/D/Y in US and D/M/Y elsewhere.
  // Heuristic: if first part > 12, it's D/M/Y
  let month, day, year;
  if (p1 > 12) {
    day = p1;
    month = p2;
    year = p3;
  } else if (p2 > 12) {
    month = p1;
    day = p2;
    year = p3;
  } else {
    // Ambiguous — default to M/D/Y (WhatsApp US default)
    month = p1;
    day = p2;
    year = p3;
  }

  // Handle 2-digit year
  if (year < 100) {
    year += year < 50 ? 2000 : 1900;
  }

  return new Date(year, month - 1, day);
}

/**
 * Formats a date string from WhatsApp export into a readable format.
 * "1/5/25" → "January 5, 2025"
 *
 * @param {string} dateStr - Raw date string from parser
 * @returns {string} Formatted date
 */
export function formatDate(dateStr) {
  const date = parseDateStr(dateStr);
  if (!date || isNaN(date.getTime())) return dateStr;

  const month = MONTH_NAMES[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  // Check if it's today or yesterday
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDate = new Date(year, date.getMonth(), day);
  const diffDays = Math.floor((today - msgDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return `${month} ${day}, ${year}`;
}

/**
 * Formats time string for display. Passes through if already formatted.
 *
 * @param {string} timeStr - Time string like "10:30 AM" or "22:30"
 * @returns {string} Formatted time
 */
export function formatTime(timeStr) {
  return timeStr;
}

/**
 * Converts bytes to a human-readable file size string.
 *
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size like "2.4 KB"
 */
export function getFileSizeString(bytes) {
  if (bytes === 0) return "0 Bytes";

  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);

  return `${value.toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}
