import { useState } from 'react';
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Search,
  SlidersHorizontal,
  UserRound,
} from 'lucide-react';
import { hoje } from '../../../app/dados/bancoMvp';
import { agruparExecucoes, dataLocalExecucao } from '../utils/extratoLimpeza';
import { DialogoCasa } from '../../casa/components/casaUi';
import { imagemComodo } from '../utils/imagemComodo';
import './extratoLimpeza.css';

const normalizar = texto =>
  String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export default function ExtratoLimpeza({
  registros,
  limpezas,
  comodos,
  perfis,
}) {
  const [mes, setMes] = useState('todos');
  const [comodo, setComodo] = useState('todos');
  const [busca, setBusca] = useState('');
  const [execucaoId, setExecucaoId] = useState(null);
  const meses = [
    ...new Set(
      registros.map(e => dataLocalExecucao(e.realizada_em).slice(0, 7))
    ),
  ]
    .sort()
    .reverse();
  const atividades = new Map(limpezas.map(l => [l.id, l]));
  const espacos = new Map(comodos.map(c => [c.id, c]));
  const pessoas = new Map(perfis.map(p => [p.id, p.nome]));
  const execucao = registros.find(item => item.id === execucaoId);
  const atividadeDetalhe = atividades.get(execucao?.limpeza_id);
  const localDetalhe = espacos.get(atividadeDetalhe?.comodo_id);
  const filtrados = registros.filter(e => {
    const atividade = atividades.get(e.limpeza_id);
    return (
      (mes === 'todos' || dataLocalExecucao(e.realizada_em).startsWith(mes)) &&
      (comodo === 'todos' || atividade?.comodo_id === Number(comodo)) &&
      normalizar(
        `${atividade?.nome} ${atividade?.descricao} ${espacos.get(atividade?.comodo_id)?.nome} ${pessoas.get(e.perfil_id) ?? ''}`
      ).includes(normalizar(busca.trim()))
    );
  });
  const grupos = agruparExecucoes(filtrados);
  const diaAtual = hoje();

  function limparFiltros() {
    setMes('todos');
    setComodo('todos');
    setBusca('');
  }

  return (
    <section className='limpeza-extrato' aria-label='Registros de limpeza'>
      <div className='extrato-filtros'>
        <label className='extrato-busca'>
          <Search size={17} aria-hidden='true' />
          <input
            aria-label='Buscar no histórico de limpeza'
            placeholder='Buscar atividade, cômodo ou pessoa'
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </label>
        <label>
          <span>Período</span>
          <select
            aria-label='Período do histórico'
            value={mes}
            onChange={e => setMes(e.target.value)}
          >
            <option value='todos'>Todo o período</option>
            {meses.map(m => (
              <option value={m} key={m}>
                {new Date(`${m}-01T12:00:00`).toLocaleDateString('pt-BR', {
                  month: 'long',
                  year: 'numeric',
                })}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Cômodo</span>
          <select
            aria-label='Cômodo do histórico'
            value={comodo}
            onChange={e => setComodo(e.target.value)}
          >
            <option value='todos'>Todos os cômodos</option>
            {comodos.map(c => (
              <option value={c.id} key={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </label>
      </div>
      {grupos.length ? (
        <div className='extrato-dias'>
          {grupos.map(grupo => (
            <section
              className='extrato-dia'
              key={grupo.dia}
              aria-label={`Limpezas de ${new Date(`${grupo.dia}T12:00:00`).toLocaleDateString('pt-BR')}`}
            >
              <header>
                <h3>
                  {grupo.dia === diaAtual
                    ? 'Hoje'
                    : new Date(`${grupo.dia}T12:00:00`).toLocaleDateString(
                        'pt-BR',
                        { weekday: 'long' }
                      )}
                  <span>
                    {new Date(`${grupo.dia}T12:00:00`).toLocaleDateString(
                      'pt-BR',
                      { day: '2-digit', month: 'long', year: 'numeric' }
                    )}
                  </span>
                </h3>
                <span>
                  {grupo.execucoes.length}{' '}
                  {grupo.execucoes.length === 1 ? 'registro' : 'registros'}
                </span>
              </header>
              <ol>
                {grupo.execucoes.map(e => {
                  const atividade = atividades.get(e.limpeza_id);
                  const data = new Date(e.realizada_em);
                  return (
                    <li key={e.id}>
                      <button
                        className='extrato-registro'
                        type='button'
                        aria-haspopup='dialog'
                        onClick={() => setExecucaoId(e.id)}
                      >
                        <time
                          dateTime={e.realizada_em}
                          title={data.toLocaleString('pt-BR')}
                        >
                          <Clock3 size={12} aria-hidden='true' />
                          {data.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </time>
                        <span className='extrato-registro-corpo'>
                          <strong>{atividade?.nome}</strong>
                          <span>{espacos.get(atividade?.comodo_id)?.nome}</span>
                        </span>
                        <span className='extrato-registro-acao'>
                          <span className='extrato-concluida'>Concluída</span>
                          <ArrowUpRight size={16} aria-hidden='true' />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      ) : (
        <div className='extrato-vazio'>
          <SlidersHorizontal size={28} aria-hidden='true' />
          <h3>
            {registros.length
              ? 'Nenhum registro encontrado'
              : 'Seu primeiro cuidado aparece aqui'}
          </h3>
          <p>
            {registros.length
              ? 'Experimente outro período, cômodo ou termo de busca.'
              : 'Conclua uma limpeza para registrar a data e o horário no seu extrato.'}
          </p>
          {!!registros.length && (
            <button type='button' onClick={limparFiltros}>
              Limpar filtros
            </button>
          )}
        </div>
      )}
      {execucao && (
        <DialogoCasa
          titulo={atividadeDetalhe?.nome || 'Limpeza realizada'}
          aoFechar={() => setExecucaoId(null)}
        >
          <div className='extrato-detalhe'>
            {localDetalhe && (
              <figure className='extrato-detalhe-comodo'>
                <img src={imagemComodo(localDetalhe.tipo)} alt='' />
                <figcaption>
                  {localDetalhe.nome}
                  <span className='extrato-concluida'>Concluída</span>
                </figcaption>
              </figure>
            )}
            <dl className='extrato-detalhe-dados'>
              <div>
                <CalendarDays size={18} aria-hidden='true' />
                <dt>Realizada em</dt>
                <dd>
                  <time dateTime={execucao.realizada_em}>
                    {new Date(execucao.realizada_em).toLocaleString('pt-BR', {
                      dateStyle: 'long',
                      timeStyle: 'short',
                    })}
                  </time>
                </dd>
              </div>
              <div>
                <UserRound size={18} aria-hidden='true' />
                <dt>Responsável</dt>
                <dd>
                  {pessoas.get(execucao.perfil_id) || 'Perfil indisponível'}
                </dd>
              </div>
            </dl>
            <section className='extrato-detalhe-orientacoes'>
              <h3>Orientações da atividade</h3>
              <p>
                {atividadeDetalhe?.descricao?.trim() ||
                  'Esta atividade ainda não tem orientações cadastradas.'}
              </p>
            </section>
          </div>
        </DialogoCasa>
      )}
    </section>
  );
}
