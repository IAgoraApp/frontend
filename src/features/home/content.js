import { readState, occurrencesBetween } from '../rotina/utils/tasks';
import { dateKey, addDays } from '../rotina/utils/dates';

export const shortcuts = [
  { label: 'Limpeza', to: '/limpeza', icon: 'Frame' },
  { label: 'Cozinha', to: '/cozinha', icon: 'Frame1' },
  { label: 'Casa', to: '/casa', icon: 'Frame2' },
  { label: 'Finanças', to: '/financas', icon: 'Frame3' },
  { label: 'Marketplace', to: '/marketplace', icon: 'Frame4' },
  { label: 'Checklists', to: '/limpeza?visao=checklist', icon: 'Frame5' },
];

export function taskSummary() {
  const state = readState();
  const today = dateKey();
  const tasks = occurrencesBetween(
    state.tasks,
    state.completions,
    today,
    addDays(today, 7)
  );
  return {
    today: tasks.filter(item => item.occurrenceDate === today),
    upcoming: tasks.filter(item => item.occurrenceDate > today),
  };
}
