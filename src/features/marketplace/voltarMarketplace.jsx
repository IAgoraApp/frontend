import { ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function VoltarMarketplace() {
  const { state } = useLocation();
  const retorno = state?.retorno;
  const interno =
    /^\/(?:marketplace|buscar|categoria|categorias|favoritos|empresas|servicos)(?:[/?#]|$)/.test(
      retorno?.url ?? ''
    );

  return (
    <Link
      className='mercado-a-voltar-detalhe'
      to={interno ? retorno.url : '/marketplace'}
      state={interno ? retorno.estado : undefined}
    >
      <ArrowLeft size={17} aria-hidden='true' />
      {interno ? retorno.rotulo : 'Voltar ao catálogo'}
    </Link>
  );
}
