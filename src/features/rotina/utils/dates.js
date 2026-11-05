const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function parseDate(value) {
  if (!datePattern.test(value ?? '')) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day, 12);
  return dateKey(date) === value ? date : null;
}

export function addDays(value, days) {
  const date = typeof value === 'string' ? parseDate(value) : new Date(value);
  date.setDate(date.getDate() + days);
  return dateKey(date);
}

export function monthRange(month) {
  return {
    start: dateKey(new Date(month.getFullYear(), month.getMonth(), 1)),
    end: dateKey(new Date(month.getFullYear(), month.getMonth() + 1, 0)),
  };
}

export function calendarDays(month) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1, 12);
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(
    first.getFullYear(),
    first.getMonth() + 1,
    0
  ).getDate();
  const count = Math.ceil((daysInMonth + offset) / 7) * 7;
  const start = addDays(first, -offset);
  return Array.from({ length: count }, (_, i) => addDays(start, i));
}

export function monthLabel(month) {
  const label = month.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatDate(value, options = { day: 'numeric', month: 'long' }) {
  return parseDate(value)?.toLocaleDateString('pt-BR', options) ?? '';
}

export function relativeDay(value, today = dateKey()) {
  if (value === today) return 'Hoje';
  if (value === addDays(today, 1)) return 'Amanhã';
  if (value === addDays(today, -1)) return 'Ontem';
  return formatDate(value);
}

export function nextWeekday(day, from = dateKey()) {
  return addDays(from, (day - parseDate(from).getDay() + 7) % 7);
}
