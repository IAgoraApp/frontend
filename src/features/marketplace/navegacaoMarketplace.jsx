import { Heart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NavegacaoMarketplace({ ativa }) {
  return (
    <nav className='mercado-a-nav' aria-label='Empresas e serviços'>
      <Link
        to='/marketplace'
        aria-current={ativa === 'catalogo' ? 'page' : undefined}
      >
        Catálogo
      </Link>
      <Link
        to='/favoritos'
        aria-current={ativa === 'favoritos' ? 'page' : undefined}
      >
        <Heart size={16} aria-hidden='true' /> Favoritos
      </Link>
      <Link
        to='/meus-contatos'
        aria-current={ativa === 'contatos' ? 'page' : undefined}
      >
        <MessageCircle size={16} aria-hidden='true' /> Serviços e conversas
      </Link>
    </nav>
  );
}
