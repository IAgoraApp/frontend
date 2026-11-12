import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Botao,
  Container,
  EstadoVazio,
  SeloEditorial,
  Titulo,
} from '../../../compartilhado/interface/indice';
import {
  atualizarEmpresa,
  formatarData,
} from '../../../aplicacao/estado/estadoEmpresa';
import {
  lerEstadoPlataforma,
  salvarEstadoPlataforma,
} from '../../../aplicacao/estado/estadoPlataforma';

export function VisaoFavoritosMercado({
  servicos = [],
  empresas = [],
  favoritos = [],
  aoAlternarFavorito,
}) {
  const servicosFavoritos = servicos.filter(item =>
    favoritos.includes(item.id)
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
          <SeloEditorial texto='SERVIÇOS SALVOS' />
          <Titulo
            como='h1'
            classe='text-[clamp(2rem,3.6vw,3rem)] leading-[1.1] font-extrabold'
          >
            Meus favoritos.
          </Titulo>
        </div>
        <Botao como={Link} to='/meus-contatos' variante='secundario'>
          Ver meus contatos ↗
        </Botao>
      </header>

      {servicosFavoritos.length ? (
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {servicosFavoritos.map(servico => {
            const empresa = empresas.find(
              item => item.id === servico.empresaId
            );
            return (
              <article
                key={servico.id}
                className='flex flex-col justify-between overflow-hidden rounded-2xl border border-[#dbe5ed] bg-white'
              >
                <div>
                  <img
                    src={servico.imagem}
                    alt={servico.titulo}
                    className='aspect-[16/10] w-full object-cover'
                  />
                  <div className='space-y-2 p-5'>
                    <p className='text-xs font-bold text-(--laranja-principal) uppercase'>
                      {servico.categoria} · ★ {servico.nota}
                    </p>
                    <Titulo
                      como='h2'
                      classe='text-xl font-extrabold text-(--azul-titulo)'
                    >
                      {empresa?.nome || servico.titulo}
                    </Titulo>
                    <p className='text-sm font-bold text-(--texto-apoio)'>
                      {servico.titulo}
                    </p>
                    <p className='text-sm font-extrabold text-(--azul-titulo)'>
                      {servico.preco}
                    </p>
                  </div>
                </div>
                <div className='flex flex-wrap gap-2 border-t border-[#eef2f5] p-5'>
                  <Botao
                    como={Link}
                    to={`/servicos/${servico.id}`}
                    cor='laranja'
                    classe='min-h-[42px]! flex-1 px-4! text-sm!'
                  >
                    Ver serviço ↗
                  </Botao>
                  <button
                    type='button'
                    onClick={() => aoAlternarFavorito(servico.id)}
                    className='min-h-[42px] cursor-pointer rounded-xl border border-[#dbe5ed] px-4 text-sm font-bold text-(--azul-titulo) hover:border-[#b42318] hover:text-[#b42318]'
                  >
                    Remover
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EstadoVazio
          titulo='Seus próximos favoritos começam na busca.'
          descricao='Salve serviços e empresas que chamarem sua atenção para comparar preços, avaliações e chamar quando precisar.'
          textoAcao='Explorar serviços'
          rotaAcao='/buscar'
        />
      )}
    </Container>
  );
}

const abasContatos = ['Todos', 'Em andamento', 'Respondido', 'Concluído'];

export function VisaoMeusContatosMercado({ contatos = [] }) {
  const { id } = useParams();
  const [filtro, setFiltro] = useState('Todos');
  const [novaMensagem, setNovaMensagem] = useState('');
  const [avisoEnvio, setAvisoEnvio] = useState('');
  const [forcarRecarga, setForcarRecarga] = useState(0);

  const conversaAtiva = id ? contatos.find(item => item.id === id) : null;

  function enviarMensagemCliente(evento) {
    evento.preventDefault();
    if (!novaMensagem.trim() || !conversaAtiva) return;

    const agora = new Date().toISOString();
    const idMensagem = crypto.randomUUID();
    const textoLimpo = novaMensagem.trim();

    const atual = lerEstadoPlataforma();
    const listaAtual = atual.contatosCliente || [];
    const existeSalvo = listaAtual.some(c => c.id === conversaAtiva.id);

    const proximoContatosCliente = existeSalvo
      ? listaAtual.map(c =>
          c.id === conversaAtiva.id
            ? {
                ...c,
                atualizadoEm: 'Agora mesmo',
                mensagens: [
                  ...(c.mensagens || []),
                  { id: idMensagem, autor: 'cliente', texto: textoLimpo, data: agora },
                ],
              }
            : c
        )
      : [
          {
            ...conversaAtiva,
            atualizadoEm: 'Agora mesmo',
            mensagens: [
              ...(conversaAtiva.mensagens || []),
              { id: idMensagem, autor: 'cliente', texto: textoLimpo, data: agora },
            ],
          },
          ...listaAtual,
        ];

    salvarEstadoPlataforma({
      ...atual,
      contatosCliente: proximoContatosCliente,
    });

    try {
      atualizarEmpresa(anterior => {
        const possuiContato = anterior.contatos.some(
          c => c.id === conversaAtiva.id
        );
        if (!possuiContato) return anterior;
        return {
          ...anterior,
          contatos: anterior.contatos.map(c =>
            c.id === conversaAtiva.id
              ? {
                  ...c,
                  mensagens: [
                    ...c.mensagens,
                    {
                      id: idMensagem,
                      autor: 'cliente',
                      texto: textoLimpo,
                      data: agora,
                    },
                  ],
                }
              : c
          ),
        };
      });
    } catch {
      setAvisoEnvio('Mensagem salva no seu histórico local.');
    }

    setNovaMensagem('');
    setAvisoEnvio('Mensagem registrada na conversa.');
    setForcarRecarga(valor => valor + 1);
  }

  if (id && !conversaAtiva) {
    return (
      <Container como='main' classe='py-10 pb-16'>
        <EstadoVazio
          varianteAlerta='erro'
          titulo='Conversa não encontrada.'
          descricao='Este histórico de atendimento não foi localizado neste navegador.'
          textoAcao='Voltar para meus contatos'
          rotaAcao='/meus-contatos'
        />
      </Container>
    );
  }

  if (conversaAtiva) {
    return (
      <Container
        key={forcarRecarga}
        como='main'
        classe='space-y-8 py-8 pb-16 sm:py-10'
      >
        <header className='space-y-3 border-b border-[#e6edf2] pb-6'>
          <Link
            to='/meus-contatos'
            className='inline-flex items-center text-sm font-bold text-(--texto-apoio) hover:text-(--laranja-principal)'
          >
            ← Voltar para Meus contatos
          </Link>
          <SeloEditorial texto='HISTÓRICO DA CONVERSA' />
          <div className='flex flex-wrap items-center gap-3'>
            <Titulo
              como='h1'
              classe='text-[clamp(1.85rem,3.4vw,2.75rem)] leading-[1.1] font-extrabold'
            >
              {conversaAtiva.empresaNome}
            </Titulo>
            <span className='rounded-full bg-[#fce8dc] px-3 py-1 text-xs font-bold text-(--laranja-principal)'>
              {conversaAtiva.situacao}
            </span>
          </div>
          <p className='text-sm font-semibold text-(--texto-apoio)'>
            {conversaAtiva.servico} · {conversaAtiva.regiao}
          </p>
        </header>

        <div className='grid items-start gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]'>
          <section className='space-y-5 rounded-2xl border border-[#dbe5ed] bg-white p-6'>
            <div className='space-y-4'>
              {(conversaAtiva.mensagens || []).map(mensagem => {
                const daEmpresa = mensagem.autor === 'empresa';
                return (
                  <div
                    key={mensagem.id}
                    className={`rounded-2xl p-4 sm:p-5 ${
                      daEmpresa
                        ? 'mr-4 border border-[#dbe5ed] bg-[#f4f7fa] sm:mr-10'
                        : 'ml-4 border border-[#f8ccb4] bg-[#fce8dc] sm:ml-10'
                    }`}
                  >
                    <p className='mb-1.5 text-xs font-bold text-(--texto-apoio)'>
                      {daEmpresa ? conversaAtiva.empresaNome : 'Você'} ·{' '}
                      {formatarData(mensagem.data)}
                    </p>
                    <p className='text-sm leading-relaxed whitespace-pre-wrap text-(--azul-titulo)'>
                      {mensagem.texto}
                    </p>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={enviarMensagemCliente}
              className='space-y-3 border-t border-[#eef2f5] pt-5'
            >
              <label
                htmlFor='cliente-nova-mensagem'
                className='flex flex-col gap-2 text-sm font-bold text-(--azul-titulo)'
              >
                Enviar nova mensagem
                <textarea
                  id='cliente-nova-mensagem'
                  rows={3}
                  value={novaMensagem}
                  onChange={evento => setNovaMensagem(evento.target.value)}
                  placeholder='Escreva uma atualização de horário, endereço ou dúvida...'
                  className='rounded-xl border border-[#dbe5ed] bg-white p-4 font-normal text-(--azul-titulo)'
                />
              </label>
              {avisoEnvio && (
                <p
                  role='status'
                  className='text-xs font-bold text-[#18794e]'
                >
                  {avisoEnvio}
                </p>
              )}
              <Botao type='submit' cor='laranja'>
                Enviar mensagem ↗
              </Botao>
            </form>
          </section>

          <aside className='space-y-4 rounded-2xl border border-[#dbe5ed] bg-[#f4f7fa] p-6'>
            <p className='text-xs font-bold tracking-[0.8px] text-(--laranja-principal) uppercase'>
              DETALHES DO PEDIDO
            </p>
            <dl className='space-y-3 text-sm'>
              <div>
                <dt className='font-bold text-(--azul-titulo)'>Empresa</dt>
                <dd className='text-(--texto-apoio)'>
                  {conversaAtiva.empresaNome}
                </dd>
              </div>
              <div>
                <dt className='font-bold text-(--azul-titulo)'>Serviço</dt>
                <dd className='text-(--texto-apoio)'>{conversaAtiva.servico}</dd>
              </div>
              <div>
                <dt className='font-bold text-(--azul-titulo)'>
                  Última atualização
                </dt>
                <dd className='text-(--texto-apoio)'>
                  {conversaAtiva.atualizadoEm}
                </dd>
              </div>
            </dl>
            <div className='flex flex-col gap-2 pt-2'>
              <Botao
                como={Link}
                to={`/servicos/${conversaAtiva.anuncioId}`}
                variante='secundario'
              >
                Ver anúncio do serviço ↗
              </Botao>
              <Botao
                como={Link}
                to={`/empresas/${conversaAtiva.empresaId}`}
                variante='fantasma'
                classe='border border-[#dbe5ed]'
              >
                Perfil da empresa
              </Botao>
            </div>
          </aside>
        </div>
      </Container>
    );
  }

  const listaVisivel = contatos.filter(
    item => filtro === 'Todos' || item.situacao === filtro
  );

  return (
    <Container como='main' classe='space-y-8 py-8 pb-16 sm:py-10'>
      <header className='flex flex-wrap items-end justify-between gap-4 border-b border-[#e6edf2] pb-6'>
        <div className='space-y-2'>
          <Link
            to='/marketplace'
            className='text-sm font-bold text-(--texto-apoio) hover:text-(--laranja-principal)'
          >
            ← Voltar para empresas e serviços
          </Link>
          <SeloEditorial texto='ACOMPANHAMENTO DE PEDIDOS' />
          <Titulo
            como='h1'
            classe='text-[clamp(2rem,3.6vw,3rem)] leading-[1.1] font-extrabold'
          >
            Meus contatos.
          </Titulo>
        </div>
        <Botao como={Link} to='/buscar' cor='laranja'>
          Buscar novos serviços ↗
        </Botao>
      </header>

      <div className='flex flex-wrap gap-2'>
        {abasContatos.map(aba => {
          const total = contatos.filter(
            item => aba === 'Todos' || item.situacao === aba
          ).length;
          return (
            <button
              key={aba}
              type='button'
              aria-pressed={filtro === aba}
              onClick={() => setFiltro(aba)}
              className={`min-h-10 cursor-pointer rounded-full px-4 text-sm font-bold transition-colors ${
                filtro === aba
                  ? 'bg-(--azul-titulo) text-white'
                  : 'border border-[#dbe5ed] bg-[#f4f7fa] text-(--azul-titulo) hover:border-(--laranja-principal)'
              }`}
            >
              {aba} ({total})
            </button>
          );
        })}
      </div>

      {listaVisivel.length ? (
        <div className='space-y-4'>
          {listaVisivel.map(item => (
            <article
              key={item.id}
              className='flex flex-col justify-between gap-4 rounded-2xl border border-[#dbe5ed] bg-white p-5 sm:flex-row sm:items-center sm:p-6'
            >
              <div className='min-w-0 space-y-1.5'>
                <div className='flex flex-wrap items-center gap-2.5'>
                  <h2 className='font-titulo text-xl font-extrabold text-(--azul-titulo)'>
                    {item.empresaNome}
                  </h2>
                  <span className='rounded-full bg-[#fce8dc] px-3 py-0.5 text-xs font-bold text-(--laranja-principal)'>
                    {item.situacao}
                  </span>
                </div>
                <p className='text-xs font-bold text-(--texto-apoio) uppercase'>
                  {item.servico} · {item.atualizadoEm}
                </p>
                <p className='line-clamp-2 text-sm text-(--texto-apoio)'>
                  {item.mensagens?.at(-1)?.texto}
                </p>
              </div>
              <Botao
                como={Link}
                to={`/meus-contatos/${item.id}`}
                cor='laranja'
                classe='shrink-0'
              >
                Abrir conversa ↗
              </Botao>
            </article>
          ))}
        </div>
      ) : (
        <EstadoVazio
          titulo='Nenhum contato nesta situação.'
          descricao='Envie uma mensagem para prestadores do Marketplace para acompanhar propostas e horários aqui.'
          textoAcao='Explorar serviços'
          rotaAcao='/buscar'
        />
      )}
    </Container>
  );
}
