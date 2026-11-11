import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Container, Title } from '../../../shared/ui';
import Footer from '../../../shared/footer';
import EditorialCollage from '../../../shared/ui/editorialCollage';
import { useEmpresa, normalize } from '../../empresa/content';
import {
  Action,
  Card,
  CompanyBox,
  CompanyHeading,
  Empty,
  scope,
} from '../../empresa/components/empresaUi';
import { catalog, publicPhotos } from '../content';
import PublicCompany from './publicCompany';
import ContactRequest from './contactRequest';
import tape from '../../empresa/assets/PaperTapePhotoHeldInPlace.svg';
import doodle from '../../empresa/assets/DoodleCaminhoAteSeuCanto.svg';

export default function MarketplaceSection({ empresa, pagina }) {
  const { data, error } = useEmpresa();
  const { companies, ads } = catalog(data);
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('categoria') ?? 'Todas';
  const [query, setQuery] = useState(searchParams.get('busca') ?? '');
  const [region, setRegion] = useState(searchParams.get('regiao') ?? '');
  const appliedQuery = normalize(searchParams.get('busca') ?? '');
  const appliedRegion = normalize(searchParams.get('regiao') ?? '');
  const ad = ads.find(item => item.id === params.id);
  const company = companies.find(
    item => item.id === (pagina === 'servico' ? ad?.companyId : params.id)
  );
  const visible = companies.filter(item => {
    const companyAds = ads.filter(ad => ad.companyId === item.id);
    return (
      (category === 'Todas' ||
        item.category === category ||
        companyAds.some(ad => ad.category === category)) &&
      normalize(
        item.name +
          ' ' +
          item.about +
          ' ' +
          companyAds.map(ad => ad.title).join(' ')
      ).includes(appliedQuery) &&
      normalize(item.region).includes(appliedRegion)
    );
  });
  return (
    <div lang='pt-BR' className={scope}>
      <Container as='main' className='pb-10'>
        {error && (
          <p role='alert' className='mt-5 rounded-lg bg-amber-50 p-4 text-sm'>
            Não foi possível carregar os dados locais. A lista exibe exemplos;
            os dados anteriores foram preservados.
          </p>
        )}
        {pagina === 'lista' ? (
          <>
            <section className='grid items-center gap-8 py-8 lg:grid-cols-2 lg:gap-16 lg:py-12'>
              <div className='min-w-0 space-y-6'>
                <p className='text-xs font-bold text-(--laranja-principal)'>
                  EMPRESAS QUE CUIDAM DO SEU CANTO
                </p>
                <Title
                  as='h1'
                  className='text-4xl leading-tight font-extrabold sm:text-6xl lg:text-7xl'
                >
                  Deu ruim?
                  <br />
                  <span className='text-(--laranja-principal)'>
                    Tem quem faça.
                  </span>
                </Title>
                <p className='max-w-xl text-lg leading-relaxed'>
                  Encontre prestadoras de serviços, conheça o que cada empresa
                  oferece e combine o atendimento direto com ela.
                </p>
                <Action
                  as={Link}
                  to={empresa ? '/anunciar-servico' : '/cadastro-empresa'}
                >
                  {empresa
                    ? 'Publicar meu serviço ↗'
                    : 'Quero divulgar minha empresa ↗'}
                </Action>
                <div className='pt-6'>
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
                    src={publicPhotos.services}
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
                <div className='absolute top-[280px] left-3'>
                  <CompanyBox />
                </div>
                <span className='absolute top-[478px] left-[201px] -rotate-4 bg-(--laranja-principal) px-5 py-3 text-sm text-white'>
                  seu canto ganha vida ↗
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
            <section className='space-y-6'>
              <div>
                <p className='text-xs font-bold text-(--laranja-principal)'>
                  ENCONTRE QUEM RESOLVE
                </p>
                <Title className='mt-3 text-3xl font-extrabold'>
                  Que cuidado sua casa precisa agora?
                </Title>
              </div>
              <form
                className='grid items-end gap-4 rounded-xl bg-(--azul-fundo) p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]'
                onSubmit={event => {
                  event.preventDefault();
                  setSearchParams(
                    previous => {
                      const next = new URLSearchParams(previous);
                      if (query.trim()) next.set('busca', query.trim());
                      else next.delete('busca');
                      if (region.trim()) next.set('regiao', region.trim());
                      else next.delete('regiao');
                      return next;
                    },
                    { preventScrollReset: true }
                  );
                }}
              >
                <label
                  htmlFor='market-query'
                  className='flex flex-col gap-2 text-sm font-bold'
                >
                  O que você procura?
                  <input
                    id='market-query'
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder='Limpeza, manutenção, mudança...'
                    maxLength={150}
                    className='h-13 min-w-0 rounded-lg border border-[#dbe5ed] bg-white px-4 font-normal'
                  />
                </label>
                <label
                  htmlFor='market-region'
                  className='flex flex-col gap-2 text-sm font-bold'
                >
                  Onde precisa do serviço?
                  <input
                    id='market-region'
                    value={region}
                    onChange={event => setRegion(event.target.value)}
                    placeholder='Cidade ou bairro'
                    maxLength={150}
                    className='h-13 min-w-0 rounded-lg border border-[#dbe5ed] bg-white px-4 font-normal'
                  />
                </label>
                <Action type='submit'>Buscar empresas ↗</Action>
              </form>
              <div
                className='flex flex-wrap gap-3'
                role='group'
                aria-label='Categorias de empresas'
              >
                {[
                  'Todas',
                  'Limpeza',
                  'Manutenção',
                  'Mudanças',
                  'Organização',
                ].map(value => (
                  <Action
                    key={value}
                    secondary={value !== category}
                    aria-pressed={value === category}
                    onClick={() =>
                      setSearchParams(
                        previous => {
                          const next = new URLSearchParams(previous);
                          if (value === 'Todas') next.delete('categoria');
                          else next.set('categoria', value);
                          return next;
                        },
                        { preventScrollReset: true }
                      )
                    }
                  >
                    {value}
                  </Action>
                ))}
              </div>
              <p className='text-xs text-(--texto-apoio)'>
                Catálogo demonstrativo. As empresas de exemplo e os registros
                criados neste navegador não representam um catálogo conectado.
              </p>
              <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
                {visible.map(item => (
                  <Card key={item.id}>
                    <img
                      src={item.image}
                      alt={'Serviços de ' + item.name}
                      className='mb-5 aspect-[1.5] w-full rounded-lg object-cover'
                    />
                    <p className='text-xs font-bold text-(--laranja-principal)'>
                      {item.category.toUpperCase()}
                    </p>
                    <Title className='mt-3 text-2xl font-extrabold'>
                      {item.name}
                    </Title>
                    <p className='mt-3 line-clamp-3 text-sm text-(--texto-apoio)'>
                      {item.about}
                    </p>
                    <p className='mt-3 text-sm'>{item.region}</p>
                    <Action
                      as={Link}
                      to={'/empresas/' + item.id}
                      className='mt-5'
                    >
                      Conhecer a empresa ↗
                    </Action>
                  </Card>
                ))}
              </div>
              {!visible.length && (
                <Empty>
                  Nenhuma empresa encontrada. Tente outra categoria, cidade ou
                  termo.
                </Empty>
              )}
            </section>
          </>
        ) : !company || (pagina === 'servico' && !ad) ? (
          <div className='py-8'>
            <CompanyHeading
              title='Serviço indisponível.'
              back='/marketplace'
              description='Este anúncio pode estar pausado, em análise ou ter sido removido.'
            />
            <Empty to='/marketplace' action='Ver empresas'>
              Explore os serviços disponíveis no catálogo.
            </Empty>
          </div>
        ) : (
          <>
            <div className='pt-6'>
              <Link
                to='/marketplace'
                className='inline-flex min-h-11 items-center text-sm font-bold text-(--texto-apoio)'
              >
                ← Voltar para empresas
              </Link>
            </div>
            {pagina === 'perfil' ? (
              <PublicCompany
                company={company}
                ads={ads.filter(item => item.companyId === company.id)}
              />
            ) : (
              <>
                <CompanyHeading
                  title={ad.title}
                  description={company.name + ' · ' + ad.region}
                  back={'/empresas/' + company.id}
                />
                <div className='grid items-start gap-6 lg:grid-cols-2'>
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className='aspect-[1.5] w-full rounded-xl object-cover'
                  />
                  <Card title={ad.price}>
                    <p className='whitespace-pre-wrap leading-relaxed'>
                      {ad.description}
                    </p>
                    <p className='mt-5 text-sm text-(--texto-apoio)'>
                      {ad.attendance} · {ad.availability}
                    </p>
                    <Action
                      secondary
                      as={Link}
                      to={'/empresas/' + company.id}
                      className='mt-5'
                    >
                      Conhecer a empresa
                    </Action>
                  </Card>
                </div>
              </>
            )}
            <section className='mt-10' id='solicitar-contato'>
              <ContactRequest
                company={company}
                ad={ad}
                ads={ads.filter(item => item.companyId === company.id)}
              />
            </section>
          </>
        )}
      </Container>
      {!empresa && <Footer variant='landing' />}
    </div>
  );
}
