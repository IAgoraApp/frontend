import { useSearchParams } from 'react-router-dom';
import { useBancoMvp } from '../../app/dados/bancoMvp';
import ComprasA from './comprasA';
import DespensaA from './despensaA';
import ReceitasA from './receitasA';
import './organizacaoCozinha.css';

export default function CozinhaA() {
  const { b, casa, perfil } = useBancoMvp();
  const [params] = useSearchParams();
  const visao = params.get('visao') || 'inicio';

  if (visao === 'despensa') return <DespensaA banco={b} casaId={casa.id} />;
  if (visao === 'compras') return <ComprasA banco={b} casaId={casa.id} />;

  return (
    <ReceitasA
      key={visao + ':' + (params.get('aba') || '')}
      banco={b}
      casaId={casa.id}
      usuario={perfil.user_id}
    />
  );
}
