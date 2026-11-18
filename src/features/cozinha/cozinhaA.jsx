import { Navigate, useSearchParams } from 'react-router-dom';
import { useBancoMvp } from '../../app/dados/bancoMvp';
import ResidenciaNecessaria from '../preparacao/ResidenciaNecessaria';
import ComprasA from './comprasA';
import ReceitasA from './receitasA';
import './organizacaoCozinha.css';

export default function CozinhaA() {
  const { b, casa, perfil } = useBancoMvp();
  const [params] = useSearchParams();
  const visao = params.get('visao') || 'inicio';

  if (visao === 'despensa') return <Navigate to='/despensa' replace />;
  if (visao === 'compras') return casa ? <ComprasA banco={b} casaId={casa.id} /> : <ResidenciaNecessaria />;

  return (
    <ReceitasA
      key={visao + ':' + (params.get('aba') || '')}
      banco={b}
      casaId={casa?.id}
      usuario={perfil.user_id}
    />
  );
}
