import { useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  Botao,
  CampoFormulario,
  ColagemEditorial,
  Container,
  EstadoCarregamento,
  EstadoVazio,
  SeloEditorial,
  Titulo,
} from '../../../compartilhado/interface/indice';
import { CaixaIlustradaEmpresa } from '../../empresa/componentes/InterfaceEmpresa';
import fitaFoto from '../../../ativos/vetores/assinaturas/fita-foto.svg';
import tracoCaminho from '../../../ativos/vetores/assinaturas/traco-caminho-canto.svg';
import {
  categoriasMercado,
  filtrarServicosMercado,
  fotosMercado,
} from '../conteudo';

function CartaoServico({
  servico,
  empresa,
  ehFavorito,
  aoAlternarFavorito,
  compacto = false,
}) {
  return (
    <article className='flex min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-[#dbe5ed] bg-white transition-shadow hover:shadow-md'>
      <div>
        <div className='relative aspect-[16/10] w-full overflow-hidden bg-[#f4f7fa]'>
          <img
            src={servico.imagem}
            alt={servico.titulo}
            className='size-full object-cover'
          />
          <button
            type='button'
            aria-label={
              ehFavorito
                ? `Remover ${servico.titulo} dos favoritos`
                : `Salvar ${servico.titulo} nos favoritos`
            }
            aria-pressed={ehFavorito}
            onClick={() => aoAlternarFavorito(servico.id)}
            className={`absolute top-3 right-3 flex size-10 cursor-pointer items-center justify-center rounded-full border text-base font-bold transition-colors ${
              ehFavorito
                ? 'border-(--laranja-principal) bg-(--laranja-principal) text-white'
                : 'border-[#dbe5ed] bg-white/95 text-(--azul-titulo) hover:border-(--laranja-principal)'
            }`}
          >
            {ehFavorito ? '♥' : '♡'}
          </button>
        </div>

        <div className='space-y-2.5 p-5'>
          <div className='flex flex-wrap items-center justify-between gap-2 text-xs font-bold'>
            <span className='tracking-[0.6px] text-(--laranja-principal) uppercase'>
              {servico.categoria} · {servico.subcategoria}
            </span>
            <span className='rounded-full bg-[#fce8dc] px-2.5 py-0.5 text-(--azul-titulo)'>
              ★ {servico.nota} ({servico.totalAvaliacoes})
            </span>
          </div>

          <Titulo
            como='h3'
            classe='text-xl leading-snug font-extrabold text-(--azul-titulo)'
          >
            {empresa?.nome || servico.titulo}
          </Titulo>

          <p className='text-sm font-bold text-(--texto-apoio)'>
            {servico.titulo}
          </p>

          {!compacto && (
            <p className='line-clamp-2 text-sm leading-relaxed text-(--texto-apoio)'>
              {servico.descricao}
            </p>
          )}
        </div>
      </div>

      <div className='space-y-3 border-t border-[#eef2f5] px-5 pt-4 pb-5'>
        <div className='flex flex-wrap items-center justify-between gap-2 text-xs text-(--texto-apoio)'>
          <span className='font-bold text-(--azul-titulo)'>
            {servico.preco}
          </span>
          <span>{servico.regiao}</span>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Botao
            como={Link}
            to={`/servicos/${servico.id}`}
            cor='laranja'
            classe='min-h-[42px]! flex-1 px-4! text-sm!'
          >
            Ver detalhes ↗
          </Botao>
          <Botao
            como={Link}
            to={`/empresas/${servico.empresaId}`}
            variante='fantasma'
            classe='min-h-[42px]! border border-[#dbe5ed] px-3! text-sm!'
          >
            Empresa
          </Botao>
        </div>
      </div>
    </article>
  );
}

export function VisaoPrincipalMercado({
  dentroDaEmpresa = false,
  empresas = [],
  servicos = [],
  favoritos = [],
  aoAlternarFavorito,
}) {
  const navegar = useNavigate();
  const [termoBusca, setTermoBusca] = useState('');
  const [regiaoBusca, setRegiaoBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todas');

  const servicosDestaque = servicos.slice(0, 4);
  const empresasFiltradas = empresas.filter(empresa => {
    if (
      categoriaSelecionada !== 'Todas' &&
      empresa.categoria !== categoriaSelecionada
    ) {
      return false;
    }
    const texto = `${empresa.nome} ${empresa.categoria} ${empresa.sobre}`.toLowerCase();
    if (
      termoBusca.trim() &&
      !texto.includes(termoBusca.trim().toLowerCase())
    ) {
      return false;
    }
    if (
      regiaoBusca.trim() &&
      !String(empresa.regiao || '')
        .toLowerCase()
        .includes(regiaoBusca.trim().toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  function enviarBusca(evento) {
    evento.preventDefault();
    const consulta = new URLSearchParams();
    if (termoBusca.trim()) consulta.set('busca', termoBusca.trim());
    if (regiaoBusca.trim()) consulta.set('regiao', regiaoBusca.trim());
    navegar(`/buscar${consulta.toString() ? `?${consulta.toString()}` : ''}`);
  }

  return (
    <div className='space-y-16 bg-white pb-16'>
      <Container>
        <section className='grid items-center gap-10 pt-8 sm:pt-12 lg:grid-cols-2 lg:gap-14'>
          <div className='min-w-0 space-y-6'>
            <SeloEditorial
              texto={
                dentroDaEmpresa
                  ? 'VITRINE DA EMPRESA NO IAGORA'
                  : 'EMPRESAS QUE CUIDAM DO SEU CANTO'
              }
            />
            <h1 className='font-titulo text-[clamp(2.5rem,5.4vw,4.6rem)] leading-[1.03] font-extrabold text-(--azul-titulo)'>
              Deu ruim?
              <span className='block text-(--laranja-principal)'>
                Tem quem faça.
              </span>
            </h1>
            <p className='max-w-[560px] text-base leading-relaxed text-(--texto-apoio) sm:text-lg'>
              {dentroDaEmpresa
                ? 'Veja como os moradores descobrem prestadores no Iagora e destaque seus serviços ao lado de empresas da região.'
                : 'Encontre prestadoras de serviços confiáveis, compare avaliações reais e combine o atendimento direto com quem resolve.'}
            </p>

            <div className='flex flex-wrap items-center gap-3'>
              <Botao
                como={Link}
                to={dentroDaEmpresa ? '/empresa/anunciar' : '/buscar'}
                cor='laranja'
                classe='px-7!'
              >
                {dentroDaEmpresa
                  ? 'Publicar meu serviço ↗'
                  : 'Buscar serviços perto de você ↗'}
              </Botao>
              {!dentroDaEmpresa && (
                <>
                  <Botao
                    como={Link}
                    to='/favoritos'
                    variante='secundario'
                    classe='px-5!'
                  >
                    ♡ Meus favoritos ({favoritos.length})
                  </Botao>
                  <Botao
                    como={Link}
                    to='/meus-contatos'
                    variante='fantasma'
                    classe='border border-[#dbe5ed] px-5!'
                  >
                    Meus contatos
                  </Botao>
                </>
              )}
            </div>

            <div className='pt-2'>
              <span className='inline-block rotate-2 bg-(--azul-titulo) px-5 py-2.5 text-xs font-bold tracking-[0.7px] text-white uppercase'>
                INDEPENDÊNCIA NA VIDA REAL ↗
              </span>
            </div>
          </div>

          <ColagemEditorial largura={539} altura={610}>
            <div
              data-movimento-editorial
              className='absolute top-7 left-[87px] h-[375px] w-[300px] rotate-6 border-8 border-white bg-white shadow-lg'
            >
              <img
                src={fotosMercado.editorialServicos}
                alt='Profissional organizando atendimento residencial'
                className='size-full object-cover'
              />
            </div>
            <div
              data-movimento-editorial
              className='absolute top-[378px] left-0 h-[164px] w-[230px] rotate-7 border-8 border-white bg-white shadow-lg'
            >
              <img
                src={fotosMercado.editorialApartamento}
                alt='Apartamento limpo e preparado para morar'
                className='size-full object-cover'
              />
            </div>
            <div className='absolute top-[280px] left-3'>
              <CaixaIlustradaEmpresa />
            </div>
            <span className='font-titulo absolute top-[478px] left-[201px] -rotate-4 bg-(--laranja-principal) px-5 py-3 text-sm font-bold text-white shadow-sm'>
              seu canto ganha vida ↗
            </span>
            <img
              src={tracoCaminho}
              alt=''
              className='absolute top-[532px] left-[121px]'
            />
            <img
              src={fitaFoto}
              alt=''
              className='absolute top-3 left-[216px] rotate-9'
            />
          </ColagemEditorial>
        </section>
      </Container>

      {dentroDaEmpresa ? (
        <section className='bg-[#f4f7fa] py-12'>
          <Container classe='space-y-8'>
            <div className='space-y-2'>
              <SeloEditorial texto='ENCONTRE QUEM RESOLVE' />
              <Titulo
                como='h2'
                classe='text-2xl font-extrabold text-(--azul-titulo) sm:text-3xl'
              >
                Que cuidado sua casa precisa agora?
              </Titulo>
            </div>

            <form
              onSubmit={evento => evento.preventDefault()}
              className='grid items-end gap-4 rounded-2xl border border-[#dbe5ed] bg-white p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]'
            >
              <CampoFormulario
                id='mercado-empresa-busca'
                rotulo='O que você procura?'
                value={termoBusca}
                onChange={evento => setTermoBusca(evento.target.value)}
                placeholder='Limpeza, manutenção, mudança...'
              />
              <CampoFormulario
                id='mercado-empresa-regiao'
                rotulo='Onde precisa do serviço?'
                value={regiaoBusca}
                onChange={evento => setRegiaoBusca(evento.target.value)}
                placeholder='Cidade ou bairro'
              />
              <Botao type='submit' cor='laranja' classe='min-h-[52px]! px-6!'>
                Buscar empresas ↗
              </Botao>
            </form>

            <div className='flex flex-wrap gap-2'>
              {[
                'Todas',
                'Limpeza',
                'Manutenção',
                'Mudanças',
                'Instalações',
                'Reparos',
              ].map(cat => (
                <button
                  key={cat}
                  type='button'
                  aria-pressed={categoriaSelecionada === cat}
                  onClick={() => setCategoriaSelecionada(cat)}
                  className={`min-h-10 cursor-pointer rounded-full px-4 text-sm font-bold transition-colors ${
                    categoriaSelecionada === cat
                      ? 'bg-(--azul-titulo) text-white'
                      : 'border border-[#dbe5ed] bg-white text-(--azul-titulo) hover:border-(--laranja-principal)'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
              {empresasFiltradas.map(empresa => (
                <article
                  key={empresa.id}
                  className='flex flex-col justify-between rounded-2xl border border-[#dbe5ed] bg-white p-5'
                >
                  <div>
                    <img
                      src={empresa.imagem}
                      alt={empresa.nome}
                      className='mb-4 aspect-[16/10] w-full rounded-xl object-cover'
                    />
                    <p className='text-xs font-bold tracking-[0.7px] text-(--laranja-principal) uppercase'>
                      {empresa.categoria}
                    </p>
                    <Titulo
                      como='h3'
                      classe='mt-2 text-2xl font-extrabold text-(--azul-titulo)'
                    >
                      {empresa.nome}
                    </Titulo>
                    <p className='mt-2 line-clamp-3 text-sm leading-relaxed text-(--texto-apoio)'>
                      {empresa.sobre}
                    </p>
                    <p className='mt-3 text-xs font-semibold text-(--texto-apoio)'>
                      {empresa.regiao}
                    </p>
                  </div>
                  <Botao
                    como={Link}
                    to={`/empresas/${empresa.id}`}
                    cor='laranja'
                    classe='mt-5 w-full'
                  >
                    Conhecer a empresa ↗
                  </Botao>
                </article>
              ))}
            </div>
          </Container>
        </section>
      ) : (
        <>
          <Container classe='space-y-8'>
            <form
              onSubmit={enviarBusca}
              className='grid items-end gap-4 rounded-2xl border border-[#dbe5ed] bg-[#f4f7fa] p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]'
            >
              <CampoFormulario
                id='mercado-busca-principal'
                rotulo='Qual serviço você precisa hoje?'
                value={termoBusca}
                onChange={evento => setTermoBusca(evento.target.value)}
                placeholder='Ex: limpeza pós-mudança, eletricista, frete...'
              />
              <CampoFormulario
                id='mercado-regiao-principal'
                rotulo='Em qual bairro ou cidade?'
                value={regiaoBusca}
                onChange={evento => setRegiaoBusca(evento.target.value)}
                placeholder='Ex: Vila Mariana, São Paulo'
              />
              <Botao type='submit' cor='laranja' classe='min-h-[52px]! px-7!'>
                Buscar agora ↗
              </Botao>
            </form>

            <div className='space-y-4'>
              <div className='flex flex-wrap items-end justify-between gap-4'>
                <div>
                  <SeloEditorial texto='CATEGORIAS DE SERVIÇO' />
                  <Titulo
                    como='h2'
                    classe='mt-1.5 text-2xl font-extrabold sm:text-3xl'
                  >
                    O que você precisa hoje?
                  </Titulo>
                </div>
                <Link
                  to='/marketplace/filtros'
                  className='text-sm font-bold text-(--laranja-principal) hover:underline'
                >
                  Filtros avançados ↗
                </Link>
              </div>

              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                {categoriasMercado.map(categoria => (
                  <Link
                    key={categoria.slug}
                    to={`/categoria/${categoria.slug}`}
                    className='group flex items-start gap-4 rounded-2xl border border-[#dbe5ed] bg-white p-5 transition-all hover:border-(--laranja-principal) hover:bg-[#fffaf7]'
                  >
                    <span className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#fce8dc] p-2.5'>
                      <img
                        src={categoria.icone}
                        alt=''
                        className='size-7 object-contain'
                      />
                    </span>
                    <div className='min-w-0'>
                      <h3 className='font-titulo text-lg font-extrabold text-(--azul-titulo) group-hover:text-(--laranja-principal)'>
                        {categoria.nome}
                      </h3>
                      <p className='mt-1 text-xs leading-relaxed text-(--texto-apoio)'>
                        {categoria.descricao}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Container>

          <Container classe='space-y-6'>
            <div className='flex flex-wrap items-end justify-between gap-4'>
              <div>
                <SeloEditorial texto='EM DESTAQUE PERTO DE VOCÊ' />
                <Titulo
                  como='h2'
                  classe='mt-1.5 text-2xl font-extrabold sm:text-3xl'
                >
                  Profissionais bem avaliados no Iagora.
                </Titulo>
              </div>
              <div className='flex flex-wrap gap-3'>
                <Link
                  to='/buscar/mapa'
                  className='text-sm font-bold text-(--azul-titulo) hover:text-(--laranja-principal) hover:underline'
                >
                  Ver no mapa ↗
                </Link>
                <Link
                  to='/buscar'
                  className='text-sm font-bold text-(--laranja-principal) hover:underline'
                >
                  Ver todos os serviços ↗
                </Link>
              </div>
            </div>

            <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-4'>
              {servicosDestaque.map(servico => (
                <CartaoServico
                  key={servico.id}
                  servico={servico}
                  empresa={empresas.find(item => item.id === servico.empresaId)}
                  ehFavorito={favoritos.includes(servico.id)}
                  aoAlternarFavorito={aoAlternarFavorito}
                  compacto
                />
              ))}
            </div>
          </Container>

          <section className='bg-[#102a43] py-12 text-white'>
            <Container classe='flex flex-col items-start justify-between gap-6 md:flex-row md:items-center'>
              <div className='space-y-2'>
                <p className='text-xs font-bold tracking-[0.8px] text-[#ffb591] uppercase'>
                  PARCERIA E CONFIANÇA
                </p>
                <Titulo
                  como='h2'
                  classe='text-3xl font-extrabold text-white! sm:text-4xl'
                >
                  Sua casa em boas mãos.
                </Titulo>
                <p className='max-w-[560px] text-base leading-relaxed text-white/85'>
                  Compare serviços da sua região, tire dúvidas antes de fechar e
                  mantenha o histórico de pedidos sempre organizado.
                </p>
              </div>
              <div className='flex flex-wrap gap-3'>
                <Botao como={Link} to='/buscar' cor='laranja' classe='px-7!'>
                  Explorar catálogo ↗
                </Botao>
                <Botao
                  como={Link}
                  to='/sejaparceiro'
                  variante='fantasma'
                  classe='border border-white/25 px-6! text-white! hover:bg-white/10!'
                >
                  Sou prestador de serviço
                </Botao>
              </div>
            </Container>
          </section>
        </>
      )}
    </div>
  );
}

export function VisaoBuscarServicos({
  empresas = [],
  servicos = [],
  favoritos = [],
  aoAlternarFavorito,
}) {
  const [parametros, setParametros] = useSearchParams();
  const [busca, setBusca] = useState(parametros.get('busca') || '');
  const [regiao, setRegiao] = useState(parametros.get('regiao') || '');

  const carregando = parametros.get('carregando') === '1';
  const erroSimulado = parametros.get('erro') === '1';

  const categoria = parametros.get('categoria') || 'Todas';
  const atendimento = parametros.get('atendimento') || 'Todos';
  const notaMinima = parametros.get('notaMinima') || '';
  const precoMaximo = parametros.get('precoMaximo') || '';
  const ordenacao = parametros.get('ordenacao') || 'relevancia';

  const resultados = filtrarServicosMercado(servicos, empresas, {
    busca: parametros.get('busca') || '',
    regiao: parametros.get('regiao') || '',
    categoria,
    atendimento,
    notaMinima,
    precoMaximo,
    ordenacao,
  });

  function atualizarFiltro(chave, valor) {
    setParametros(anterior => {
      const proximo = new URLSearchParams(anterior);
      if (valor && valor !== 'Todas' && valor !== 'Todos') {
        proximo.set(chave, valor);
      } else {
        proximo.delete(chave);
      }
      return proximo;
    });
  }

  function limparFiltros() {
    setBusca('');
    setRegiao('');
    setParametros({});
  }

  return (
    <Container como='main' classe='space-y-8 py-8 pb-16 sm:py-10'>
      <header className='space-y-4 border-b border-[#e6edf2] pb-6'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <Link
            to='/marketplace'
            className='text-sm font-bold text-(--texto-apoio) hover:text-(--laranja-principal)'
          >
            ← Voltar ao início do Marketplace
          </Link>
          <div className='flex flex-wrap gap-2'>
            <Botao
              como={Link}
              to='/favoritos'
              variante='secundario'
              classe='min-h-[40px]! px-4! text-xs!'
            >
              ♡ Meus favoritos ({favoritos.length})
            </Botao>
            <Botao
              como={Link}
              to='/meus-contatos'
              variante='fantasma'
              classe='min-h-[40px]! border border-[#dbe5ed] px-4! text-xs!'
            >
              Meus contatos
            </Botao>
            <Botao
              como={Link}
              to='/buscar/mapa'
              variante='fantasma'
              classe='min-h-[40px]! border border-[#dbe5ed] px-4! text-xs!'
            >
              Ver mapa
            </Botao>
          </div>
        </div>

        <SeloEditorial texto='BUSCAR SERVIÇOS' />
        <Titulo
          como='h1'
          classe='text-[clamp(2rem,3.6vw,3rem)] leading-[1.1] font-extrabold'
        >
          Serviços perto de você.
        </Titulo>
      </header>

      <form
        onSubmit={evento => {
          evento.preventDefault();
          setParametros(anterior => {
            const proximo = new URLSearchParams(anterior);
            if (busca.trim()) proximo.set('busca', busca.trim());
            else proximo.delete('busca');
            if (regiao.trim()) proximo.set('regiao', regiao.trim());
            else proximo.delete('regiao');
            return proximo;
          });
        }}
        className='grid items-end gap-4 rounded-2xl border border-[#dbe5ed] bg-[#f4f7fa] p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]'
      >
        <CampoFormulario
          id='buscar-termo'
          rotulo='O que você precisa?'
          value={busca}
          onChange={evento => setBusca(evento.target.value)}
          placeholder='Ex: limpeza, elétrica, mudança...'
        />
        <CampoFormulario
          id='buscar-regiao'
          rotulo='Região ou bairro'
          value={regiao}
          onChange={evento => setRegiao(evento.target.value)}
          placeholder='Ex: Vila Mariana, São Paulo'
        />
        <div className='flex flex-wrap gap-2'>
          <Botao type='submit' cor='laranja' classe='min-h-[52px]! px-6!'>
            Filtrar ↗
          </Botao>
          <Botao
            como={Link}
            to='/marketplace/filtros'
            variante='secundario'
            classe='min-h-[52px]! px-5!'
          >
            Mais filtros
          </Botao>
        </div>
      </form>

      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex flex-wrap gap-2'>
          {['Todas', ...categoriasMercado.map(c => c.nome)].map(nomeCat => (
            <button
              key={nomeCat}
              type='button'
              aria-pressed={categoria === nomeCat}
              onClick={() => atualizarFiltro('categoria', nomeCat)}
              className={`min-h-10 cursor-pointer rounded-full px-4 text-xs font-bold transition-colors ${
                categoria === nomeCat
                  ? 'bg-(--azul-titulo) text-white'
                  : 'border border-[#dbe5ed] bg-white text-(--azul-titulo) hover:border-(--laranja-principal)'
              }`}
            >
              {nomeCat}
            </button>
          ))}
        </div>

        <label className='flex items-center gap-2 text-xs font-bold text-(--texto-apoio)'>
          Ordenar:
          <select
            value={ordenacao}
            onChange={evento => atualizarFiltro('ordenacao', evento.target.value)}
            className='h-10 rounded-lg border border-[#dbe5ed] bg-white px-3 text-xs font-bold text-(--azul-titulo)'
          >
            <option value='relevancia'>Mais relevantes</option>
            <option value='melhor-avaliacao'>Melhor avaliação</option>
            <option value='menor-preco'>Menor preço</option>
          </select>
        </label>
      </div>

      {carregando ? (
        <EstadoCarregamento
          titulo='Buscando prestadores na região'
          descricao='Filtrando serviços, avaliações e horários disponíveis perto de você.'
        />
      ) : erroSimulado ? (
        <EstadoVazio
          varianteAlerta='erro'
          titulo='Não foi possível carregar os serviços agora.'
          descricao='Houve uma instabilidade temporária ao consultar os filtros selecionados. Tente novamente em instantes.'
          textoAcao='Recarregar busca'
          aoClicar={limparFiltros}
        />
      ) : (
        <div className='grid items-start gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]'>
          <div className='space-y-5'>
            <p className='text-sm font-semibold text-(--texto-apoio)'>
              {resultados.length}{' '}
              {resultados.length === 1
                ? 'serviço encontrado'
                : 'serviços encontrados'}
            </p>

            {resultados.length ? (
              <div className='grid gap-6 md:grid-cols-2'>
                {resultados.map(servico => (
                  <CartaoServico
                    key={servico.id}
                    servico={servico}
                    empresa={empresas.find(item => item.id === servico.empresaId)}
                    ehFavorito={favoritos.includes(servico.id)}
                    aoAlternarFavorito={aoAlternarFavorito}
                  />
                ))}
              </div>
            ) : (
              <EstadoVazio
                titulo='Nenhum serviço com esses filtros.'
                descricao='Tente ajustar a região, limpar a busca ou explorar outras categorias disponíveis na plataforma.'
                textoAcao='Limpar filtros'
                aoClicar={limparFiltros}
              />
            )}
          </div>

          <aside className='sticky top-6 space-y-4 rounded-2xl border border-[#dbe5ed] bg-[#f4f7fa] p-5'>
            <div className='overflow-hidden rounded-xl border border-[#dbe5ed] bg-white'>
              <img
                src={fotosMercado.mapaSaoPaulo}
                alt='Mapa ilustrativo de São Paulo com bairros atendidos'
                className='aspect-[4/3] w-full object-cover'
              />
            </div>
            <div className='space-y-2'>
              <Titulo
                como='h2'
                classe='text-lg font-extrabold text-(--azul-titulo)'
              >
                Explore os atendimentos no mapa
              </Titulo>
              <p className='text-sm leading-relaxed text-(--texto-apoio)'>
                Visualize a concentração de prestadores em bairros de São Paulo
                e compare valores iniciais.
              </p>
              <Botao
                como={Link}
                to='/buscar/mapa'
                cor='laranja'
                classe='w-full'
              >
                Abrir visualização em mapa ↗
              </Botao>
            </div>
          </aside>
        </div>
      )}
    </Container>
  );
}

export function VisaoFiltrosMercado() {
  const navegar = useNavigate();
  const [parametros] = useSearchParams();
  const [categoria, setCategoria] = useState(
    parametros.get('categoria') || 'Todas'
  );
  const [atendimento, setAtendimento] = useState(
    parametros.get('atendimento') || 'Todos'
  );
  const [notaMinima, setNotaMinima] = useState(
    parametros.get('notaMinima') || ''
  );
  const [precoMaximo, setPrecoMaximo] = useState(
    parametros.get('precoMaximo') || ''
  );
  const [regiao, setRegiao] = useState(parametros.get('regiao') || '');

  function aplicarFiltros(evento) {
    evento.preventDefault();
    const consulta = new URLSearchParams();
    if (categoria && categoria !== 'Todas') consulta.set('categoria', categoria);
    if (atendimento && atendimento !== 'Todos') {
      consulta.set('atendimento', atendimento);
    }
    if (notaMinima) consulta.set('notaMinima', notaMinima);
    if (precoMaximo) consulta.set('precoMaximo', precoMaximo);
    if (regiao.trim()) consulta.set('regiao', regiao.trim());
    navegar(`/buscar${consulta.toString() ? `?${consulta.toString()}` : ''}`);
  }

  return (
    <Container como='main' classe='space-y-8 py-8 pb-16 sm:py-10'>
      <header className='space-y-3 border-b border-[#e6edf2] pb-6'>
        <Link
          to='/buscar'
          className='inline-flex items-center text-sm font-bold text-(--texto-apoio) hover:text-(--laranja-principal)'
        >
          ← Voltar para a busca
        </Link>
        <SeloEditorial texto='FILTRAR RESULTADOS' />
        <Titulo
          como='h1'
          classe='text-[clamp(2rem,3.6vw,3rem)] leading-[1.1] font-extrabold'
        >
          O serviço certo para seu momento.
        </Titulo>
        <p className='max-w-[680px] text-base text-(--texto-apoio)'>
          Combine categoria, região, tipo de atendimento e faixa de orçamento
          para encontrar exatamente quem você precisa.
        </p>
      </header>

      <div className='grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]'>
        <form
          onSubmit={aplicarFiltros}
          className='space-y-6 rounded-2xl border border-[#dbe5ed] bg-white p-6 sm:p-8'
        >
          <div className='space-y-2'>
            <p className='text-sm font-bold text-(--azul-titulo)'>Categoria</p>
            <div className='flex flex-wrap gap-2'>
              {['Todas', ...categoriasMercado.map(c => c.nome)].map(nome => (
                <button
                  key={nome}
                  type='button'
                  aria-pressed={categoria === nome}
                  onClick={() => setCategoria(nome)}
                  className={`min-h-10 cursor-pointer rounded-full px-4 text-sm font-bold transition-colors ${
                    categoria === nome
                      ? 'bg-(--laranja-principal) text-white'
                      : 'border border-[#dbe5ed] bg-[#f4f7fa] text-(--azul-titulo)'
                  }`}
                >
                  {nome}
                </button>
              ))}
            </div>
          </div>

          <div className='grid gap-5 sm:grid-cols-2'>
            <div className='space-y-2'>
              <label
                htmlFor='filtro-atendimento'
                className='text-sm font-bold text-(--azul-titulo)'
              >
                Tipo de atendimento
              </label>
              <select
                id='filtro-atendimento'
                value={atendimento}
                onChange={evento => setAtendimento(evento.target.value)}
                className='h-[52px] w-full rounded-lg border border-[#dbe5ed] bg-white px-4 text-base text-(--azul-titulo)'
              >
                <option value='Todos'>Todos os formatos</option>
                <option value='Residencial'>Residencial</option>
                <option value='Comercial'>Comercial</option>
                <option value='Ambos'>Residencial e comercial</option>
              </select>
            </div>

            <div className='space-y-2'>
              <label
                htmlFor='filtro-nota'
                className='text-sm font-bold text-(--azul-titulo)'
              >
                Avaliação mínima
              </label>
              <select
                id='filtro-nota'
                value={notaMinima}
                onChange={evento => setNotaMinima(evento.target.value)}
                className='h-[52px] w-full rounded-lg border border-[#dbe5ed] bg-white px-4 text-base text-(--azul-titulo)'
              >
                <option value=''>Qualquer avaliação</option>
                <option value='4.5'>Acima de 4.5 ★</option>
                <option value='4.8'>Acima de 4.8 ★</option>
                <option value='4.9'>Somente 4.9 ★</option>
              </select>
            </div>
          </div>

          <div className='grid gap-5 sm:grid-cols-2'>
            <CampoFormulario
              id='filtro-preco-max'
              rotulo='Orçamento máximo inicial (R$)'
              type='number'
              min='0'
              value={precoMaximo}
              onChange={evento => setPrecoMaximo(evento.target.value)}
              placeholder='Ex: 200'
            />
            <CampoFormulario
              id='filtro-regiao'
              rotulo='Região preferida'
              value={regiao}
              onChange={evento => setRegiao(evento.target.value)}
              placeholder='Ex: Vila Mariana, Centro'
            />
          </div>

          <div className='flex flex-wrap gap-3 pt-2'>
            <Botao type='submit' cor='laranja' classe='px-7!'>
              Aplicar filtros e buscar ↗
            </Botao>
            <Botao
              type='button'
              variante='secundario'
              onClick={() => {
                setCategoria('Todas');
                setAtendimento('Todos');
                setNotaMinima('');
                setPrecoMaximo('');
                setRegiao('');
              }}
            >
              Limpar seleção
            </Botao>
          </div>
        </form>

        <aside className='space-y-4 rounded-2xl border border-[#f8ccb4] bg-[#fce8dc] p-6 sm:p-7'>
          <p className='text-xs font-bold tracking-[0.8px] text-(--laranja-principal) uppercase'>
            O SERVIÇO QUE VOCÊ PRECISA
          </p>
          <Titulo
            como='h2'
            classe='text-2xl font-extrabold text-(--azul-titulo)'
          >
            Combine detalhes sem compromisso antes de contratar.
          </Titulo>
          <p className='text-sm leading-relaxed text-(--texto-apoio)'>
            Os valores exibidos são faixas iniciais para ajudar no seu
            planejamento financeiro. Você pode conversar com mais de uma empresa
            para comparar escopo e prazo.
          </p>
          <ul className='space-y-2 text-sm text-(--azul-titulo)'>
            <li className='rounded-xl bg-white/80 p-3 font-semibold'>
              1. Escolha a categoria e faixa de valor
            </li>
            <li className='rounded-xl bg-white/80 p-3 font-semibold'>
              2. Leia avaliações e fotos reais
            </li>
            <li className='rounded-xl bg-white/80 p-3 font-semibold'>
              3. Registre um pedido direto na plataforma
            </li>
          </ul>
        </aside>
      </div>
    </Container>
  );
}

export function VisaoMapaServicos({ pinos = [], servicos = [], empresas = [] }) {
  const [pinoAtivoId, setPinoAtivoId] = useState(
    pinos[0]?.id || 'limpeza-residencial'
  );
  const pinoSelecionado =
    pinos.find(item => item.id === pinoAtivoId) || pinos[0];
  const servicoSelecionado = servicos.find(
    item => item.id === pinoSelecionado?.id
  );
  const empresaSelecionada = empresas.find(
    item => item.id === servicoSelecionado?.empresaId
  );

  return (
    <Container como='main' classe='space-y-8 py-8 pb-16 sm:py-10'>
      <header className='flex flex-wrap items-end justify-between gap-4 border-b border-[#e6edf2] pb-6'>
        <div className='space-y-2'>
          <Link
            to='/buscar'
            className='text-sm font-bold text-(--texto-apoio) hover:text-(--laranja-principal)'
          >
            ← Voltar para a busca
          </Link>
          <SeloEditorial texto='MAPA DE ATENDIMENTO' />
          <Titulo
            como='h1'
            classe='text-[clamp(2rem,3.6vw,3rem)] leading-[1.1] font-extrabold'
          >
            Serviços na sua região.
          </Titulo>
        </div>
        <Botao como={Link} to='/buscar' variante='secundario'>
          Ver em lista ↗
        </Botao>
      </header>

      <div className='grid items-start gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]'>
        <div className='relative overflow-hidden rounded-2xl border border-[#dbe5ed] bg-[#f4f7fa]'>
          <img
            src={fotosMercado.mapaSaoPaulo}
            alt='Mapa com localização dos prestadores em São Paulo'
            className='h-[420px] w-full object-cover sm:h-[520px]'
          />
          {pinos.map(pino => {
            const ativo = pino.id === pinoSelecionado?.id;
            return (
              <button
                key={pino.id}
                type='button'
                onClick={() => setPinoAtivoId(pino.id)}
                style={{ top: pino.topo, left: pino.esquerda }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border px-3.5 py-2 text-xs font-extrabold shadow-md transition-transform ${
                  ativo
                    ? 'z-20 scale-110 border-white bg-(--laranja-principal) text-white'
                    : 'z-10 border-[#dbe5ed] bg-white text-(--azul-titulo) hover:scale-105'
                }`}
              >
                {pino.bairro} · {pino.preco}
              </button>
            );
          })}
        </div>

        <aside className='space-y-5 rounded-2xl border border-[#dbe5ed] bg-white p-6'>
          {servicoSelecionado ? (
            <>
              <img
                src={servicoSelecionado.imagem}
                alt={servicoSelecionado.titulo}
                className='aspect-[16/10] w-full rounded-xl object-cover'
              />
              <div className='space-y-2'>
                <p className='text-xs font-bold tracking-[0.7px] text-(--laranja-principal) uppercase'>
                  {servicoSelecionado.categoria} · {pinoSelecionado?.bairro}
                </p>
                <Titulo
                  como='h2'
                  classe='text-2xl font-extrabold text-(--azul-titulo)'
                >
                  {empresaSelecionada?.nome || servicoSelecionado.titulo}
                </Titulo>
                <p className='text-sm font-bold text-(--texto-apoio)'>
                  {servicoSelecionado.titulo} · ★ {servicoSelecionado.nota}
                </p>
                <p className='text-sm leading-relaxed text-(--texto-apoio)'>
                  {servicoSelecionado.descricao}
                </p>
                <p className='text-base font-extrabold text-(--azul-titulo)'>
                  {servicoSelecionado.preco}
                </p>
              </div>
              <div className='flex flex-wrap gap-3'>
                <Botao
                  como={Link}
                  to={`/servicos/${servicoSelecionado.id}`}
                  cor='laranja'
                  classe='flex-1'
                >
                  Ver serviço ↗
                </Botao>
                <Botao
                  como={Link}
                  to={`/servicos/${servicoSelecionado.id}/contato`}
                  variante='secundario'
                >
                  Contato
                </Botao>
              </div>
            </>
          ) : (
            <EstadoVazio
              titulo='Selecione um ponto no mapa'
              descricao='Clique em um dos bairros marcados para conferir detalhes e preço inicial.'
              textoAcao='Ver lista completa'
              rotaAcao='/buscar'
            />
          )}
        </aside>
      </div>
    </Container>
  );
}

export function VisaoCategoriaServicos({
  empresas = [],
  servicos = [],
  favoritos = [],
  aoAlternarFavorito,
}) {
  const { slug } = useParams();
  const [subcategoriaAtiva, setSubcategoriaAtiva] = useState('Todas');
  const categoria =
    categoriasMercado.find(item => item.slug === slug) || categoriasMercado[0];

  const servicosCategoria = servicos.filter(item => {
    const mesmoNome =
      item.categoria.toLowerCase() === categoria.nome.toLowerCase();
    if (!mesmoNome) return false;
    if (subcategoriaAtiva === 'Todas') return true;
    return (
      item.subcategoria?.toLowerCase() === subcategoriaAtiva.toLowerCase() ||
      item.atendimento?.toLowerCase() === subcategoriaAtiva.toLowerCase()
    );
  });

  return (
    <Container como='main' classe='space-y-8 py-8 pb-16 sm:py-10'>
      <header className='space-y-4 border-b border-[#e6edf2] pb-6'>
        <Link
          to='/marketplace'
          className='inline-flex items-center text-sm font-bold text-(--texto-apoio) hover:text-(--laranja-principal)'
        >
          ← Voltar ao Marketplace
        </Link>

        <div className='flex flex-wrap items-center gap-4'>
          <span className='flex size-14 items-center justify-center rounded-2xl bg-[#fce8dc]'>
            <img
              src={categoria.icone}
              alt=''
              className='size-8 object-contain'
            />
          </span>
          <div>
            <SeloEditorial texto='CATEGORIA DE SERVIÇOS' />
            <Titulo
              como='h1'
              classe='mt-1 text-[clamp(2rem,3.6vw,3rem)] leading-[1.1] font-extrabold'
            >
              {categoria.nome}
            </Titulo>
          </div>
        </div>
        <p className='max-w-[680px] text-base text-(--texto-apoio)'>
          {categoria.descricao} Compare opções disponíveis e fale direto com a
          empresa escolhida.
        </p>

        <div className='flex flex-wrap gap-2 pt-2'>
          {['Todas', ...categoria.subcategorias].map(sub => (
            <button
              key={sub}
              type='button'
              aria-pressed={subcategoriaAtiva === sub}
              onClick={() => setSubcategoriaAtiva(sub)}
              className={`min-h-10 cursor-pointer rounded-full px-4 text-sm font-bold transition-colors ${
                subcategoriaAtiva === sub
                  ? 'bg-(--azul-titulo) text-white'
                  : 'border border-[#dbe5ed] bg-[#f4f7fa] text-(--azul-titulo) hover:border-(--laranja-principal)'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </header>

      {servicosCategoria.length ? (
        <div className='space-y-5'>
          {servicosCategoria.map(servico => {
            const empresa = empresas.find(
              item => item.id === servico.empresaId
            );
            const ehFavorito = favoritos.includes(servico.id);
            return (
              <article
                key={servico.id}
                className='grid items-center gap-6 rounded-2xl border border-[#dbe5ed] bg-white p-5 md:grid-cols-[240px_minmax(0,1fr)_auto]'
              >
                <img
                  src={servico.imagem}
                  alt={servico.titulo}
                  className='aspect-[16/10] w-full rounded-xl object-cover'
                />
                <div className='min-w-0 space-y-2'>
                  <div className='flex flex-wrap items-center gap-2 text-xs font-bold'>
                    <span className='text-(--laranja-principal) uppercase'>
                      {servico.categoria} · {servico.subcategoria}
                    </span>
                    <span className='rounded-full bg-[#fce8dc] px-2.5 py-0.5 text-(--azul-titulo)'>
                      ★ {servico.nota} ({servico.totalAvaliacoes})
                    </span>
                  </div>
                  <Titulo
                    como='h2'
                    classe='text-2xl font-extrabold text-(--azul-titulo)'
                  >
                    {empresa?.nome || servico.titulo}
                  </Titulo>
                  <p className='text-sm font-bold text-(--texto-apoio)'>
                    {servico.titulo}
                  </p>
                  <p className='text-sm leading-relaxed text-(--texto-apoio)'>
                    {servico.descricao}
                  </p>
                  <p className='text-sm font-extrabold text-(--azul-titulo)'>
                    {servico.preco} ·{' '}
                    <span className='font-normal text-(--texto-apoio)'>
                      {servico.regiao}
                    </span>
                  </p>
                </div>
                <div className='flex flex-wrap gap-2 md:flex-col'>
                  <Botao
                    como={Link}
                    to={`/servicos/${servico.id}`}
                    cor='laranja'
                  >
                    Ver detalhes ↗
                  </Botao>
                  <button
                    type='button'
                    onClick={() => aoAlternarFavorito(servico.id)}
                    className={`min-h-11 cursor-pointer rounded-xl border px-4 text-sm font-bold transition-colors ${
                      ehFavorito
                        ? 'border-(--laranja-principal) bg-[#fce8dc] text-(--laranja-principal)'
                        : 'border-[#dbe5ed] bg-white text-(--azul-titulo)'
                    }`}
                  >
                    {ehFavorito ? '♥ Salvo' : '♡ Favoritar'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EstadoVazio
          titulo='Nenhum serviço encontrado nesta subcategoria.'
          descricao='Você pode visualizar todas as subcategorias disponíveis ou ampliar a busca no catálogo completo.'
          textoAcao='Ver todos desta categoria'
          aoClicar={() => setSubcategoriaAtiva('Todas')}
        />
      )}
    </Container>
  );
}
