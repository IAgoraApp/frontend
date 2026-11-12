import { useState } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  CabecalhoSubpagina,
  Container,
  EstadoCarregamento,
  EstadoVazio,
  ModalConfirmacao,
} from '../../compartilhado/interface/indice';
import {
  atualizarEmpresa,
  idEmpresaPadrao,
  useEmpresa,
  validarAnuncio,
} from '../../aplicacao/estado/estadoEmpresa';
import {
  lerEstadoPlataforma,
  salvarEstadoPlataforma,
} from '../../aplicacao/estado/estadoPlataforma';
import {
  ContatosEmpresa,
  DashboardEmpresa,
  DetalheAnuncio,
  EditorAnuncio,
  EditorFotos,
  FaixaAvisoEmpresa,
  InicioEmpresa,
  ListaAnuncios,
  MidiasEmpresa,
  PerfilEmpresa,
  PreviaAnuncio,
} from './componentes/indice';
import { CartaoEmpresa } from './componentes/InterfaceEmpresa';
import { Botao } from '../../compartilhado/interface/indice';

const cabecalhosVisao = {
  painel: {
    selo: 'PAINEL DA EMPRESA',
    titulo: 'Desempenho dos seus anúncios.',
    subtitulo:
      'Acompanhe visualizações, contatos recebidos e resultados por serviço.',
    assinatura: 'caixa',
    etiqueta: 'BORA CRESCER ↗',
  },
  anuncios: {
    selo: 'SEU NEGÓCIO NO IAGORA',
    titulo: 'Seus anúncios.',
    subtitulo:
      'Acompanhe status, visualizações e atualize os serviços oferecidos.',
    assinatura: 'checklist',
    etiqueta: 'TUDO EM DIA ↗',
  },
  novo: {
    selo: 'ANUNCIAR SERVIÇO',
    titulo: 'Você faz bem. Conta pra geral.',
    subtitulo:
      'Apresente o serviço com clareza e revise como ele aparece no Marketplace.',
    assinatura: 'caixa',
    etiqueta: 'MOSTRE SEU TRABALHO ↗',
  },
  editar: {
    selo: 'EDITAR ANÚNCIO',
    titulo: 'Ajuste o que seu serviço precisa mostrar.',
    subtitulo: 'Revise título, atendimento, valores e fotos antes de salvar.',
    assinatura: 'prancheta',
    etiqueta: 'DO SEU JEITO ↗',
  },
  fotos: {
    selo: 'FOTOS DO ANÚNCIO',
    titulo: 'Mostre seu trabalho.',
    subtitulo: 'Adicione imagens reais do atendimento ou da equipe.',
    assinatura: 'planta',
    etiqueta: 'SEU CAPRICHO ↗',
  },
  previa: {
    selo: 'PRÉVIA PÚBLICA',
    titulo: 'Assim seu serviço será apresentado.',
    subtitulo:
      'Confira título, descrição, preço e contato antes de enviar para análise.',
    assinatura: 'chave',
    etiqueta: 'VITRINE IAGORA ↗',
  },
  perfil: {
    selo: 'PERFIL DA EMPRESA',
    titulo: 'Cuide da presença da sua marca.',
    subtitulo:
      'Seu perfil ajuda novos moradores a confiar no seu trabalho desde o início.',
    assinatura: 'planta',
    etiqueta: 'SUA ASSINATURA ↗',
  },
  midias: {
    selo: 'LOGO E PORTFÓLIO',
    titulo: 'Logo, foto comercial e portfólio.',
    subtitulo:
      'Personalize as imagens que identificam sua empresa no Marketplace.',
    assinatura: 'planta',
    etiqueta: 'MARCA PRÓPRIA ↗',
  },
  contatos: {
    selo: 'ATENDIMENTO',
    titulo: 'Meus contatos.',
    subtitulo: 'Veja os moradores que entraram em contato e responda por aqui.',
    assinatura: 'livro',
    etiqueta: 'CONVERSA ABERTA ↗',
  },
};

function EmpresaConteudo({ visao }) {
  const { dados, erro } = useEmpresa();
  const parametrosUrl = useParams();
  const navegar = useNavigate();
  const [parametrosBusca] = useSearchParams();

  const carregando = parametrosBusca.get('carregando') === '1';
  const anuncio = dados.anuncios.find(item => item.id === parametrosUrl.id);
  const contato = dados.contatos.find(
    item =>
      item.id === parametrosUrl.id &&
      (!item.empresaId || item.empresaId === idEmpresaPadrao)
  );

  const [aviso, setAviso] = useState('');
  const [falha, setFalha] = useState('');
  const [confirmacao, setConfirmacao] = useState(null);
  const [fotosEdicao, setFotosEdicao] = useState(() => anuncio?.fotos ?? []);

  const precisaAnuncio = ['editar', 'detalhe', 'fotos', 'previa'].includes(
    visao
  );

  function executarAtualizacao(transformar, mensagemSucesso) {
    try {
      atualizarEmpresa(transformar);
      setFalha('');
      if (mensagemSucesso) setAviso(mensagemSucesso);
      return true;
    } catch (excecao) {
      setFalha(excecao.message);
      return false;
    }
  }

  function salvarAnuncio(valor, modo) {
    const situacao =
      modo === 'rascunho' ? 'rascunho' : (anuncio?.situacao ?? 'rascunho');
    const proximo = {
      ...valor,
      situacao,
      atualizadoEm: new Date().toISOString(),
    };
    if (
      executarAtualizacao(
        anterior => ({
          ...anterior,
          anuncios: anterior.anuncios.some(item => item.id === proximo.id)
            ? anterior.anuncios.map(item =>
                item.id === proximo.id ? proximo : item
              )
            : [...anterior.anuncios, proximo],
        }),
        modo === 'rascunho' ? 'Rascunho salvo.' : 'Anúncio atualizado.'
      )
    ) {
      navegar(
        `/empresa/anuncios/${proximo.id}${modo === 'previa' ? '/previa' : ''}`
      );
    }
  }

  function executarAcaoAnuncio(acao) {
    if (!anuncio) return;
    if (acao === 'excluir') {
      if (
        executarAtualizacao(
          anterior => ({
            ...anterior,
            anuncios: anterior.anuncios.filter(item => item.id !== anuncio.id),
          }),
          'Anúncio excluído. O histórico de contatos foi preservado.'
        )
      ) {
        setConfirmacao(null);
        navegar('/empresa/anuncios');
      }
      return;
    }

    const proximaSituacao =
      acao === 'pausar'
        ? 'pausado'
        : acao === 'publicar'
          ? 'analise'
          : 'ativo';

    if (acao === 'publicar') {
      const mensagemValidacao = validarAnuncio(anuncio);
      if (mensagemValidacao) {
        setFalha(mensagemValidacao);
        setConfirmacao(null);
        return;
      }
    }

    if (
      executarAtualizacao(
        anterior => ({
          ...anterior,
          anuncios: anterior.anuncios.map(item =>
            item.id === anuncio.id
              ? {
                  ...item,
                  situacao: proximaSituacao,
                  atualizadoEm: new Date().toISOString(),
                }
              : item
          ),
        }),
        proximaSituacao === 'analise'
          ? 'Pedido de análise registrado nesta demonstração.'
          : proximaSituacao === 'pausado'
            ? 'Anúncio pausado.'
            : 'Anúncio ativo no catálogo desta demonstração.'
      )
    ) {
      setConfirmacao(null);
      if (acao === 'publicar') {
        navegar(`/empresa/anuncios/${anuncio.id}`);
      }
    }
  }

  function responderContato(item, texto) {
    const agora = new Date().toISOString();
    const idMensagem = crypto.randomUUID();
    const atualizado = executarAtualizacao(
      anterior => ({
        ...anterior,
        contatos: anterior.contatos.map(entrada =>
          entrada.id === item.id
            ? {
                ...entrada,
                situacao:
                  entrada.situacao === 'concluido' ? 'concluido' : 'andamento',
                mensagens: [
                  ...entrada.mensagens,
                  {
                    id: idMensagem,
                    autor: 'empresa',
                    texto,
                    data: agora,
                  },
                ],
              }
            : entrada
        ),
      }),
      'Resposta registrada localmente.'
    );
    if (atualizado) {
      const plataforma = lerEstadoPlataforma();
      const possuiVinculo = (plataforma.contatosCliente || []).some(
        c => c.id === item.id
      );
      if (possuiVinculo) {
        salvarEstadoPlataforma({
          ...plataforma,
          contatosCliente: plataforma.contatosCliente.map(c =>
            c.id === item.id
              ? {
                  ...c,
                  situacao: c.situacao === 'Concluído' ? 'Concluído' : 'Em andamento',
                  mensagens: [
                    ...(c.mensagens || []),
                    {
                      id: idMensagem,
                      autor: 'empresa',
                      texto,
                      data: agora,
                    },
                  ],
                }
              : c
          ),
        });
      }
    }
    return atualizado;
  }

  const cabecalhoAtual = cabecalhosVisao[visao] || cabecalhosVisao.painel;
  const tituloPagina =
    visao === 'detalhe'
      ? anuncio?.titulo || 'Rascunho sem título'
      : visao === 'conversa'
        ? `Conversa com ${contato?.nome || 'cliente'}.`
        : cabecalhoAtual.titulo;
  const subtituloPagina =
    visao === 'conversa'
      ? `${contato?.servico || 'Atendimento'} · Histórico ilustrativo.`
      : cabecalhoAtual.subtitulo;
  const rotaVoltar =
    visao === 'conversa'
      ? '/empresa/contatos'
      : visao === 'midias'
        ? '/empresa/perfil'
        : precisaAnuncio
          ? '/empresa/anuncios'
          : '/empresa';

  return (
    <div
      lang='pt-BR'
      className='min-w-0 flex-1 bg-white font-corpo text-(--azul-titulo)'
    >
      <Container classe='pt-5'>
        <FaixaAvisoEmpresa
          exemplo={dados.exemplo}
          erroArmazenamento={erro}
          falha={falha}
          aviso={aviso}
          aoFecharAviso={() => setAviso('')}
        />
      </Container>

      {carregando ? (
        <Container como='main' classe='py-8 sm:py-12'>
          <EstadoCarregamento
            titulo='Carregando painel da empresa'
            descricao='Organizando anúncios, métricas e conversas desta conta.'
          />
        </Container>
      ) : visao === 'inicio' ? (
        <main>
          <InicioEmpresa dados={dados} />
        </main>
      ) : (
        <Container como='main' classe='space-y-8 py-8 pb-14 sm:py-10'>
          {(precisaAnuncio && !anuncio) ||
          (visao === 'conversa' && !contato) ? (
            <EstadoVazio
              varianteAlerta='erro'
              titulo='Registro não encontrado'
              descricao='Este anúncio ou contato pode ter sido removido desta demonstração.'
              textoAcao='Voltar para a lista'
              rotaAcao={
                visao === 'conversa'
                  ? '/empresa/contatos'
                  : '/empresa/anuncios'
              }
            />
          ) : (
            <>
              <CabecalhoSubpagina
                voltarPara={rotaVoltar}
                rotuloVoltar='← Voltar'
                selo={cabecalhoAtual.selo}
                titulo={tituloPagina}
                subtitulo={subtituloPagina}
                assinatura={cabecalhoAtual.assinatura}
                etiquetaAssinatura={cabecalhoAtual.etiqueta}
              />

              {visao === 'painel' && <DashboardEmpresa dados={dados} />}

              {visao === 'anuncios' && <ListaAnuncios dados={dados} />}

              {(visao === 'novo' || visao === 'editar') && (
                <EditorAnuncio
                  key={anuncio?.id ?? 'novo-anuncio'}
                  anuncio={anuncio}
                  empresa={dados.empresa}
                  aoSalvar={salvarAnuncio}
                />
              )}

              {visao === 'detalhe' && (
                <DetalheAnuncio
                  key={anuncio.id}
                  anuncio={anuncio}
                  aoAcionar={setConfirmacao}
                />
              )}

              {visao === 'perfil' && (
                <PerfilEmpresa
                  key={dados.empresa.nome + dados.empresa.logo}
                  empresa={dados.empresa}
                  aoSalvar={empresaAtualizada =>
                    executarAtualizacao(
                      anterior => ({ ...anterior, empresa: empresaAtualizada }),
                      'Perfil da empresa atualizado.'
                    )
                  }
                />
              )}

              {visao === 'midias' && (
                <MidiasEmpresa
                  empresa={dados.empresa}
                  aoSalvar={empresaAtualizada =>
                    executarAtualizacao(
                      anterior => ({ ...anterior, empresa: empresaAtualizada }),
                      'Logo e portfólio atualizados com sucesso.'
                    )
                  }
                />
              )}

              {(visao === 'contatos' || visao === 'conversa') && (
                <ContatosEmpresa
                  key={contato?.id ?? 'lista-contatos'}
                  dados={dados}
                  contato={contato}
                  aoAlterarSituacao={(item, situacao) =>
                    executarAtualizacao(
                      anterior => ({
                        ...anterior,
                        contatos: anterior.contatos.map(entrada =>
                          entrada.id === item.id
                            ? { ...entrada, situacao }
                            : entrada
                        ),
                      }),
                      'Status do contato atualizado.'
                    )
                  }
                  aoResponder={responderContato}
                />
              )}

              {visao === 'fotos' && (
                <CartaoEmpresa titulo='Fotos do anúncio'>
                  <EditorFotos
                    fotos={fotosEdicao}
                    aoAlterar={setFotosEdicao}
                  />
                  <div className='mt-6 flex flex-wrap gap-3'>
                    <Botao
                      type='button'
                      cor='laranja'
                      onClick={() => {
                        if (
                          executarAtualizacao(
                            anterior => ({
                              ...anterior,
                              anuncios: anterior.anuncios.map(item =>
                                item.id === anuncio.id
                                  ? {
                                      ...item,
                                      fotos: fotosEdicao,
                                      atualizadoEm: new Date().toISOString(),
                                    }
                                  : item
                              ),
                            }),
                            'Fotos atualizadas.'
                          )
                        ) {
                          navegar(`/empresa/anuncios/${anuncio.id}`);
                        }
                      }}
                    >
                      Salvar fotos
                    </Botao>
                    <Botao
                      type='button'
                      variante='secundario'
                      onClick={() => navegar(`/empresa/anuncios/${anuncio.id}`)}
                    >
                      Voltar ao anúncio
                    </Botao>
                  </div>
                </CartaoEmpresa>
              )}

              {visao === 'previa' && (
                <PreviaAnuncio
                  anuncio={anuncio}
                  empresa={dados.empresa}
                  aoPublicarParaAnalise={() => setConfirmacao('publicar')}
                />
              )}
            </>
          )}
        </Container>
      )}

      <ModalConfirmacao
        aberto={Boolean(confirmacao)}
        destrutivo={confirmacao === 'excluir'}
        titulo={
          confirmacao === 'excluir'
            ? 'Excluir anúncio?'
            : confirmacao === 'pausar'
              ? 'Pausar anúncio?'
              : confirmacao === 'publicar'
                ? 'Enviar anúncio para análise?'
                : confirmacao === 'renovar'
                  ? 'Renovar anúncio?'
                  : 'Reativar anúncio?'
        }
        descricao={
          confirmacao === 'excluir'
            ? 'O anúncio será removido desta demonstração. O histórico de contatos anteriores será preservado.'
            : confirmacao === 'pausar'
              ? 'O serviço deixará de aparecer no Marketplace até que você decida reativá-lo.'
              : confirmacao === 'publicar'
                ? 'O anúncio passará para o status Em análise nesta demonstração local.'
                : 'O anúncio voltará a ficar ativo para os moradores no Marketplace.'
        }
        textoConfirmar='Confirmar'
        textoCancelar='Cancelar'
        aoCancelar={() => setConfirmacao(null)}
        aoConfirmar={() => executarAcaoAnuncio(confirmacao)}
      />
    </div>
  );
}

export default function Empresa({ visao = 'inicio' }) {
  const { pathname } = useLocation();
  return <EmpresaConteudo key={pathname} visao={visao} />;
}
