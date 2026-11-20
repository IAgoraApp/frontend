import { ClipboardList, Heart, MessageCircle } from 'lucide-react';
import { usePerfilPreparacao } from '../../app/dados/perfilNavegacao';
import { Link } from 'react-router-dom';

export default function NavegacaoMarketplace({ ativa }) {
  const preparacao = usePerfilPreparacao();
  return (
    <nav className='mercado-a-nav' aria-label='Empresas e serviços'>
      <Link
        to='/marketplace'
        aria-current={ativa === 'catalogo' ? 'page' : undefined}
      >
        Catálogo
      </Link>
      {!preparacao && <Link
        to='/favoritos'
        aria-current={ativa === 'favoritos' ? 'page' : undefined}
      >
        <Heart size={16} aria-hidden='true' /> Favoritos
      </Link>}
      <Link
        to='/meus-contatos'
        aria-current={ativa === 'contatos' ? 'page' : undefined}
      >
        <MessageCircle size={16} aria-hidden='true' /> Conversas
      </Link>
      <Link
        to='/servicos-contratados'
        aria-current={ativa === 'servicos' ? 'page' : undefined}
      >
        <ClipboardList size={16} aria-hidden='true' /> Meus serviços
      </Link>
    </nav>
  );
}
