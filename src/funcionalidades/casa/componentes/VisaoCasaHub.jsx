import { IconeConcluido } from '../../../compartilhado/interface/IndicadoresFuncionais';
import { Link } from 'react-router-dom';
import { Container, Titulo } from '../../../compartilhado/interface/indice';
import { dicasCuidadoCasa } from '../conteudo';
import { BotaoCasa } from './InterfaceCasa';
import ArteCasa from './ArteCasa';
import fotoLimpeza from '../../../ativos/imagens/fotografias/servicos-davi-igor.jpg';
import fotoCozinha from '../../../ativos/imagens/fotografias/cozinha-comida-boa.jpg';

export default function VisaoCasaHub({ aoNavegar, marcacoes, aoMarcar }) {
  return (
    <>
      <Container>
        <section className='grid items-center gap-8 py-8 lg:grid-cols-2 lg:gap-14 lg:py-12'>
          <ArteCasa />
          <div className='min-w-0 space-y-6'>
            <p className='text-xs font-bold tracking-[0.08em] text-(--laranja-principal)'>
              SEU CANTO. SEU JEITO DE CUIDAR
            </p>
            <Titulo
              como='h1'
              classe='text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.04] font-extrabold'
            >
              Casa com
              <br />
              <span className='mt-3 inline-block -rotate-2 bg-(--azul-titulo) px-5 pt-1 pb-2.5 text-white'>
                a sua cara
              </span>
            </Titulo>
            <p className='max-w-xl text-lg leading-relaxed text-(--azul-titulo)'>
              Organize a limpeza, descubra o que cozinhar e encontre ajuda
              quando precisar.
            </p>
            <BotaoCasa como={Link} to='/rotina' classe='px-8'>
              Organizar minha rotina
            </BotaoCasa>
          </div>
        </section>

        <div className='grid gap-6 md:grid-cols-2'>
          {[
            {
              imagem: fotoLimpeza,
              alt: 'Profissionais de serviços domésticos e manutenção prontos para ajudar em casa',
              subtitulo: '01 / LIMPEZA',
              titulo: 'Casa limpa, sem complicação',
              descricao:
                'Uma rotina possível, os produtos certos e um cômodo de cada vez.',
              acao: 'Cuidar da limpeza',
              rota: '/limpeza',
              destaque: true,
            },
            {
              imagem: fotoCozinha,
              alt: 'Bancada de cozinha organizada com pratos de macarrão preparados na hora',
              subtitulo: '02 / COZINHA',
              titulo: 'Comida boa no seu ritmo',
              descricao:
                'Receitas simples e ideias para aproveitar o que já tem em casa.',
              acao: 'Explorar a cozinha',
              rota: '/cozinha',
              destaque: false,
            },
          ].map(item => (
            <section
              key={item.rota}
              className={
                'overflow-hidden rounded-lg ' +
                (item.destaque ? 'bg-(--laranja-fundo)' : 'bg-white')
              }
            >
              <img
                src={item.imagem}
                alt={item.alt}
                className='aspect-[636/430] w-full object-cover'
              />
              <div className='space-y-3 bg-white p-5 sm:p-6'>
                <p className='text-xs font-bold tracking-[0.06em] text-(--laranja-principal)'>
                  {item.subtitulo}
                </p>
                <Titulo classe='text-3xl leading-tight font-extrabold lg:text-4xl'>
                  {item.titulo}
                </Titulo>
                <p className='text-sm leading-relaxed text-(--texto-apoio)'>
                  {item.descricao}
                </p>
                <BotaoCasa como={Link} to={item.rota} classe='w-full'>
                  {item.acao}
                </BotaoCasa>
              </div>
            </section>
          ))}
        </div>

        <section className='mt-12'>
          <p className='text-xs font-bold tracking-[0.06em] text-(--laranja-principal)'>
            PEQUENOS CUIDADOS
          </p>
          <Titulo classe='mt-2 text-3xl font-extrabold sm:text-4xl'>
            O básico que faz diferença
          </Titulo>
          <div className='mt-6 rounded-lg bg-(--azul-fundo) p-5 sm:p-7'>
            {dicasCuidadoCasa.map(([titulo, descricao], indice) => {
              const marcado = Boolean(
                marcacoes['cuidado-' + indice] ?? marcacoes['care-' + indice]
              );
              return (
                <label
                  key={titulo}
                  className='flex cursor-pointer items-start gap-4 py-4'
                >
                  <input
                    type='checkbox'
                    className='peer sr-only'
                    checked={marcado}
                    onChange={evento =>
                      aoMarcar('cuidado-' + indice, evento.target.checked)
                    }
                  />
                  <span
                    aria-hidden='true'
                    className={
                      'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--laranja-principal) ' +
                      (marcado
                        ? 'border-(--laranja-principal) bg-(--laranja-principal) text-white'
                        : 'border-(--azul-titulo) bg-transparent text-transparent')
                    }
                  >
                    <IconeConcluido />
                  </span>
                  <span>
                    <strong className='block font-bold text-(--azul-titulo)'>
                      {titulo}
                    </strong>
                    <span className='mt-1 block text-sm text-(--texto-apoio)'>
                      {descricao}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </section>
      </Container>

      <section className='mt-12 bg-(--azul-titulo) py-8 text-white'>
        <Container classe='flex flex-wrap items-center justify-between gap-6'>
          <div>
            <Titulo classe='text-3xl font-extrabold text-white!'>
              Tem coisa que pede uma mão extra
            </Titulo>
            <p className='mt-2 text-sm text-white/90'>
              Encontre empresas de limpeza, manutenção e mudança.
            </p>
          </div>
          <BotaoCasa onClick={() => aoNavegar('servicos')}>
            Encontrar empresas
          </BotaoCasa>
        </Container>
      </section>
    </>
  );
}
