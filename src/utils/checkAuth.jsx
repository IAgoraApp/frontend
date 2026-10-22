import { Outlet } from 'react-router-dom';

export const PrivateRoute = () => {
  return <Outlet />;
};

export const PublicRoute = () => {
  return <Outlet />;
};
