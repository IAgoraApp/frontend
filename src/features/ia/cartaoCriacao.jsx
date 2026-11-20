import { Link } from 'react-router-dom';
import { contaApi } from '../../app/dados/contaApi';
import { lerSessao } from '../../app/dados/sessao';
import { salvarReceitaApi } from '../cozinha/cozinhaApi';
import imagemReceita from '../cozinha/assets/cafe-da-manha.webp';
import imagemTarefa from '../landing-page/assets/passo-organizar-rotina.png';
import imagemLancamento from '../financas/assets/porquinho-metas.webp';

const cartoes = {
  receita: {
    titulo: 'Receita',
    proposta: 'Proposta de receita',
    salvo: 'Receita salva como rascunho particular',
    destino: 'Abrir na Cozinha',
    pagina: '/cozinha?visao=minhas',
    imagem: imagemReceita,
  },
  tarefa: {
    titulo: 'Tarefa',
    proposta: 'Proposta de tarefa',
    salvo: 'Tarefa criada',
    destino: 'Abrir na Rotina',
    pagina: '/rotina?visao=lista',
    imagem: imagemTarefa,
  },
  lancamento: {
    titulo: 'Lançamento financeiro',
    proposta: 'Proposta de lançamento',
    salvo: 'Lançamento salvo',
    destino: 'Abrir em Finanças',
    pagina: '/financas?visao=lancamentos',
    imagem: imagemLancamento,
  },
};

const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});
const dataCurta = data => data.slice(0, 10).split('-').reverse().join('/');

async function salvarProposta(proposta, sessao) {
  const {
    nome,
    descricao,
    preparo,
    ingredientes,
    categoriaId,
    prazo,
    tipo,
    valor,
    data,
    pago,
  } = proposta;
  if (proposta.tipoRegistro === 'receita') {
    const id = await salvarReceitaApi(
      { nome, descricao, preparo, status: 'rascunho' },
      ingredientes.map(item => ({
        nome_item: item.nomeItem,
        quantidade: item.quantidade,
      })),
      sessao.id
    );
    return cartoes.receita.pagina + '&receita=' + id;
  }
  if (proposta.tipoRegistro === 'lancamento') {
    const registro = await contaApi('/assistente/lancamentos', {
      metodo: 'POST',
      token: sessao.token,
      dados: { nome, tipo, valor, data, pago, categoriaId },
    });
    return cartoes.lancamento.pagina + '&lancamento=' + registro.id;
  }
  const tarefa = await contaApi('/assistente/tarefas', {
    metodo: 'POST',
    token: sessao.token,
    dados: { nome, descricao, categoriaId, prazo },
  });
  return cartoes.tarefa.pagina + '&data=' + tarefa.prazo.slice(0, 10);
}

export default function CartaoCriacao({
  proposta,
  registro,
  aoAtualizar,
  sessao,
}) {
  const { estado, erro, rota } = registro ?? {};
  const cartao = cartoes[proposta.tipoRegistro];

  async function salvar() {
    if (estado || lerSessao()?.token !== sessao.token) return;
    aoAtualizar({ estado: 'salvando' });
    try {
      const destino = await salvarProposta(proposta, sessao);
      aoAtualizar({ estado: 'salvo', rota: destino });
    } catch (falha) {
      const incerto = !falha.status || falha.status >= 500;
      aoAtualizar({
        estado: incerto ? 'incerto' : undefined,
        erro: incerto
          ? 'O servidor não confirmou o resultado. Confira na página antes de tentar criar novamente.'
          : falha.message,
      });
    }
  }

  return (
    <section
      className='ia-cartao-criacao'
      aria-label={cartao.titulo}
      data-tipo={proposta.tipoRegistro}
    >
      <img className='ia-cartao-imagem' src={cartao.imagem} alt='' />
      <div className='ia-cartao-corpo'>
        <strong role='status'>
          {estado === 'salvo' ? cartao.salvo : cartao.proposta}
        </strong>
        <h3>{proposta.nome}</h3>
        {typeof proposta.descricao === 'string' && <p>{proposta.descricao}</p>}
        {proposta.tipoRegistro === 'receita' && (
          <>
            <ul>
              {proposta.ingredientes.map((item, indice) => (
                <li key={indice}>
                  {item.quantidade} × {item.nomeItem}
                </li>
              ))}
            </ul>
            <p>{proposta.preparo}</p>
          </>
        )}
        {proposta.tipoRegistro === 'tarefa' && (
          <p>
            {dataCurta(proposta.prazo)} às {proposta.prazo.slice(11, 16)}
            {proposta.categoria && ' · ' + proposta.categoria}
          </p>
        )}
        {proposta.tipoRegistro === 'lancamento' && (
          <>
            <p>
              <b>{moeda.format(proposta.valor)}</b> ·{' '}
              {proposta.tipo === 'despesa' ? 'Despesa' : 'Receita'}
            </p>
            <p>
              {dataCurta(proposta.data)} · {proposta.categoria ?? 'Outros'} ·{' '}
              {proposta.pago ? 'Liquidado' : 'Pendente'}
            </p>
          </>
        )}
        {erro && <p role='alert'>{erro}</p>}
        {rota || estado === 'incerto' ? (
          <Link className='ia-ver-registro' to={rota ?? cartao.pagina}>
            {cartao.destino}
          </Link>
        ) : (
          <button
            type='button'
            className='ia-ver-registro'
            disabled={estado === 'salvando'}
            onClick={salvar}
          >
            {estado === 'salvando' ? 'Salvando…' : 'Confirmar e salvar'}
          </button>
        )}
      </div>
    </section>
  );
}
