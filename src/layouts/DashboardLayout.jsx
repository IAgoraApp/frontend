import { Outlet } from 'react-router-dom';
import Header from '../components/header';
import { Suspense } from 'react';

export default function DashboardLayout({ children }) {
  return (
    <>
      <Header variant='dashboard' />
      <Suspense
        fallback={
          <p role='status' className='px-6 py-10 text-center'>
            Carregando seu painel…
          </p>
        }
      >
        {children || <Outlet />}
      </Suspense>
    </>
  );
}
