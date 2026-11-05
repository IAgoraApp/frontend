import { Link } from 'react-router-dom';
import { Title } from '../../../shared/ui';
import EditorialCollage from '../../../shared/ui/editorialCollage';
import { Plant } from '../../casa/components/casaArtwork';
import { Action, Card, Empty } from '../../empresa/components/empresaUi';
import { safeUrl } from '../../empresa/content';
import { publicPhotos } from '../content';
import tape from '../../empresa/assets/PaperTapePhotoHeldInPlace.svg';
import doodle from '../../empresa/assets/DoodleCaminhoAteSeuCanto.svg';

export default function PublicCompany({ company, ads }) {
  return (
    <div className='space-y-8'>
      <section className='grid items-center gap-8 lg:grid-cols-2'>
        <div className='space-y-5'>
          {company.logo && (
            <img
              src={company.logo}
              alt={'Logo de ' + company.name}
              className='size-20 rounded-full border border-(--azul-titulo)/10 object-cover'
            />
          )}
          <p className='text-xs font-bold text-(--laranja-principal)'>
            {company.name.toUpperCase()} · EMPRESA PRESTADORA DE SERVIÇOS
          </p>
          <Title
            as='h1'
            className='text-4xl leading-tight font-extrabold sm:text-6xl'
          >
            {company.name}
          </Title>
          <p className='text-lg text-(--texto-apoio)'>
            {company.category} · {company.region}
          </p>
          <p className='leading-relaxed'>{company.about}</p>
          <Action as={Link} to='/marketplace'>
            Voltar para empresas ↗
          </Action>
          <div className='pt-5'>
            <span className='inline-block rotate-2 bg-(--azul-titulo) px-6 py-3 text-xs text-white'>
              INDEPENDÊNCIA NA VIDA REAL ↗
            </span>
          </div>
        </div>
        <EditorialCollage width={539} height={610}>
          <div
            data-editorial-motion
            className='absolute top-7 left-[87px] h-[375px] w-[300px] rotate-6 border-8 border-white shadow-lg'
          >
            <img
              src={company.image}
              alt=''
              className='size-full object-cover'
            />
          </div>
          <div
            data-editorial-motion
            className='absolute top-[378px] left-0 h-[164px] w-[230px] rotate-7 border-8 border-white shadow-lg'
          >
            <img
              src={publicPhotos.apartment}
              alt=''
              className='size-full object-cover'
            />
          </div>
          <div className='absolute top-[205px] left-7'>
            <Plant />
          </div>
          <span className='absolute top-[478px] left-[201px] -rotate-4 bg-(--laranja-principal) px-5 py-3 text-sm text-white'>
            a empresa é sua. bora ↗
          </span>
          <img
            src={doodle}
            alt=''
            className='absolute top-[532px] left-[121px]'
          />
          <img
            src={tape}
            alt=''
            className='absolute top-3 left-[216px] rotate-9'
          />
        </EditorialCollage>
      </section>
      <Card title='Cuidado de verdade com o seu espaço.'>
        <p className='whitespace-pre-wrap leading-relaxed'>{company.about}</p>
        <dl className='mt-6 grid gap-5 sm:grid-cols-3'>
          {[
            ['Categoria', company.category],
            ['Atendimento', company.hours || 'Sob consulta'],
            ['Região', company.region],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className='text-sm font-bold'>{label}</dt>
              <dd className='mt-2 text-sm text-(--texto-apoio)'>{value}</dd>
            </div>
          ))}
        </dl>
        {safeUrl(company.website) && (
          <a
            href={safeUrl(company.website)}
            target='_blank'
            rel='noreferrer'
            className='mt-5 inline-flex min-h-11 items-center text-sm font-bold text-(--laranja-principal)'
          >
            Site ou portfólio ↗
          </a>
        )}
      </Card>
      <section>
        <Title className='mb-6 text-3xl font-extrabold'>
          O que oferecemos.
        </Title>
        {ads.length ? (
          <div className='grid gap-6 md:grid-cols-2'>
            {ads.map(ad => (
              <Card key={ad.id}>
                <img
                  src={ad.image}
                  alt={ad.title}
                  className='mb-5 aspect-[1.6] w-full rounded-lg object-cover'
                />
                <Title className='text-2xl font-extrabold'>{ad.title}</Title>
                <p className='mt-3 text-sm text-(--texto-apoio)'>
                  {ad.description}
                </p>
                <Action as={Link} to={'/servicos/' + ad.id} className='mt-5'>
                  Combinar atendimento ↗
                </Action>
              </Card>
            ))}
          </div>
        ) : (
          <Empty>Esta empresa não tem anúncios ativos no momento.</Empty>
        )}
      </section>
      {company.portfolio.length > 0 && (
        <Card title='Seu trabalho em imagens'>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {company.portfolio.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={'Portfólio da empresa ' + (index + 1)}
                className='aspect-[1.5] w-full rounded-lg object-cover'
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
