import Logo from '../assets/images/logoLaranja.png';

export default function Footer() {
  return (
    <footer className='mx-30 pt-20'>
      <div className='flex border-b border-gray-300 pb-10'>
        <div className='w-1/3'>
          <img className='w-40' src={Logo} alt='' />
          <p className='text-[20px] text-(--texto-claro) mt-4'>
            Um guia para conquistar e cuidar da sua <br />
            independência.
          </p>
        </div>

        <div className='grid grid-cols-3 flex-1'>
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
    </footer>
  );
}
