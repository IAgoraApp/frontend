import { useState } from 'react';
import { ChevronRight, Pencil, Plus, ReceiptText } from 'lucide-react';
import { alterarBancoPreparacao, moeda } from '../../../app/dados/bancoMvp';
import fotoEntrada from '../../encontrar-casa/assets/fachada-apartamento-sp.jpg';
import fotoReforma from '../../seja-parceiro/assets/reformas.png';
import fotoMobilia from '../../limpeza/assets/comodo-quarto.jpg';
import fotoMudanca from '../../seja-parceiro/assets/mudancas.png';
import { BotaoCasa, DialogoCasa } from '../../casa/components/casaUi';
import { centavos } from '../dinheiroDados';

const grupos = [
  {
    titulo: 'Entrada do imóvel',
    exemplo: 'Caução, vistoria ou documentação',
    categoria: 'moradia',
    categorias: ['moradia', 'documentacao'],
    foto: fotoEntrada,
  },
  {
    titulo: 'Reformas e instalações',
    exemplo: 'Pintura, reparos e instalações iniciais',
    categoria: 'reformas',
    categorias: ['reformas', 'manutencao', 'servicos'],
    foto: fotoReforma,
  },
  {
    titulo: 'Móveis e eletrodomésticos',
    exemplo: 'Cama, geladeira e utensílios',
    categoria: 'mobilia',
    categorias: ['mobilia', 'eletrodomesticos', 'organizacao'],
    foto: fotoMobilia,
  },
  {
    titulo: 'Mudança e primeiros itens',
    exemplo: 'Frete, caixas e produtos de limpeza',
    categoria: 'transporte',
    categorias: ['transporte', 'mudanca', 'limpeza', 'outros'],
    foto: fotoMudanca,
  },
];

const soma = itens =>
  itens.reduce((total, item) => total + centavos(item.valor), 0) / 100;

export default function CustosIniciais({
  registros,
  banco,
  usuario,
  escopo,
  adicionar,
  editar,
}) {
  const [aberto, setAberto] = useState(null);
  const [criando, setCriando] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [foto, setFoto] = useState(0);
  const [erro, setErro] = useState('');
  const preferencias = (banco.categorias_custos_preparacao ?? []).filter(
    item => item.usuario === usuario && item.escopo === escopo
  );
  const categorias = [
    ...grupos,
    ...preferencias
      .filter(item => !item.oculta)
      .map(item => ({
        ...item,
        categorias: [item.categoria],
        foto: grupos[item.foto]?.foto ?? fotoEntrada,
      })),
  ];
  const iniciais = registros.filter(item => item.tipo === 'inicial');
  const dados = categorias
    .filter(
      grupo =>
        !preferencias.some(
          item => item.oculta && item.categoria === grupo.categoria
        )
    )
    .map(grupo => ({
      ...grupo,
      itens: iniciais.filter(
        item =>
          (categorias.find(opcao => opcao.categorias.includes(item.categoria))
            ?.categoria ?? 'transporte') === grupo.categoria
      ),
    }));
  const ativo = dados.find(grupo => grupo.categoria === aberto);

  function excluirCategoria() {
    const ids = new Set(ativo.itens.map(item => item.id));
    try {
      alterarBancoPreparacao(bancoAtual => {
        bancoAtual.custo_moradia = bancoAtual.custo_moradia.filter(
          item => !ids.has(item.id) || item.tipo !== 'inicial'
        );
        bancoAtual.categorias_custos_preparacao = (
          bancoAtual.categorias_custos_preparacao ?? []
        ).filter(
          item =>
            !(
              item.usuario === usuario &&
              item.escopo === escopo &&
              item.categoria === ativo.categoria
            )
        );
        if (grupos.some(grupo => grupo.categoria === ativo.categoria)) {
          bancoAtual.categorias_custos_preparacao.push({
            usuario,
            escopo,
            categoria: ativo.categoria,
            oculta: true,
          });
        }
      });
      setAberto(null);
      setConfirmandoExclusao(false);
    } catch {
      setErro('Não foi possível excluir a categoria neste navegador.');
    }
  }

  function criar(evento) {
    evento.preventDefault();
    const titulo = new FormData(evento.currentTarget).get('titulo').trim();
    if (!titulo) {
      setErro('Informe o nome da categoria.');
      return;
    }
    if (
      dados.some(grupo => grupo.titulo.toLowerCase() === titulo.toLowerCase())
    ) {
      setErro('Já existe uma categoria com esse nome.');
      return;
    }
    const identificador = crypto.getRandomValues(new Uint32Array(3));
    const categoria =
      'extra-' +
      Array.from(identificador, valor => valor.toString(16)).join('-');
    try {
      alterarBancoPreparacao(bancoAtual => {
        bancoAtual.categorias_custos_preparacao ??= [];
        bancoAtual.categorias_custos_preparacao.push({
          usuario,
          escopo,
          titulo,
          categoria,
          foto,
        });
      });
    } catch {
      setErro('Não foi possível salvar a categoria neste navegador.');
      return;
    }
    setCriando(false);
    setAberto(categoria);
  }

  return (
    <section className='custos-entrada' aria-labelledby='custos-entrada-titulo'>
      <header className='custos-entrada-resumo'>
        <div>
          <h2 id='custos-entrada-titulo'>Orçamento de entrada</h2>
          <p>Planeje o que você vai pagar uma vez para se mudar.</p>
        </div>
        <div>
          <span>Total inicial previsto</span>
          <strong>{moeda(soma(iniciais))}</strong>
        </div>
      </header>
      {ativo && (
        <DialogoCasa
          titulo={confirmandoExclusao ? 'Excluir categoria?' : ativo.titulo}
          classe='custos-entrada-modal custos-entrada-modal-detalhe'
          aoFechar={() => {
            if (confirmandoExclusao) setConfirmandoExclusao(false);
            else setAberto(null);
          }}
        >
          {confirmandoExclusao ? (
            <>
              <p>
                A categoria <strong>{ativo.titulo}</strong> será excluída deste
                orçamento.
                {ativo.itens.length > 0 &&
                  ' Os gastos desta categoria também serão excluídos do total inicial.'}
              </p>
              {erro && <p role='alert'>{erro}</p>}
              <div className='mvp-form-acoes'>
                <BotaoCasa
                  secundario
                  type='button'
                  onClick={() => setConfirmandoExclusao(false)}
                >
                  Cancelar
                </BotaoCasa>
                <BotaoCasa type='button' onClick={excluirCategoria}>
                  Excluir categoria
                </BotaoCasa>
              </div>
            </>
          ) : (
            <article className='custos-entrada-detalhe'>
              <img src={ativo.foto} alt='' />
              <div className='custos-entrada-dados'>
                <div className='custos-entrada-cabecalho'>
                  <span>Subtotal da categoria</span>
                  <strong>{moeda(soma(ativo.itens))}</strong>
                </div>
                {ativo.exemplo && <p>{ativo.exemplo}</p>}
                {ativo.itens.length ? (
                  <ul>
                    {ativo.itens.map(item => (
                      <li key={item.id}>
                        <button
                          type='button'
                          className='moradia-linha'
                          onClick={() => editar(item, ativo)}
                          aria-label={'Editar ' + item.nome}
                        >
                          <span className='custos-entrada-item'>
                            <ReceiptText size={17} aria-hidden='true' />{' '}
                            {item.nome}
                          </span>
                          <strong>{moeda(item.valor)}</strong>
                          <Pencil size={14} aria-hidden='true' />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='custos-entrada-vazio'>
                    Nenhum gasto nesta categoria.
                  </p>
                )}
                <div className='custos-entrada-acoes'>
                  <BotaoCasa type='button' onClick={() => adicionar(ativo)}>
                    <Plus size={17} aria-hidden='true' /> Novo gasto
                  </BotaoCasa>
                  <button
                    type='button'
                    className='custos-entrada-excluir'
                    onClick={() => {
                      setErro('');
                      setConfirmandoExclusao(true);
                    }}
                  >
                    Excluir categoria
                  </button>
                </div>
              </div>
            </article>
          )}
        </DialogoCasa>
      )}
      <div
        className='custos-entrada-grade'
        role='region'
        aria-label='Categorias de gastos iniciais'
        tabIndex={0}
      >
        {dados.map(grupo => (
          <button
            className='custos-entrada-cartao'
            type='button'
            key={grupo.categoria}
            aria-haspopup='dialog'
            onClick={() => setAberto(grupo.categoria)}
          >
            <span className='custos-entrada-topo-cartao'>
              <strong>{grupo.titulo}</strong>
              <ChevronRight size={19} aria-hidden='true' />
            </span>
            <span className='custos-entrada-foto-cartao'>
              <img src={grupo.foto} alt='' />
            </span>
            <span className='custos-entrada-dados'>
              <span className='custos-entrada-previa'>
                {grupo.exemplo ??
                  (grupo.itens.length === 1
                    ? '1 gasto previsto'
                    : grupo.itens.length + ' gastos previstos')}
              </span>
              <span className='custos-entrada-subtotal'>
                <span>Subtotal previsto</span>
                <b>{moeda(soma(grupo.itens))}</b>
              </span>
            </span>
          </button>
        ))}
        <button
          type='button'
          className='custos-entrada-nova'
          aria-haspopup='dialog'
          onClick={() => {
            setFoto(0);
            setErro('');
            setCriando(true);
          }}
        >
          <Plus size={32} aria-hidden='true' /> Nova categoria
        </button>
      </div>
      {criando && (
        <DialogoCasa
          titulo='Nova categoria'
          classe='custos-entrada-modal'
          aoFechar={() => setCriando(false)}
        >
          <form onSubmit={criar}>
            <label className='custos-entrada-nome'>
              Nome da categoria
              <input
                name='titulo'
                placeholder='Ex.: Segurança da casa'
                maxLength={60}
                required
              />
            </label>
            <fieldset className='custos-entrada-fotos'>
              <legend>Escolha uma imagem</legend>
              {grupos.map((grupo, indice) => (
                <label key={grupo.categoria}>
                  <input
                    type='radio'
                    name='foto'
                    aria-label={grupo.titulo}
                    checked={foto === indice}
                    onChange={() => setFoto(indice)}
                  />
                  <img src={grupo.foto} alt='' />
                </label>
              ))}
            </fieldset>
            {erro && <p role='alert'>{erro}</p>}
            <div className='mvp-form-acoes'>
              <BotaoCasa
                secundario
                type='button'
                onClick={() => setCriando(false)}
              >
                Cancelar
              </BotaoCasa>
              <BotaoCasa type='submit'>Criar categoria</BotaoCasa>
            </div>
          </form>
        </DialogoCasa>
      )}
    </section>
  );
}
