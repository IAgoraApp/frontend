import { alterarBancoReceitas, inserir } from '../../app/dados/bancoMvp';
import macarrao from '../casa/assets/PhotoFood.png';
import omelete from './assets/omelete-rapido.webp';
import bolo from './assets/ImageCake1.png';
import frango from './assets/frango-grelhado.webp';
import cafe from './assets/cafe-da-manha.webp';

const fotos = { 1: macarrao, 2: omelete, 3: frango, 4: bolo, 5: cafe };

export const tiposReceita = {
  cafe_da_manha: 'Café da manhã',
  almoco: 'Almoço',
  jantar: 'Jantar',
  sobremesa: 'Sobremesa',
  lanche: 'Lanche',
  outro: 'Outro',
};

export const situacoesPreparo = {
  fazer: 'A fazer',
  fazendo: 'Fazendo',
  feita: 'Feita',
};

export const receitaPublica = receita =>
  receita.publica && receita.status === 'publicada';

export function fotoReceita(receita, ignorarFotoPersonalizada = false) {
  if (receita.imagem && !ignorarFotoPersonalizada)
    return { endereco: receita.imagem, ilustrativa: false };
  if (fotos[receita.id] && receita.nome === nomesFotos[receita.id])
    return { endereco: fotos[receita.id], ilustrativa: false };
  if (!receitaPublica(receita)) return null;

  const porTipo = {
    cafe_da_manha: cafe,
    almoco: frango,
    jantar: macarrao,
    sobremesa: bolo,
  };
  return { endereco: porTipo[receita.tipo] || cafe, ilustrativa: true };
}

const nomesFotos = {
  1: 'Macarrão ao molho',
  2: 'Omelete rápido',
  3: 'Frango grelhado',
  4: 'Bolo experimental',
  5: 'Café da manhã básico',
};

export function salvarReceita(receita, ingredientes, usuario) {
  let id = receita.id;

  alterarBancoReceitas(banco => {
    const existente = banco.receitas.find(item => item.id === id);
    if (id && existente?.user_id !== usuario)
      throw new Error('Esta receita não está mais disponível para edição.');

    const dados = { ...receita, user_id: usuario, publica: false };
    if (existente) Object.assign(existente, dados);
    else id = inserir('receitas', dados, banco).id;

    const itensAnteriores = banco.receita_item.filter(
      item => item.receita_id === id
    );
    ingredientes.forEach(ingrediente => {
      const anterior = itensAnteriores.find(item => item.id === ingrediente.id);
      const dadosItem = {
        receita_id: id,
        nome_item: ingrediente.nome_item.trim() || null,
        produto_id: Number(ingrediente.produto_id) || null,
        quantidade: Number(ingrediente.quantidade),
      };
      if (anterior) Object.assign(anterior, dadosItem);
      else inserir('receita_item', dadosItem, banco);
    });
    banco.receita_item = banco.receita_item.filter(
      item =>
        !itensAnteriores.includes(item) ||
        ingredientes.some(ingrediente => ingrediente.id === item.id)
    );
  });

  return id;
}

export function marcarReceita(colecao, receitaId, usuario, status) {
  alterarBancoReceitas(banco => {
    const receita = banco.receitas.find(item => item.id === receitaId);
    if (!receita || (!receitaPublica(receita) && receita.user_id !== usuario))
      throw new Error('Esta receita não está mais disponível.');

    const existente = banco[colecao].find(
      item => item.user_id === usuario && item.receita_id === receitaId
    );
    if (!status) {
      banco[colecao] = banco[colecao].filter(item => item !== existente);
    } else if (colecao === 'receita_usuario' && existente) {
      existente.status = status;
    } else if (!existente) {
      inserir(
        colecao,
        {
          user_id: usuario,
          receita_id: receitaId,
          ...(colecao === 'receita_usuario' && { status }),
        },
        banco
      );
    }
  });
}
