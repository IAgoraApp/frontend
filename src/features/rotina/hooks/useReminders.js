import { useEffect, useRef } from 'react';
import { addDays, dateKey } from '../utils/dates';
import { occurrencesBetween } from '../utils/tasks';

export function useReminders(tasks, completions, notify) {
  const shown = useRef(new Set());

  useEffect(() => {
    function check() {
      const now = Date.now();
      const today = dateKey();
      const upcoming = occurrencesBetween(
        tasks,
        completions,
        today,
        addDays(today, 1)
      );
      for (const task of upcoming) {
        if (task.reminder === 'none') continue;
        const due =
          new Date(`${task.occurrenceDate}T${task.time}:00`).getTime() -
          Number(task.reminder) * 60_000;
        const key = `${task.occurrenceId}:${task.time}:${task.reminder}`;
        if (due <= now && now - due < 60_000 && !shown.current.has(key)) {
          shown.current.add(key);
          notify(`Lembrete: ${task.title} · ${task.time}`);
        }
      }
    }
    const interval = window.setInterval(check, 30_000);
    check();
    return () => window.clearInterval(interval);
  }, [tasks, completions, notify]);
}
