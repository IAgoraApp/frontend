import { Rodape } from '../../shared/index';
import {
  SecaoHeroParceiro,
  SecaoBeneficios,
  SecaoCategorias,
  SecaoPassosParceiro,
  SecaoPerguntasParceiro,
  SecaoChamada,
} from './components/index';

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
