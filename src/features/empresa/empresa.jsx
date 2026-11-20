import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useBancoMvp } from '../../app/dados/bancoMvp';
import { acessoLocal } from '../../app/dados/acessoLocal';
import { lerSessao } from '../../app/dados/contaApi';
import { Botao } from '../../shared/ui';
import { DialogoCasa } from '../casa/components/casaUi';
import { PaginaMvp, VazioMvp } from '../../shared/ui/mvp';
import { useAvisoPerfilA } from '../../app/avisos/avisosPerfilA';
import DetalheAnuncio from './components/adDetail';
import EditorAnuncio from './components/adEditor';
import ListaAnuncios from './components/adsList';
import AvaliacoesServico from '../marketplace/AvaliacoesServico';
import InicioEmpresa from './components/companyHome';
import PerfilEmpresa from './components/companyProfile';
import SolicitacoesMarketplace from './components/solicitacoesMarketplace';
import PublicacoesEmpresa from './components/PublicacoesEmpresa';
import {
  acionarServico,
  cancelarPublicacao,
  cobrarPublicacao,
  contratarPublicacao,
  contaEmpresaLocal,
  empresaDoUsuario,
  salvarServico,
  servicosDaEmpresa,
} from './empresaDados';
import '../marketplace/marketplaceA.css';
import './servicosEmpresa.css';

const titulos = {
  anuncios: 'Meus serviços',
  novo: 'Cadastrar serviço',
  editar: 'Editar serviço',
  fotos: 'Fotos do serviço',
  previa: 'Prévia do serviço',
  contatos: 'Atendimentos',
  conversa: 'Atendimentos',
};
const acoes = {
  validar: [
    'Enviar serviço para análise?',
    'O serviço ficará pendente até a equipe revisar.',
  ],
  ativar: [
    'Ativar serviço?',
    'Serviços aprovados com publicação vigente voltam ao catálogo.',
  ],
  desativar: [
    'Desativar serviço?',
    'O serviço sairá do catálogo. O histórico ficará disponível.',
  ],
  excluir: ['Excluir serviço?', 'O serviço será removido da sua lista.'],
  cancelar: [
    'Cancelar publicação?',
    'A divulgação e as cobranças pendentes desta publicação serão canceladas.',
  ],
};

function EmpresaConteudo({ visao }) {
  const navegar = useNavigate();
  const { id } = useParams();
  const [params] = useSearchParams();
  const { b } = useBancoMvp();
  const notificar = useAvisoPerfilA();
  const [confirmacao, setConfirmacao] = useState(null);
  const [editandoInformacoes, setEditandoInformacoes] = useState(false);
  const [erro, setErro] = useState('');
  const userId = acessoLocal
    ? contaEmpresaLocal(b, lerSessao())?.id
    : undefined;
  const empresa = empresaDoUsuario(b, userId);
  const servicos = servicosDaEmpresa(b, empresa);
  const ids = new Set(servicos.map(s => s.id));
  const pedidos = b.servico_contratado.filter(p => ids.has(p.servico_id));
  const anuncio = servicos.find(s => s.id === Number(id));
  const rotaServico = anuncio && `/empresa/anuncios/${anuncio.id}`;
  const chat = b.chat_servico.find(
    c => c.id === Number(id) && c.empresa_id === empresa?.id
  );

  function executar(operacao, mensagem, destino) {
    try {
      operacao();
      setErro('');
      setConfirmacao(null);
      if (mensagem) notificar(mensagem);
      if (destino) navegar(destino);
    } catch (falha) {
      setErro(falha.message);
    }
  }

  function salvar(dados, permanecer = false) {
    const salvo = salvarServico(userId, anuncio?.id, dados);
    notificar(anuncio ? 'Serviço atualizado.' : 'Rascunho salvo.');
    if (!permanecer) navegar(`/empresa/anuncios/${salvo.id}`);
  }

  if (!acessoLocal || !userId)
    return (
      <PaginaMvp titulo='Área profissional'>
        <VazioMvp>
          Este módulo está disponível no ambiente de demonstração enquanto o
          servidor não oferece os recursos comerciais.
        </VazioMvp>
      </PaginaMvp>
    );

  if (visao === 'inicio')
    return (
      <InicioEmpresa empresa={empresa} servicos={servicos} pedidos={pedidos} />
    );

  if (visao === 'perfil' || (visao === 'midias' && empresa))
    return (
      <>
        {erro && (
          <p className='mvp-vazio' role='alert'>
            {erro}
          </p>
        )}
        <PerfilEmpresa
          b={b}
          userId={userId}
          empresa={empresa}
          visao={params.get('visao')}
          somenteMidias={visao === 'midias'}
          executar={executar}
          notificar={notificar}
        />
      </>
    );

  if (!empresa)
    return (
      <PaginaMvp titulo='Área profissional'>
        <VazioMvp>
          Cadastre o perfil da sua empresa para gerenciar serviços.
        </VazioMvp>
        <Link className='mvp-link' to='/empresa/perfil'>
          Cadastrar perfil
        </Link>
      </PaginaMvp>
    );

  const precisaAnuncio = ['detalhe', 'editar', 'fotos', 'previa'].includes(
    visao
  );
  const titulosComServico = ['detalhe', 'previa'];
  if ((precisaAnuncio && !anuncio) || (visao === 'conversa' && !chat))
    return (
      <PaginaMvp titulo='Registro indisponível'>
        <Link
          className='mvp-link'
          to={
            precisaAnuncio
              ? '/empresa/anuncios'
              : '/empresa/contatos?visao=chat'
          }
        >
          Voltar para a lista
        </Link>
      </PaginaMvp>
    );

  const pedidosDoServico = pedidos.filter(
    p => p.servico_id === anuncio?.id && p.status === 'concluido'
  );
  const podeExcluir =
    anuncio &&
    !pedidos.some(p => p.servico_id === anuncio.id) &&
    !b.publicacao_servico.some(p => p.servico_id === anuncio.id);
  const dadosAcao = acoes[confirmacao?.acao];

  return (
    <PaginaMvp
      cabecalho={!precisaAnuncio}
      classe={precisaAnuncio ? 'empresa-anuncio-pagina' : ''}
      titulo={titulos[visao]}
      descricao={
        visao === 'previa'
          ? 'Veja como seu serviço será apresentado no Marketplace.'
          : ['contatos', 'conversa'].includes(visao)
            ? 'Acompanhe os serviços e converse com seus clientes.'
            : undefined
      }
      acao={
        visao === 'anuncios' ? (
          <Link className='mvp-primario' to='/empresa/anunciar'>
            Cadastrar serviço
          </Link>
        ) : null
      }
    >
      {precisaAnuncio && (
        <header className='empresa-anuncio-cabecalho'>
          <Link
            className='empresa-anuncio-voltar'
            to={visao === 'detalhe' ? '/empresa/anuncios' : rotaServico}
          >
            <ArrowLeft size={18} aria-hidden='true' />
            {visao === 'detalhe' ? 'Meus serviços' : 'Voltar ao serviço'}
          </Link>
          <h1>
            {titulosComServico.includes(visao)
              ? anuncio.titulo
              : titulos[visao]}
          </h1>
          {visao === 'previa' && (
            <p>Veja como seu serviço será apresentado no Marketplace.</p>
          )}
          {visao === 'detalhe' && (
            <nav
              className='empresa-anuncio-secoes'
              aria-label='Seções do anúncio'
            >
              <a href='#dados-anuncio'>Informações</a>
              <a href='#publicacoes-anuncio'>Publicações</a>
              <a href='#avaliacoes-anuncio'>Avaliações</a>
            </nav>
          )}
        </header>
      )}
      {erro && (
        <p className='mvp-vazio' role='alert'>
          {erro}
        </p>
      )}
      <div
        className={
          precisaAnuncio ? 'empresa-anuncio-conteudo' : 'grid min-w-0 gap-4'
        }
      >
        {visao === 'anuncios' && (
          <ListaAnuncios
            servicos={servicos}
            empresa={empresa}
            publicacoes={b.publicacao_servico}
          />
        )}
        {['novo', 'editar', 'fotos'].includes(visao) && (
          <EditorAnuncio
            anuncio={anuncio}
            somenteFotos={visao === 'fotos'}
            aoSalvar={salvar}
          />
        )}
        {titulosComServico.includes(visao) && (
          <DetalheAnuncio
            anuncio={anuncio}
            empresa={empresa}
            publicacoes={b.publicacao_servico}
            previa={visao === 'previa'}
            aoEditar={() => setEditandoInformacoes(true)}
            aoAcionar={acao => {
              setErro('');
              setConfirmacao({ acao });
            }}
            podeExcluir={podeExcluir}
          />
        )}
        {visao === 'detalhe' && (
          <>
            <div id='publicacoes-anuncio' tabIndex={-1}>
              <PublicacoesEmpresa
                b={b}
                empresa={empresa}
                servico={anuncio}
                executar={executar}
                operacoes={{
                  contratar: (plano, renovacao) => {
                    contratarPublicacao(userId, anuncio.id, plano, renovacao);
                    if (!renovacao)
                      notificar(
                        'Publicação contratada. Gere a cobrança para concluir.'
                      );
                  },
                  cobrar: (publicacao, metodo) => {
                    cobrarPublicacao(userId, publicacao, metodo);
                    notificar('Cobrança de teste criada.');
                  },
                  confirmarCancelamento: publicacao => {
                    setErro('');
                    setConfirmacao({ acao: 'cancelar', publicacao });
                  },
                }}
              />
            </div>
            <div id='avaliacoes-anuncio' tabIndex={-1}>
              <AvaliacoesServico
                avaliacoes={b.avaliacao_servico.filter(a =>
                  pedidosDoServico.some(
                    p => p.id === a.contratado_id && p.perfil_id === a.perfil_id
                  )
                )}
              />
            </div>
          </>
        )}
        {['contatos', 'conversa'].includes(visao) && (
          <SolicitacoesMarketplace
            b={b}
            empresa={empresa}
            servicos={servicos}
            pedidos={pedidos}
            chatInicial={
              chat && { chatId: chat.id, pedidoId: chat.contratado_id }
            }
          />
        )}
      </div>
      {editandoInformacoes && anuncio && (
        <DialogoCasa
          titulo='Editar informações do serviço'
          classe='empresa-editor-dialogo empresa-servico-dialogo'
          aoFechar={() => setEditandoInformacoes(false)}
        >
          <EditorAnuncio
            anuncio={anuncio}
            aoSalvar={dados => salvar(dados, true)}
            aoCancelar={() => setEditandoInformacoes(false)}
          />
        </DialogoCasa>
      )}
      {dadosAcao && (
        <DialogoCasa
          titulo={dadosAcao[0]}
          aoFechar={() => setConfirmacao(null)}
        >
          <p>{dadosAcao[1]}</p>
          <div className='mt-5 flex flex-wrap justify-end gap-2'>
            <Botao
              type='button'
              variante='contorno'
              onClick={() => setConfirmacao(null)}
            >
              Voltar
            </Botao>
            <Botao
              type='button'
              onClick={() => {
                const { acao, publicacao } = confirmacao;
                setConfirmacao(null);
                executar(
                  () =>
                    acao === 'cancelar'
                      ? cancelarPublicacao(userId, publicacao)
                      : acionarServico(userId, anuncio.id, acao),
                  'Alteração salva.',
                  acao === 'excluir' ? '/empresa/anuncios' : undefined
                );
              }}
            >
              Confirmar
            </Botao>
          </div>
        </DialogoCasa>
      )}
    </PaginaMvp>
  );
}

export default function Empresa({ visao = 'inicio' }) {
  const { pathname } = useLocation();
  return <EmpresaConteudo key={pathname} visao={visao} />;
}
