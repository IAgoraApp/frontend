import LandingPage from './landingPage';
import Home from './home';
import Dashboard from './dashboard';
import MeusServicos from './meusServicos';
import PerfilEmpresa from './perfilEmpresa';
import CadastroEmpresa from './cadastroEmpresa';

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
};
