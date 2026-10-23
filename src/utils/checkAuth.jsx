import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { profilePaths } from '../data/navigation';

export const PrivateRoute = () => {
  const session = useAppStore(state => state.session);
  const profile = useAppStore(state => state.data.profile);
  const location = useLocation();
  if (!session)
    return <Navigate to='/login' replace state={{ from: location.pathname }} />;
  if (!profile) return <Navigate to='/onboarding' replace />;
  if (!profilePaths[profile]?.includes(location.pathname))
    return <Navigate to='/home' replace />;
  return <Outlet />;
};

export const PublicRoute = () => {
  return <Outlet />;
};
