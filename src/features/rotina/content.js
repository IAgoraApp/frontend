export const categories = [
  { id: 'casa', label: 'Casa' },
  { id: 'cozinha', label: 'Cozinha' },
  { id: 'pessoal', label: 'Pessoal' },
  { id: 'financas', label: 'Finanças' },
];

export const quickActions = [
  { id: 'create', label: 'Criar tarefa', icon: 'edit' },
  { id: 'assistant', label: 'Sugestões da IA', icon: 'spark' },
  { id: 'calendar', label: 'Ver calendário', icon: 'calendar' },
  { id: 'list', label: 'Ver lista', icon: 'list' },
  { id: 'history', label: 'Histórico', icon: 'clock' },
];

export const frequencies = [
  { id: 'none', label: 'Sem repetição' },
  { id: 'daily', label: 'Diária' },
  { id: 'weekly', label: 'Semanal' },
  { id: 'monthly', label: 'Mensal' },
];

export const weekdays = [
  { id: 1, short: 'SEG', label: 'Segunda-feira' },
  { id: 2, short: 'TER', label: 'Terça-feira' },
  { id: 3, short: 'QUA', label: 'Quarta-feira' },
  { id: 4, short: 'QUI', label: 'Quinta-feira' },
  { id: 5, short: 'SEX', label: 'Sexta-feira' },
  { id: 6, short: 'SÁB', label: 'Sábado' },
  { id: 0, short: 'DOM', label: 'Domingo' },
];

export const reminderOptions = [
  { value: 'none', label: 'Sem lembrete' },
  { value: '0', label: 'Na hora da tarefa' },
  { value: '5', label: '5 minutos antes' },
  { value: '15', label: '15 minutos antes' },
  { value: '30', label: '30 minutos antes' },
  { value: '60', label: '1 hora antes' },
  { value: '1440', label: '1 dia antes' },
];

export const suggestionExamples = [
  { id: 'cleaning', title: 'Rotina de limpeza semanal', icon: 'spray' },
  { id: 'kitchen', title: 'Organizar a cozinha', icon: 'shirt' },
  { id: 'study', title: 'Planejar rotina de estudos', icon: 'study' },
];

export const agendaPreferences = [
  { id: 'tasks', label: 'Tarefas com data e horário' },
  { id: 'reminders', label: 'Lembretes de tarefas' },
  { id: 'updates', label: 'Atualizar mudanças no horário' },
];
