export const money = value =>
  Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

export function today() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export const dateLabel = value =>
  value
    ? new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR')
    : 'Sem data';

export const normalize = value =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export function nextTaskDate(task) {
  if (task.frequency === 'Uma vez') return task.date;
  const date = new Date(`${task.date}T12:00:00`);
  if (task.frequency === 'Mensal') {
    const day = task.monthDay || date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth() + 1);
    const lastDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    date.setDate(Math.min(day, lastDay));
  } else {
    date.setDate(date.getDate() + 1);
    if (task.frequency === 'Semanal') {
      const days = task.days.length
        ? task.days.map(Number)
        : [new Date(`${task.date}T12:00:00`).getDay()];
      while (!days.includes(date.getDay())) date.setDate(date.getDate() + 1);
    }
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function financialProjection(plan) {
  const monthly =
    plan.rent +
    (plan.housingFees || 0) +
    plan.bills +
    plan.food +
    plan.transport;
  const initial = plan.rent * plan.deposit + plan.moving + plan.furniture;
  const target = initial + monthly * plan.reserveMonths;
  const missing = Math.max(0, target - plan.savings);
  return {
    monthly,
    initial,
    target,
    missing,
    monthlySaving: missing / Math.max(1, plan.months),
    available: plan.income - monthly,
  };
}
