import Logo from '../assets/images/logoLaranja.png';
import { Button } from './ui';

const abas = [
  'Inicio',
  'Rotina',
  'Minha casa',
  'Finanças',
  'Empresas e Serviços',
];

export default function Header() {
  return (
    <header className='mx-30 flex justify-between py-5 items-center'>
      <img className='w-40' src={Logo} alt='' />
      <div className='flex gap-10'>
        {abas.map(i => {
          return (
            <a className='font-semibold hover:text-(--laranja-principal) cursor-pointer transition-all'>
              {i}
            </a>
          );
        })}
      </div>
      <Button color='laranja'>Meu perfil</Button>
    </header>
  );
}
