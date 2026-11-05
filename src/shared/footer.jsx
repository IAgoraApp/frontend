import Logo from './assets/logoLaranja.png';
import LogoFigma from './assets/logoFigma.png';
import { Link } from 'react-router-dom';
import { Container } from './ui';

function LandingFooter({ company = false }) {
  const groups = [
    {
      title: 'Conheça o Iagora',
      links: [
        {
          label: 'Funcionalidades',
          href: company ? '/#funcionalidades' : '#categorias',
        },
        {
          label: 'Como funciona',
          href: company ? '/sejaparceiro#como-funciona' : '#como-funciona',
        },
        { label: 'Sobre nós', to: '/sobrenos' },
      ],
    },
    {
      title: 'Sua conta',
      links: [
        {
          label: company ? 'Área da empresa' : 'Meu perfil',
          to: company ? '/login?perfil=empresa' : '/login',
        },
        { label: 'Suporte', href: 'mailto:Iagora@hotmail.com' },
        {
          label: 'Perguntas frequentes',
          href: company
            ? '/sejaparceiro#perguntas-frequentes'
            : '#perguntas-frequentes',
        },
      ],
    },
  ];

  return (
    <Container
      as='footer'
      id='contato'
      className='scroll-mt-6 pt-16 pb-8 text-[#526579]'
    >
      <div className='grid gap-10 lg:gap-16 [@media(1024px<=width<1400px)]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] min-[1400px]:grid-cols-[360px_minmax(0,1fr)]'>
        <div>
          <Link
            to='/'
            aria-label='Página inicial Iagora'
            className='inline-block rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--laranja-principal)'
          >
            <img
              src={LogoFigma}
              alt='IAgora'
              width='126'
              height='46'
              className='h-[46px] w-[126px] object-cover'
            />
          </Link>
          <p className='mt-4 max-w-[360px] text-base leading-[26px]'>
            Um guia para conquistar e cuidar da sua independência.
          </p>
        </div>
        <div className='grid min-w-0 gap-8 sm:grid-cols-3 sm:gap-6 xl:gap-12'>
          {groups.map(group => (
            <div
              key={group.title}
              className='flex min-w-0 flex-col items-start gap-2'
            >
              <h2 className='text-[15px] leading-[22px] font-bold text-(--azul-titulo)'>
                {group.title}
              </h2>
              {group.links.map(link =>
                link.to ? (
                  <Link
                    key={link.label}
                    to={link.to}
                    className='text-sm leading-8 hover:underline'
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className='text-sm leading-8 hover:underline'
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>
          ))}
          <div className='flex min-w-0 flex-col items-start gap-2'>
            <h2 className='text-[15px] leading-[22px] font-bold text-(--azul-titulo)'>
              Vamos conversar
            </h2>
            <a
              href='mailto:Iagora@hotmail.com'
              className='max-w-full text-sm leading-8 wrap-anywhere hover:underline'
            >
              Iagora@hotmail.com
            </a>
            <p className='text-sm leading-[22px]'>
              Instagram · GitHub · LinkedIn
            </p>
          </div>
        </div>
      </div>
      <div className='mt-12 border-t border-[#d8e1e8] pt-6'>
        <p className='text-sm leading-[22px]'>
          © Iagora · Todos os direitos reservados.
        </p>
      </div>
    </Container>
  );
}

export default function Footer({ variant = 'default' }) {
  if (variant === 'landing') return <LandingFooter />;
  if (variant === 'empresa') return <LandingFooter company />;

  return (
    <Container as='footer' className='pt-20'>
      <div className='grid gap-10 border-b border-gray-300 pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]'>
        <div className='min-w-0'>
          <img className='w-40' src={Logo} alt='' />
          <p className='text-[20px] text-(--texto-claro) mt-4'>
            Um guia para conquistar e cuidar da sua <br />
            independência.
          </p>
        </div>

        <div className='grid min-w-0 gap-8 sm:grid-cols-3 sm:gap-6'>
          <div>
            <p className='font-semibold mb-3'>Conheça o Iagora</p>
            <p className='mb-2 text-(--texto-claro)'>Funcionalidades</p>
            <p className='mb-2 text-(--texto-claro)'>Como funciona</p>
            <p className='mb-2 text-(--texto-claro)'>Sobre nós</p>
          </div>
          <div>
            <p className='font-semibold mb-3'>Sua conta</p>
            <p className='mb-2 text-(--texto-claro)'>Meu perfil</p>
            <p className='mb-2 text-(--texto-claro)'>Suporte</p>
            <p className='mb-2 text-(--texto-claro)'>Perguntas frequentes</p>
          </div>
          <div>
            <p className='font-semibold mb-3'>Vamos conversar</p>
            <p className='mb-2 text-(--texto-claro)'>Iagora@hotmail.com</p>
            <p className='mb-2 text-(--texto-claro)'>
              Instagram · GitHub · LinkedIn
            </p>
          </div>
        </div>
      </div>

      <p className='text-[20px] text-(--texto-claro) mt-10 mb-10'>
        © Iagora · Todos os direitos reservados.
      </p>
    </Container>
  );
}
