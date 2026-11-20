import { useBancoMvp } from '../../app/dados/bancoMvp';
import { selecionarContaEmpresaLocal } from '../empresa/empresaDados';
import { acessoLocal } from '../../app/dados/acessoLocal';
import { useCallback, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff, House } from 'lucide-react';
import logoLaranja from '../../shared/assets/logoLaranja.png';
import fotoProfissional from '../empresa/assets/ServiceCover.png';
import { Botao } from '../../shared/index';
import { contaApi, salvarSessao } from '../../app/dados/contaApi';
import fotoChaveiro from './assets/autenticacao-chaveiro.png';
import EntrarComGoogle from './components/EntrarComGoogle';
import { regrasSenha } from './content';
import './auth.css';

const textos = {
  login: [
    'Entre no IAgora',
    'Use seu e-mail e sua senha para acessar sua conta.',
  ],
  cadastro: [
    'Crie sua conta',
    'Crie seu acesso agora e complete seu perfil depois.',
  ],
  recuperar: [
    'Recuperar senha',
    'Informe o e-mail da sua conta para receber as instruções.',
  ],
  'nova-senha': [
    'Defina sua nova senha',
    'Escolha uma nova senha para voltar a acessar sua conta.',
  ],
};

export function Autenticacao() {
  const [params] = useSearchParams();
  return <FormularioAcesso key={params.toString()} params={params} />;
}

function FormularioAcesso({ params }) {
  const navegar = useNavigate();
  const { b } = useBancoMvp();
  const token = params.get('token');
  const modo = token
    ? 'nova-senha'
    : ['cadastro', 'recuperar'].includes(params.get('modo'))
      ? params.get('modo')
      : 'login';
  const cadastro = modo === 'cadastro';
  const empresa = cadastro && params.get('perfil') === 'empresa';
  const entradaLocal = acessoLocal && (cadastro || modo === 'login');
  const recuperacao = modo === 'recuperar';
  const redefinicao = modo === 'nova-senha';
  const [mostrar, setMostrar] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [entrada, setEntrada] = useState(null);
  const [vinculoGoogle, setVinculoGoogle] = useState(null);
  const requisicao = useRef(false);
  const [titulo, descricao] = textos[modo];
  const conta = empresa ? 'empresa' : 'pessoal';

  const rota = (proximoModo, perfil = conta) => {
    const query = new URLSearchParams();
    if (proximoModo !== 'login') query.set('modo', proximoModo);
    if (proximoModo === 'cadastro' && perfil === 'empresa')
      query.set('perfil', 'empresa');
    return query.size ? '/login?' + query.toString() : '/login';
  };

  const entrar = useCallback(
    (sessao, novaConta = false) => {
      salvarSessao({ ...sessao, cadastroPendente: novaConta });
      const profissional = sessao.tipo === 2;
      let destino = profissional ? '/empresa' : '/home';
      if (novaConta) {
        destino = profissional ? '/cadastro/dados-da-empresa' : '/cadastro/moradia';
      }
      navegar(destino, {
        replace: true,
      });
    },
    [navegar]
  );

  const entrarComGoogle = useCallback(
    async (credential, senha) => {
      if (requisicao.current) return;
      requisicao.current = true;
      setErro('');
      setCarregando(true);
      try {
        const sessao = await contaApi('/user/login/google', {
          metodo: 'POST',
          dados: {
            credential,
            ...(senha && { senha }),
            ...(cadastro && { tipo: empresa ? 2 : 1 }),
          },
        });
        entrar(sessao, sessao.novaConta);
      } catch (falha) {
        if (falha.status === 409 && !senha) setVinculoGoogle(credential);
        else setErro(falha.message);
      } finally {
        requisicao.current = false;
        setCarregando(false);
      }
    },
    [cadastro, empresa, entrar, setErro, setVinculoGoogle]
  );

  async function enviar(evento) {
    evento.preventDefault();
    if (entradaLocal) {
      const email = String(new FormData(evento.currentTarget).get('email') ?? '').trim().toLowerCase();
      if (!cadastro && selecionarContaEmpresaLocal(b, email)) {
        navegar('/empresa', { replace: true });
        return;
      }
      navegar(
        cadastro
          ? empresa
            ? '/cadastro/dados-da-empresa'
            : '/cadastro/moradia'
          : '/home',
        {
          replace: true,
          state: { email },
        }
      );
      return;
    }
    if (requisicao.current) return;
    requisicao.current = true;
    const dados = new FormData(evento.currentTarget);
    const email = String(dados.get('email') ?? '')
      .trim()
      .toLowerCase();
    const senha = String(dados.get('senha') ?? '');
    setErro('');
    setAviso('');
    setCarregando(true);
    try {
      if (cadastro || redefinicao) {
        if (!regrasSenha.every(regra => regra.validar(senha)))
          throw new Error(
            'Use ao menos 8 caracteres, incluindo letras, números e um símbolo.'
          );
        if (senha !== dados.get('confirmacao'))
          throw new Error('As senhas precisam ser iguais.');
      }
      if (recuperacao) {
        await contaApi('/user/forgot-password', {
          metodo: 'POST',
          dados: { email },
        });
        setAviso(
          'Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.'
        );
      } else if (redefinicao) {
        await contaApi('/user/reset-password', {
          metodo: 'POST',
          dados: { token, novaSenha: senha },
        });
        setAviso('Senha atualizada. Você já pode entrar na plataforma.');
      } else {
        if (cadastro && !entrada) {
          await contaApi('/user/register', {
            metodo: 'POST',
            dados: { email, senha, tipo: empresa ? 2 : 1 },
          });
          setEntrada(email);
        }
        const sessao = await contaApi('/user/login', {
          metodo: 'POST',
          dados: { email, senha },
        });
        entrar(sessao, cadastro);
      }
    } catch (falha) {
      setErro(falha.message);
    } finally {
      requisicao.current = false;
      setCarregando(false);
    }
  }

  return (
    <div className='acesso-pagina'>
      <div className='acesso-conjunto'>
        <header className='acesso-topo'>
          <Link to='/' aria-label='Página inicial do IAgora'>
            <img src={logoLaranja} alt='IAgora' />
          </Link>
          <Link to='/' className='acesso-link acesso-voltar'>
            <House size={17} aria-hidden='true' /> Página inicial
          </Link>
        </header>
        <main className='acesso-grade'>
          <section
            className='acesso-formulario'
            aria-labelledby='titulo-acesso'
          >
            {cadastro && (
              <nav className='acesso-modos' aria-label='Tipo de conta'>
                <Link
                  to={rota(modo, 'pessoal')}
                  aria-current={!empresa ? 'page' : undefined}
                >
                  Pessoal
                </Link>
                <Link
                  to={rota(modo, 'empresa')}
                  aria-current={empresa ? 'page' : undefined}
                >
                  Empresa
                </Link>
              </nav>
            )}
            <h1 id='titulo-acesso'>{titulo}</h1>
            <p>
              {entradaLocal
                ? 'Acesso local disponível sem e-mail ou senha.'
                : descricao}
            </p>
            {entrada && (
              <p role='status'>
                Conta criada. Entre com a senha para continuar.
              </p>
            )}
            {!aviso || recuperacao ? (
              <form
                className='acesso-campos'
                onSubmit={enviar}
                noValidate={entradaLocal}
              >
                {!redefinicao && (
                  <label>
                    E-mail {empresa ? 'da empresa' : ''}
                    <input
                      name='email'
                      type='email'
                      autoComplete='email'
                      maxLength={255}
                      required
                      readOnly={Boolean(entrada)}
                    />
                  </label>
                )}
                {!recuperacao && (
                  <label>
                    Senha
                    <span className='acesso-senha'>
                      <input
                        name='senha'
                        type={mostrar ? 'text' : 'password'}
                        autoComplete={
                          cadastro || redefinicao
                            ? 'new-password'
                            : 'current-password'
                        }
                        required
                      />
                      <button
                        type='button'
                        onClick={() => setMostrar(!mostrar)}
                        aria-label={mostrar ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {mostrar ? <EyeOff size={19} /> : <Eye size={19} />}
                      </button>
                    </span>
                  </label>
                )}
                {(cadastro || redefinicao) && (
                  <>
                    <label>
                      Confirme a senha
                      <input
                        name='confirmacao'
                        type={mostrar ? 'text' : 'password'}
                        autoComplete='new-password'
                        required
                      />
                    </label>
                    <p>
                      Use ao menos 8 caracteres, com letras, números e um
                      símbolo.
                    </p>
                  </>
                )}
                {cadastro && !entrada && (
                  <label className='acesso-termos'>
                    <input type='checkbox' name='termos' required />
                    <span>
                      Li os <Link to='/termos'>Termos de Uso</Link> e a{' '}
                      <Link to='/privacidade'>Política de Privacidade</Link>.
                    </span>
                  </label>
                )}
                {erro && !vinculoGoogle && (
                  <p role='alert' className='text-(--vermelho-alerta)'>
                    {erro}
                  </p>
                )}
                {aviso && <p role='status'>{aviso}</p>}
                <Botao
                  type='submit'
                  disabled={carregando}
                  classe='w-full disabled:opacity-60'
                >
                  {entradaLocal
                    ? cadastro
                      ? 'Continuar'
                      : 'Acessar plataforma'
                    : carregando
                      ? 'Aguarde…'
                      : entrada
                        ? 'Entrar'
                        : cadastro
                          ? 'Criar conta'
                          : recuperacao
                            ? 'Enviar instruções'
                            : redefinicao
                              ? 'Salvar nova senha'
                              : 'Entrar'}
                </Botao>
              </form>
            ) : (
              <p role='status' className='mt-4'>
                {aviso}
              </p>
            )}
            {(modo === 'login' || cadastro) &&
              !acessoLocal &&
              (vinculoGoogle ? (
                <form
                  className='acesso-campos'
                  aria-label='Vincular conta Google'
                  onSubmit={evento => {
                    evento.preventDefault();
                    const senha = new FormData(evento.currentTarget).get(
                      'vinculo-senha'
                    );
                    entrarComGoogle(vinculoGoogle, senha);
                  }}
                >
                  <p>
                    Confirme a senha da sua conta IAgora para vincular o Google.
                  </p>
                  <label>
                    Senha da conta IAgora
                    <input
                      name='vinculo-senha'
                      type='password'
                      autoComplete='current-password'
                      required
                    />
                  </label>
                  {erro && (
                    <p role='alert' className='text-(--vermelho-alerta)'>
                      {erro}
                    </p>
                  )}
                  <div className='flex flex-wrap gap-2'>
                    <Botao type='submit' disabled={carregando}>
                      Vincular e entrar
                    </Botao>
                    <Botao
                      type='button'
                      variante='contorno'
                      onClick={() => {
                        setVinculoGoogle(null);
                        setErro('');
                      }}
                    >
                      Cancelar
                    </Botao>
                  </div>
                </form>
              ) : (
                <EntrarComGoogle
                  cadastro={cadastro}
                  aoReceber={entrarComGoogle}
                  bloqueado={carregando}
                />
              ))}
            <div className='acesso-rodape-form'>
              {modo === 'login' ? (
                <>
                  <Link
                    to={rota('cadastro')}
                    className='acesso-acao-secundaria'
                  >
                    Criar conta <ArrowRight size={16} aria-hidden='true' />
                  </Link>
                  <Link to={rota('recuperar')}>Esqueci a senha</Link>
                </>
              ) : (
                <Link to={rota('login')} className='acesso-voltar'>
                  <ArrowLeft size={16} aria-hidden='true' /> Voltar ao login
                </Link>
              )}
            </div>
          </section>
          <aside
            className='acesso-vitrine'
            aria-label={
              empresa ? 'IAgora para empresas' : 'Seu canto no IAgora'
            }
          >
            <div className='acesso-vitrine-visual' aria-hidden='true'>
              {empresa ? (
                <img
                  src={fotoProfissional}
                  alt=''
                  className='acesso-vitrine-foto'
                />
              ) : (
                <img
                  src={fotoChaveiro}
                  alt=''
                  className='acesso-vitrine-chaveiro'
                />
              )}
            </div>
            <div className='acesso-vitrine-textos'>
              <div aria-hidden={empresa}>
                <h2>Tudo para cuidar do seu canto</h2>
                <p>
                  Planeje a mudança, organize tarefas e acompanhe as contas da
                  casa.
                </p>
              </div>
              <div aria-hidden={!empresa}>
                <h2>Divulgue seus serviços</h2>
                <p>
                  Complete o perfil da empresa para anunciar e receber contatos
                  de clientes.
                </p>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
