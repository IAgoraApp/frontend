import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  alterarBancoMarketplace,
  dataCurta,
  hoje,
  inserir,
  useBancoMvp,
} from '../../app/dados/bancoMvp';
import { EditorMvp, PaginaMvp, VazioMvp } from '../../shared/ui/mvp';
import DialogoMarketplace from './dialogoMarketplace';
import { CartaoEmpresa, MarcaEmpresa } from './empresaMarketplace';
import CatalogoMarketplaceA, {
  FotoServico,
  NotaServico,
} from './catalogoMarketplaceA';
import {
  nomeCategoria,
  precoServico,
  servicoPublico,
} from './marketplaceDados';
import ContatosMarketplaceA from './contatosMarketplaceA';
import './marketplaceA.css';

export default function MarketplaceA({ dentroDaEmpresa = false }) {
  const { b, perfil, casa } = useBancoMvp();
  const { id, slug } = useParams();
  const { pathname } = useLocation();
  const navegar = useNavigate();
  const [contratar, setContratar] = useState(false);
  const [erroChat, setErroChat] = useState('');
  const [solicitacaoCriada, setSolicitacaoCriada] = useState(null);
  const empresas = b.perfil_empresa.filter(e => e.validado);
  const empresasPorId = new Map(empresas.map(e => [e.id, e]));
  const servicos = b.servico.filter(s =>
    servicoPublico(s, empresasPorId.get(s.empresa_id))
  );
  const servico = pathname.startsWith('/servicos/')
    ? servicos.find(s => s.id === Number(id))
    : null;
  const empresa = empresasPorId.get(
    pathname.startsWith('/empresas/') ? Number(id) : servico?.empresa_id
  );
  const rotaContato = pathname.endsWith('/contato');
  const rotaAvaliacoes = pathname.endsWith('/avaliacoes');

  useEffect(() => {
    if (!rotaAvaliacoes) return;
    const quadro = requestAnimationFrame(() => {
      document.getElementById('avaliacoes-servico')?.focus();
    });
    return () => cancelAnimationFrame(quadro);
  }, [rotaAvaliacoes, id]);

  function abrirChat(empresaId, contratadoId = null) {
    try {
      let conversaId;
      alterarBancoMarketplace(db => {
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
    } catch (falha) {
      setErroChat(falha.message);
    }
  }
  if (pathname.startsWith('/meus-contatos')) {
    return (
      <ContatosMarketplaceA
        banco={b}
        perfil={perfil}
        id={id}
        aoConversar={abrirChat}
        erroChat={erroChat}
      />
    );
  }

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
    function fecharSolicitacao() {
      setContratar(false);
      if (rotaContato) navegar('/servicos/' + servico.id, { replace: true });
    }

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
          <Link className='mercado-a-voltar-detalhe' to='/marketplace'>
            Todos os serviços
          </Link>
        }
      >
        {erroChat && (
          <p className='mvp-confirmacao' role='alert'>
            {erroChat}
          </p>
        )}
        {solicitacaoCriada?.servicoId === servico.id && (
          <p role='status' className='mvp-sucesso'>
            Solicitação enviada.{' '}
            <Link
              className='mvp-link'
              to={`/meus-contatos/${solicitacaoCriada.chatId}`}
            >
              Abrir conversa
            </Link>
          </p>
        )}
        {(contratar || rotaContato) && (
          <DialogoMarketplace
            titulo='Solicitar serviço'
            aoFechar={fecharSolicitacao}
          >
            <div className='mercado-a-dialogo-contexto'>
              <MarcaEmpresa key={empresa.id} empresa={empresa} />
              <div>
                <strong>{servico.titulo}</strong>
                <p>
                  {empresa.nome} · {precoServico(servico)}
                </p>
              </div>
            </div>
            <div className='mercado-a-editor'>
              <EditorMvp
                cabecalho={false}
                titulo='Solicitar serviço'
                rotuloSalvar='Enviar solicitação'
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
                onClose={fecharSolicitacao}
                onSave={v => {
                  if (v.data_agendamento < `${hoje()}T00:00`)
                    throw new Error('Escolha uma data a partir de hoje.');
                  let chatId;
                  alterarBancoMarketplace(db => {
                    const contratacao = inserir(
                      'servico_contratado',
                      {
                        ...v,
                        servico_id: servico.id,
                        perfil_id: perfil.id,
                        endereco_id: casa.endereco_id,
                        valor: Number(servico.preco ?? 0),
                        status: 'pendente',
                        data_contratacao: new Date().toISOString(),
                        data_conclusao: null,
                      },
                      db
                    );
                    chatId = inserir(
                      'chat_servico',
                      {
                        perfil_id: perfil.id,
                        empresa_id: servico.empresa_id,
                        contratado_id: contratacao.id,
                      },
                      db
                    ).id;
                  });
                  setSolicitacaoCriada({ servicoId: servico.id, chatId });
                }}
              />
            </div>
          </DialogoMarketplace>
        )}
        <div className='mercado-a-detalhe'>
          <section className='mvp-painel mercado-a-servico'>
            <div className='mercado-a-servico-foto'>
              <FotoServico key={servico.id} servico={servico} destaque />
            </div>
            <div className='mvp-conteudo'>
              <div className='mercado-a-cartao-meta'>
                <span>{nomeCategoria(servico.categoria)}</span>
                <NotaServico nota={servico.nota} />
              </div>
              <h2>{precoServico(servico)}</h2>
              <p>{servico.descricao}</p>
              {servico.disponibilidade?.dias?.length > 0 && (
                <p>
                  Atendimento:{' '}
                  {servico.disponibilidade.dias
                    .map(dia =>
                      dia === 'terca'
                        ? 'terça'
                        : dia === 'sabado'
                          ? 'sábado'
                          : dia
                    )
                    .join(', ')}
                  .
                </p>
              )}
              <div className='mercado-a-servico-acoes'>
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
                <Link
                  className='mvp-link'
                  to='/meus-contatos?visao=solicitacoes'
                >
                  Ver minhas solicitações
                </Link>
              </div>
            </div>
          </section>
          <aside
            className='mercado-a-detalhe-lateral'
            aria-label='Empresa e avaliações'
          >
            <CartaoEmpresa empresa={empresa} />
            <section
              className='mvp-painel mercado-a-avaliacoes'
              id='avaliacoes-servico'
              aria-labelledby='mercado-a-avaliacoes-titulo'
              tabIndex={-1}
            >
              <div className='mvp-painel-topo'>
                <h2 id='mercado-a-avaliacoes-titulo'>Avaliações</h2>
                <span>
                  {avaliacoes.length}{' '}
                  {avaliacoes.length === 1 ? 'avaliação' : 'avaliações'}
                </span>
              </div>
              {avaliacoes.length ? (
                <ul
                  className='mercado-a-avaliacoes-lista'
                  tabIndex={0}
                  aria-label='Comentários do serviço'
                >
                  {avaliacoes.map(a => (
                    <li key={a.id}>
                      <div>
                        <strong>{a.nota} de 5</strong>
                        <small>{dataCurta(a.data_avaliacao)}</small>
                      </div>
                      {a.comentario && <p>{a.comentario}</p>}
                    </li>
                  ))}
                </ul>
              ) : (
                <VazioMvp>Ainda não há avaliações deste serviço.</VazioMvp>
              )}
            </section>
          </aside>
        </div>
      </PaginaMvp>
    );
  }
  return (
    <CatalogoMarketplaceA
      servicos={servicos}
      dentroDaEmpresa={dentroDaEmpresa}
      empresas={empresas}
      empresa={empresa}
      usuario={perfil.user_id}
      slug={slug}
      pathname={pathname}
      aoConversar={abrirChat}
      erroChat={erroChat}
    />
  );
}
