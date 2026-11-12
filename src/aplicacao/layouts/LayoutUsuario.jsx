import LayoutAplicacao from './LayoutAplicacao';

export default function LayoutUsuario({
  tipoUsuario = 'consumidorA',
  propriedadesCabecalho,
  ...propriedades
}) {
  return (
    <LayoutAplicacao
      {...propriedades}
      varianteCabecalho='usuario'
      propriedadesCabecalho={{ ...propriedadesCabecalho, tipoUsuario }}
    />
  );
}
