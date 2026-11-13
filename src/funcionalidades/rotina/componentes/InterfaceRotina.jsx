import { ArrowLeft, X } from 'lucide-react';
import {
  Botao,
  CampoFormulario,
  Titulo,
} from '../../../compartilhado/interface/indice';
import Editar from '../../../ativos/vetores/rotina/editar.svg';
import Brilho from '../../../ativos/vetores/rotina/brilho.svg';
import Calendario from '../../../ativos/vetores/rotina/calendario.svg';
import Lista from '../../../ativos/vetores/rotina/lista.svg';
import Relogio from '../../../ativos/vetores/rotina/relogio.svg';
import Excluir from '../../../ativos/vetores/rotina/excluir.svg';
import Estudos from '../../../ativos/vetores/rotina/estudos.svg';
import Limpeza from '../../../ativos/vetores/rotina/limpeza.svg';
import Roupas from '../../../ativos/vetores/rotina/roupas.svg';
import ListaTarefas from '../../../ativos/vetores/rotina/lista-tarefas.svg';
import AssinaturaChecklist from '../../../ativos/vetores/rotina/assinatura-checklist.svg';
import AssinaturaRaios from '../../../ativos/vetores/rotina/assinatura-raios.svg';
import PontoCasa from '../../../ativos/vetores/rotina/ponto-casa.svg';
import PontoCozinha from '../../../ativos/vetores/rotina/ponto-cozinha.svg';
import PontoPessoal from '../../../ativos/vetores/rotina/ponto-pessoal.svg';
import PontoFinancas from '../../../ativos/vetores/rotina/ponto-financas.svg';
import { categoriasRotina } from '../conteudo';
import classesRotina from '../classesRotina';

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

const pontosRotina = {
  casa: PontoCasa,
  cozinha: PontoCozinha,
  pessoal: PontoPessoal,
  financas: PontoFinancas,
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

export function FitaRotina({ children = 'MINHA ROTINA', editorial = false }) {
  return (
    <span
      className={`${classesRotina.fita} ${editorial ? classesRotina.fitaEditorial : ''}`}
    >
      {children}
    </span>
  );
}

export function CabecalhoRotina({
  titulo,
  descricao,
  aoVoltar,
  fita = false,
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
          {fita && <FitaRotina />}
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
      <span className={classesRotina.notaAssinatura}>DO SEU JEITO</span>
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

export function SeloCategoriaRotina({ categoria, neutro = false }) {
  return (
    <span
      data-categoria
      className={`${classesRotina.seloCategoria} ${neutro ? classesRotina.seloNeutro : classesRotina[categoria]}`}
    >
      {categoriasRotina.find(item => item.id === categoria)?.rotulo ?? 'Pessoal'}
    </span>
  );
}

export function PontoCategoriaRotina({ categoria }) {
  return (
    <img
      className={classesRotina.pontoCategoria}
      src={pontosRotina[categoria]}
      width='14'
      height='14'
      alt=''
      aria-hidden='true'
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
  titulo = 'Seu dia está livre por aqui',
  descricao = 'Crie sua primeira tarefa ou peça uma sugestão.',
  aoCriar,
  aoAssistente,
  children,
}) {
  return (
    <div className={classesRotina.estadoVazio}>
      <div className={classesRotina.linhaTitulo}>
        <div className={classesRotina.copiaTitulo}>
          <FitaRotina />
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
  editorial = false,
  arte = false,
  como = 'h2',
  fita = true,
}) {
  return (
    <div className={classesRotina.linhaTitulo}>
      <div className={classesRotina.copiaTitulo}>
        {fita && (
          <FitaRotina editorial={editorial}>
            {editorial ? 'IAGORA · UM PASSO DE CADA VEZ' : 'MINHA ROTINA'}
          </FitaRotina>
        )}
        <Titulo como={como} id={id} tabIndex={-1} classe={classesRotina.tituloModal}>
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

export function SelecaoRotina({
  id,
  rotulo,
  erro,
  children,
  ...propriedades
}) {
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
