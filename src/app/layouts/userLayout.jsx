import ProvedorAvisosPerfilA from '../avisos/provedorAvisosPerfilA';
import LayoutAplicacao from './appLayout';

export default function LayoutUsuario({
  tipoUsuario = 'consumidorA',
  propriedadesCabecalho,
  ...propriedades
}) {
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
