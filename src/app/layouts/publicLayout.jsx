import LayoutAplicacao from './appLayout';

export default function LayoutPublico(propriedades) {
  return <LayoutAplicacao {...propriedades} varianteCabecalho='publico' />;
}
