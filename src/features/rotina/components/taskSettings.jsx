import { Bell, BellOff, Check, Clock } from 'lucide-react';
import { useCategoriasRotina } from '../hooks/useRotinaBanco';
import { useState } from 'react';
import {
  frequenciasRotina,
  opcoesLembrete,
  diasSemanaRotina,
} from '../content';
import { chaveData, analisarData, diaRelativo } from '../utils/dates';
import {
  CabecalhoModalRotina,
  AvisoRotina,
  BotaoRotina,
  CampoRotina,
  SelecaoRotina,
} from './routineUi';
import classesRotina from '../routineClasses';

const titulosAjustes = {
  reagendar: 'Um novo horário para sua tarefa.',
  repeticao: 'Uma frequência que funciona.',
};

export default function AjustesTarefa({
  tipo,
  tarefa,
  aoSalvar,
  aoCancelar,
  idTitulo,
}) {
  const categoriasRotina = useCategoriasRotina();
  const [valores, setValores] = useState(() => ({
    date: tarefa.occurrenceDate,
    time: tarefa.time,
    scope: 'occurrence',
    reminder: tarefa.reminder ?? 'none',
    frequency: tarefa.frequency,
    weekdays: tarefa.weekdays?.length
      ? tarefa.weekdays
      : [analisarData(tarefa.date).getDay()],
    endDate: tarefa.endDate ?? '',
  }));
  const [erro, setErro] = useState('');
  function alterar(evento) {
    setValores(anterior => ({
      ...anterior,
      [evento.target.name]: evento.target.value,
    }));
    setErro('');
  }
  function enviar(evento) {
    evento.preventDefault();
    if (
      tipo === 'reagendar' &&
      (!analisarData(valores.date) ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(valores.time))
    ) {
      setErro('Informe uma data e um horário válidos.');
      return;
    }
    if (
      tipo === 'reagendar' &&
      valores.scope === 'series' &&
      tarefa.endDate &&
      valores.date > tarefa.endDate
    ) {
      setErro(
        'Escolha uma data antes do fim da repetição ou ajuste a repetição primeiro.'
      );
      return;
    }
    if (
      tipo === 'repeticao' &&
      valores.frequency === 'weekly' &&
      !valores.weekdays.length
    ) {
      setErro('Escolha pelo menos um dia da semana.');
      return;
    }
    if (
      tipo === 'repeticao' &&
      valores.endDate &&
      (!analisarData(valores.endDate) || valores.endDate < tarefa.date)
    ) {
      setErro(
        'O fim da repetição precisa ser igual ou posterior à data inicial.'
      );
      return;
    }
    aoSalvar(valores);
  }
  const rotuloDias = diasSemanaRotina
    .filter(dia => valores.weekdays.includes(dia.id))
    .map(dia => dia.rotulo.replace('-feira', '').toLowerCase())
    .join(', ');

  if (tipo === 'lembrete') {
    const ativo = valores.reminder !== 'none';
    const horario = new Date(
      new Date(`${tarefa.occurrenceDate}T${tarefa.time}:00`).getTime() -
        Number(valores.reminder) * 60_000
    );
    return (
      <form className='rotina-lembrete' onSubmit={enviar}>
        <header className='rotina-detalhe-cabecalho'>
          <span className='rotina-lembrete-icone'>
            <Bell size={22} aria-hidden='true' />
          </span>
          <div className='min-w-0 flex-1'>
            <h2
              id={idTitulo}
              tabIndex={-1}
              className='font-titulo text-2xl leading-tight font-extrabold'
            >
              Ajustar lembrete
            </h2>
            <p className='mt-1 text-sm text-(--texto-apoio)'>
              {tarefa.title} · {diaRelativo(tarefa.occurrenceDate)} às{' '}
              {tarefa.time}
            </p>
          </div>
        </header>
        <fieldset className='min-w-0'>
          <legend className='mb-2 text-sm font-bold'>Quando avisar?</legend>
          <div className='rotina-lembrete-opcoes'>
            {opcoesLembrete.map(({ valor, rotulo }) => (
              <label key={valor} className='rotina-lembrete-opcao'>
                <input
                  type='radio'
                  name='reminder'
                  value={valor}
                  checked={valores.reminder === valor}
                  onChange={alterar}
                  className='sr-only'
                />
                <span>
                  {valor === 'none' ? (
                    <BellOff size={16} aria-hidden='true' />
                  ) : (
                    <Clock size={16} aria-hidden='true' />
                  )}
                  {rotulo}
                  {valores.reminder === valor && (
                    <Check
                      size={16}
                      className='ml-auto shrink-0'
                      aria-hidden='true'
                    />
                  )}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div role='status' className='rotina-lembrete-previa'>
          {ativo && !Number.isNaN(horario.getTime()) ? (
            <>
              <strong>
                Aviso em{' '}
                {horario.toLocaleString('pt-BR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </strong>
              <p>
                O aviso aparece na plataforma enquanto esta aba estiver aberta.
              </p>
            </>
          ) : (
            <p>
              {ativo
                ? 'A tarefa precisa de data e horário para exibir o aviso.'
                : 'Você não receberá aviso para esta tarefa.'}
            </p>
          )}
        </div>
        <div className='rotina-lembrete-acoes'>
          <BotaoRotina type='submit'>Salvar lembrete</BotaoRotina>
        </div>
      </form>
    );
  }

  return (
    <div className={classesRotina.conteudoModal}>
      <CabecalhoModalRotina
        id={idTitulo}
        titulo={titulosAjustes[tipo]}
        descricao={tarefa.title}
      />
      <div className={classesRotina.espacoAjustes}>
        <form
          className={classesRotina.painelFormulario}
          onSubmit={enviar}
          noValidate
        >
          {erro && (
            <AvisoRotina erro titulo='Confira este detalhe.'>
              {erro}
            </AvisoRotina>
          )}
          {tipo === 'reagendar' && (
            <>
              <div
                className={classesRotina.camposRelacionados}
                data-relacionados
              >
                <CampoRotina
                  id='reagendar-data'
                  rotulo='Data'
                  name='date'
                  type='date'
                  required
                  value={valores.date}
                  onChange={alterar}
                />
                <CampoRotina
                  id='reagendar-horario'
                  rotulo='Horário'
                  name='time'
                  type='time'
                  required
                  value={valores.time}
                  onChange={alterar}
                />
              </div>
              <SelecaoRotina
                id='reagendar-escopo'
                name='scope'
                rotulo='Aplicar mudança'
                value={valores.scope}
                onChange={alterar}
              >
                <option value='occurrence'>Somente esta ocorrência</option>
                {tarefa.frequency !== 'none' && (
                  <option value='series'>Toda a repetição</option>
                )}
              </SelecaoRotina>
            </>
          )}
          {tipo === 'repeticao' && (
            <>
              <SelecaoRotina
                id='repeticao-frequencia'
                name='frequency'
                rotulo='Frequência'
                value={valores.frequency}
                onChange={alterar}
              >
                {frequenciasRotina.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.rotulo}
                  </option>
                ))}
              </SelecaoRotina>
              {valores.frequency === 'weekly' && (
                <fieldset className={classesRotina.campoDiasSemana}>
                  <legend className={classesRotina.rotuloCampo}>Dias</legend>
                  <div className={classesRotina.opcoesDiasSemana}>
                    {diasSemanaRotina.map(dia => (
                      <label key={dia.id}>
                        <input
                          type='checkbox'
                          checked={valores.weekdays.includes(dia.id)}
                          onChange={evento =>
                            setValores(anterior => ({
                              ...anterior,
                              weekdays: evento.target.checked
                                ? [...anterior.weekdays, dia.id]
                                : anterior.weekdays.filter(
                                    valor => valor !== dia.id
                                  ),
                            }))
                          }
                        />
                        <span>{dia.sigla}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
              {valores.frequency !== 'none' && (
                <CampoRotina
                  id='repeticao-fim'
                  name='endDate'
                  type='date'
                  min={tarefa.date || chaveData()}
                  rotulo='Terminar repetição (opcional)'
                  value={valores.endDate}
                  onChange={alterar}
                />
              )}
            </>
          )}
          <div className={classesRotina.acoes} data-acoes>
            <BotaoRotina type='submit'>Salvar</BotaoRotina>
            <BotaoRotina tom='secundario' onClick={aoCancelar}>
              Cancelar
            </BotaoRotina>
          </div>
        </form>
        <aside className={classesRotina.painelContexto}>
          <p className={classesRotina.sobrescrito}>VOCÊ ESTÁ AJUSTANDO</p>
          <h3>{tarefa.title}</h3>
          <p>
            {categoriasRotina.find(item => item.id === tarefa.category)?.rotulo}{' '}
            ·{' '}
            {frequenciasRotina
              .find(item => item.id === tarefa.frequency)
              ?.rotulo.toLowerCase()}
          </p>
          <hr />
          {tipo === 'reagendar' && (
            <>
              <div>
                <strong>Horário atual</strong>
                <p>
                  {diaRelativo(tarefa.occurrenceDate)} · {tarefa.time}
                </p>
              </div>
              <div>
                <strong>Novo horário</strong>
                <p>
                  {analisarData(valores.date)
                    ? `${diaRelativo(valores.date)} · ${valores.time || 'Escolha o horário'}`
                    : 'Escolha a data'}
                </p>
              </div>
              <p>
                Ajuste uma ocorrência ou a repetição inteira no campo ao lado.
              </p>
            </>
          )}
          {tipo === 'repeticao' && (
            <>
              <div>
                <strong>Dias escolhidos</strong>
                <p>
                  {valores.frequency === 'weekly'
                    ? rotuloDias || 'Escolha seus dias'
                    : frequenciasRotina.find(
                        item => item.id === valores.frequency
                      )?.rotulo}
                </p>
              </div>
              <p>
                Escolha dias que cabem na sua semana. Para uma tarefa pontual,
                mantenha sem repetição.
              </p>
            </>
          )}
          <BotaoRotina tom='secundario' onClick={aoCancelar}>
            Rever a tarefa
          </BotaoRotina>
        </aside>
      </div>
    </div>
  );
}
