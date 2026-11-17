import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  alterarBanco,
  dataCurta,
  hoje,
  inserir,
  moeda,
  salvarRegistro,
  useBancoMvp,
} from '../../app/dados/bancoMvp';
import { EditorMvp, PaginaMvp, VazioMvp } from '../../shared/ui/mvp';

export default function MarketplaceA() {
  const { b, perfil, casa } = useBancoMvp();
  const { id, slug } = useParams();
  const { pathname } = useLocation();
  const navegar = useNavigate();
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState(slug || 'todas');
  const [contratar, setContratar] = useState(false);
  const [avaliar, setAvaliar] = useState(null);
  const [aviso, setAviso] = useState('');
  const servico = pathname.startsWith('/servicos/')
    ? b.servico.find(
        s =>
          s.id === Number(id) && s.ativo && s.status_publicacao === 'publicado'
      )
    : null;
  const empresa = pathname.startsWith('/empresas/')
    ? b.perfil_empresa.find(e => e.id === Number(id))
    : b.perfil_empresa.find(e => e.id === servico?.empresa_id);
  const contratacoes = b.servico_contratado.filter(
    c => c.perfil_id === perfil.id
  );
  const chats = b.chat_servico.filter(c => c.perfil_id === perfil.id);
  const chat = chats.find(c => c.id === Number(id));
  const contatos = pathname.startsWith('/meus-contatos');
  const servicos = b.servico.filter(
    s =>
      s.ativo &&
      s.status_publicacao === 'publicado' &&
      (!pathname.startsWith('/empresas/') || s.empresa_id === empresa?.id) &&
      (categoria === 'todas' || s.categoria === categoria) &&
      `${s.titulo} ${s.descricao}`.toLowerCase().includes(busca.toLowerCase())
  );

  function abrirChat(empresaId, contratadoId = null) {
    let conversaId;
    alterarBanco(db => {
      const existente = db.chat_servico.find(
        c =>
          c.perfil_id === perfil.id &&
          c.empresa_id === empresaId &&
          c.contratado_id === contratadoId
      );
      conversaId =
        existente?.id ??
        inserir(
          'chat_servico',
          {
            perfil_id: perfil.id,
            empresa_id: empresaId,
            contratado_id: contratadoId,
          },
          db
        ).id;
    });
    navegar(`/meus-contatos/${conversaId}`);
  }
  if (contatos)
    return (
      <PaginaMvp
        titulo='Serviços e conversas'
        descricao='Acompanhe solicitações e fale com as empresas.'
      >
        {aviso && (
          <p className='mvp-sucesso' role='status'>
            {aviso}
          </p>
        )}
        {avaliar && (
          <EditorMvp
            titulo='Avaliar serviço'
            inicial={{ nota: 5, comentario: '' }}
            campos={[
              {
                nome: 'nota',
                rotulo: 'Nota',
                numero: true,
                opcoes: [1, 2, 3, 4, 5].map(n => [n, `${n} de 5`]),
              },
              { nome: 'comentario', rotulo: 'Comentário', tipo: 'textarea' },
            ]}
            onClose={() => setAvaliar(null)}
            onSave={v => {
              salvarRegistro('avaliacao_servico', {
                ...v,
                contratado_id: avaliar.id,
                perfil_id: perfil.id,
                data_avaliacao: new Date().toISOString(),
              });
              setAviso('Avaliação registrada.');
            }}
          />
        )}
        <div className='mvp-grade'>
          <section className='mvp-painel'>
            <div className='mvp-painel-topo'>
              <h2>Minhas contratações</h2>
            </div>
            {!contratacoes.length && (
              <VazioMvp>Você ainda não solicitou um serviço.</VazioMvp>
            )}
            {contratacoes.map(c => {
              const s = b.servico.find(s => s.id === c.servico_id);
              return (
                <div className='mvp-registro' key={c.id}>
                  <div>
                    <strong>{s?.titulo}</strong>
                    <p className='mvp-detalhe'>
                      {c.descricao}
                      <br />
                      {dataCurta(c.data_agendamento)} · {moeda(c.valor)} ·{' '}
                      {c.status}
                    </p>
                  </div>
                  <div className='mvp-acoes'>
                    <button
                      type='button'
                      onClick={() => abrirChat(s.empresa_id, c.id)}
                    >
                      Conversar
                    </button>
                    {c.status === 'pendente' && (
                      <button
                        type='button'
                        onClick={() => {
                          salvarRegistro('servico_contratado', {
                            ...c,
                            status: 'cancelado',
                          });
                          setAviso('Solicitação cancelada.');
                        }}
                      >
                        Cancelar solicitação
                      </button>
                    )}
                    {c.status === 'concluido' &&
                      !b.avaliacao_servico.some(
                        a => a.contratado_id === c.id
                      ) && (
                        <button type='button' onClick={() => setAvaliar(c)}>
                          Avaliar
                        </button>
                      )}
                  </div>
                </div>
              );
            })}
          </section>
          <section className='mvp-painel'>
            <div className='mvp-painel-topo'>
              <h2>Conversas</h2>
            </div>
            {chats.map(c => (
              <div className='mvp-registro' key={c.id}>
                <Link className='mvp-link' to={`/meus-contatos/${c.id}`}>
                  {b.perfil_empresa.find(e => e.id === c.empresa_id)?.nome}
                </Link>
                <span className='mvp-detalhe'>
                  {b.mensagem.filter(m => m.chat_id === c.id).length} mensagens
                </span>
              </div>
            ))}
            {id && !chat && <VazioMvp>Conversa não encontrada.</VazioMvp>}
            {chat && (
              <div className='mvp-conteudo'>
                <h3>
                  {b.perfil_empresa.find(e => e.id === chat.empresa_id)?.nome}
                </h3>
                {b.mensagem
                  .filter(m => m.chat_id === chat.id)
                  .map(m => (
                    <div key={m.id} className='mvp-mensagem'>
                      <small>
                        {m.user_id === perfil.user_id
                          ? 'Você'
                          : b.perfil_empresa.find(e => e.user_id === m.user_id)
                              ?.nome}{' '}
                        · {dataCurta(m.data)}
                      </small>
                      {m.mensagem}
                    </div>
                  ))}
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    const campo = e.currentTarget.elements.mensagem;
                    const texto = campo.value.trim();
                    if (!texto) return;
                    salvarRegistro('mensagem', {
                      chat_id: chat.id,
                      user_id: perfil.user_id,
                      mensagem: texto,
                      data: new Date().toISOString(),
                      lida_em: null,
                    });
                    e.currentTarget.reset();
                  }}
                >
                  <label className='mvp-campos'>
                    <span>Mensagem para a empresa</span>
                    <textarea name='mensagem' maxLength={2000} required />
                  </label>
                  <button type='submit' className='mvp-primario'>
                    Enviar mensagem
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      </PaginaMvp>
    );

  if (pathname.startsWith('/servicos/')) {
    if (!servico)
      return (
        <PaginaMvp titulo='Serviço indisponível'>
          <VazioMvp>Esse serviço não está disponível no catálogo.</VazioMvp>
          <Link className='mvp-link' to='/marketplace'>
            Voltar aos serviços
          </Link>
        </PaginaMvp>
      );
    const avaliacoes = b.avaliacao_servico.filter(a =>
      b.servico_contratado.some(
        c => c.id === a.contratado_id && c.servico_id === servico.id
      )
    );
    return (
      <PaginaMvp
        titulo={servico.titulo}
        descricao={empresa?.nome}
        acao={
          <Link className='mvp-link' to='/marketplace'>
            Todos os serviços
          </Link>
        }
      >
        {aviso && (
          <p role='status' className='mvp-sucesso'>
            {aviso}
          </p>
        )}
        {contratar && (
          <EditorMvp
            titulo='Solicitar serviço'
            inicial={{ descricao: '', data_agendamento: `${hoje()}T09:00` }}
            campos={[
              {
                nome: 'descricao',
                rotulo: 'O que você precisa?',
                tipo: 'textarea',
              },
              {
                nome: 'data_agendamento',
                rotulo: 'Data desejada',
                tipo: 'datetime-local',
              },
            ]}
            onClose={() => setContratar(false)}
            onSave={v => {
              if (v.data_agendamento < `${hoje()}T00:00`)
                throw new Error('Escolha uma data a partir de hoje.');
              salvarRegistro('servico_contratado', {
                ...v,
                servico_id: servico.id,
                perfil_id: perfil.id,
                endereco_id: casa.endereco_id,
                valor: servico.preco,
                status: 'pendente',
                data_contratacao: new Date().toISOString(),
                data_conclusao: null,
              });
              setAviso(
                'Solicitação enviada. Acompanhe em Serviços e conversas.'
              );
            }}
          />
        )}
        <div className='mvp-grade'>
          <section className='mvp-painel'>
            <div className='mvp-conteudo'>
              <h2>{moeda(servico.preco)}</h2>
              <p>
                {servico.tipo_preco === 'fixo'
                  ? 'Preço fixo'
                  : servico.tipo_preco}
              </p>
              <p>{servico.descricao}</p>
              <p>Categoria: {servico.categoria}</p>
              <p>Nota do catálogo: {servico.nota ?? 'Ainda sem nota'}</p>
              <div className='mvp-atalhos'>
                <button
                  type='button'
                  className='mvp-primario'
                  onClick={() => setContratar(true)}
                >
                  Solicitar serviço
                </button>
                <button
                  type='button'
                  className='mvp-link'
                  onClick={() => abrirChat(servico.empresa_id)}
                >
                  Falar com a empresa
                </button>
              </div>
              <Link className='mvp-link' to='/meus-contatos'>
                Ver minhas solicitações
              </Link>
            </div>
          </section>
          <section className='mvp-painel'>
            <div className='mvp-painel-topo'>
              <h2>Quem vai ajudar</h2>
            </div>
            <div className='mvp-conteudo'>
              <h3>{empresa?.nome}</h3>
              <p>{empresa?.descricao}</p>
              <p>
                {empresa?.telefone}
                <br />
                {empresa?.email_comercial}
              </p>
              <p>{empresa?.local_atendimento.join(', ')}</p>
              <Link className='mvp-link' to={`/empresas/${empresa?.id}`}>
                Ver empresa e serviços
              </Link>
            </div>
          </section>
          <section className='mvp-painel'>
            <div className='mvp-painel-topo'>
              <h2>Avaliações</h2>
            </div>
            {!avaliacoes.length && (
              <VazioMvp>Ainda não há avaliações deste serviço.</VazioMvp>
            )}
            {avaliacoes.map(a => (
              <div className='mvp-conteudo' key={a.id}>
                <strong>{a.nota} de 5</strong>
                <p>{a.comentario}</p>
                <small>{dataCurta(a.data_avaliacao)}</small>
              </div>
            ))}
          </section>
        </div>
      </PaginaMvp>
    );
  }
  return (
    <PaginaMvp
      titulo={
        pathname.startsWith('/empresas/')
          ? empresa?.nome || 'Empresa não encontrada'
          : 'Uma ajuda para o seu canto.'
      }
      descricao={
        empresa?.descricao || 'Encontre serviços e acompanhe suas solicitações.'
      }
      acao={
        <Link className='mvp-link' to='/meus-contatos'>
          Serviços e conversas
        </Link>
      }
    >
      <div className='mvp-busca'>
        <input
          aria-label='Buscar serviços'
          placeholder='Qual serviço você precisa?'
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
        <select
          aria-label='Categoria de serviço'
          value={categoria}
          onChange={e => setCategoria(e.target.value)}
        >
          <option value='todas'>Todas as categorias</option>
          {[...new Set(b.servico.map(s => s.categoria))].map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      {!servicos.length && (
        <VazioMvp>
          Nenhum serviço encontrado. Experimente outro nome ou categoria.
        </VazioMvp>
      )}
      <div className='mvp-grade'>
        {servicos.map(s => (
          <article className='mvp-painel' key={s.id}>
            <div className='mvp-painel-topo'>
              <h2>{s.titulo}</h2>
              <span className='mvp-detalhe'>{s.nota ?? 'Sem nota'}</span>
            </div>
            <div className='mvp-conteudo'>
              <p>{b.perfil_empresa.find(e => e.id === s.empresa_id)?.nome}</p>
              <p>{s.descricao}</p>
              <h3>{moeda(s.preco)}</h3>
              <Link className='mvp-primario' to={`/servicos/${s.id}`}>
                Ver serviço
              </Link>
            </div>
          </article>
        ))}
      </div>
    </PaginaMvp>
  );
}
