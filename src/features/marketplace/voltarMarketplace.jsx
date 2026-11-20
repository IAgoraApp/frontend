import { ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function VoltarMarketplace({ destino = '/marketplace' }) {
  const { state } = useLocation();
  const retorno = state?.retorno;
  const interno =
    /^\/(?:empresa\/(?:marketplace|buscar)|marketplace|buscar|categoria|categorias|favoritos|empresas|servicos)(?:[/?#]|$)/.test(
      retorno?.url ?? ''
    );

  return (
    <Link
      className='mercado-a-voltar-detalhe'
      to={interno ? retorno.url : destino}
      state={interno ? retorno.estado : undefined}
    >
      <ArrowLeft size={17} aria-hidden='true' />
      {interno ? retorno.rotulo : 'Voltar ao catálogo'}
    </Link>
  );
}
