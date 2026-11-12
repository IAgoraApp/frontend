import { lerEstadoRotina, ocorrenciasEntre } from '../rotina/utils/tasks';
import {
  adicionarDias,
  chaveData,
  intervaloMes,
} from '../rotina/utils/dates';
import { lerEstadoCasa } from '../casa/content';
import { lerEstadoFinancas, statusConta, vencimentoConta } from '../financas/content';
import iconeLimpeza from './assets/Frame.svg';
import iconeCozinha from './assets/Frame1.svg';
import iconeCasa from './assets/Frame2.svg';
import iconeFinancas from './assets/Frame3.svg';
import iconeMercado from './assets/Frame4.svg';
import iconeChecklists from './assets/Frame5.svg';

export const atalhosInicio = [
  { rotulo: 'Limpeza', rota: '/limpeza', icone: iconeLimpeza },
  { rotulo: 'Cozinha', rota: '/cozinha', icone: iconeCozinha },
  { rotulo: 'Casa', rota: '/casa', icone: iconeCasa },
  { rotulo: 'Finanças', rota: '/financas', icone: iconeFinancas },
  { rotulo: 'Marketplace', rota: '/marketplace', icone: iconeMercado },
  { rotulo: 'Checklists', rota: '/checklists', icone: iconeChecklists },
];

export function obterResumoTarefas() {
  const estado = lerEstadoRotina();
  const hoje = chaveData();
  const tarefas = ocorrenciasEntre(
    estado.tasks,
    estado.completions,
    hoje,
    adicionarDias(hoje, 7)
  );
  return {
    hoje: tarefas.filter(item => item.occurrenceDate === hoje),
    proximas: tarefas.filter(item => item.occurrenceDate > hoje),
  };
}

export function obterEventosAgendaMes(referenciaMes) {
  const { inicio, fim } = intervaloMes(referenciaMes);
  const mesChave = `${referenciaMes.getFullYear()}-${String(referenciaMes.getMonth() + 1).padStart(2, '0')}`;
  const eventos = [];

  const estadoRotina = lerEstadoRotina();
  const ocorrencias = ocorrenciasEntre(
    estadoRotina.tasks,
    estadoRotina.completions,
    inicio,
    fim
  );
  for (const item of ocorrencias) {
    eventos.push({
      id: `rotina-${item.occurrenceId}`,
      data: item.occurrenceDate,
      titulo: item.title,
      subtitulo: `Minha rotina · ${item.time}`,
      rota: `/rotina?data=${item.occurrenceDate}`,
      tipo: 'rotina',
    });
  }

  const financas = lerEstadoFinancas();
  for (const conta of financas.dados.bills || []) {
    const ativaNoMes = conta.repeat
      ? conta.date.slice(0, 7) <= mesChave
      : conta.date.startsWith(mesChave);
    if (!ativaNoMes) continue;
    const status = statusConta(conta, mesChave, financas.dados.payments || {});
    if (status === 'paga') continue;
    const dataVencimento = vencimentoConta(conta, mesChave);
    eventos.push({
      id: `conta-${conta.id}-${mesChave}`,
      data: dataVencimento,
      titulo: conta.name,
      subtitulo: status === 'vencida' ? 'Conta vencida' : 'Vencimento mensal',
      rota: '/financas?visao=contas',
      tipo: 'financas',
    });
  }

  const casa = lerEstadoCasa();
  for (const manutencao of casa.dados.maintenance || []) {
    if (manutencao.completedAt) continue;
    if (!manutencao.date || !manutencao.date.startsWith(mesChave)) continue;
    eventos.push({
      id: `casa-${manutencao.id}`,
      data: manutencao.date,
      titulo: manutencao.title,
      subtitulo: `${manutencao.room} · Manutenção`,
      rota: '/casa?visao=manutencoes',
      tipo: 'casa',
    });
  }

  return eventos.sort((a, b) => a.data.localeCompare(b.data));
}
