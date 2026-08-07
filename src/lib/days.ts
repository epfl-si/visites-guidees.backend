import Holidays from 'date-holidays';

const holidays = new Holidays('CH', 'VD');

export function isBusinessDay(date: Date): boolean {
  const day = date.getDay();

  // Sunday or Saturday
  if (day === 0 || day === 6) {
    return false;
  }

  return !holidays.isHoliday(date);
}

export function isAtLeast7BusinessDaysBefore(visitDate: Date | string): boolean {
  const today = new Date();
  const visit = new Date(visitDate);

  today.setHours(0, 0, 0, 0);
  visit.setHours(0, 0, 0, 0);

  if (today >= visit) {
    return false;
  }

  let businessDays = 0;
  const current = new Date(today);

  while (current < visit) {
    current.setDate(current.getDate() + 1);

    if (isBusinessDay(current)) {
      businessDays++;
    }
  }
  return businessDays >= 7;
}