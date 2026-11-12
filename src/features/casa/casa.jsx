import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SecaoCasa } from './components/index';

export default function Casa() {
  const [parametros] = useSearchParams();
  const navegar = useNavigate();
  const visao = parametros.get('visao');

  useEffect(() => {
    if (visao === 'limpeza') {
      navegar('/limpeza', { replace: true });
    } else if (visao === 'cozinha') {
      navegar('/cozinha', { replace: true });
    }
  }, [visao, navegar]);

  if (visao === 'limpeza' || visao === 'cozinha') {
    return null;
  }

  return <SecaoCasa />;
}
