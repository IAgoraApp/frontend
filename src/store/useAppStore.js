import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { initialData } from '../data/demo.js';
import { nextTaskDate, today } from '../utils/format.js';

function previousChecklists() {
  const data = initialData();
  try {
    for (const cadence of ['dia', 'semana', 'mes']) {
      const checked = JSON.parse(
        localStorage.getItem(`iagora:limpeza:${cadence}`)
      );
      if (Array.isArray(checked))
        data.cleaningChecks.push(
          ...checked.filter(id => typeof id === 'string')
        );
    }
    const routine = JSON.parse(localStorage.getItem('iagora:rotina:limpeza'));
    if (Array.isArray(routine?.items)) {
      data.tasks.push(
        ...routine.items
          .filter(item => item?.id && item?.title)
          .map(item => ({
            id: crypto.randomUUID(),
            cleaningId: item.id,
            title: item.title,
            date: today(),
            time: '09:00',
            days: [String(new Date().getDay())],
            frequency:
              { dia: 'Diária', semana: 'Semanal', mes: 'Mensal' }[
                routine.cadence
              ] || 'Uma vez',
            category: 'Limpeza',
            reminder: true,
            done: false,
          }))
      );
    }
  } catch {
    /* Older data is optional; a fresh demonstration remains available. */
  }
  return data;
}

const storage = {
  getItem: name => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      globalThis.dispatchEvent(new Event('iagora-storage-error'));
    }
  },
  removeItem: name => {
    try {
      localStorage.removeItem(name);
    } catch {
      /* State remains usable in memory. */
    }
  },
};

export const useAppStore = create(
  persist(
    (set, get) => ({
      data: previousChecklists(),
      account: null,
      session: false,
      notice: '',
      notify: notice => set({ notice }),
      update: patch => set(state => ({ data: { ...state.data, ...patch } })),
      saveItem: (collection, item) =>
        set(state => ({
          data: {
            ...state.data,
            [collection]: item.id
              ? state.data[collection].map(old =>
                  old.id === item.id ? item : old
                )
              : [
                  ...state.data[collection],
                  { ...item, id: crypto.randomUUID() },
                ],
          },
        })),
      removeItem: (collection, id) =>
        set(state => ({
          data: {
            ...state.data,
            [collection]: state.data[collection].filter(item => item.id !== id),
          },
        })),
      toggle: (collection, id) =>
        set(state => ({
          data: {
            ...state.data,
            [collection]: state.data[collection].includes(id)
              ? state.data[collection].filter(value => value !== id)
              : [...state.data[collection], id],
          },
        })),
      completeTask: id => {
        const { data } = get();
        const task = data.tasks.find(item => item.id === id);
        if (!task) return;
        if (task.done) {
          get().update({
            tasks: data.tasks.map(item =>
              item.id === id ? { ...item, done: false } : item
            ),
            cleaningChecks: data.cleaningChecks.filter(
              value => value !== task.cleaningId
            ),
          });
          return;
        }
        get().update({
          cleaningChecks:
            task.cleaningId && !data.cleaningChecks.includes(task.cleaningId)
              ? [...data.cleaningChecks, task.cleaningId]
              : data.cleaningChecks,
          completions: [
            ...data.completions,
            {
              id: crypto.randomUUID(),
              taskId: id,
              title: task.title,
              date: new Date().toISOString(),
            },
          ],
          tasks: data.tasks.map(item =>
            item.id === id
              ? {
                  ...item,
                  done: task.frequency === 'Uma vez',
                  date: nextTaskDate(task),
                }
              : item
          ),
        });
        get().notify(
          task.frequency === 'Uma vez'
            ? 'Tarefa concluída! Seu histórico foi atualizado.'
            : 'Tarefa concluída! A próxima ocorrência já está agendada.'
        );
      },
      addCleaningTasks: items => {
        const { data } = get();
        const fresh = items.filter(
          item => !data.tasks.some(task => task.cleaningId === item.cleaningId)
        );
        get().update({
          tasks: [
            ...data.tasks,
            ...fresh.map(item => ({ ...item, id: crypto.randomUUID() })),
          ],
        });
        get().notify(
          fresh.length
            ? `${fresh.length} atividade(s) adicionada(s) à Minha rotina.`
            : 'Essas atividades já estão na sua rotina.'
        );
      },
      startDemo: () => {
        const state = get();
        if (state.account && !state.account.demo) {
          get().notify(
            'Já existe uma conta local. Entre com seu e-mail e senha ou use a recuperação local para preservar seus dados.'
          );
          return false;
        }
        if (state.account) set({ session: true });
        else
          set({
            data: state.data,
            account: { demo: true, email: 'demo@iagora.local' },
            session: true,
          });
        return true;
      },
      register: account => {
        const data = get().account ? initialData() : get().data;
        set({
          data: {
            ...data,
            person: {
              ...data.person,
              name: account.name,
              email: account.email,
            },
          },
          account,
          session: true,
        });
      },
      login: () => set({ session: true }),
      logout: () => set({ session: false, notice: '' }),
      deleteAccount: () => {
        set({ data: initialData(), account: null, session: false, notice: '' });
        try {
          for (const key of Object.keys(localStorage))
            if (key.startsWith('iagora:')) localStorage.removeItem(key);
        } catch {
          /* In-memory data has already been cleared. */
        }
      },
    }),
    {
      name: 'iagora:app:v1',
      version: 1,
      storage: createJSONStorage(() => storage),
      partialize: ({ data, account, session }) => ({ data, account, session }),
      merge: (persisted, current) => ({
        ...current,
        ...persisted,
        data: { ...initialData(), ...(persisted?.data || {}) },
      }),
    }
  )
);
