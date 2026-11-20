import { usePerfilPreparacao } from '../../app/dados/perfilNavegacao';
import { useState } from 'react';
import {
  ArrowUpRight,
  Building2,
  Heart,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
} from 'lucide-react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  nomeCategoria,
  normalizarBusca,
  precoServico,
} from './marketplaceDados';
import { PaginaMvp, VazioMvp } from '../../shared/ui/mvp';
import fotoLimpeza from '../casa/assets/servicos-joao-limpeza.jpg';
import { fotosMercado } from './content';
import { PerfilEmpresaMarketplace } from './empresaMarketplace';
import NavegacaoMarketplace from './navegacaoMarketplace';
import VoltarMarketplace from './voltarMarketplace';

const chaveFavoritos = 'iagora:marketplace-a:favoritos:v1';

export function FotoServico({ servico, destaque = false }) {
  const primeiro = Array.isArray(servico.fotos) ? servico.fotos[0] : undefined;
  const [falhou, setFalhou] = useState(false);
  const fotoReal =
    !falhou &&
    typeof primeiro === 'string' &&
    primeiro &&
    !primeiro.startsWith('/mock/');
  const fonte = fotoReal
    ? primeiro
    : servico.categoria === 'limpeza'
      ? fotoLimpeza
      : fotosMercado.equipeServicos;
  return (
    <>
      <img
        className='mercado-a-foto'
        src={fonte}
        alt=''
        loading={destaque ? 'eager' : 'lazy'}
        onError={() => setFalhou(true)}
      />
      {!fotoReal && (
        <span className='mercado-a-foto-legenda'>Imagem ilustrativa</span>
      )}
    </>
  );
}

function lerFavoritos(usuario) {
  try {
    const dados = JSON.parse(
      localStorage.getItem(`${chaveFavoritos}:${usuario}`)
    );
    return new Set(Array.isArray(dados) ? dados.filter(Number.isInteger) : []);
  } catch {
    return new Set();
  }
}

export function NotaServico({ nota }) {
  if (nota == null)
    return <span className='mercado-a-nota'>Sem avaliações</span>;
  return (
    <span className='mercado-a-nota'>
      <Star size={15} aria-hidden='true' />{' '}
      {Number(nota).toLocaleString('pt-BR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      })}
    </span>
  );
}

export default function CatalogoMarketplaceA({
  servicos,
  empresas,
  empresa,
  usuario,
  slug,
  pathname,
  dentroDaEmpresa,
  erroChat,
}) {
  const localizacao = useLocation();
  const preparacao = usePerfilPreparacao();
  const [params, setParams] = useSearchParams();
  const [favoritos, setFavoritos] = useState(() => lerFavoritos(usuario));
  const [erro, setErro] = useState('');
  const ehEmpresa = pathname.startsWith('/empresas/');
  const ehFavoritos = pathname === '/favoritos';
  const rotaCatalogo = dentroDaEmpresa
    ? '/empresa/marketplace'
    : ehFavoritos
      ? '/favoritos'
      : '/marketplace';
  const categoria = params.get('categoria') ?? slug ?? '';
  const busca = params.get('busca') || '';
  const regiao = params.get('regiao') || '';
  const porEmpresa = new Map(empresas.map(e => [e.id, e]));
  const base = servicos.filter(
    s =>
      (!ehEmpresa || s.empresa_id === empresa?.id) &&
      (!ehFavoritos || favoritos.has(s.id))
  );
  const locais = [
    ...new Set(
      base.flatMap(s => porEmpresa.get(s.empresa_id)?.local_atendimento || [])
    ),
  ].sort();
  const categorias = [
    ...new Set(base.map(s => s.categoria).filter(Boolean)),
  ].sort();
  const resultados = base.filter(s => {
    const perfil = porEmpresa.get(s.empresa_id);
    return (
      (!categoria || s.categoria === categoria) &&
      (!regiao ||
        perfil?.local_atendimento?.some(local =>
          normalizarBusca(local).includes(normalizarBusca(regiao))
        )) &&
      normalizarBusca(
        [s.titulo, s.descricao, perfil?.nome, nomeCategoria(s.categoria)].join(
          ' '
        )
      ).includes(normalizarBusca(busca))
    );
  });

  function alternarFavorito(id) {
    const proximos = lerFavoritos(usuario);
    if (proximos.has(id)) proximos.delete(id);
    else proximos.add(id);
    try {
      localStorage.setItem(
        `${chaveFavoritos}:${usuario}`,
        JSON.stringify([...proximos])
      );
      setFavoritos(proximos);
      setErro('');
    } catch {
      setErro('Não foi possível atualizar seus favoritos no navegador.');
    }
  }

  if (ehEmpresa && !empresa)
    return (
      <PaginaMvp titulo='Empresa indisponível'>
        <Link className='mvp-link' to='/marketplace'>
          Voltar ao catálogo
        </Link>
      </PaginaMvp>
    );

  return (
    <PaginaMvp cabecalho={false}>
      <div className='mercado-a'>
        {empresa ? (
          <>
            <VoltarMarketplace />
            <PerfilEmpresaMarketplace key={empresa.id} empresa={empresa} />
          </>
        ) : (
          <header className='mercado-a-cabecalho'>
            <h1>
              {ehFavoritos ? 'Serviços favoritos' : 'Empresas e serviços'}
            </h1>
            {dentroDaEmpresa ? (
              <Link to='/empresa/anunciar' className='mvp-primario'>
                Anunciar serviço
              </Link>
            ) : (
              <NavegacaoMarketplace
                ativa={ehFavoritos ? 'favoritos' : 'catalogo'}
              />
            )}
          </header>
        )}
        <div
          className={
            ehEmpresa ? 'mercado-a-ofertas-empresa' : 'mercado-a-diretorio'
          }
        >
          {!ehEmpresa && (
            <aside
              className='mercado-a-filtros'
              aria-label='Filtros do catálogo'
            >
              <h2>
                <SlidersHorizontal size={18} aria-hidden='true' /> Encontrar
                serviços
              </h2>
              <form
                key={pathname + params.toString()}
                className='mercado-a-busca'
                onSubmit={evento => {
                  evento.preventDefault();
                  const consulta = new URLSearchParams();
                  for (const [chave, valor] of new FormData(
                    evento.currentTarget
                  )) {
                    if (valor.trim() || (chave === 'categoria' && slug))
                      consulta.set(chave, valor.trim());
                  }
                  setParams(consulta);
                }}
              >
                <label>
                  <span>Serviço ou empresa</span>
                  <span className='mercado-a-campo-busca'>
                    <Search size={16} aria-hidden='true' />
                    <input
                      name='busca'
                      type='search'
                      placeholder='Ex.: faxina residencial'
                      defaultValue={busca}
                    />
                  </span>
                </label>
                <label>
                  <span>Região de atendimento</span>
                  <select name='regiao' defaultValue={regiao}>
                    <option value=''>Todas as regiões</option>
                    {regiao && !locais.includes(regiao) && (
                      <option value={regiao}>{regiao}</option>
                    )}
                    {locais.map(local => (
                      <option key={local} value={local}>
                        {local}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Categoria</span>
                  <select name='categoria' defaultValue={categoria}>
                    <option value=''>Todas</option>
                    {categoria && !categorias.includes(categoria) && (
                      <option value={categoria}>
                        {nomeCategoria(categoria)}
                      </option>
                    )}
                    {categorias.map(item => (
                      <option key={item} value={item}>
                        {nomeCategoria(item)}
                      </option>
                    ))}
                  </select>
                </label>
                <button type='submit' className='mvp-primario'>
                  Buscar
                </button>
              </form>
              {(busca || regiao || categoria) && (
                <Link className='mvp-link mercado-a-limpar' to={rotaCatalogo}>
                  Limpar filtros
                </Link>
              )}
            </aside>
          )}
          <section
            className='mercado-a-resultados'
            aria-labelledby='servicos-disponiveis'
          >
            <div className='mercado-a-resultados-topo'>
              <h2 id='servicos-disponiveis'>
                {ehEmpresa ? 'Serviços da empresa' : 'Serviços disponíveis'}
              </h2>
              <span role='status'>
                {resultados.length}{' '}
                {resultados.length === 1 ? 'serviço' : 'serviços'}
              </span>
            </div>
            {(erro || erroChat) && (
              <p className='mvp-confirmacao' role='alert'>
                {erro || erroChat}
              </p>
            )}
            {resultados.length ? (
              <ul className='mercado-a-grade'>
                {resultados.map(s => {
                  const perfil = porEmpresa.get(s.empresa_id);
                  const salvo = favoritos.has(s.id);
                  return (
                    <li key={s.id} className='mercado-a-cartao'>
                      <div className='mercado-a-cartao-foto'>
                        <FotoServico servico={s} />
                        {!dentroDaEmpresa && !preparacao && (
                          <button
                            type='button'
                            aria-label={`Favoritar ${s.titulo}`}
                            aria-pressed={salvo}
                            onClick={() => alternarFavorito(s.id)}
                          >
                            <Heart
                              size={20}
                              fill={salvo ? 'currentColor' : 'none'}
                              aria-hidden='true'
                            />
                          </button>
                        )}
                      </div>
                      <div className='mercado-a-cartao-corpo'>
                        <div className='mercado-a-cartao-meta'>
                          <span>{nomeCategoria(s.categoria)}</span>
                          <NotaServico nota={s.nota} />
                        </div>
                        <h3>
                          {dentroDaEmpresa ? (
                            s.titulo
                          ) : (
                            <Link
                              className='mercado-a-cartao-link'
                              to={`/servicos/${s.id}`}
                              state={{
                                retorno: {
                                  url: pathname + localizacao.search,
                                  rotulo: ehEmpresa
                                    ? 'Voltar ao perfil da empresa'
                                    : ehFavoritos
                                      ? 'Voltar aos favoritos'
                                      : 'Voltar ao catálogo',
                                  estado: ehEmpresa
                                    ? localizacao.state
                                    : undefined,
                                },
                              }}
                            >
                              {s.titulo}
                            </Link>
                          )}
                        </h3>
                        {dentroDaEmpresa ? (
                          <span className='mercado-a-empresa'>
                            <Building2 size={15} aria-hidden='true' />{' '}
                            {perfil.nome}
                          </span>
                        ) : (
                          <Link
                            className='mercado-a-empresa'
                            to={`/empresas/${perfil.id}`}
                            state={{
                              retorno: {
                                url: pathname + localizacao.search,
                                rotulo: ehFavoritos
                                  ? 'Voltar aos favoritos'
                                  : 'Voltar ao catálogo',
                              },
                            }}
                          >
                            <Building2 size={15} aria-hidden='true' />{' '}
                            {perfil.nome}
                          </Link>
                        )}
                        <p>{s.descricao}</p>
                        {perfil.local_atendimento?.length > 0 && (
                          <span className='mercado-a-local'>
                            <MapPin size={15} aria-hidden='true' />{' '}
                            {perfil.local_atendimento.join(', ')}
                          </span>
                        )}
                        <div className='mercado-a-cartao-rodape'>
                          <strong>{precoServico(s)}</strong>
                          {!dentroDaEmpresa && (
                            <span
                              className='mercado-a-cartao-acao'
                              aria-hidden='true'
                            >
                              Ver serviço <ArrowUpRight size={15} />
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className='mercado-a-vazio'>
                <VazioMvp>
                  {ehFavoritos && !favoritos.size
                    ? 'Use o coração de um serviço para salvá-lo aqui.'
                    : 'Nenhum serviço disponível para esta seleção.'}
                </VazioMvp>
              </div>
            )}
          </section>
        </div>
      </div>
    </PaginaMvp>
  );
}
