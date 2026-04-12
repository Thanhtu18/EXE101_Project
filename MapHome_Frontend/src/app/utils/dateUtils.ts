/**
 * Format a date to dd/mm/yyyy format
 * @param date - Date object or date string
 * @returns Formatted date string in dd/mm/yyyy format
 */
export const formatDateToDDMMYYYY = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Format a date to Vietnamese locale with dd/mm/yyyy format
 * @param date - Date object or date string
 * @param includeWeekday - Whether to include weekday (default: false)
 * @returns Formatted date string
 */
export const formatDateVietnamese = (
  date: Date | string,
  includeWeekday: boolean = false,
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  const baseFormat = `${day}/${month}/${year}`;

  if (includeWeekday) {
    const weekday = new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
    }).format(dateObj);
    return `${weekday}, ${baseFormat}`;
  }

  return baseFormat;
};
