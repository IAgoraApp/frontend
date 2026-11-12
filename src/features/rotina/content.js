export const categoriasRotina = [
  { id: 'casa', rotulo: 'Casa' },
  { id: 'cozinha', rotulo: 'Cozinha' },
  { id: 'pessoal', rotulo: 'Pessoal' },
  { id: 'financas', rotulo: 'Finanças' },
];

export const acoesRapidasRotina = [
  { id: 'criar', rotulo: 'Criar tarefa', icone: 'editar' },
  { id: 'assistente', rotulo: 'Sugestões da IA', icone: 'brilho' },
  { id: 'calendario', rotulo: 'Ver calendário', icone: 'calendario' },
  { id: 'lista', rotulo: 'Ver lista', icone: 'lista' },
  { id: 'historico', rotulo: 'Histórico', icone: 'relogio' },
];

export const frequenciasRotina = [
  { id: 'none', rotulo: 'Sem repetição' },
  { id: 'daily', rotulo: 'Diária' },
  { id: 'weekly', rotulo: 'Semanal' },
  { id: 'monthly', rotulo: 'Mensal' },
];

export const diasSemanaRotina = [
  { id: 1, sigla: 'SEG', rotulo: 'Segunda-feira' },
  { id: 2, sigla: 'TER', rotulo: 'Terça-feira' },
  { id: 3, sigla: 'QUA', rotulo: 'Quarta-feira' },
  { id: 4, sigla: 'QUI', rotulo: 'Quinta-feira' },
  { id: 5, sigla: 'SEX', rotulo: 'Sexta-feira' },
  { id: 6, sigla: 'SÁB', rotulo: 'Sábado' },
  { id: 0, sigla: 'DOM', rotulo: 'Domingo' },
];

export const opcoesLembrete = [
  { valor: 'none', rotulo: 'Sem lembrete' },
  { valor: '0', rotulo: 'Na hora da tarefa' },
  { valor: '5', rotulo: '5 minutos antes' },
  { valor: '15', rotulo: '15 minutos antes' },
  { valor: '30', rotulo: '30 minutos antes' },
  { valor: '60', rotulo: '1 hora antes' },
  { valor: '1440', rotulo: '1 dia antes' },
];

export const exemplosSugestao = [
  { id: 'limpeza', titulo: 'Rotina de limpeza semanal', icone: 'limpeza' },
  { id: 'cozinha', titulo: 'Organizar a cozinha', icone: 'roupas' },
  { id: 'estudos', titulo: 'Planejar rotina de estudos', icone: 'estudos' },
];

export const preferenciasAgenda = [
  { id: 'tasks', rotulo: 'Tarefas com data e horário' },
  { id: 'reminders', rotulo: 'Lembretes de tarefas' },
  { id: 'updates', rotulo: 'Atualizar mudanças no horário' },
];
