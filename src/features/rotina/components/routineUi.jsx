import { useCategoriasRotina } from '../hooks/useRotinaBanco';
import { ArrowLeft, X } from 'lucide-react';
import { Botao, CampoFormulario, Titulo } from '../../../shared/ui/index';
import Editar from '../assets/edit.svg';
import Brilho from '../assets/spark.svg';
import Calendario from '../assets/calendar.svg';
import Lista from '../assets/list.svg';
import Relogio from '../assets/clock.svg';
import Excluir from '../assets/trash.svg';
import Estudos from '../assets/study.svg';
import Limpeza from '../assets/spray.svg';
import Roupas from '../assets/shirt.svg';
import ListaTarefas from '../assets/checklist.svg';
import AssinaturaChecklist from '../assets/signature-checklist.svg';
import AssinaturaRaios from '../assets/assinatura-raios.svg';
import classesRotina from '../routineClasses';

const iconesRotina = {
  editar: Editar,
  brilho: Brilho,
  calendario: Calendario,
  lista: Lista,
  relogio: Relogio,
  excluir: Excluir,
  estudos: Estudos,
  limpeza: Limpeza,
  roupas: Roupas,
};

export function IconeRotina({ nome, classe = '', ...propriedades }) {
  return (
    <span
      className={`${classesRotina.icone} ${classe}`}
      aria-hidden='true'
      {...propriedades}
    >
      <img src={iconesRotina[nome] ?? iconesRotina.lista} alt='' />
    </span>
  );
}

export function BotaoRotina({
  tom = 'primario',
  classe = '',
  children,
  ...propriedades
}) {
  return (
    <Botao
      type='button'
      semEstilo
      cor='laranja'
      classe={`${classesRotina.botao} ${classesRotina[tom]} ${classe}`}
      {...propriedades}
    >
      {children}
    </Botao>
  );
}

export function CabecalhoRotina({
  titulo,
  descricao,
  aoVoltar,
  children,
  compacto = false,
}) {
  return (
    <div
      className={`${classesRotina.cabecalhoPagina} ${compacto ? classesRotina.cabecalhoCompacto : ''}`}
    >
      {aoVoltar && (
        <button
          type='button'
          className={classesRotina.botaoVoltar}
          onClick={aoVoltar}
        >
          <ArrowLeft size={18} aria-hidden='true' /> <span>Minha rotina</span>
        </button>
      )}
      <div className={classesRotina.linhaTitulo}>
        <div className={classesRotina.copiaTitulo}>
          <Titulo como='h1' classe={classesRotina.tituloPagina}>
            {titulo}
          </Titulo>
          {descricao && (
            <p className={classesRotina.descricaoPagina}>{descricao}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

export function ArteListaRotina({ assinatura = false }) {
  if (!assinatura) {
    return (
      <img
        className={classesRotina.listaIlustracao}
        src={ListaTarefas}
        width='220'
        height='150'
        alt=''
        aria-hidden='true'
      />
    );
  }
  return (
    <div className={classesRotina.assinatura} aria-hidden='true'>
      <span className={classesRotina.papelAssinatura} />
      <img
        className={classesRotina.checklistAssinatura}
        src={AssinaturaChecklist}
        width='136'
        height='92.7273'
        alt=''
      />
      <span className={classesRotina.notaAssinatura}>DO SEU JEITO ↗</span>
      <img
        className={classesRotina.raiosAssinatura}
        src={AssinaturaRaios}
        width='46'
        height='42'
        alt=''
      />
    </div>
  );
}

export function SeloCategoriaRotina({ categoria }) {
  const categoriasRotina = useCategoriasRotina();
  return (
    <span
      data-categoria
      className={`${classesRotina.seloCategoria} ${classesRotina.seloNeutro}`}
    >
      {categoriasRotina.find(item => item.id === categoria)?.rotulo ??
        'Sem categoria'}
    </span>
  );
}

export function PontoCategoriaRotina({ categoria }) {
  const cor = useCategoriasRotina().find(item => item.id === categoria)?.cor;
  return (
    <span
      aria-hidden='true'
      className='inline-block size-2.5 shrink-0 rounded-full'
      style={{ backgroundColor: cor || 'var(--azul-principal)' }}
    />
  );
}

export function AvisoRotina({ titulo, children, erro = false }) {
  return (
    <div
      className={`${classesRotina.aviso} ${erro ? classesRotina.avisoErro : ''}`}
      role={erro ? 'alert' : undefined}
    >
      {titulo && <strong>{titulo}</strong>}
      <p>{children}</p>
    </div>
  );
}

export function EstadoVazioRotina({
  titulo = 'Seu dia está livre por aqui.',
  descricao = 'Crie sua primeira tarefa ou peça uma sugestão.',
  aoCriar,
  aoAssistente,
  children,
}) {
  return (
    <div className={classesRotina.estadoVazio}>
      <div className={classesRotina.linhaTitulo}>
        <div className={classesRotina.copiaTitulo}>
          <Titulo como='h2' classe={classesRotina.tituloModal}>
            {titulo}
          </Titulo>
          <p className={classesRotina.apoio}>{descricao}</p>
        </div>
        <ArteListaRotina assinatura />
      </div>
      <div className={classesRotina.acoes} data-acoes>
        {aoCriar && <BotaoRotina onClick={aoCriar}>Criar tarefa</BotaoRotina>}
        {aoAssistente && (
          <BotaoRotina tom='secundario' onClick={aoAssistente}>
            Pedir sugestão
          </BotaoRotina>
        )}
        {children}
      </div>
    </div>
  );
}

export function BotaoFecharRotina({ aoClicar, rotulo = 'Fechar' }) {
  return (
    <button
      type='button'
      className={classesRotina.botaoFechar}
      aria-label={rotulo}
      onClick={aoClicar}
    >
      <X size={22} aria-hidden='true' />
    </button>
  );
}

export function CabecalhoModalRotina({
  id,
  titulo,
  descricao,
  arte = false,
  como = 'h2',
}) {
  return (
    <div className={classesRotina.linhaTitulo}>
      <div className={classesRotina.copiaTitulo}>
        <Titulo
          como={como}
          id={id}
          tabIndex={-1}
          classe={classesRotina.tituloModal}
        >
          {titulo}
        </Titulo>
        {descricao && <p className={classesRotina.apoio}>{descricao}</p>}
      </div>
      {arte && <ArteListaRotina assinatura />}
    </div>
  );
}

export function CampoRotina({ erro, classe = '', ...propriedades }) {
  const temSeletor =
    propriedades.type === 'date' || propriedades.type === 'time';
  return (
    <div className={`${classesRotina.envoltorioCampo} ${classe}`}>
      <CampoFormulario
        {...propriedades}
        classe={classesRotina.campoFormulario}
        classeEntrada={classesRotina.entrada}
        classeRotulo={classesRotina.rotuloCampo}
        onClick={
          propriedades.onClick ??
          (temSeletor
            ? evento => {
                try {
                  evento.currentTarget.showPicker?.();
                } catch (erroCapturado) {
                  void erroCapturado;
                }
              }
            : undefined)
        }
        aria-invalid={Boolean(erro)}
        aria-describedby={
          erro ? `${propriedades.id}-erro` : propriedades['aria-describedby']
        }
      />
      {erro && (
        <p className={classesRotina.erroCampo} id={`${propriedades.id}-erro`}>
          {erro}
        </p>
      )}
    </div>
  );
}

export function SelecaoRotina({ id, rotulo, erro, children, ...propriedades }) {
  return (
    <div className={classesRotina.campoFormulario}>
      <label className={classesRotina.rotuloCampo} htmlFor={id}>
        {rotulo}
      </label>
      <select
        id={id}
        className={classesRotina.entrada}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${id}-erro` : undefined}
        {...propriedades}
      >
        {children}
      </select>
      {erro && (
        <p className={classesRotina.erroCampo} id={`${id}-erro`}>
          {erro}
        </p>
      )}
    </div>
  );
}
