import { Link } from 'react-router-dom';
import Logo from '../assets/images/logoLaranja.png';

export default function Footer() {
  return (
    <footer className='site-footer mx-30 pt-20'>
      <div className='footer-columns flex border-b border-gray-300 pb-10 gap-8'>
        <div className='footer-brand w-1/3'>
          <Link to='/'>
            <img className='w-40' src={Logo} alt='Iagora · voltar ao início' />
          </Link>
          <p className='text-[20px] text-(--texto-claro) mt-4'>
            Um guia para conquistar e cuidar da sua independência.
          </p>
        </div>
        <div className='footer-links grid grid-cols-3 flex-1 gap-6'>
          <div className='flex flex-col gap-2'>
            <p className='font-semibold mb-1'>Conheça o Iagora</p>
            <Link to='/#funcionalidades'>Funcionalidades</Link>
            <Link to='/#como-funciona'>Como funciona</Link>
            <Link to='/sobrenos'>Sobre nós</Link>
            <Link to='/cadastro-empresa'>Para anunciantes</Link>
          </div>
          <div className='flex flex-col gap-2'>
            <p className='font-semibold mb-1'>Sua conta</p>
            <Link to='/perfil'>Meu perfil</Link>
            <a href='mailto:Iagora@hotmail.com'>Suporte por e-mail</a>
            <Link to='/#perguntas-frequentes'>Perguntas frequentes</Link>
          </div>
          <div className='flex flex-col gap-2'>
            <p className='font-semibold mb-1'>Vamos conversar</p>
            <a href='mailto:Iagora@hotmail.com'>Iagora@hotmail.com</a>
            <Link to='/sobrenos'>Equipe e redes disponíveis ↗</Link>
            <span className='text-sm text-(--texto-claro)'>
              Demonstração frontend · dados neste navegador
            </span>
          </div>
        </div>
      </div>
      <p className='text-[16px] text-(--texto-claro) mt-8 mb-10'>
        © Iagora · Todos os direitos reservados.
      </p>
    </footer>
  );
}
