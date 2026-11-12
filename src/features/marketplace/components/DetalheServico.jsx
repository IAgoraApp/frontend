import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Botao,
  Container,
  EstadoVazio,
  SeloEditorial,
  Titulo,
} from '../../../shared/ui/index';
import { fotosMercado } from '../content';

const abasDetalhe = [
  { id: 'sobre', rotulo: 'Sobre' },
  { id: 'servicos', rotulo: 'Serviços' },
  { id: 'avaliacoes', rotulo: 'Avaliações' },
  { id: 'fotos', rotulo: 'Fotos' },
  { id: 'localizacao', rotulo: 'Localização' },
];

export default function DetalheServico({
  empresas = [],
  servicos = [],
  avaliacoes = [],
  favoritos = [],
  aoAlternarFavorito,
  indisponivel = false,
}) {
  const { id } = useParams();
  const [abaAtiva, setAbaAtiva] = useState('sobre');
  const [avisoCompartilhar, setAvisoCompartilhar] = useState('');

  const servico = indisponivel ? null : servicos.find(item => item.id === id);
  const empresa = empresas.find(item => item.id === servico?.empresaId);

  if (indisponivel || !servico || !empresa) {
    return (
      <Container como='main' classe='space-y-8 py-10 pb-16'>
        <Link
          to='/buscar'
          className='inline-flex items-center text-sm font-bold text-(--texto-apoio) hover:text-(--laranja-principal)'
        >
          ← Voltar para a busca
        </Link>
        <EstadoVazio
          varianteAlerta='erro'
          titulo='Este serviço não está disponível.'
          descricao='Esse anúncio foi pausado, está em revisão ou não faz mais parte do catálogo ativo.'
          textoAcao='Explorar serviços disponíveis'
          rotaAcao='/buscar'
        />
      </Container>
    );
  }

  const ehFavorito = favoritos.includes(servico.id);
  const servicosEmpresa = servicos.filter(item => item.empresaId === empresa.id);
  const avaliacoesServico = avaliacoes.filter(
    item => item.servicoId === servico.id
  );
  const galeria = servico.fotos?.length
    ? servico.fotos
    : [servico.imagem, fotosMercado.empresaFotoUm];

  async function compartilharServico() {
    const urlAtual = window.location.href;
    try {
      await navigator.clipboard?.writeText(urlAtual);
      setAvisoCompartilhar('Link do serviço copiado para a área de transferência.');
    } catch {
      setAvisoCompartilhar(`Link pronto para compartilhar: ${urlAtual}`);
    }
  }

  return (
    <Container como='main' classe='space-y-8 py-8 pb-16 sm:py-10'>
      <header className='space-y-4'>
        <Link
          to='/buscar'
          className='inline-flex items-center text-sm font-bold text-(--texto-apoio) hover:text-(--laranja-principal)'
        >
          ← Voltar para serviços
        </Link>

        <div className='grid items-start gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]'>
          <div className='space-y-4'>
            <SeloEditorial
              texto={`${servico.categoria.toUpperCase()} · ${empresa.nome.toUpperCase()}`}
            />
            <Titulo
              como='h1'
              classe='text-[clamp(2rem,3.6vw,3rem)] leading-[1.1] font-extrabold'
            >
              {servico.titulo}
            </Titulo>
            <p className='text-base leading-relaxed text-(--texto-apoio)'>
              Oferecido por{' '}
              <Link
                to={`/empresas/${empresa.id}`}
                className='font-bold text-(--azul-titulo) underline-offset-4 hover:text-(--laranja-principal) hover:underline'
              >
                {empresa.nome}
              </Link>{' '}
              · {servico.regiao}
            </p>

            <div className='flex flex-wrap gap-3 pt-1'>
              <Botao
                como={Link}
                to={`/servicos/${servico.id}/contato`}
                cor='laranja'
                classe='px-7!'
              >
                Entrar em contato ↗
              </Botao>
              <Botao
                type='button'
                variante='secundario'
                aria-pressed={ehFavorito}
                onClick={() => aoAlternarFavorito(servico.id)}
              >
                {ehFavorito ? '♥ Salvo nos favoritos' : '♡ Salvar nos favoritos'}
              </Botao>
              <Botao
                type='button'
                variante='fantasma'
                classe='border border-[#dbe5ed]'
                onClick={compartilharServico}
              >
                Compartilhar
              </Botao>
            </div>

            {avisoCompartilhar && (
              <p
                role='status'
                className='rounded-xl border border-[#abefc6] bg-[#ecfdf3] px-4 py-3 text-sm font-semibold text-[#18794e]'
              >
                {avisoCompartilhar}
              </p>
            )}
          </div>

          <aside className='space-y-4 rounded-2xl border border-[#f8ccb4] bg-[#fce8dc] p-6'>
            <div className='flex items-baseline justify-between gap-3'>
              <p className='font-titulo text-3xl font-extrabold text-(--azul-titulo)'>
                {servico.preco}
              </p>
              <span className='rounded-full bg-white px-3 py-1 text-xs font-extrabold text-(--azul-titulo)'>
                ★ {servico.nota} ({servico.totalAvaliacoes})
              </span>
            </div>
            <dl className='space-y-2 text-sm text-(--azul-titulo)'>
              <div className='flex justify-between gap-2'>
                <dt className='text-(--texto-apoio)'>Atendimento</dt>
                <dd className='font-bold'>{servico.atendimento}</dd>
              </div>
              <div className='flex justify-between gap-2'>
                <dt className='text-(--texto-apoio)'>Horários</dt>
                <dd className='text-right font-bold'>
                  {servico.disponibilidade}
                </dd>
              </div>
              <div className='flex justify-between gap-2'>
                <dt className='text-(--texto-apoio)'>Tempo médio</dt>
                <dd className='font-bold'>
                  {empresa.tempoResposta || 'Responde no mesmo dia'}
                </dd>
              </div>
            </dl>
            <div className='border-t border-[#f3bfa1] pt-3'>
              <Link
                to={`/servicos/${servico.id}/avaliacoes`}
                className='text-sm font-bold text-(--laranja-principal) hover:underline'
              >
                Ver todas as avaliações ↗
              </Link>
            </div>
          </aside>
        </div>
      </header>

      <nav
        aria-label='Seções do serviço'
        className='flex flex-wrap gap-2 border-b border-[#e6edf2] pb-4'
      >
        {abasDetalhe.map(aba => (
          <button
            key={aba.id}
            type='button'
            aria-pressed={abaAtiva === aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            className={`min-h-11 cursor-pointer rounded-full px-5 text-sm font-bold transition-colors ${
              abaAtiva === aba.id
                ? 'bg-(--azul-titulo) text-white'
                : 'border border-[#dbe5ed] bg-[#f4f7fa] text-(--azul-titulo) hover:border-(--laranja-principal)'
            }`}
          >
            {aba.rotulo}
          </button>
        ))}
      </nav>

      {abaAtiva === 'sobre' && (
        <section className='grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]'>
          <div className='space-y-6'>
            <img
              src={servico.imagem}
              alt={servico.titulo}
              className='aspect-[16/10] w-full rounded-2xl object-cover'
            />
            <div className='space-y-3 rounded-2xl border border-[#dbe5ed] bg-white p-6'>
              <Titulo
                como='h2'
                classe='text-2xl font-extrabold text-(--azul-titulo)'
              >
                Como funciona este serviço
              </Titulo>
              <p className='leading-relaxed whitespace-pre-wrap text-(--texto-apoio)'>
                {servico.descricao}
              </p>
              <h3 className='pt-2 text-sm font-bold text-(--azul-titulo) uppercase'>
                O que costuma estar incluído
              </h3>
              <ul className='space-y-2'>
                {(servico.itensIncluidos || []).map(item => (
                  <li
                    key={item}
                    className='flex items-start gap-2.5 text-sm text-(--azul-titulo)'
                  >
                    <span className='font-bold text-(--laranja-principal)'>
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className='space-y-5 rounded-2xl border border-[#dbe5ed] bg-[#f4f7fa] p-6'>
            <p className='text-xs font-bold tracking-[0.7px] text-(--laranja-principal) uppercase'>
              SOBRE A EMPRESA
            </p>
            <Titulo
              como='h2'
              classe='text-2xl font-extrabold text-(--azul-titulo)'
            >
              {empresa.nome}
            </Titulo>
            <p className='text-sm leading-relaxed text-(--texto-apoio)'>
              {empresa.sobre}
            </p>
            <Botao
              como={Link}
              to={`/empresas/${empresa.id}`}
              variante='secundario'
              classe='w-full'
            >
              Ver perfil completo da empresa ↗
            </Botao>
          </aside>
        </section>
      )}

      {abaAtiva === 'servicos' && (
        <section className='space-y-4'>
          <Titulo como='h2' classe='text-2xl font-extrabold text-(--azul-titulo)'>
            Outros anúncios de {empresa.nome}
          </Titulo>
          <div className='grid gap-5 md:grid-cols-2'>
            {servicosEmpresa.map(item => (
              <article
                key={item.id}
                className='flex flex-col justify-between rounded-2xl border border-[#dbe5ed] bg-white p-5'
              >
                <div>
                  <p className='text-xs font-bold text-(--laranja-principal) uppercase'>
                    {item.categoria}
                  </p>
                  <Titulo
                    como='h3'
                    classe='mt-1 text-xl font-extrabold text-(--azul-titulo)'
                  >
                    {item.titulo}
                  </Titulo>
                  <p className='mt-2 text-sm text-(--texto-apoio)'>
                    {item.descricao}
                  </p>
                </div>
                <div className='mt-4 flex items-center justify-between gap-3 border-t border-[#eef2f5] pt-4'>
                  <span className='text-sm font-bold text-(--azul-titulo)'>
                    {item.preco}
                  </span>
                  <Botao
                    como={Link}
                    to={`/servicos/${item.id}`}
                    cor='laranja'
                    classe='min-h-[40px]! px-4! text-sm!'
                  >
                    Abrir serviço
                  </Botao>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {abaAtiva === 'avaliacoes' && (
        <section className='space-y-5'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <Titulo
              como='h2'
              classe='text-2xl font-extrabold text-(--azul-titulo)'
            >
              Experiências recentes ({avaliacoesServico.length})
            </Titulo>
            <Botao
              como={Link}
              to={`/servicos/${servico.id}/avaliacoes`}
              cor='laranja'
            >
              Avaliar ou ver todas ↗
            </Botao>
          </div>
          {avaliacoesServico.length ? (
            <div className='grid gap-4 md:grid-cols-2'>
              {avaliacoesServico.map(item => (
                <article
                  key={item.id}
                  className='rounded-2xl border border-[#dbe5ed] bg-white p-5'
                >
                  <div className='flex items-center justify-between text-xs font-bold'>
                    <span className='text-(--azul-titulo)'>{item.autor}</span>
                    <span className='text-(--laranja-principal)'>
                      {'★'.repeat(item.nota)}
                    </span>
                  </div>
                  <p className='mt-2 text-sm leading-relaxed text-(--texto-apoio)'>
                    {item.comentario}
                  </p>
                  <p className='mt-3 text-xs text-(--texto-apoio)'>{item.data}</p>
                </article>
              ))}
            </div>
          ) : (
            <EstadoVazio
              titulo='Ainda sem avaliações por aqui.'
              descricao='Seja a primeira pessoa a contar como foi o atendimento desta empresa.'
              textoAcao='Escrever avaliação'
              rotaAcao={`/servicos/${servico.id}/avaliacoes`}
            />
          )}
        </section>
      )}

      {abaAtiva === 'fotos' && (
        <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {galeria.map((foto, indice) => (
            <img
              key={`${foto}-${indice}`}
              src={foto}
              alt={`${servico.titulo} imagem ${indice + 1}`}
              className='aspect-[4/3] w-full rounded-2xl border border-[#dbe5ed] object-cover'
            />
          ))}
        </section>
      )}

      {abaAtiva === 'localizacao' && (
        <section className='grid items-center gap-6 rounded-2xl border border-[#dbe5ed] bg-[#f4f7fa] p-6 md:grid-cols-2'>
          <div className='space-y-3'>
            <Titulo
              como='h2'
              classe='text-2xl font-extrabold text-(--azul-titulo)'
            >
              Região de atendimento
            </Titulo>
            <p className='text-base text-(--texto-apoio)'>{servico.regiao}</p>
            <p className='text-sm text-(--texto-apoio)'>
              Consulte bairros vizinhos ao enviar sua solicitação de orçamento.
            </p>
            <Botao
              como={Link}
              to='/buscar/mapa'
              variante='secundario'
            >
              Ver bairros no mapa ↗
            </Botao>
          </div>
          <img
            src={fotosMercado.mapaSaoPaulo}
            alt='Mapa de cobertura em São Paulo'
            className='aspect-[16/10] w-full rounded-xl border border-[#dbe5ed] object-cover'
          />
        </section>
      )}
    </Container>
  );
}
