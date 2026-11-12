import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Titulo } from '../../../compartilhado/interface/indice';
import Rodape from '../../../compartilhado/Rodape';
import { BotaoCasa, CartaoCasa, DialogoCasa } from '../../casa/componentes/indice';
import {
  adicionarDias,
  adicionarNaListaCompras,
  cabecalhosCozinha,
  CHAVE_COZINHA,
  chaveIngrediente,
  formatarQuantidade,
  ingredientesDoPlano,
  lerEstadoCozinha,
  normalizarTexto,
  possuiIngrediente,
  receitasCozinha,
  segundaFeiraSemana,
} from '../conteudo';
import HeroiCozinha from './HeroiCozinha';
import CartoesReceita from './CartoesReceita';
import DetalheReceita from './DetalheReceita';
import { FormularioCompras, FormularioRefeicao } from './FormulariosCozinha';
import PlanoRefeicoes from './PlanoRefeicoes';
import ListaCompras from './ListaCompras';

export default function SecaoCozinha() {
  const [carregado] = useState(lerEstadoCozinha);
  const [dados, setDados] = useState(carregado.dados);
  const [erro, setErro] = useState(
    carregado.erro
      ? 'Não foi possível carregar a cozinha salva. Os dados anteriores foram preservados.'
      : ''
  );
  const [parametros, definirParametros] = useSearchParams();
  const solicitada = parametros.get('visao');
  const receita = receitasCozinha.find(
    item => item.id === parametros.get('receita')
  );
  const visao = receita
    ? 'receita'
    : Object.hasOwn(cabecalhosCozinha, solicitada)
      ? solicitada
      : 'inicio';

  const [busca, setBusca] = useState('');
  const [textoDespensa, setTextoDespensa] = useState('');
  const [semana, setSemana] = useState(segundaFeiraSemana);
  const [dialogo, setDialogo] = useState(null);
  const [erroFormulario, setErroFormulario] = useState('');
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    if (carregado.erro) return;
    try {
      localStorage.setItem(CHAVE_COZINHA, JSON.stringify(dados));
    } catch {
      const temporizador = setTimeout(
        () =>
          setErro(
            'Não foi possível salvar no navegador. As alterações ficam disponíveis nesta sessão.'
          ),
        0
      );
      return () => clearTimeout(temporizador);
    }
  }, [dados, carregado.erro]);

  useEffect(() => {
    if (!aviso) return;
    const temporizador = setTimeout(() => setAviso(''), 5000);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  function navegar(proxima, id) {
    definirParametros(
      anterior => {
        const atualizado = new URLSearchParams(anterior);
        if (proxima === 'inicio') atualizado.delete('visao');
        else atualizado.set('visao', proxima);
        if (id) atualizado.set('receita', id);
        else atualizado.delete('receita');
        return atualizado;
      },
      { preventScrollReset: true }
    );
  }

  function abrirDialogo(tipo, item) {
    setErroFormulario('');
    setDialogo({ tipo, item });
  }

  function alternarFavorita(id) {
    setDados(anterior => ({
      ...anterior,
      favorites: anterior.favorites.includes(id)
        ? anterior.favorites.filter(valor => valor !== id)
        : [...anterior.favorites, id],
    }));
  }

  function atualizarDespensa(nome, disponivel) {
    setDados(anterior => ({
      ...anterior,
      pantry: disponivel
        ? possuiIngrediente(anterior.pantry, nome)
          ? anterior.pantry
          : [...anterior.pantry, nome]
        : anterior.pantry.filter(
            valor => chaveIngrediente(valor) !== chaveIngrediente(nome)
          ),
    }));
  }

  function adicionarDespensa(texto) {
    const nomes = texto
      .split(/[,;\n]/)
      .map(valor => valor.trim().slice(0, 80))
      .filter(Boolean);
    setDados(anterior => ({
      ...anterior,
      pantry: nomes.reduce(
        (resultado, nome) =>
          possuiIngrediente(resultado, nome) ? resultado : [...resultado, nome],
        [...anterior.pantry]
      ),
    }));
    setTextoDespensa('');
  }

  function marcar(chave, valor) {
    setDados(anterior => ({
      ...anterior,
      checks: { ...anterior.checks, [chave]: valor },
    }));
  }

  function adicionarCompras(ingredientes) {
    if (!ingredientes.length) {
      setAviso('Não há ingredientes faltantes para adicionar.');
      return;
    }
    setDados(anterior => adicionarNaListaCompras(anterior, ingredientes));
    setAviso(
      'Ingredientes adicionados à lista de compras. Itens repetidos foram agrupados.'
    );
  }

  function gerarCompras() {
    const refeicoes = dados.meals.filter(
      item => item.date >= semana && item.date <= adicionarDias(semana, 6)
    );
    if (!refeicoes.length) {
      setAviso('Adicione refeições ao plano desta semana primeiro.');
      return;
    }
    adicionarCompras(ingredientesDoPlano(refeicoes, dados.pantry));
  }

  function sugerirPlano() {
    setDados(anterior => {
      const refeicoes = [...anterior.meals];
      for (let dia = 0; dia < 7; dia++) {
        const data = adicionarDias(semana, dia);
        for (const [indice, tipo] of ['Almoço', 'Jantar'].entries()) {
          if (!refeicoes.some(item => item.date === data && item.type === tipo)) {
            refeicoes.push({
              id: crypto.randomUUID(),
              date: data,
              type: tipo,
              recipeId: ['macarrao', 'omelete', 'shakshuka'][(dia + indice) % 3],
              portions: 2,
            });
          }
        }
      }
      return { ...anterior, meals: refeicoes };
    });
    setAviso(
      'Espaços vazios preenchidos com sugestões do catálogo. Ajuste ao seu ritmo.'
    );
  }

  function salvarRefeicao(item) {
    if (
      dados.meals.some(
        refeicao =>
          refeicao.id !== item.id &&
          refeicao.date === item.date &&
          refeicao.type === item.type
      )
    ) {
      setErroFormulario(
        'Já existe uma refeição neste dia e horário. Edite a refeição existente ou escolha outro horário.'
      );
      return;
    }
    setDados(anterior => ({
      ...anterior,
      meals: anterior.meals.some(refeicao => refeicao.id === item.id)
        ? anterior.meals.map(refeicao =>
            refeicao.id === item.id ? item : refeicao
          )
        : [...anterior.meals, item],
    }));
    setSemana(segundaFeiraSemana(item.date));
    setDialogo(null);
    setAviso('Refeição salva no plano.');
  }

  function salvarItemCompra(item) {
    setDados(anterior => ({
      ...anterior,
      shopping: anterior.shopping.some(entrada => entrada.id === item.id)
        ? anterior.shopping.map(entrada =>
            entrada.id === item.id ? item : entrada
          )
        : [...anterior.shopping, item],
    }));
    setDialogo(null);
    setAviso('Item salvo na lista.');
  }

  function exportarLista() {
    const texto =
      'Minha lista de compras\n\n' +
      dados.shopping
        .map(
          item =>
            (item.bought ? '[x] ' : '[ ] ') +
            item.name +
            ' · ' +
            formatarQuantidade(item.amount) +
            ' ' +
            item.unit
        )
        .join('\n');
    const url = URL.createObjectURL(
      new Blob([texto], { type: 'text/plain;charset=utf-8' })
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'minha-lista-de-compras.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const resultadosBusca = receitasCozinha.filter(item =>
    normalizarTexto(
      item.title +
        ' ' +
        item.tags.join(' ') +
        ' ' +
        item.ingredients.map(ingrediente => ingrediente.name).join(' ')
    ).includes(normalizarTexto(busca))
  );

  const receitasDespensa = [...receitasCozinha]
    .filter(item =>
      item.ingredients.some(ingrediente =>
        possuiIngrediente(dados.pantry, ingrediente.name)
      )
    )
    .sort(
      (a, b) =>
        b.ingredients.filter(item => possuiIngrediente(dados.pantry, item.name))
          .length /
          b.ingredients.length -
        a.ingredients.filter(item => possuiIngrediente(dados.pantry, item.name))
          .length /
          a.ingredients.length
    );

  const renderizarCartoes = itens => (
    <CartoesReceita
      receitas={itens}
      favoritas={dados.favorites}
      aoFavoritar={alternarFavorita}
      despensa={visao === 'despensa' ? dados.pantry : undefined}
      aoAbrir={id => navegar('receita', id)}
    />
  );

  return (
    <div
      lang='pt-BR'
      className='min-w-0 flex-1 bg-white font-corpo leading-normal text-(--azul-titulo) wrap-anywhere [&_:is(a,button,input,select,textarea):focus-visible]:outline-2 [&_:is(a,button,input,select,textarea):focus-visible]:outline-offset-3 [&_:is(a,button,input,select,textarea):focus-visible]:outline-(--laranja-principal)'
    >
      <main>
        <Container classe='pt-4'>
          {erro && (
            <p role='alert' className='mt-4 rounded-lg bg-amber-50 p-4 text-sm'>
              {erro}
            </p>
          )}
        </Container>
        <Container classe='pb-10'>
          {visao === 'inicio' ? (
            <HeroiCozinha
              navegar={navegar}
              marcacoes={dados.checks}
              aoMarcar={marcar}
            />
          ) : (
            <>
              <header className='py-8'>
                <button
                  type='button'
                  onClick={() =>
                    navegar(visao === 'receita' ? 'buscar' : 'inicio')
                  }
                  className='mb-4 min-h-11 text-sm font-bold text-(--texto-apoio)'
                >
                  ← Voltar
                </button>
                <p className='text-xs font-bold text-(--laranja-principal)'>
                  HOJE TEM EU QUE FIZ
                </p>
                <Titulo
                  como='h1'
                  classe='mt-3 text-3xl leading-tight font-extrabold sm:text-4xl'
                >
                  {receita?.title ?? cabecalhosCozinha[visao][0]}
                </Titulo>
                <p className='mt-3 text-(--texto-apoio)'>
                  {receita ? receita.description : cabecalhosCozinha[visao][1]}
                </p>
              </header>

              {visao === 'buscar' && (
                <div className='space-y-6'>
                  <input
                    aria-label='Buscar receita'
                    type='search'
                    value={busca}
                    onChange={evento => setBusca(evento.target.value)}
                    placeholder='Ex.: Bolo de chocolate, macarrão, omelete...'
                    maxLength={200}
                    className='min-h-13 w-full rounded-full border border-[#dbe5ed] px-5'
                  />
                  <div className='flex flex-wrap gap-2'>
                    {[
                      'Bolo de chocolate',
                      'Macarrão',
                      'Omelete',
                      'Sem ovos',
                    ].map(texto => (
                      <button
                        type='button'
                        key={texto}
                        onClick={() => setBusca(texto)}
                        className='min-h-11 rounded-full bg-(--azul-fundo) px-4 text-sm'
                      >
                        {texto}
                      </button>
                    ))}
                  </div>
                  <p className='text-xs text-(--texto-apoio)'>
                    Busca no catálogo local de receitas.
                  </p>
                  {renderizarCartoes(resultadosBusca)}
                </div>
              )}

              {visao === 'despensa' && (
                <div className='space-y-6'>
                  <form
                    className='flex flex-wrap gap-3'
                    onSubmit={evento => {
                      evento.preventDefault();
                      adicionarDespensa(textoDespensa);
                    }}
                  >
                    <input
                      aria-label='Ingredientes disponíveis'
                      value={textoDespensa}
                      onChange={evento => setTextoDespensa(evento.target.value)}
                      placeholder='Ex.: ovo, cebola, tomate'
                      maxLength={1000}
                      required
                      className='min-h-13 min-w-0 flex-1 rounded-full border border-[#dbe5ed] px-5'
                    />
                    <BotaoCasa type='submit'>Adicionar ingredientes</BotaoCasa>
                  </form>
                  <div className='flex flex-wrap gap-3'>
                    {dados.pantry.map(nome => (
                      <button
                        type='button'
                        key={nome}
                        aria-label={'Remover ingrediente ' + nome}
                        onClick={() => atualizarDespensa(nome, false)}
                        className='min-h-11 rounded-full bg-(--laranja-fundo) px-4 text-sm'
                      >
                        {nome} ×
                      </button>
                    ))}
                  </div>
                  <p className='text-xs text-(--texto-apoio)'>
                    As receitas são comparadas com os ingredientes informados.
                    Confira os itens faltantes na receita; as quantidades
                    disponíveis não são controladas.
                  </p>
                  {dados.pantry.length ? (
                    renderizarCartoes(receitasDespensa)
                  ) : (
                    <CartaoCasa titulo='Comece pelo que você já tem'>
                      <p className='mb-4 text-(--texto-apoio)'>
                        Adicione seus ingredientes para encontrar ideias no
                        catálogo.
                      </p>
                      <BotaoCasa
                        secundario
                        onClick={() =>
                          adicionarDespensa('Ovo, Cebola, Tomate')
                        }
                      >
                        Experimentar ovo, cebola e tomate
                      </BotaoCasa>
                    </CartaoCasa>
                  )}
                </div>
              )}

              {visao === 'receita' && receita && (
                <DetalheReceita
                  key={receita.id}
                  receita={receita}
                  dados={dados}
                  aoFavoritar={alternarFavorita}
                  aoAtualizarDespensa={atualizarDespensa}
                  aoAdicionarCompras={adicionarCompras}
                  aoPlanejarRefeicao={(item, portions) =>
                    abrirDialogo('refeicao', { recipeId: item.id, portions })
                  }
                  aoMarcar={marcar}
                />
              )}

              {visao === 'favoritas' &&
                renderizarCartoes(
                  receitasCozinha.filter(item =>
                    dados.favorites.includes(item.id)
                  )
                )}

              {visao === 'plano' && (
                <PlanoRefeicoes
                  semana={semana}
                  refeicoes={dados.meals}
                  aoMudarSemana={setSemana}
                  aoEditar={item => abrirDialogo('refeicao', item)}
                  aoSugerir={sugerirPlano}
                  aoGerarCompras={gerarCompras}
                />
              )}

              {visao === 'compras' && (
                <ListaCompras
                  itens={dados.shopping}
                  aoEditar={item => abrirDialogo('compras', item)}
                  aoAlternar={id =>
                    setDados(anterior => ({
                      ...anterior,
                      shopping: anterior.shopping.map(item =>
                        item.id === id
                          ? { ...item, bought: !item.bought }
                          : item
                      ),
                    }))
                  }
                  aoGerar={gerarCompras}
                  aoLimpar={() => abrirDialogo('limpar')}
                  aoExportar={exportarLista}
                />
              )}

              {visao === 'basico' && (
                <div className='space-y-6'>
                  <CartaoCasa titulo='Uma refeição de cada vez.'>
                    <ul className='list-inside list-disc space-y-3 text-(--texto-apoio)'>
                      <li>
                        Leia a receita inteira e separe os ingredientes antes de
                        começar.
                      </li>
                      <li>
                        Use utensílios adequados e mantenha a bancada limpa.
                      </li>
                      <li>Prepare pequenas porções e ajuste ao seu tempo.</li>
                      <li>
                        Confira o ponto dos alimentos e tenha cuidado com o fogo
                        e os utensílios quentes.
                      </li>
                    </ul>
                  </CartaoCasa>
                  {renderizarCartoes(
                    receitasCozinha.filter(item => item.minutes <= 25)
                  )}
                  <BotaoCasa
                    secundario
                    como={Link}
                    to='/limpeza?visao=guia&guia=cozinha'
                  >
                    Aprender a limpar a cozinha ↗
                  </BotaoCasa>
                </div>
              )}
            </>
          )}
        </Container>
        <section className='bg-(--azul-titulo) py-8 text-white'>
          <Container classe='flex flex-wrap items-center justify-between gap-6'>
            <div>
              <Titulo classe='text-3xl font-extrabold text-white!'>
                Aprender a cozinhar também é se cuidar.
              </Titulo>
              <p className='mt-2 text-sm text-white/90'>
                Um repertório simples já muda a sua semana.
              </p>
            </div>
            <BotaoCasa onClick={() => navegar('basico')}>
              Aprender o básico ↗
            </BotaoCasa>
          </Container>
        </section>
      </main>
      <Rodape />
      {aviso && (
        <div
          role='status'
          className='fixed right-4 bottom-4 left-4 z-40 flex items-center justify-between gap-4 rounded-xl bg-(--azul-titulo) p-4 text-sm text-white sm:left-auto sm:max-w-md'
        >
          {aviso}
          <button
            type='button'
            onClick={() => setAviso('')}
            aria-label='Fechar aviso'
            className='size-11 shrink-0 text-xl'
          >
            ×
          </button>
        </div>
      )}
      {dialogo && (
        <DialogoCasa
          titulo={
            dialogo.tipo === 'refeicao'
              ? dialogo.item?.id
                ? 'Editar refeição'
                : 'Uma receita no seu plano.'
              : dialogo.tipo === 'compras'
                ? dialogo.item
                  ? 'Editar item'
                  : 'O que falta comprar?'
                : dialogo.tipo === 'limpar'
                  ? 'Limpar itens comprados?'
                  : 'Remover registro?'
          }
          aoFechar={() => setDialogo(null)}
        >
          {erroFormulario && (
            <p
              role='alert'
              className='mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800'
            >
              {erroFormulario}
            </p>
          )}
          {dialogo.tipo === 'refeicao' ? (
            <FormularioRefeicao
              item={dialogo.item}
              aoSalvar={salvarRefeicao}
              aoCancelar={() => setDialogo(null)}
              aoRemover={() => abrirDialogo('remover-refeicao', dialogo.item)}
            />
          ) : dialogo.tipo === 'compras' ? (
            <FormularioCompras
              item={dialogo.item}
              aoSalvar={salvarItemCompra}
              aoCancelar={() => setDialogo(null)}
              aoRemover={() => abrirDialogo('remover-item', dialogo.item)}
            />
          ) : (
            <>
              <p className='mb-6 text-(--texto-apoio)'>
                {dialogo.tipo === 'limpar'
                  ? 'Os itens marcados como comprados serão removidos da lista.'
                  : 'Este registro será removido. Deseja continuar?'}
              </p>
              <div className='flex flex-wrap gap-3'>
                <BotaoCasa
                  onClick={() => {
                    setDados(anterior =>
                      dialogo.tipo === 'limpar'
                        ? {
                            ...anterior,
                            shopping: anterior.shopping.filter(
                              item => !item.bought
                            ),
                          }
                        : dialogo.tipo === 'remover-refeicao'
                          ? {
                              ...anterior,
                              meals: anterior.meals.filter(
                                item => item.id !== dialogo.item.id
                              ),
                            }
                          : {
                              ...anterior,
                              shopping: anterior.shopping.filter(
                                item => item.id !== dialogo.item.id
                              ),
                            }
                    );
                    setDialogo(null);
                    setAviso('Registro atualizado.');
                  }}
                >
                  Confirmar remoção
                </BotaoCasa>
                <BotaoCasa secundario onClick={() => setDialogo(null)}>
                  Cancelar
                </BotaoCasa>
              </div>
            </>
          )}
        </DialogoCasa>
      )}
    </div>
  );
}
