import { usePerfilPreparacao } from '../../app/dados/perfilNavegacao';
import { useAvisoPerfilA } from '../../app/avisos/avisosPerfilA';
import { useEffect, useState } from 'react';
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  alterarBancoMarketplace,
  useBancoMvp,
} from '../../app/dados/bancoMvp';
import { PaginaMvp, VazioMvp } from '../../shared/ui/mvp';
import SolicitarServico from './solicitarServico';
import { chatLiberado, garantirChat } from './contratacoes';
import VoltarMarketplace from './voltarMarketplace';
import { CartaoEmpresa } from './empresaMarketplace';
import CatalogoMarketplaceA, {
  FotoServico,
  NotaServico,
} from './catalogoMarketplaceA';
import {
  nomeCategoria,
  precoServico,
  servicoPublico,
} from './marketplaceDados';
import AvaliacoesServico from './AvaliacoesServico';
import ContatosMarketplaceA from './contatosMarketplaceA';
import './marketplaceA.css';

export default function MarketplaceA({ dentroDaEmpresa = false }) {
  const preparacao = usePerfilPreparacao();
  const { b, perfil, endereco } = useBancoMvp();
  const { id, slug } = useParams();
  const { pathname, search, state } = useLocation();
  const navegar = useNavigate();
  const notificar = useAvisoPerfilA();
  const [contratar, setContratar] = useState(false);
  const [erroChat, setErroChat] = useState('');
  const empresas = b.perfil_empresa.filter(e => e.validado);
  const empresasPorId = new Map(empresas.map(e => [e.id, e]));
  const servicos = b.servico.filter(s =>
    servicoPublico(s, empresasPorId.get(s.empresa_id), undefined, b.publicacao_servico.filter(p => p.servico_id === s.id))
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

  if (preparacao && pathname === '/favoritos')
    return <Navigate to='/marketplace' replace />;

  function abrirChat(empresaId, contratadoId) {
    try {
      let conversaId;
      alterarBancoMarketplace(db => {
        const pedido = db.servico_contratado.find(
          c => c.id === contratadoId && c.perfil_id === perfil.id
        );
        conversaId = garantirChat(db, pedido, empresaId).id;
      });
      navegar(`/meus-contatos/${conversaId}`);
    } catch (falha) {
      setErroChat(falha.message);
    }
  }
  const ehMeusServicos = pathname === '/servicos-contratados';
  if (
    pathname.startsWith('/meus-contatos') &&
    ['servicos', 'solicitacoes'].includes(
      new URLSearchParams(search).get('visao')
    )
  )
    return <Navigate to='/servicos-contratados' replace />;

  if (ehMeusServicos || pathname.startsWith('/meus-contatos')) {
    return (
      <ContatosMarketplaceA
        ehMeusServicos={ehMeusServicos}
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
      if (rotaContato)
        navegar('/servicos/' + servico.id, { replace: true, state });
    }

    const pedidoAberto = b.servico_contratado.find(
      c =>
        c.servico_id === servico.id &&
        c.perfil_id === perfil.id &&
        ['pendente', 'aceito', 'em_andamento'].includes(c.status)
    );
    const avaliacoes = b.avaliacao_servico.filter(a =>
      b.servico_contratado.some(
        c => c.id === a.contratado_id && c.servico_id === servico.id
      )
    );
    return (
      <PaginaMvp cabecalho={false}>
        <header className='mercado-a-detalhe-topo'>
          <VoltarMarketplace />
          <div className='mercado-a-detalhe-identidade'>
            <div>
              <h1>{servico.titulo}</h1>
              <p>{empresa.nome}</p>
            </div>
            <a className='mercado-a-voltar-detalhe' href='#avaliacoes-servico'>
              Ver avaliações
            </a>
          </div>
        </header>
        {erroChat && (
          <p className='mvp-confirmacao' role='alert'>
            {erroChat}
          </p>
        )}
        {(contratar || rotaContato) && !pedidoAberto && (
          <SolicitarServico
            servico={servico}
            empresa={empresa}
            perfil={perfil}
            endereco={endereco}
            aoFechar={fecharSolicitacao}
            aoEnviar={chatId => {
              setContratar(false);
              notificar('Solicitação enviada.');
              navegar(`/meus-contatos/${chatId}`, {
                replace: rotaContato,
              });
            }}
          />
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
              <p className='mercado-a-servico-pagamento'>
                Pagamento combinado diretamente com a empresa.
              </p>
              <div className='mercado-a-servico-acoes'>
                {chatLiberado(pedidoAberto) ? (
                  <button
                    type='button'
                    className='mvp-primario'
                    onClick={() =>
                      abrirChat(servico.empresa_id, pedidoAberto.id)
                    }
                  >
                    Abrir conversa
                  </button>
                ) : (
                  <button
                    type='button'
                    className='mvp-primario'
                    onClick={() => setContratar(true)}
                  >
                    Iniciar conversa
                  </button>
                )}
                <Link className='mvp-link' to='/servicos-contratados'>
                  Meus serviços
                </Link>
              </div>
            </div>
          </section>
          <aside
            className='mercado-a-detalhe-lateral'
            aria-label='Empresa e avaliações'
          >
            <CartaoEmpresa
              empresa={empresa}
              estado={
                state?.retorno?.url === `/empresas/${empresa.id}`
                  ? state.retorno.estado
                  : {
                      retorno: {
                        url: `/servicos/${servico.id}`,
                        rotulo: 'Voltar ao serviço',
                        estado: state,
                      },
                    }
              }
            />
            <AvaliacoesServico avaliacoes={avaliacoes} />
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
      erroChat={erroChat}
    />
  );
}
