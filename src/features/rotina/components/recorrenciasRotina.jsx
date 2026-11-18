import { useAvisoPerfilA } from '../../../app/avisos/avisosPerfilA';
import { useState } from 'react';
import { CalendarDays, Pencil, Plus, Repeat2, Trash2 } from 'lucide-react';
import {
  alterarBanco,
  dataCurta,
  hoje,
  inserir,
  removerRegistro,
} from '../../../app/dados/bancoMvp';
import { DialogoCasa } from '../../casa/components/casaUi';
import {
  normalizarRecorrencia,
  proximaOcorrencia,
} from '../utils/recorrenciasMvp';
import { BotaoRotina, CabecalhoRotina } from './routineUi';
import './recorrenciasRotina.css';

const frequencias = {
  diaria: ['Diária', 'Todos os dias', 'dias'],
  semanal: ['Semanal', 'Toda semana', 'semanas'],
  mensal: ['Mensal', 'Todo mês', 'meses'],
};
const diasSemana = [
  ['segunda', 'Seg', 'Segunda-feira'],
  ['terca', 'Ter', 'Terça-feira'],
  ['quarta', 'Qua', 'Quarta-feira'],
  ['quinta', 'Qui', 'Quinta-feira'],
  ['sexta', 'Sex', 'Sexta-feira'],
  ['sabado', 'Sáb', 'Sábado'],
  ['domingo', 'Dom', 'Domingo'],
];
const diasMes = Array.from({ length: 31 }, (_, indice) => {
  const dia = indice + 1;
  return [dia, dia, `Dia ${dia}`];
});

function resumoFrequencia(regra) {
  const [, rotulo, unidade] = frequencias[regra.frequencia];
  const intervalo = regra.intervalo || 1;
  return intervalo === 1 ? rotulo : `A cada ${intervalo} ${unidade}`;
}

function resumoDias(regra) {
  if (regra.frequencia === 'semanal')
    return diasSemana
      .filter(([id]) => regra.dias_semana?.includes(id))
      .map(([, , nome]) => nome)
      .join(', ');
  if (regra.frequencia === 'mensal' && regra.dia_mes?.length)
    return `Dias ${regra.dia_mes.join(', ')} do mês`;
  return '';
}

function EditorRecorrencia({ regra, tarefas, aoSalvar, aoFechar, aoExcluir }) {
  const [frequencia, setFrequencia] = useState(regra?.frequencia || 'semanal');
  const [semana, setSemana] = useState(regra?.dias_semana || []);
  const [mes, setMes] = useState(regra?.dia_mes || []);
  const [erro, setErro] = useState('');
  const [confirmar, setConfirmar] = useState(false);
  const [rotulo, , unidade] = frequencias[frequencia];
  const semanal = frequencia === 'semanal';

  function enviar(evento) {
    evento.preventDefault();
    const campos = new FormData(evento.currentTarget);
    try {
      aoSalvar(
        normalizarRecorrencia({
          id: regra?.id,
          tarefa_id: Number(campos.get('tarefa')),
          frequencia,
          intervalo: Number(campos.get('intervalo')),
          dias_semana: semana,
          dia_mes: mes,
          inicio: campos.get('inicio'),
          fim: campos.get('fim') || null,
        })
      );
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <DialogoCasa
      titulo={regra ? 'Editar recorrência' : 'Nova recorrência'}
      aoFechar={aoFechar}
    >
      <form className='rotina-recorrencia-form' onSubmit={enviar}>
        <label>
          Tarefa
          <select name='tarefa' defaultValue={regra?.tarefa_id ?? ''} required>
            <option value='' disabled>
              Escolha uma tarefa
            </option>
            {tarefas.map(tarefa => (
              <option key={tarefa.id} value={tarefa.id}>
                {tarefa.nome}
              </option>
            ))}
          </select>
        </label>
        <div className='rotina-recorrencia-campos'>
          <label>
            Frequência
            <select
              value={frequencia}
              onChange={evento => setFrequencia(evento.target.value)}
            >
              {Object.entries(frequencias).map(([id, [nome]]) => (
                <option key={id} value={id}>
                  {nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            {`Repetir a cada (em ${unidade})`}
            <input
              type='number'
              name='intervalo'
              min='1'
              step='1'
              required
              defaultValue={regra?.intervalo ?? 1}
            />
          </label>
        </div>
        {frequencia !== 'diaria' && (
          <fieldset>
            <legend>{semanal ? 'Dias da semana' : 'Dias do mês'}</legend>
            <div className='rotina-recorrencia-dias'>
              {(semanal ? diasSemana : diasMes).map(([id, sigla, nome]) => (
                <label key={id}>
                  <input
                    type='checkbox'
                    aria-label={nome}
                    checked={(semanal ? semana : mes).includes(id)}
                    onChange={evento => {
                      const marcado = evento.target.checked;
                      (semanal ? setSemana : setMes)(anteriores =>
                        marcado
                          ? [...anteriores, id]
                          : anteriores.filter(item => item !== id)
                      );
                    }}
                  />
                  <span>{sigla}</span>
                </label>
              ))}
            </div>
            <p>Sem seleção, a repetição acompanha o dia da data de início.</p>
          </fieldset>
        )}
        <div className='rotina-recorrencia-campos'>
          <label>
            Começa em
            <input
              type='date'
              name='inicio'
              required
              defaultValue={regra?.inicio || hoje()}
            />
          </label>
          <label>
            Termina em (opcional)
            <input type='date' name='fim' defaultValue={regra?.fim || ''} />
          </label>
        </div>
        {erro && (
          <p role='alert' className='rotina-recorrencia-erro'>
            {erro}
          </p>
        )}
        {confirmar && (
          <div className='rotina-recorrencia-confirmacao'>
            <p>
              Remover a repetição {rotulo.toLowerCase()}? As ocorrências já
              criadas ficam na agenda.
            </p>
            <BotaoRotina tom='secundario' onClick={aoExcluir}>
              Confirmar remoção
            </BotaoRotina>
          </div>
        )}
        <div className='rotina-recorrencia-acoes'>
          {regra && (
            <button
              type='button'
              className='rotina-recorrencia-remover'
              onClick={() => setConfirmar(!confirmar)}
              aria-expanded={confirmar}
            >
              <Trash2 size={16} aria-hidden='true' /> Remover
            </button>
          )}
          <BotaoRotina tom='secundario' onClick={aoFechar}>
            Cancelar
          </BotaoRotina>
          <BotaoRotina type='submit'>Salvar repetição</BotaoRotina>
        </div>
      </form>
    </DialogoCasa>
  );
}

export default function RecorrenciasRotina({ regras, tarefas, execucoes }) {
  const [editor, setEditor] = useState(null);
  const notificar = useAvisoPerfilA();
  const comRegra = new Set(regras.map(item => item.tarefa_id));
  const novasTarefas = tarefas.filter(tarefa => !comRegra.has(tarefa.id));

  function gerar(regra) {
    let proxima;
    alterarBanco(db => {
      const atual = db.recorrencia_tarefa.find(item => item.id === regra.id);
      if (!atual) return;
      proxima = proximaOcorrencia(atual, db.execucao_tarefa, hoje());
      if (!proxima) return;
      const hora =
        db.tarefa
          .find(tarefa => tarefa.id === atual.tarefa_id)
          ?.prazo?.slice(11, 16) || '12:00';
      inserir(
        'execucao_tarefa',
        {
          tarefa_id: atual.tarefa_id,
          data_prevista: `${proxima}T${hora}:00`,
          concluida_em: null,
          status: 'pendente',
        },
        db
      );
    });
    notificar(
      proxima
        ? `Ocorrência adicionada à agenda para ${dataCurta(proxima)}.`
        : 'Nenhuma nova ocorrência neste período.'
    );
  }

  function salvar(regra) {
    alterarBanco(db => {
      if (
        db.recorrencia_tarefa.some(
          item => item.tarefa_id === regra.tarefa_id && item.id !== regra.id
        )
      )
        throw new Error('Essa tarefa já tem uma repetição.');
      if (regra.id) {
        const atual = db.recorrencia_tarefa.find(item => item.id === regra.id);
        if (!atual)
          throw new Error('Esta recorrência não está mais disponível.');
        Object.assign(atual, regra);
      } else inserir('recorrencia_tarefa', regra, db);
    });
    setEditor(null);
    notificar('Repetição salva.');
  }

  return (
    <section className='rotina-recorrencias'>
      <CabecalhoRotina
        titulo='Recorrências'
        descricao='Organize as tarefas que se repetem na sua rotina.'
      >
        <BotaoRotina
          disabled={!novasTarefas.length}
          onClick={() => setEditor({})}
        >
          <Plus size={17} aria-hidden='true' /> Nova recorrência
        </BotaoRotina>
      </CabecalhoRotina>
      {regras.length ? (
        <ul className='rotina-recorrencia-lista'>
          {regras.map(regra => {
            const tarefa = tarefas.find(item => item.id === regra.tarefa_id);
            const proxima = proximaOcorrencia(regra, execucoes, hoje());
            const dias = resumoDias(regra);
            return (
              <li className='rotina-recorrencia-card' key={regra.id}>
                <span className='rotina-recorrencia-icone'>
                  <Repeat2 size={22} aria-hidden='true' />
                </span>
                <div className='rotina-recorrencia-texto'>
                  <h2>{tarefa.nome}</h2>
                  <p>
                    <strong>{resumoFrequencia(regra)}</strong>
                    {dias && <span>{dias}</span>}
                  </p>
                  <small>
                    Desde {dataCurta(regra.inicio)}
                    {regra.fim && ` até ${dataCurta(regra.fim)}`}
                  </small>
                </div>
                <div className='rotina-recorrencia-proxima'>
                  <span>
                    <CalendarDays size={16} aria-hidden='true' />{' '}
                    {proxima
                      ? `Disponível para adicionar: ${dataCurta(proxima)}`
                      : 'Sem novas ocorrências'}
                  </span>
                  <div className='rotina-recorrencia-acoes'>
                    <BotaoRotina
                      tom='secundario'
                      aria-label={`Editar repetição de ${tarefa.nome}`}
                      onClick={() => setEditor(regra)}
                    >
                      <Pencil size={16} aria-hidden='true' /> Editar
                    </BotaoRotina>
                    <BotaoRotina
                      disabled={!proxima}
                      onClick={() => gerar(regra)}
                    >
                      Adicionar à agenda
                    </BotaoRotina>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className='mvp-vazio'>
          {tarefas.length
            ? 'Nenhuma tarefa se repete. Use Nova recorrência para configurar a primeira.'
            : 'Crie uma tarefa para configurar quando ela deve se repetir.'}
        </p>
      )}
      {editor && (
        <EditorRecorrencia
          regra={editor.id ? editor : undefined}
          tarefas={
            editor.id
              ? tarefas.filter(
                  tarefa =>
                    tarefa.id === editor.tarefa_id || !comRegra.has(tarefa.id)
                )
              : novasTarefas
          }
          aoSalvar={salvar}
          aoFechar={() => setEditor(null)}
          aoExcluir={() => {
            removerRegistro('recorrencia_tarefa', editor.id);
            setEditor(null);
            notificar('Repetição removida.');
          }}
        />
      )}
    </section>
  );
}
