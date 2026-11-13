import LayoutAplicacao from './LayoutAplicacao';
import { useLocation } from 'react-router-dom';
import { lerEstadoPlataforma } from '../estado/estadoPlataforma';
import { tipoUsuarioDaRota } from '../utilitarios/navegacao';

export default function LayoutUsuario({
  tipoUsuario = 'consumidorA',
  propriedadesCabecalho,
  ...propriedades
}) {
  const { pathname } = useLocation();
  const tipoAtual = tipoUsuarioDaRota(pathname, lerEstadoPlataforma().perfil.momento, tipoUsuario);
  return (
    <LayoutAplicacao
      {...propriedades}
      varianteCabecalho='usuario'
      propriedadesCabecalho={{ ...propriedadesCabecalho, tipoUsuario: tipoAtual }}
    />
  );
}
