import LandingPage from './landingPage';
import Home from './home';
import FinancasA from './financasA';
import SobreNos from './sobreNos';
import Auth from './auth';
import { lazy } from 'react';
import CadastroEmpresa from './cadastroEmpresa';
import Marketplace from './marketplace';
import Onboarding from './onboarding';
import MinhaJornada from './minhaJornada';
import Casa from './casa';
import { Link } from 'react-router-dom';

const Dashboard = lazy(() => import('./dashboard'));
const MeusServicos = lazy(() => import('./meusServicos'));
const PerfilEmpresa = lazy(() => import('./perfilEmpresa'));

const TelaErro = () => {
  return (
    <main className='min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center'>
      <h1 className='font-heading text-4xl font-bold'>
        Esse caminho não foi encontrado.
      </h1>
      <p>Volte ao início para continuar sua jornada.</p>
      <Link
        to='/'
        className='rounded-full bg-(--laranja-principal) text-white px-8 py-3'
      >
        Ir para o início
      </Link>
    </main>
  );
};

export const Pages = {
  LandingPage,
  Home,
  Dashboard,
  MeusServicos,
  PerfilEmpresa,
  CadastroEmpresa,
  TelaErro,
  Marketplace,
  Auth,
  Onboarding,
  SobreNos,
  MinhaJornada,
  Casa,
  FinancasA,
};
