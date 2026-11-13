import { Navigate, useLocation } from 'react-router-dom';

export default function Redirecionamento({ para }) {
  const { search, hash, state } = useLocation();
  return <Navigate to={para + search + hash} replace state={state} />;
}
