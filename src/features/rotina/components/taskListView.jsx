import { useState } from 'react';
import { CalendarDays, ChevronDown, Plus, Search } from 'lucide-react';
import { useBancoMvp } from '../../../app/dados/bancoMvp';
import { useCategoriasRotina } from '../hooks/useRotinaBanco';
import { listarCompromissos } from '../utils/compromissos';
import { chaveData, intervaloMes, rotuloMes } from '../utils/dates';
import { BotaoRotina, CabecalhoRotina } from './routineUi';
import ExtratoRotina from './routineStatement';

export default function VisaoListaTarefas({
  tarefas,
  mes,
  mostrarTudo,
  aoMostrarTudo,
  aoEscolherMes,
  aoCriar,
  aoAbrir,
  aoConcluir,
  aoReagendar,
}) {
  const categorias = useCategoriasRotina();
  const { limpezas, transacoes } = useBancoMvp();
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const { inicio, fim } = intervaloMes(mes);
  const hoje = chaveData();
  const termo = busca.trim().toLocaleLowerCase('pt-BR');

  const tarefasFiltradas = tarefas
    .filter(t => categoria === 'todas' || t.category === categoria)
    .map(t => ({
      id: 'tarefa-' + t.occurrenceId,
      data: t.occurrenceDate,
      tipo: 'tarefa',
      titulo: t.title,
      categoria: categorias.find(c => c.id === t.category)?.rotulo,
      detalhe: t.time,
      icone: t.icon,
      situacao: t.completed
        ? 'Concluída'
        : t.occurrenceDate < hoje
          ? 'Em atraso'
          : 'Pendente',
      estado: t.completed
        ? 'concluida'
        : t.occurrenceDate < hoje
          ? 'atrasada'
          : 'pendente',
      aoAbrir: () => aoAbrir(t),
      aoConcluir: () => aoConcluir(t),
      aoReagendar: () => aoReagendar(t),
    }));
  const corresponde = item =>
    [item.titulo, item.categoria].some(valor =>
      valor?.toLocaleLowerCase('pt-BR').includes(termo)
    );
  const atrasadas = tarefasFiltradas.filter(
    item => item.estado === 'atrasada' && corresponde(item)
  );
  const registros = [
    ...tarefasFiltradas.filter(item => item.estado !== 'atrasada'),
    ...(mostrarTudo && categoria === 'todas'
      ? listarCompromissos(limpezas, transacoes).map(item => ({
          ...item,
          categoria: item.tipo === 'limpeza' ? 'Limpeza' : 'Finanças',
          situacao: item.tipo === 'limpeza' ? item.detalhe : item.subtitulo,
          detalhe: item.tipo === 'conta' ? item.detalhe : '',
          icone: item.tipo === 'limpeza' ? 'limpeza' : undefined,
        }))
      : []),
  ].filter(
    item => item.data >= inicio && item.data <= fim && corresponde(item)
  );

  return (
    <div className='rotina-extrato rotina-extrato-tarefas'>
      <CabecalhoRotina titulo='Tarefas'>
        <BotaoRotina
          onClick={() => aoCriar(hoje >= inicio && hoje <= fim ? hoje : inicio)}
          classe='rotina-extrato-nova'
        >
          <Plus size={17} aria-hidden='true' /> Nova tarefa
        </BotaoRotina>
      </CabecalhoRotina>
      <section
        className='rotina-extrato-painel'
        aria-labelledby='agenda-mes-titulo'
      >
        <h2 id='agenda-mes-titulo' className='rotina-extrato-titulo'>
          Agenda do mês
        </h2>
        <div className='rotina-extrato-filtros'>
          <button
            type='button'
            aria-haspopup='dialog'
            onClick={aoEscolherMes}
            className='rotina-extrato-controle rotina-extrato-periodo'
          >
            <CalendarDays size={16} aria-hidden='true' /> {rotuloMes(mes)}{' '}
            <ChevronDown size={14} aria-hidden='true' />
          </button>
          <label className='rotina-extrato-controle rotina-extrato-busca'>
            <Search size={16} aria-hidden='true' />
            <input
              type='search'
              aria-label='Buscar na agenda'
              placeholder='Buscar'
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </label>
          <select
            aria-label='Categoria das tarefas'
            className='rotina-extrato-controle'
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
          >
            <option value='todas'>Todas as categorias</option>
            {categorias.map(item => (
              <option key={item.id} value={item.id}>
                {item.rotulo}
              </option>
            ))}
          </select>
          <label className='rotina-mostrar-tudo'>
            <input
              type='checkbox'
              checked={mostrarTudo}
              onChange={e => {
                aoMostrarTudo(e.target.checked);
                setCategoria('todas');
              }}
            />{' '}
            Mostrar tudo
          </label>
        </div>
        <ExtratoRotina
          registros={registros}
          atrasadas={atrasadas}
          rotulo='Agenda em lista'
          vazio={
            termo || categoria !== 'todas'
              ? 'Nenhum registro com esses filtros.'
              : 'Nenhum registro neste mês.'
          }
        />
      </section>
    </div>
  );
}
