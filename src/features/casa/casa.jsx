import { CasaSection } from './components';
import { Navigate, useSearchParams } from 'react-router-dom';

export default function Casa() {
  const [params] = useSearchParams();
  if (['limpeza', 'cozinha'].includes(params.get('visao'))) {
    return <Navigate to={'/' + params.get('visao')} replace />;
  }
  if (params.get('visao') === 'servicos') {
    const category = params.get('categoria');
    return (
      <Navigate
        to={
          '/marketplace' +
          (category
            ? '?categoria=' +
              encodeURIComponent(category === 'limpeza' ? 'Limpeza' : category)
            : '')
        }
        replace
      />
    );
  }
  return <CasaSection />;
}
