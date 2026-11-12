import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Botao,
  Container,
  Titulo,
} from '../../compartilhado/interface/indice';
import Rodape from '../../compartilhado/Rodape';
import {
  calcularProgressoJornada,
  lerEstadoPlataforma,
} from '../../aplicacao/estado/estadoPlataforma';
import { atalhosPreparacao } from './conteudo';
import fotoPlanejamento from '../../ativos/imagens/fotografias/planejamento-mudanca.png';
import raiosDesenhados from '../../ativos/vetores/assinaturas/raios-desenhados.svg';
import marcaConcluido from '../../ativos/vetores/comuns/marca-concluido.svg';

export default function InicioPreparacao() {
  const [estado, setEstado] = useState(lerEstadoPlataforma);

  useEffect(() => {
    const atualizar = () => setEstado(lerEstadoPlataforma());
    window.addEventListener('iagora:estado', atualizar);
    return () => window.removeEventListener('iagora:estado', atualizar);
  }, []);

  const progresso = calcularProgressoJornada(estado);
  const metasAtivas = (estado.metasJornada || []).filter(
    meta => !meta.concluida
  ).length;
  const pendenciasAtivas = (estado.pendenciasJornada || []).filter(
    item => !item.feito
  ).length;
  const momentoAtual =
    estado.perfil?.momentoRotulo || 'Vou morar sozinho';

  return (
    <div
      lang='pt-BR'
      className='min-w-0 flex-1 bg-white font-corpo text-(--azul-titulo) [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-(--laranja-principal)'
    >
      <Container como='main' classe='py-8 sm:py-12'>
        <div className='flex flex-col justify-between gap-6 lg:flex-row lg:items-center'>
          <Titulo
            como='h1'
            classe='text-3xl leading-tight font-extrabold sm:text-4xl'
          >
            Oi! Vamos preparar sua mudança?
          </Titulo>
          <div className='flex min-w-0 items-center justify-between gap-6 rounded-[10px] bg-(--azul-fundo) px-5 py-4 lg:w-[445px]'>
            <div className='min-w-0'>
              <p className='text-xs font-bold tracking-[1.5px] text-[#e13b00]'>
                SEU MOMENTO
              </p>
              <p className='mt-1 truncate font-bold text-(--azul-titulo)'>
                {momentoAtual}
              </p>
            </div>
            <Link
              to='/onboarding'
              className='inline-flex min-h-11 shrink-0 items-center font-bold text-[#e13b00]'
            >
              Alterar ↗
            </Link>
          </div>
        </div>

        <section className='mt-10' aria-labelledby='preparacao-ferramentas'>
          <p
            id='preparacao-ferramentas'
            className='text-xs font-bold tracking-[0.12em] text-[#e13b00]'
          >
            FERRAMENTAS PARA A VIDA REAL
          </p>
          <nav
            aria-label='Ferramentas para a vida real'
            className='mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6'
          >
            {atalhosPreparacao.map(item => (
              <Link
                key={item.rotulo}
                to={item.rota}
                className='flex min-w-0 items-center gap-3 rounded-xl p-2 text-sm font-bold text-(--azul-titulo) transition-colors hover:bg-(--azul-fundo) sm:text-base'
              >
                <span className='flex size-14 shrink-0 items-center justify-center rounded-[20px] bg-(--pessego-suave) sm:size-[70px]'>
                  <img
                    src={item.icone}
                    alt=''
                    className='max-h-9 max-w-9 object-contain'
                  />
                </span>
                <span className='leading-snug wrap-anywhere'>{item.rotulo}</span>
              </Link>
            ))}
          </nav>
        </section>

        <div className='mt-8 grid overflow-hidden rounded-lg border border-[#fce8d9] lg:grid-cols-2'>
          <section
            className='flex min-w-0 items-center justify-between gap-4 bg-(--pessego-suave) p-7 sm:p-10 lg:min-h-[30rem]'
            aria-labelledby='preparacao-jornada'
          >
            <div className='min-w-0 flex-1 space-y-4'>
              <p className='text-xs font-bold tracking-[1.5px] text-[#e13b00]'>
                MINHA JORNADA
              </p>
              <Titulo
                id='preparacao-jornada'
                classe='text-3xl leading-tight font-extrabold sm:text-[34px]'
              >
                Seu progresso rumo à independência.
              </Titulo>
              <p className='leading-relaxed text-[#62717d]'>
                {progresso}% concluído · {metasAtivas} metas ativas ·{' '}
                {pendenciasAtivas} atividades pendentes. Continue organizando
                reserva inicial, lista do essencial e pesquisa de bairros.
              </p>
              <Botao
                como={Link}
                to='/minhajornada'
                cor='laranja'
                classe='mt-2 min-h-13 rounded-full px-8'
              >
                Ver progresso
              </Botao>
            </div>

            <div
              aria-hidden='true'
              className='relative hidden h-[180px] w-[180px] shrink-0 sm:block'
            >
              <img
                src={raiosDesenhados}
                alt=''
                className='absolute top-8 left-0 h-8 w-5 -scale-x-100'
              />
              <div className='absolute top-1 left-5 w-[154px] -rotate-4 rounded-md border border-[#f5e3d4] bg-[#fffbf6] p-3 shadow-xs'>
                <p className='text-xl font-extrabold text-(--azul-titulo)'>
                  {progresso}%
                </p>
                <div className='mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#ffdbc2]'>
                  <div
                    className='h-full rounded-full bg-(--laranja-principal)'
                    style={{ width: `${progresso}%` }}
                  />
                </div>
                <div className='mt-3 space-y-2'>
                  {[true, true, false].map((concluido, indice) => (
                    <div key={indice} className='flex items-center gap-2'>
                      <span
                        className={
                          'flex size-4.5 shrink-0 items-center justify-center rounded-xs ' +
                          (concluido
                            ? 'bg-(--laranja-principal)'
                            : 'border-2 border-[#6b7a85]')
                        }
                      >
                        {concluido && (
                          <img src={marcaConcluido} alt='' className='size-3.5' />
                        )}
                      </span>
                      <span
                        className={
                          'h-2 rounded-full bg-[#ffdbc2] ' +
                          (concluido ? 'w-20' : 'w-14')
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            className='flex min-w-0 flex-col bg-white p-6 sm:p-8'
            aria-labelledby='preparacao-recomendacoes'
          >
            <img
              src={fotoPlanejamento}
              alt='Caderno de planejamento da mudança com notebook e xícara sobre a mesa'
              className='aspect-[1.85] w-full rounded object-cover'
            />
            <div className='mt-5 space-y-3'>
              <p className='text-xs font-bold tracking-wider text-[#e13b00]'>
                PARA O SEU MOMENTO
              </p>
              <Titulo
                id='preparacao-recomendacoes'
                classe='text-2xl leading-tight font-extrabold sm:text-[32px]'
              >
                Recomendações feitas para a sua fase.
              </Titulo>
              <p className='leading-relaxed text-[#6b7582]'>
                Veja lembretes de metas, atividades e conteúdos personalizados
                para planejar a mudança com mais segurança.
              </p>
              <div className='flex flex-wrap gap-x-6 gap-y-2 pt-1'>
                <Link
                  to='/planejamento'
                  className='inline-flex min-h-11 items-center text-sm font-bold text-(--laranja-principal)'
                >
                  Simular orçamento →
                </Link>
                <Link
                  to='/encontrar-casa'
                  className='inline-flex min-h-11 items-center text-sm font-bold text-(--laranja-principal)'
                >
                  Comparar imóveis →
                </Link>
              </div>
            </div>
          </section>
        </div>
      </Container>
      <Rodape />
    </div>
  );
}
