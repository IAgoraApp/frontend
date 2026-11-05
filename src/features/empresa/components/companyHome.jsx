import { Link } from 'react-router-dom';
import { Container, Title } from '../../../shared/ui';
import { Action, CompanyBox, Metrics } from './empresaUi';
import AdsList from './adsList';
import photo from '../assets/PhotoServices.png';

export default function CompanyHome({ data }) {
  return (
    <>
      <Container>
        <section className='flex flex-col justify-between gap-8 py-10 md:flex-row md:items-center sm:py-14'>
          <div>
            <p className='text-xs font-bold text-(--laranja-principal)'>
              PAINEL DA EMPRESA / BORA CRESCER
            </p>
            <Title
              as='h1'
              className='mt-5 text-4xl leading-tight font-extrabold sm:text-6xl lg:text-7xl'
            >
              Seu trabalho.
              <br />
              <span className='text-(--laranja-principal)'>Faz acontecer.</span>
            </Title>
            <span className='mt-10 inline-block rotate-2 bg-(--azul-titulo) px-8 py-3 text-xs text-white'>
              DO SEU JEITO. NO SEU TEMPO. ↗
            </span>
          </div>
          <CompanyBox />
        </section>
      </Container>
      <section className='bg-(--azul-titulo) py-8 text-white'>
        <Container className='grid items-center gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]'>
          <div>
            <p className='text-xs font-bold'>
              SUA EMPRESA, MAIS PERTO DE QUEM PRECISA
            </p>
            <Title className='mt-4 text-3xl leading-tight font-extrabold sm:text-4xl'>
              Seu próximo serviço
              <br />
              começa com uma boa apresentação.
            </Title>
            <Action as={Link} to='/anunciar-servico' className='mt-5'>
              Publicar um novo serviço ↗
            </Action>
          </div>
          <img
            src={photo}
            alt='Equipe de profissionais de serviços'
            className='aspect-[1.65] w-full rounded-lg object-cover'
          />
        </Container>
      </section>
      <Container className='space-y-8 py-8'>
        <Metrics
          items={[
            [
              data.example
                ? 'Visualizações demonstrativas'
                : 'Visualizações registradas',
              data.ads.reduce((sum, ad) => sum + ad.views, 0),
            ],
            ['Contatos recebidos', data.contacts.length],
            ['Anúncios cadastrados', data.ads.length],
            [
              'Anúncios ativos',
              data.ads.filter(ad => ad.status === 'active').length,
            ],
          ]}
        />
        <div>
          <p className='text-xs font-bold text-(--laranja-principal)'>
            MEUS SERVIÇOS
          </p>
          <Title className='mt-3 mb-6 text-3xl font-extrabold'>
            O que sua empresa oferece.
          </Title>
          <AdsList data={data} compact />
        </div>
      </Container>
      <section className='bg-(--azul-titulo) py-8 text-white'>
        <Container className='flex flex-wrap items-center justify-between gap-6'>
          <div>
            <Title className='text-3xl font-extrabold'>
              Seu perfil também vende confiança.
            </Title>
            <p className='mt-2 text-sm'>
              Conte sobre a empresa, mostre sua equipe e mantenha o contato em
              dia.
            </p>
          </div>
          <Action as={Link} to='/perfil-empresa'>
            Editar perfil da empresa ↗
          </Action>
        </Container>
      </section>
    </>
  );
}
