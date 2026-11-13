import { useState } from 'react';
import { encerrarSessao } from '../../aplicacao/utilitarios/sessao';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import fotoQueroMorar from '../../ativos/imagens/fotografias/onboarding-quero-morar-sozinho.jpg';
import fotoJaMoro from '../../ativos/imagens/fotografias/onboarding-ja-moro-sozinho.jpg';
import {
  lerEstadoPlataforma,
  salvarEstadoPlataforma,
} from '../../aplicacao/estado/estadoPlataforma';
import {
  Botao,
  Container,
  ModalConfirmacao,
  Rodape,
} from '../../compartilhado/indice';
import {
  CartaoMomento,
  VisaoAlterarMomento,
  VisaoControleConta,
  VisaoDocumentosPerfil,
  VisaoExcluirConta,
  VisaoFotoPerfil,
  VisaoInformacoesPessoais,
  VisaoMoradiaPerfil,
  VisaoNotificacoesPerfil,
  VisaoPrivacidadePerfil,
  VisaoSegurancaPerfil,
} from './componentes/SubvisoesPerfil';

export function Perfil() {
  const localizacao = useLocation();
  const navegar = useNavigate();
  const [parametros, setParametros] = useSearchParams();
  const visaoSolicitada = parametros.get('visao');
  const visao = ['controle', 'informacoes', 'foto', 'seguranca', 'momento', 'notificacoes', 'privacidade', 'moradia', 'documentos', 'excluir'].includes(visaoSolicitada)
    ? visaoSolicitada
    : '';

  const [estado, setEstado] = useState(lerEstadoPlataforma);
  const [nome, setNome] = useState(
    () => lerEstadoPlataforma().perfil?.nome || ''
  );
  const [email, setEmail] = useState(
    () => lerEstadoPlataforma().perfil?.email || ''
  );
  const [salvoResumo, setSalvoResumo] = useState(false);
  const [modalSairAberto, setModalSairAberto] = useState(false);

  const ehPreparacao =
    localizacao.pathname.startsWith('/perfil-b') ||
    estado.perfil?.momento === 'preparacao';
  const caminhoBase = localizacao.pathname.startsWith('/perfil-b')
    ? '/perfil-b'
    : '/perfil';

  const abrirVisao = proxima => {
    if (!proxima) {
      setParametros({});
      return;
    }
    setParametros({ visao: proxima });
  };

  const atualizarPerfil = campos => {
    const atual = lerEstadoPlataforma();
    const proximo = {
      ...atual,
      perfil: {
        ...atual.perfil,
        ...campos,
      },
    };
    salvarEstadoPlataforma(proximo);
    setEstado(proximo);
    if (campos.nome !== undefined) setNome(campos.nome);
    if (campos.email !== undefined) setEmail(campos.email);
  };

  const selecionarMomento = (momento, rotaDestino) => {
    const momentoRotulo =
      momento === 'preparacao' ? 'Vou morar sozinho' : 'Já moro sozinho';
    try {
      localStorage.setItem(
        'iagora:situacao-moradia',
        momento === 'preparacao' ? 'planning' : 'living-alone'
      );
    } catch (erro) {
      void erro;
    }
    atualizarPerfil({ momento, momentoRotulo });
    if (rotaDestino) {
      navegar(rotaDestino);
    }
  };

  const sairDaConta = () => {
    encerrarSessao();
    setModalSairAberto(false);
    navegar('/login', { replace: true });
  };

  const excluirContaDemo = () => {
    encerrarSessao();
    try {
      localStorage.removeItem('iagora_estado_plataforma_v1');
      localStorage.removeItem('iagora:situacao-moradia');
    } catch (erro) {
      void erro;
    }
    navegar('/login?modo=cadastro', { replace: true });
  };

  const lidarSalvarResumo = evento => {
    evento.preventDefault();
    atualizarPerfil({
      nome: nome.trim() || estado.perfil.nome,
      nomeCompleto: nome.trim() || estado.perfil.nomeCompleto,
      email: email.trim() || estado.perfil.email,
    });
    setSalvoResumo(true);
  };

  if (visao) {
    return (
      <div className='flex min-h-dvh flex-col bg-white text-(--azul-titulo)'>
        <Container como='main' classe='flex-1 py-8 sm:py-12'>
          {visao === 'controle' && (
            <VisaoControleConta
              aoVoltar={() => abrirVisao('')}
              aoAbrirVisao={abrirVisao}
              aoSair={() => setModalSairAberto(true)}
            />
          )}
          {visao === 'informacoes' && (
            <VisaoInformacoesPessoais
              perfil={estado.perfil}
              aoSalvar={atualizarPerfil}
              aoVoltar={() => abrirVisao('controle')}
              aoAbrirMomento={() => abrirVisao('momento')}
            />
          )}
          {visao === 'foto' && (
            <VisaoFotoPerfil
              perfil={estado.perfil}
              aoSalvar={atualizarPerfil}
              aoVoltar={() => abrirVisao('')}
            />
          )}
          {visao === 'seguranca' && (
            <VisaoSegurancaPerfil aoVoltar={() => abrirVisao('controle')} />
          )}
          {visao === 'momento' && (
            <VisaoAlterarMomento
              aoSelecionarMomento={selecionarMomento}
              aoVoltar={() => abrirVisao('controle')}
            />
          )}
          {visao === 'notificacoes' && (
            <VisaoNotificacoesPerfil
              perfil={estado.perfil}
              aoSalvar={atualizarPerfil}
              aoVoltar={() => abrirVisao('controle')}
            />
          )}
          {visao === 'privacidade' && (
            <VisaoPrivacidadePerfil
              perfil={estado.perfil}
              aoSalvar={atualizarPerfil}
              aoVoltar={() => abrirVisao('controle')}
            />
          )}
          {visao === 'moradia' && (
            <VisaoMoradiaPerfil
              perfil={estado.perfil}
              ehPreparacao={ehPreparacao}
              aoSalvar={atualizarPerfil}
              aoVoltar={() => abrirVisao('controle')}
            />
          )}
          {visao === 'documentos' && (
            <VisaoDocumentosPerfil
              aoAbrirPrivacidade={() => abrirVisao('privacidade')}
              aoAbrirControle={() => abrirVisao('controle')}
              aoFechar={() => abrirVisao('')}
            />
          )}
          {visao === 'excluir' && (
            <VisaoExcluirConta
              aoConfirmarExclusao={excluirContaDemo}
              aoVoltar={() => abrirVisao('controle')}
            />
          )}
        </Container>

        <ModalConfirmacao
          aberto={modalSairAberto}
          titulo='Precisa sair por agora?'
          descricao='Seu espaço estará salvo aqui quando você voltar.'
          textoConfirmar='Sair da conta'
          textoCancelar='Continuar aqui'
          aoCancelar={() => setModalSairAberto(false)}
          aoConfirmar={sairDaConta}
        />

        <Rodape />
      </div>
    );
  }

  return (
    <div className='flex min-h-dvh flex-col bg-white text-(--azul-titulo)'>
      <main className='flex-1 py-8 sm:py-12'>
        <Container classe='space-y-8'>
          <section
            aria-label='Resumo do perfil'
            className='grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-10'
          >
            <div className='flex flex-col items-center justify-between rounded-[20px] bg-[#102a43] p-7 text-center text-white'>
              <p className='self-start text-xs font-bold tracking-[0.06em] text-[#ffb591] uppercase'>
                SUA CARA, SUA HISTÓRIA
              </p>

              <div className='my-6 flex flex-col items-center'>
                <div className='flex size-40 items-center justify-center overflow-hidden rounded-full bg-white p-2 shadow-sm'>
                  {estado.perfil?.fotoUrl ? (
                    <img
                      src={estado.perfil.fotoUrl}
                      alt='Sua foto de perfil'
                      className='size-full rounded-full object-cover'
                    />
                  ) : (
                    <div className='flex size-full items-center justify-center rounded-full bg-[#fdf0ea]'>
                      <svg
                        viewBox='0 0 64 64'
                        className='size-14 text-(--laranja-principal)'
                        fill='currentColor'
                        aria-hidden='true'
                      >
                        <path d='M32 6c2 15 11 24 26 26-15 2-24 11-26 26-2-15-11-24-26-26 15-2 24-11 26-26Z' />
                      </svg>
                    </div>
                  )}
                </div>

                <h1 className='font-titulo mt-5 text-2xl font-extrabold text-white'>
                  Sua foto
                </h1>
                <p className='mt-2 max-w-[260px] text-sm leading-relaxed text-[#d8e5ee]'>
                  Um detalhe só seu. Personalize quando quiser.
                </p>
              </div>

              <button
                type='button'
                onClick={() => abrirVisao('foto')}
                className='inline-flex min-h-[50px] w-full cursor-pointer items-center justify-center rounded-full bg-[#254b68] px-6 text-sm font-bold text-white transition-colors hover:bg-[#2f5b7d]'
              >
                Adicionar foto
              </button>
            </div>

            <form
              onSubmit={lidarSalvarResumo}
              className='flex flex-col justify-center rounded-[20px] bg-(--azul-fundo) p-6 sm:p-9'
            >
              <p className='text-xs font-bold tracking-[0.06em] text-(--laranja-destaque) uppercase'>
                SUAS INFORMAÇÕES
              </p>
              <h2 className='font-titulo mt-2 text-3xl leading-tight font-extrabold text-(--azul-titulo) sm:text-4xl'>
                Tudo no seu jeito
              </h2>
              <p className='mt-2 text-base text-(--texto-apoio)'>
                Atualize os dados que aparecem na sua conta Iagora.
              </p>

              <div className='mt-7 grid gap-5 sm:grid-cols-2'>
                <div className='rounded-xl bg-white p-4'>
                  <label
                    htmlFor='perfil-nome-rapido'
                    className='block text-sm font-bold text-(--azul-titulo)'
                  >
                    Nome
                  </label>
                  <input
                    id='perfil-nome-rapido'
                    type='text'
                    value={nome}
                    onChange={e => {
                      setSalvoResumo(false);
                      setNome(e.target.value);
                    }}
                    placeholder='Como podemos te chamar?'
                    className='mt-2 h-12 w-full rounded-lg border border-[#dce5ed] bg-white px-4 text-sm text-(--azul-titulo) placeholder:text-(--texto-apoio)'
                  />
                </div>

                <div className='rounded-xl bg-white p-4'>
                  <label
                    htmlFor='perfil-email-rapido'
                    className='block text-sm font-bold text-(--azul-titulo)'
                  >
                    E-mail
                  </label>
                  <div className='relative mt-2'>
                    <input
                      id='perfil-email-rapido'
                      type='email'
                      value={email}
                      onChange={e => {
                        setSalvoResumo(false);
                        setEmail(e.target.value);
                      }}
                      placeholder='seuemail@exemplo.com'
                      className='h-12 w-full rounded-lg border border-[#dce5ed] bg-white pr-10 pl-4 text-sm text-(--azul-titulo) placeholder:text-(--texto-apoio)'
                    />

                  </div>
                </div>
              </div>

              <div className='mt-5 rounded-xl border-l-4 border-(--laranja-destaque) bg-white px-5 py-4 text-sm text-(--texto-apoio)'>
                Seus dados ficam no seu perfil e podem ser atualizados.
              </div>

              <div className='mt-6 flex flex-wrap items-center gap-4'>
                <Botao type='submit' cor='laranja' classe='px-8!'>
                  Salvar alterações
                </Botao>
                <p className='text-xs text-(--texto-apoio)'>
                  {salvoResumo
                    ? 'Alterações salvas localmente no seu perfil.'
                    : 'Informações ilustrativas • nada foi alterado na sua conta.'}
                </p>
              </div>
            </form>
          </section>

          <section
            aria-labelledby='titulo-momento-perfil'
            className='rounded-[20px] bg-[#102a43] p-6 text-white sm:p-8'
          >
            <p className='text-xs font-bold tracking-[0.06em] text-[#ffb591] uppercase'>
              PERSONALIZE SUA JORNADA
            </p>
            <h2
              id='titulo-momento-perfil'
              className='font-titulo mt-2 text-3xl leading-tight font-extrabold text-white sm:text-4xl'
            >
              Em que momento você tá?
            </h2>
            <p className='mt-2 text-sm text-[#dce8f2] sm:text-base'>
              Você pode mudar essa escolha depois. O Iagora acompanha seu ritmo.
            </p>

            <div className='mt-8 grid gap-8 md:grid-cols-2 lg:gap-12'>
              <CartaoMomento
                titulo='Quero morar sozinho'
                descricao='Planejar os gastos, encontrar uma casa e se preparar para a mudança.'
                imagem={fotoQueroMorar}
                alt='Pessoa organizando caixas da mudança em um apartamento claro'
                destaquePessego
                selecionado={ehPreparacao}
                aoClicar={() => selecionarMomento('preparacao', '/perfil-b')}
              />
              <CartaoMomento
                titulo='Já moro sozinho'
                descricao='Manter a casa, organizar a rotina e resolver problemas do dia a dia.'
                imagem={fotoJaMoro}
                alt='Pessoa cozinhando em uma cozinha luminosa e organizada'
                selecionado={!ehPreparacao}
                aoClicar={() => selecionarMomento('morando', '/perfil')}
              />
            </div>

            <p className='mt-6 text-xs text-[#bed1e0]'>
              A escolha mostrada aqui pode ser alternada sempre que seu momento
              mudar.
            </p>
          </section>

          <section
            aria-labelledby='titulo-conta-controle'
            className='grid items-end gap-6 pt-2 lg:grid-cols-2'
          >
            <div className='space-y-4'>
              <p className='text-xs font-bold tracking-[0.06em] text-(--laranja-destaque) uppercase'>
                CUIDE DO SEU CANTINHO
              </p>
              <button
                type='button'
                onClick={() => abrirVisao('controle')}
                className='font-titulo cursor-pointer text-left text-3xl font-extrabold text-(--azul-titulo) hover:text-(--laranja-principal) sm:text-4xl'
              >
                Sua conta, sob seu controle
              </button>

              <div className='flex flex-wrap items-center justify-between gap-4 rounded-xl bg-(--azul-fundo) px-6 py-5'>
                <div>
                  <h3 className='font-titulo text-xl font-extrabold text-(--azul-titulo)'>
                    Senha e acesso
                  </h3>
                  <p className='mt-1 text-sm text-(--texto-apoio)'>
                    Gerencie como você entra no Iagora.
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => abrirVisao('controle')}
                  className='cursor-pointer text-sm font-bold text-(--laranja-destaque) hover:underline'
                >
                  Gerenciar acesso
                </button>
              </div>
            </div>

            <div className='flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#fff0e7] px-6 py-5'>
              <div>
                <h3 className='font-titulo text-xl font-extrabold text-(--azul-titulo)'>
                  Precisa sair por agora?
                </h3>
                <p className='mt-1 text-sm text-(--texto-apoio)'>
                  Seu espaço estará aqui quando voltar.
                </p>
              </div>
              <div className='flex items-center gap-4'>
                <Link
                  to={`${caminhoBase}?visao=documentos`}
                  className='text-xs font-bold text-(--azul-titulo) hover:underline'
                >
                  Privacidade e termos
                </Link>
                <button
                  type='button'
                  onClick={() => setModalSairAberto(true)}
                  className='cursor-pointer text-sm font-bold text-(--laranja-destaque) hover:underline'
                >
                  Sair da conta
                </button>
              </div>
            </div>
          </section>
        </Container>
      </main>

      <ModalConfirmacao
        aberto={modalSairAberto}
        titulo='Precisa sair por agora?'
        descricao='Seu espaço estará salvo aqui quando você voltar.'
        textoConfirmar='Sair da conta'
        textoCancelar='Continuar aqui'
        aoCancelar={() => setModalSairAberto(false)}
        aoConfirmar={sairDaConta}
      />

      <Rodape />
    </div>
  );
}

export default Perfil;
