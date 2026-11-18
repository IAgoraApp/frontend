import { DialogoCasa } from '../casa/components/casaUi';

export default function DialogoMarketplace({ titulo, aoFechar, children }) {
  return (
    <DialogoCasa titulo={titulo} aoFechar={aoFechar} classe='mercado-a-dialogo'>
      {children}
    </DialogoCasa>
  );
}
