import { useState } from 'react';
import { categoriasRotina, frequenciasRotina, diasSemanaRotina } from '../conteudo';
import { chaveData, analisarData } from '../utilitarios/datas';
import { validarTarefa } from '../utilitarios/tarefas';
import { useEspacoCompacto } from '../hooks/useEspacoCompacto';
import {
  CabecalhoModalRotina,
  BotaoRotina,
  CampoRotina,
  SelecaoRotina,
} from './InterfaceRotina';
import classesRotina from '../classesRotina';

export default function FormularioTarefa({
  tarefa,
  dataPadrao,
  aoSalvar,
  aoCancelar,
  aoAssistente,
  aoExcluir,
  idTitulo,
  apresentacao = 'modal',
}) {
  const [valores, setValores] = useState(() => ({
    title: tarefa?.title ?? '',
    category: tarefa?.category ?? '',
    frequency: tarefa?.frequency ?? 'none',
    date: tarefa?.date ?? dataPadrao ?? chaveData(),
    time: tarefa?.time ?? '',
    notes: tarefa?.notes ?? '',
    weekdays: tarefa?.weekdays ?? [],
    endDate: tarefa?.endDate ?? '',
  }));
  const [erros, setErros] = useState({});
  const compacto = useEspacoCompacto() && apresentacao === 'pagina';
  const [etapa, setEtapa] = useState(0);
  const etapas = ['Sua tarefa', 'Quando fazer', 'Detalhes'];
  const etapaCampo = nome =>
    ['title', 'category'].includes(nome)
      ? 0
      : ['date', 'time', 'frequency'].includes(nome)
        ? 1
        : 2;

  function irParaEtapa(proxima) {
    setEtapa(proxima);
    setErros({});
  }

  function avancar() {
    const proximosErros = Object.fromEntries(
      Object.entries(validarTarefa(valores)).filter(
        ([nome]) => etapaCampo(nome) === etapa
      )
    );
    setErros(proximosErros);
    const primeiro = Object.keys(proximosErros)[0];
    if (primeiro) {
      requestAnimationFrame(() =>
        document.getElementById(`${idTitulo}-${primeiro}`)?.focus()
      );
    } else {
      setEtapa(anterior => anterior + 1);
    }
  }

  function alterar(evento) {
    const { name, value } = evento.target;
    setValores(anterior => ({
      ...anterior,
      [name]: value,
      ...(name === 'frequency' &&
      value === 'weekly' &&
      !anterior.weekdays.length
        ? { weekdays: [analisarData(anterior.date || chaveData()).getDay()] }
        : {}),
      ...(name === 'frequency' && value === 'none' ? { endDate: '' } : {}),
    }));
    setErros(anterior => ({ ...anterior, [name]: undefined }));
  }

  function enviar(evento) {
    evento.preventDefault();
    const proximosErros = validarTarefa(valores);
    setErros(proximosErros);
    if (Object.keys(proximosErros).length) {
      const primeiro = Object.keys(proximosErros)[0];
      if (compacto) setEtapa(etapaCampo(primeiro));
      requestAnimationFrame(() =>
        document.getElementById(`${idTitulo}-${primeiro}`)?.focus()
      );
      return;
    }
    aoSalvar({
      ...valores,
      title: valores.title.trim(),
      notes: valores.notes.trim(),
    });
  }

  return (
    <div className={classesRotina.conteudoModal}>
      <CabecalhoModalRotina
        id={idTitulo}
        como={apresentacao === 'pagina' ? 'h1' : 'h2'}
        fita={apresentacao !== 'pagina'}
        titulo={tarefa ? 'Editar tarefa' : 'Criar nova tarefa'}
        descricao={
          tarefa
            ? apresentacao === 'pagina'
              ? undefined
              : 'Ajuste os detalhes para a tarefa caber no seu dia.'
            : 'Adicione uma tarefa manualmente ou peça sugestões para a IA.'
        }
      />
      {!tarefa && (
        <div
          className={classesRotina.modosCriacao}
          hidden={compacto && etapa > 0}
          role='group'
          aria-label='Como criar a tarefa'
        >
          <button type='button' aria-pressed='true'>
            Manual
          </button>
          <button type='button' onClick={aoAssistente}>
            Com a IA
          </button>
        </div>
      )}
      {compacto && (
        <nav className={classesRotina.etapasFormulario} aria-label='Etapas da tarefa'>
          {etapas.map((rotulo, indice) => (
            <button
              key={rotulo}
              type='button'
              aria-current={indice === etapa ? 'step' : undefined}
              onClick={() => irParaEtapa(indice)}
            >
              <span>{indice + 1}</span> {rotulo}
            </button>
          ))}
        </nav>
      )}
      <form
        onSubmit={evento => {
          if (compacto && etapa < 2) {
            evento.preventDefault();
            avancar();
          } else {
            enviar(evento);
          }
        }}
        noValidate
        className={classesRotina.formularioTarefa}
        data-etapado={compacto}
      >
        {Object.values(erros).some(Boolean) && (
          <p className={classesRotina.somenteLeitor} role='alert'>
            {Object.values(erros).filter(Boolean).join(' ')}
          </p>
        )}
        <div className={classesRotina.painelFormulario} data-etapado={compacto}>
          <div
            className={classesRotina.etapaFormulario}
            data-etapado={compacto}
            data-etapa='0'
            hidden={compacto && etapa !== 0}
          >
            <CampoRotina
              id={`${idTitulo}-title`}
              name='title'
              rotulo='Título da tarefa'
              placeholder='Ex: Lavar a roupa'
              maxLength={120}
              value={valores.title}
              onChange={alterar}
              required
              erro={erros.title}
            />
            <SelecaoRotina
              id={`${idTitulo}-category`}
              name='category'
              rotulo='Categoria'
              value={valores.category}
              onChange={alterar}
              required
              erro={erros.category}
            >
              <option value='' disabled>
                Selecionar categoria
              </option>
              {categoriasRotina.map(item => (
                <option key={item.id} value={item.id}>
                  {item.rotulo}
                </option>
              ))}
            </SelecaoRotina>
          </div>
          <div
            className={classesRotina.etapaFormulario}
            data-etapado={compacto}
            data-etapa='1'
            hidden={compacto && etapa !== 1}
          >
            <div className={classesRotina.camposRelacionados}>
              <CampoRotina
                id={`${idTitulo}-date`}
                name='date'
                rotulo={tarefa ? 'Data de início' : 'Data'}
                type='date'
                value={valores.date}
                onChange={alterar}
                required
                erro={erros.date}
              />
              <CampoRotina
                id={`${idTitulo}-time`}
                name='time'
                rotulo='Horário'
                type='time'
                value={valores.time}
                onChange={alterar}
                required
                erro={erros.time}
              />
            </div>
            <SelecaoRotina
              id={`${idTitulo}-frequency`}
              name='frequency'
              rotulo='Frequência'
              value={valores.frequency}
              onChange={alterar}
              erro={erros.frequency}
            >
              {frequenciasRotina.map(item => (
                <option key={item.id} value={item.id}>
                  {item.rotulo}
                </option>
              ))}
            </SelecaoRotina>
          </div>
          <div
            className={classesRotina.etapaFormulario}
            data-etapado={compacto}
            data-etapa='2'
            hidden={compacto && etapa !== 2}
          >
            {valores.frequency === 'weekly' && (
              <fieldset
                id={`${idTitulo}-weekdays`}
                tabIndex={-1}
                className={classesRotina.campoDiasSemana}
              >
                <legend className={classesRotina.rotuloCampo}>
                  Dias da semana
                </legend>
                <div className={classesRotina.opcoesDiasSemana}>
                  {diasSemanaRotina.map(dia => (
                    <label key={dia.id}>
                      <input
                        type='checkbox'
                        name='weekdays'
                        checked={valores.weekdays.includes(dia.id)}
                        onChange={evento => {
                          setValores(anterior => ({
                            ...anterior,
                            weekdays: evento.target.checked
                              ? [...anterior.weekdays, dia.id]
                              : anterior.weekdays.filter(
                                  valor => valor !== dia.id
                                ),
                          }));
                          setErros(anterior => ({
                            ...anterior,
                            weekdays: undefined,
                          }));
                        }}
                      />
                      <span>{dia.sigla}</span>
                    </label>
                  ))}
                </div>
                {erros.weekdays && (
                  <p className={classesRotina.erroCampo}>{erros.weekdays}</p>
                )}
              </fieldset>
            )}
            {valores.frequency !== 'none' && (
              <CampoRotina
                id={`${idTitulo}-endDate`}
                name='endDate'
                rotulo='Terminar repetição (opcional)'
                type='date'
                min={valores.date}
                value={valores.endDate}
                onChange={alterar}
                erro={erros.endDate}
              />
            )}
            <div
              className={`${classesRotina.campoFormulario} ${classesRotina.observacoesFormulario}`}
              data-observacoes
            >
              <label
                className={classesRotina.rotuloCampo}
                htmlFor={`${idTitulo}-notes`}
              >
                Observações (opcional)
              </label>
              <textarea
                id={`${idTitulo}-notes`}
                name='notes'
                className={classesRotina.areaTexto}
                maxLength={1000}
                placeholder='Ex: Usar sabão X, separar por cor...'
                value={valores.notes}
                onChange={alterar}
              />
            </div>
            {tarefa?.frequency !== 'none' && tarefa && (
              <p className={classesRotina.notaPequena}>
                As alterações serão aplicadas à repetição inteira. Para mudar só
                uma data, use Reagendar.
              </p>
            )}
          </div>
        </div>
        <div className={classesRotina.acoesFormulario}>
          <BotaoRotina
            tom='contorno'
            onClick={
              compacto && etapa > 0
                ? () => irParaEtapa(etapa - 1)
                : tarefa
                  ? aoExcluir
                  : aoCancelar
            }
          >
            {compacto && etapa > 0 ? 'Voltar' : tarefa ? 'Excluir' : 'Cancelar'}
          </BotaoRotina>
          <BotaoRotina type='submit'>
            {compacto && etapa < 2
              ? 'Continuar'
              : tarefa
                ? 'Salvar alterações'
                : 'Salvar tarefa'}{' '}
            <span aria-hidden='true'>→</span>
          </BotaoRotina>
        </div>
      </form>
    </div>
  );
}
