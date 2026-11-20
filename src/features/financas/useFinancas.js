import { useDadosServidor } from '../../app/dados/contextoServidor';
import { editarFinancas, gerarMesRecorrente } from './financasApi';
import {
  atualizarFinancas,
  excluirFinancas,
  gerarRecorrencia,
} from './financasDados';

export function useFinancas() {
  const servidor = useDadosServidor();
  if (!servidor)
    return { atualizarFinancas, excluirFinancas, gerarRecorrencia };
  return {
    async atualizarFinancas(colecao, registro, alterar = () => registro) {
      const atual = servidor.dados[colecao]?.find(
        item => item.id === registro.id
      );
      const salvo = await editarFinancas(
        colecao,
        atual ?? registro,
        alterar(atual)
      );
      await servidor.atualizar();
      return salvo;
    },
    async excluirFinancas(colecao, registro) {
      await editarFinancas(colecao, registro);
      await servidor.atualizar();
    },
    async gerarRecorrencia(registro, mes, categoriaId) {
      const gerados = await gerarMesRecorrente(registro.id, mes, categoriaId);
      await servidor.atualizar();
      return gerados;
    },
  };
}
