import { Link } from 'react-router-dom';
import {
  Botao,
  Container,
  Titulo,
} from '../../../shared/ui/index';
import { imagensPadraoEmpresa } from '../content';
import {
  CaixaIlustradaEmpresa,
  GradeMetricasEmpresa,
} from './empresaUi';
import ListaAnuncios from './adsList';

export default function InicioEmpresa({ dados }) {
  const totalVisualizacoes = dados.anuncios.reduce(
    (soma, item) => soma + item.visualizacoes,
    0
  );
  const totalContatos = dados.contatos.length;
  const anunciosAtivos = dados.anuncios.filter(
    item => item.situacao === 'ativo'
  ).length;

  return (
    <div className='space-y-12 pb-14'>
      <Container>
        <section className='flex flex-col items-start justify-between gap-8 pt-8 sm:pt-12 lg:flex-row lg:items-center'>
          <div className='max-w-[720px] space-y-5'>
            <p className='text-xs font-bold tracking-[0.8px] text-(--laranja-principal) uppercase'>
              PAINEL DA EMPRESA / BORA CRESCER
            </p>
            <h1 className='font-titulo text-[clamp(2.5rem,5.4vw,4.5rem)] leading-[1.03] font-extrabold text-(--azul-titulo)'>
              Seu trabalho.
              <span className='block text-(--laranja-principal)'>
                Faz acontecer.
              </span>
            </h1>
            <p className='max-w-[540px] text-base leading-relaxed text-(--texto-apoio) sm:text-lg'>
              Organize seus serviços, acompanhe visualizações e responda quem
              precisa de ajuda para cuidar da casa.
            </p>
            <div className='flex flex-wrap items-center gap-4 pt-1'>
              <span className='inline-block rotate-2 bg-(--azul-titulo) px-5 py-2.5 text-xs font-bold tracking-[0.7px] text-white uppercase'>
                DO SEU JEITO. NO SEU TEMPO. ↗
              </span>
              <Link
                to='/empresa/dashboard'
                className='text-sm font-bold text-(--azul-titulo) underline-offset-4 hover:text-(--laranja-principal) hover:underline'
              >
                Ver desempenho completo ↗
              </Link>
            </div>
          </div>

          <CaixaIlustradaEmpresa />
        </section>
      </Container>

      <section className='bg-[#102a43] py-10 text-white sm:py-12'>
        <Container classe='grid items-center gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]'>
          <div className='space-y-5'>
            <p className='text-xs font-bold tracking-[0.8px] text-[#ffb591] uppercase'>
              SUA EMPRESA, MAIS PERTO DE QUEM PRECISA
            </p>
            <Titulo
              como='h2'
              classe='text-3xl leading-[1.1] font-extrabold text-white! sm:text-4xl'
            >
              Seu próximo serviço
              <span className='block'>começa com uma boa apresentação.</span>
            </Titulo>
            <p className='max-w-[540px] text-base leading-relaxed text-white/85'>
              Descreva com clareza o que está incluído, sua região de atendimento
              e a média de valores para gerar confiança logo no primeiro contato.
            </p>
            <div className='flex flex-wrap gap-3 pt-1'>
              <Botao
                como={Link}
                to='/empresa/anunciar'
                cor='laranja'
                classe='px-7!'
              >
                Publicar um novo serviço ↗
              </Botao>
              <Botao
                como={Link}
                to='/empresa/contatos'
                variante='fantasma'
                classe='px-6!'
              >
                Ver contatos ({totalContatos})
              </Botao>
            </div>
          </div>

          <div className='overflow-hidden rounded-2xl border-4 border-white/15 bg-white/5 shadow-lg'>
            <img
              src={imagensPadraoEmpresa.equipe}
              alt='Profissionais de serviços organizando atendimento residencial'
              className='aspect-[16/10] w-full object-cover'
            />
          </div>
        </Container>
      </section>

      <Container classe='space-y-10'>
        <section aria-label='Resumo de resultados' className='space-y-5'>
          <div className='flex flex-wrap items-end justify-between gap-4'>
            <div>
              <p className='text-xs font-bold tracking-[0.8px] text-(--laranja-principal) uppercase'>
                RESUMO DA OPERAÇÃO
              </p>
              <Titulo
                como='h2'
                classe='mt-1.5 text-2xl font-extrabold sm:text-3xl'
              >
                Como sua empresa aparece hoje.
              </Titulo>
            </div>
            <Link
              to='/empresa/dashboard'
              className='text-sm font-bold text-(--laranja-principal) hover:underline'
            >
              Abrir painel detalhado ↗
            </Link>
          </div>

          <GradeMetricasEmpresa
            colunas={3}
            itens={[
              {
                rotulo: dados.exemplo
                  ? 'Visualizações demonstrativas'
                  : 'Visualizações registradas',
                valor: totalVisualizacoes,
                apoio: 'Acessos acumulados nos seus anúncios',
              },
              {
                rotulo: 'Contatos recebidos',
                valor: totalContatos,
                apoio: 'Solicitações enviadas pelo Marketplace',
                destaque: true,
              },
              {
                rotulo: 'Anúncios cadastrados',
                valor: dados.anuncios.length,
                apoio: `${anunciosAtivos} ativos no catálogo`,
              },
            ]}
          />
        </section>

        <section aria-label='Meus serviços' className='space-y-5'>
          <div className='flex flex-wrap items-end justify-between gap-4'>
            <div>
              <p className='text-xs font-bold tracking-[0.8px] text-(--laranja-principal) uppercase'>
                MEUS SERVIÇOS
              </p>
              <Titulo
                como='h2'
                classe='mt-1.5 text-2xl font-extrabold sm:text-3xl'
              >
                O que sua empresa oferece.
              </Titulo>
            </div>
            <div className='flex flex-wrap gap-3'>
              <Botao
                como={Link}
                to='/empresa/anuncios'
                variante='secundario'
                classe='min-h-[44px]!'
              >
                Gerenciar todos ({dados.anuncios.length})
              </Botao>
              <Botao
                como={Link}
                to='/empresa/anunciar'
                cor='laranja'
                classe='min-h-[44px]!'
              >
                + Novo anúncio
              </Botao>
            </div>
          </div>

          <ListaAnuncios dados={dados} compacto />
        </section>
      </Container>

      <section className='bg-[#102a43] py-10 text-white'>
        <Container classe='flex flex-col items-start justify-between gap-6 md:flex-row md:items-center'>
          <div className='space-y-2'>
            <Titulo
              como='h2'
              classe='text-2xl font-extrabold text-white! sm:text-3xl'
            >
              Seu perfil também vende confiança.
            </Titulo>
            <p className='max-w-[560px] text-sm leading-relaxed text-white/85 sm:text-base'>
              Conte sobre a história da empresa, adicione fotos do portfólio e
              mantenha seus horários e canais de contato sempre atualizados.
            </p>
          </div>
          <Botao
            como={Link}
            to='/empresa/perfil'
            cor='laranja'
            classe='shrink-0 px-7!'
          >
            Editar perfil da empresa ↗
          </Botao>
        </Container>
      </section>
    </div>
  );
}
