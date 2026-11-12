import { Rodape } from '../../compartilhado/indice';
import {
  SecaoHeroParceiro,
  SecaoBeneficios,
  SecaoCategorias,
  SecaoPassosParceiro,
  SecaoPerguntasParceiro,
  SecaoChamada,
} from './componentes/indice';

export function SejaParceiro() {
  return (
    <>
      <main className='bg-white text-(--azul-titulo) wrap-anywhere'>
        <SecaoHeroParceiro />
        <SecaoBeneficios />
        <SecaoCategorias />
        <SecaoPassosParceiro />
        <SecaoPerguntasParceiro />
        <SecaoChamada />
      </main>
      <Rodape variante='empresa' />
    </>
  );
}
