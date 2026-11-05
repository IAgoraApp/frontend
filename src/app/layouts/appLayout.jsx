import { Outlet } from 'react-router-dom';
import { Header } from '../../shared';

export default function AppLayout({
  headerVariant,
  children,
  className = '',
  headerProps,
}) {
  return (
    <div
      className={`flex min-h-dvh min-w-0 flex-col ${className}`}
      data-app-layout
    >
      <Header {...headerProps} variant={headerVariant} />
      {children ?? <Outlet />}
    </div>
  );
}
