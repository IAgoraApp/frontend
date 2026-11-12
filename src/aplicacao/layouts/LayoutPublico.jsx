import LayoutAplicacao from './LayoutAplicacao';

export default function LayoutPublico(propriedades) {
  return <LayoutAplicacao {...propriedades} varianteCabecalho='publico' />;
}
