/**
 * Calendar utility functions for accurate date handling
 */

export interface CalendarDay {
  date: string;        // YYYY-MM-DD format
  dayName: string;     // Short day name (Mon, Tue, etc.)
  dayNumber: number;   // Day of month (1-31)
  fullDate: string;    // Full date string for display
  isToday: boolean;    // Whether this is today
  isWeekend: boolean;  // Whether this is weekend
}

/**
 * Get the last 7 days with accurate calendar information
 * @param timezone - Optional timezone (defaults to local timezone)
 * @returns Array of CalendarDay objects for the last 7 days
 */
export function getLast7Days(timezone?: string): CalendarDay[] {
  const days: CalendarDay[] = [];
  const today = new Date();
  
  // Create a date formatter for the specified timezone or local timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  // Generate the last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Format the date components
    const parts = formatter.formatToParts(date);
    const year = parts.find(part => part.type === 'year')?.value || '';
    const month = parts.find(part => part.type === 'month')?.value || '';
    const day = parts.find(part => part.type === 'day')?.value || '';
    const weekday = parts.find(part => part.type === 'weekday')?.value || '';
    
    const dateString = `${year}-${month}-${day}`;
    const dayNumber = parseInt(day);
    const isToday = i === 0;
    const isWeekend = weekday === 'Sat' || weekday === 'Sun';
    
    days.push({
      date: dateString,
      dayName: weekday,
      dayNumber,
      fullDate: `${weekday}, ${month}/${day}/${year}`,
      isToday,
      isWeekend
    });
  }
  
  return days;
}

/**
 * Format a date string for chart display
 * @param dateString - Date in YYYY-MM-DD format
 * @param format - Display format ('short', 'medium', 'full')
 * @returns Formatted date string
 */
export function formatDateForChart(dateString: string, format: 'short' | 'medium' | 'full' = 'short'): string {
  const date = new Date(dateString);
  
  switch (format) {
    case 'short':
      // Show day name and number (e.g., "Mon 15")
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        day: 'numeric'
      }).format(date);
      
    case 'medium':
      // Show month/day (e.g., "12/15")
      return new Intl.DateTimeFormat('en-US', {
        month: 'numeric',
        day: 'numeric'
      }).format(date);
      
    case 'full':
      // Show full date (e.g., "Mon, Dec 15")
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(date);
      
    default:
      return dateString;
  }
}

/**
 * Get today's date in YYYY-MM-DD format
 * @param timezone - Optional timezone (defaults to local timezone)
 * @returns Today's date string
 */
export function getTodayString(timezone?: string): string {
  const today = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const parts = formatter.formatToParts(today);
  const year = parts.find(part => part.type === 'year')?.value || '';
  const month = parts.find(part => part.type === 'month')?.value || '';
  const day = parts.find(part => part.type === 'day')?.value || '';
  
  return `${year}-${month}-${day}`;
}

/**
 * Check if a date string is today
 * @param dateString - Date in YYYY-MM-DD format
 * @param timezone - Optional timezone (defaults to local timezone)
 * @returns True if the date is today
 */
export function isToday(dateString: string, timezone?: string): boolean {
  return dateString === getTodayString(timezone);
}

/**
 * Get the start and end dates for a 7-day period ending today
 * @param timezone - Optional timezone (defaults to local timezone)
 * @returns Object with startDate and endDate strings
 */
export function get7DayPeriod(timezone?: string): { startDate: string; endDate: string } {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 6);
  
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const formatDate = (date: Date) => {
    const parts = formatter.formatToParts(date);
    const year = parts.find(part => part.type === 'year')?.value || '';
    const month = parts.find(part => part.type === 'month')?.value || '';
    const day = parts.find(part => part.type === 'day')?.value || '';
    return `${year}-${month}-${day}`;
  };
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(today)
  };
}
