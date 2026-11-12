import { Link } from 'react-router-dom';
import {
  Botao,
  CabecalhoSubpagina,
  Titulo,
} from '../../../compartilhado/interface/indice';
import { etapasFixasJornada } from '../conteudo';

export default function EtapaJornada({
  etapaAtual,
  estadoPlataforma,
  aoAlternarTarefa,
  aoConcluirEtapa,
  aoAbrirEtapa,
  aoVoltar,
  aoAbrirVisao,
}) {
  const etapa = etapasFixasJornada.find(item => item.id === etapaAtual);
  if (!etapa) return null;

  const etapaEstado = (estadoPlataforma.etapasJornada || []).find(
    item => item.id === etapa.chave
  );
  const itensEstado = etapaEstado?.itens || [];

  return (
    <section className='space-y-6 py-4'>
      <CabecalhoSubpagina
        aoVoltar={aoVoltar}
        rotuloVoltar='Voltar'
        selo='ANTES DAS CHAVES'
        titulo={etapa.titulo}
        subtitulo={etapa.subtitulo}
      />

      <div className='grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]'>
        <div className='space-y-5'>
          <div className='space-y-3 rounded-xl bg-(--azul-fundo) p-4 sm:p-6'>
            {etapa.tarefas.map((tarefa, indice) => {
              const itemSalvo = itensEstado[indice];
              const marcado = Boolean(itemSalvo?.feito);
              return (
                <label
                  key={tarefa.titulo}
                  className='flex cursor-pointer items-start gap-4 rounded-xl bg-white p-4 transition-colors hover:bg-[#fff9f5] sm:p-5'
                >
                  <input
                    type='checkbox'
                    checked={marcado}
                    onChange={evento =>
                      aoAlternarTarefa(
                        etapa.chave,
                        indice,
                        evento.target.checked,
                        tarefa.titulo
                      )
                    }
                    className='mt-1 size-5 shrink-0 accent-(--laranja-principal)'
                  />
                  <span>
                    <strong className='block text-base font-bold text-(--azul-titulo)'>
                      {tarefa.titulo}
                    </strong>
                    <span className='mt-1 block text-sm text-(--texto-apoio)'>
                      {tarefa.descricao}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>

          <div className='flex flex-wrap gap-3'>
            {etapa.visaoAcao ? (
              <Botao
                cor='laranja'
                classe='rounded-full px-7'
                onClick={() => aoAbrirVisao(etapa.visaoAcao)}
              >
                {etapa.rotuloAcao}
              </Botao>
            ) : (
              <Botao
                como={Link}
                to={etapa.rotaAcao}
                cor='laranja'
                classe='rounded-full px-7'
              >
                {etapa.rotuloAcao}
              </Botao>
            )}
            <Botao
              variante='secundario'
              classe='rounded-full px-7'
              onClick={() => aoConcluirEtapa(etapa.chave, etapa.tarefas)}
            >
              {etapaEstado?.situacao === 'concluida'
                ? 'Etapa concluída ✓'
                : 'Concluir etapa'}
            </Botao>
            <Botao
              variante='secundario'
              classe='rounded-full px-7'
              onClick={() => aoAbrirVisao('pendencias')}
            >
              Ver minhas pendências
            </Botao>
          </div>
        </div>

        <aside className='space-y-5'>
          <div className='space-y-2.5'>
            <p className='text-xs font-bold tracking-wider text-(--azul-titulo) uppercase'>
              SEU CAMINHO ATÉ AS CHAVES
            </p>
            <div className='space-y-2.5'>
              {etapasFixasJornada.map(item => {
                const ativa = item.id === etapaAtual;
                return (
                  <button
                    key={item.id}
                    type='button'
                    aria-current={ativa ? 'step' : undefined}
                    onClick={() => aoAbrirEtapa(item.id)}
                    className={
                      'flex min-h-12 w-full items-center justify-center rounded-full px-5 text-sm font-bold transition-colors ' +
                      (ativa
                        ? 'bg-(--laranja-principal) text-white'
                        : 'bg-(--azul-fundo) text-(--azul-titulo) hover:bg-[#e6edf2]')
                    }
                  >
                    {item.numero} {item.tituloNav}
                  </button>
                );
              })}
            </div>
          </div>

          <div className='rounded-xl bg-(--laranja-fundo) p-5 sm:p-6'>
            <Titulo classe='text-lg font-extrabold'>
              Um foco para esta etapa
            </Titulo>
            <p className='mt-2 text-sm leading-relaxed text-(--azul-titulo)'>
              {etapa.foco}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
