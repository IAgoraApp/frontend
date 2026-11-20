import RegistrosPreparacao from '../preparacao/RegistrosPreparacao';

export default function EncontrarCasa() {
  return (
    <RegistrosPreparacao
      raiz='casa_desejada'
      titulo='Imóveis desejados'
      descricao='Cadastre as opções de moradia que você está considerando.'
    />
  );
}
