import LandingPage from './landingPage';
import Home from './home';
import SobreNos from './sobreNos';
import Auth from './auth';
import Dashboard from './dashboard';
import MeusServicos from './meusServicos';
import PerfilEmpresa from './perfilEmpresa';
import CadastroEmpresa from './cadastroEmpresa';
import Marketplace from './marketplace';
import Onboarding from './onboarding';
import MinhaJornada from './minhaJornada';
import Casa from './casa';

const TelaErro = () => {
  return <h1>Erro não esperado</h1>;
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
  Casa
};
