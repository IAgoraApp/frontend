import { acessoLocal } from '../dados/acessoLocal';
import { Navigate } from 'react-router-dom';
import { lerSessao } from '../dados/contaApi';
import ProvedorAvisosPerfilA from '../avisos/provedorAvisosPerfilA';
import LayoutAplicacao from './appLayout';

export default function LayoutUsuario({
  tipoUsuario = 'consumidorA',
  propriedadesCabecalho,
  ...propriedades
}) {
  if (!acessoLocal && lerSessao()?.tipo === 2) return <Navigate to='/empresa/perfil' replace />;
  const layout = (
    <LayoutAplicacao
      {...propriedades}
      varianteCabecalho='usuario'
      propriedadesCabecalho={{ ...propriedadesCabecalho, tipoUsuario }}
    />
  );
  return tipoUsuario === 'consumidorA' ? (
    <ProvedorAvisosPerfilA>{layout}</ProvedorAvisosPerfilA>
  ) : (
    layout
  );
}
