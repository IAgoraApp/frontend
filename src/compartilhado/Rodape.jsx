import { Link, useLocation } from 'react-router-dom';
import logoMarca from '../ativos/imagens/marcas/logo-iagora.png';
import { Container } from './interface/indice';
import { lerEstadoPlataforma } from '../aplicacao/estado/estadoPlataforma';
import { tipoUsuarioDaRota } from '../aplicacao/utilitarios/navegacao';
import { inicioDaSessao, perfilDaSessao, temSessao } from '../aplicacao/utilitarios/sessao';

export default function Rodape({ variante = 'padrao' }) {
  const logado = temSessao();
  const ehEmpresa = variante === 'empresa' || (logado && perfilDaSessao() === 'empresa');
  const ehInicial = variante === 'inicial';
  const { pathname } = useLocation();
  const ehPreparacao = tipoUsuarioDaRota(pathname, lerEstadoPlataforma().perfil.momento) === 'consumidorB';
  const rotaInicio = logado ? inicioDaSessao(lerEstadoPlataforma().perfil.momento) : '/';

  const grupos = [
    {
      titulo: 'Conheça o Iagora',
      links: [
        {
          rotulo: 'Funcionalidades',
          rota: ehEmpresa
            ? '/sejaparceiro#categorias'
            : ehInicial && !logado
              ? '/#funcionalidades'
              : '/como-funciona',
        },
        {
          rotulo: 'Como funciona',
          rota: ehEmpresa ? '/sejaparceiro#como-funciona' : '/como-funciona',
        },
        { rotulo: 'Sobre nós', rota: '/sobrenos' },
      ],
    },
    {
      titulo: 'Sua conta',
      links: [
        {
          rotulo: ehEmpresa ? 'Área da empresa' : 'Meu perfil',
          rota: ehEmpresa ? '/empresa' : ehPreparacao ? '/perfil-b' : '/perfil',
        },
        { rotulo: 'Suporte', rota: '/ajuda' },
        { rotulo: 'Perguntas frequentes', rota: '/ajuda/faq' },
      ],
    },
  ];

  return (
    <Container
      como='footer'
      id='contato'
      classe='scroll-mt-6 border-t border-[#e6edf2] bg-white pt-16 pb-8 text-[#526579]'
    >
      <div className='grid gap-10 lg:gap-16 [@media(1024px<=width<1400px)]:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] min-[1400px]:grid-cols-[360px_minmax(0,1fr)]'>
        <div>
          <Link
            to={rotaInicio}
            aria-label='Página inicial Iagora'
            className='inline-block rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--laranja-principal)'
          >
            <img
              src={logoMarca}
              alt='IAgora'
              width='126'
              height='46'
              className='h-[46px] w-[126px] rounded-xl object-cover'
            />
          </Link>
          <p className='mt-4 max-w-[360px] text-base leading-[26px]'>
            Um guia para conquistar e cuidar da sua independência.
          </p>
        </div>

        <div className='grid min-w-0 gap-8 sm:grid-cols-3 sm:gap-6 xl:gap-12'>
          {grupos.map(grupo => (
            <div
              key={grupo.titulo}
              className='flex min-w-0 flex-col items-start gap-2'
            >
              <h2 className='font-corpo! text-[15px] leading-[22px] font-bold text-(--azul-titulo)'>
                {grupo.titulo}
              </h2>
              {grupo.links.map(item =>
                item.rota.includes('#') ? (
                  <a
                    key={item.rotulo}
                    href={item.rota}
                    className='text-sm leading-8 hover:text-(--azul-titulo) hover:underline'
                  >
                    {item.rotulo}
                  </a>
                ) : (
                  <Link
                    key={item.rotulo}
                    to={item.rota}
                    className='text-sm leading-8 hover:text-(--azul-titulo) hover:underline'
                  >
                    {item.rotulo}
                  </Link>
                )
              )}
            </div>
          ))}

          <div className='flex min-w-0 flex-col items-start gap-2'>
            <h2 className='font-corpo! text-[15px] leading-[22px] font-bold text-(--azul-titulo)'>
              Vamos conversar
            </h2>
            <a
              href='mailto:Iagora@hotmail.com'
              className='max-w-full text-sm leading-8 wrap-anywhere hover:text-(--azul-titulo) hover:underline'
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
