import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Eye, EyeOff, Mail } from 'lucide-react';
import logoLaranja from '../../ativos/imagens/marcas/logo-iagora-laranja.png';
import iconeGoogle from '../../ativos/imagens/marcas/icone-google.png';
import confirmacaoImg from '../../ativos/imagens/ilustracoes/autenticacao-confirmacao.png';
import { Botao, SeloEditorial } from '../../compartilhado/indice';
import {
  lerEstadoPlataforma,
  salvarEstadoPlataforma,
} from '../../aplicacao/estado/estadoPlataforma';
import { EmblemaChaveiro } from './componentes/EmblemaChaveiro';
import { etapasAutenticacao, regrasSenha } from './conteudo';

function lerEmailLembrado(tipoPerfil) {
  const chave =
    tipoPerfil === 'empresa'
      ? 'iagora:empresa-email-lembrado'
      : 'iagora:email-lembrado';
  try {
    return localStorage.getItem(chave) || '';
  } catch {
    return '';
  }
}

function gravarEmailLembrado(email, lembrar, tipoPerfil) {
  const chave =
    tipoPerfil === 'empresa'
      ? 'iagora:empresa-email-lembrado'
      : 'iagora:email-lembrado';
  try {
    if (lembrar && email) {
      localStorage.setItem(chave, email);
    } else {
      localStorage.removeItem(chave);
    }
  } catch (erro) {
    void erro;
  }
}

function mapearModoParametro(modoParam) {
  if (modoParam === 'cadastro') return 'cadastro';
  if (modoParam === 'recuperar') return 'recuperar';
  if (modoParam === 'verificar') return 'verificar';
  if (modoParam === 'nova-senha') return 'novaSenha';
  if (modoParam === 'sucesso') return 'sucesso';
  return 'login';
}

export function Autenticacao() {
  const navegar = useNavigate();
  const [parametros, setParametros] = useSearchParams();
  const tipoPerfil =
    parametros.get('perfil') === 'empresa' ? 'empresa' : 'pessoal';
  const modo = mapearModoParametro(parametros.get('modo'));

  const [origemFluxo, setOrigemFluxo] = useState('cadastro');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState(() => lerEmailLembrado(tipoPerfil));
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [lembrar, setLembrar] = useState(() =>
    Boolean(lerEmailLembrado(tipoPerfil))
  );
  const [aceitouTermos, setAceitouTermos] = useState(true);
  const [codigo, setCodigo] = useState(['1', '', '', '', '', '']);
  const [segundosReenvio, setSegundosReenvio] = useState(59);
  const [modalEmailEnviado, setModalEmailEnviado] = useState(false);
  const [erroFormulario, setErroFormulario] = useState('');
  const referenciasOtp = useRef([]);

  useEffect(() => {
    if (modo !== 'verificar' || segundosReenvio <= 0) return undefined;
    const temporizador = setInterval(() => {
      setSegundosReenvio(anterior => (anterior > 0 ? anterior - 1 : 0));
    }, 1000);
    return () => clearInterval(temporizador);
  }, [modo, segundosReenvio]);

  const chaveTexto =
    modo === 'login' && tipoPerfil === 'empresa' ? 'loginEmpresa' : modo;
  const cabecalhoAtual = etapasAutenticacao[chaveTexto];

  const atualizarUrl = (proximoModo, proximoPerfil = tipoPerfil) => {
    setErroFormulario('');
    setParametros(
      anterior => {
        const proximo = new URLSearchParams(anterior);
        if (proximoPerfil === 'empresa') proximo.set('perfil', 'empresa');
        else proximo.delete('perfil');

        if (proximoModo === 'login') proximo.delete('modo');
        else if (proximoModo === 'novaSenha') proximo.set('modo', 'nova-senha');
        else proximo.set('modo', proximoModo);
        return proximo;
      },
      { replace: true }
    );
  };

  const concluirAcesso = (destinoEspecifico = '') => {
    gravarEmailLembrado(email, lembrar, tipoPerfil);
    const estadoAtual = lerEstadoPlataforma();
    const primeiroNome = nomeCompleto.trim().split(' ')[0] || estadoAtual.perfil.nome;
    salvarEstadoPlataforma({
      ...estadoAtual,
      perfil: {
        ...estadoAtual.perfil,
        nome: primeiroNome,
        nomeCompleto: nomeCompleto.trim() || estadoAtual.perfil.nomeCompleto,
        email: email.trim() || estadoAtual.perfil.email,
      },
    });
    if (destinoEspecifico) {
      navegar(destinoEspecifico);
      return;
    }
    if (tipoPerfil === 'empresa') {
      navegar('/empresa');
      return;
    }
    const momentoSalvo = localStorage.getItem('iagora:situacao-moradia');
    navegar(
      ['planning', 'preparacao'].includes(momentoSalvo) ? '/home-b' : '/home'
    );
  };

  const lidarLogin = evento => {
    evento.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErroFormulario('Informe um endereço de e-mail válido.');
      return;
    }
    if (senha.length < 4) {
      setErroFormulario('Digite sua senha para continuar.');
      return;
    }
    concluirAcesso();
  };

  const lidarCadastro = evento => {
    evento.preventDefault();
    if (nomeCompleto.trim().length < 2) {
      setErroFormulario('Informe seu nome completo.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErroFormulario('Informe um e-mail válido.');
      return;
    }
    if (!regrasSenha.every(regra => regra.validar(senha))) {
      setErroFormulario(
        'A senha precisa atender aos três critérios de segurança.'
      );
      return;
    }
    if (!aceitouTermos) {
      setErroFormulario(
        'Aceite os Termos de Uso e a Política de Privacidade para continuar.'
      );
      return;
    }
    setOrigemFluxo('cadastro');
    setSegundosReenvio(59);
    atualizarUrl('verificar');
  };

  const lidarRecuperar = evento => {
    evento.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErroFormulario('Informe um endereço de e-mail válido.');
      return;
    }
    setOrigemFluxo('recuperar');
    setModalEmailEnviado(true);
  };

  const lidarVerificarCodigo = evento => {
    evento.preventDefault();
    if (codigo.join('').length < 6) {
      setErroFormulario('Digite os 6 dígitos do código de verificação.');
      return;
    }
    if (origemFluxo === 'recuperar') {
      atualizarUrl('novaSenha');
      return;
    }
    atualizarUrl('sucesso');
  };

  const lidarSalvarNovaSenha = evento => {
    evento.preventDefault();
    if (!regrasSenha.every(regra => regra.validar(senha))) {
      setErroFormulario(
        'A nova senha precisa atender aos critérios de segurança.'
      );
      return;
    }
    if (senha !== confirmarSenha) {
      setErroFormulario('As senhas digitadas não coincidem.');
      return;
    }
    atualizarUrl('sucesso');
  };

  const alterarDigitoCodigo = (indice, valor) => {
    const apenasDigito = valor.replace(/\D/g, '').slice(-1);
    const proximo = [...codigo];
    proximo[indice] = apenasDigito;
    setCodigo(proximo);
    if (apenasDigito && indice < 5) {
      referenciasOtp.current[indice + 1]?.focus();
    }
  };

  return (
    <div className='min-h-dvh bg-white text-(--azul-titulo)'>
      <header className='mx-auto flex w-full max-w-[1440px] items-center justify-between px-(--margem-pagina) py-6'>
        <Link
          to='/'
          aria-label='Voltar para a página inicial Iagora'
          className='inline-flex items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--laranja-principal)'
        >
          <img
            src={logoLaranja}
            alt='IAgora'
            className='h-9 w-auto object-contain sm:h-11'
          />
        </Link>
        <p className='text-xs font-semibold tracking-[0.08em] text-(--texto-apoio) uppercase'>
          {cabecalhoAtual.migalha}
        </p>
      </header>

      {modo === 'sucesso' ? (
        <main className='mx-auto flex min-h-[calc(100dvh-110px)] max-w-[1440px] flex-col items-center justify-center px-(--margem-pagina) py-10 text-center'>
          <div className='relative flex size-48 items-center justify-center sm:size-56'>
            <div className='size-[82%] rounded-full bg-(--laranja-principal)' />
            <img
              src={confirmacaoImg}
              alt='Ícone de confirmação de acesso'
              className='absolute inset-0 size-full object-contain drop-shadow-md'
            />
          </div>
          <h1 className='font-titulo mt-6 text-4xl font-extrabold text-(--azul-titulo) sm:text-5xl'>
            {cabecalhoAtual.titulo}
          </h1>
          <p className='mt-3 max-w-[460px] text-base leading-relaxed text-(--texto-apoio)'>
            {cabecalhoAtual.subtitulo}
          </p>
          <div className='mt-8'>
            <Botao
              type='button'
              cor='laranja'
              onClick={() =>
                concluirAcesso(
                  tipoPerfil === 'empresa'
                    ? '/empresa'
                    : origemFluxo === 'cadastro'
                      ? '/onboarding'
                      : ''
                )
              }
              classe='px-10!'
            >
              Ir para o meu cantinho
            </Botao>
          </div>
        </main>
      ) : (
        <main className='mx-auto grid min-h-[calc(100dvh-110px)] w-full max-w-[1440px] items-center gap-12 px-(--margem-pagina) py-8 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] lg:gap-16 lg:py-12'>
          <section aria-labelledby='titulo-autenticacao' className='min-w-0'>
            <p className='text-xs font-bold tracking-[0.06em] text-(--laranja-principal) uppercase'>
              {cabecalhoAtual.selo}
            </p>
            <h1
              id='titulo-autenticacao'
              className='font-titulo mt-2 text-[clamp(2rem,3.6vw,3rem)] leading-[1.08] font-extrabold text-(--azul-titulo)'
            >
              {cabecalhoAtual.titulo}
            </h1>
            <p className='mt-3 text-base leading-relaxed text-(--texto-apoio)'>
              {cabecalhoAtual.subtitulo}
            </p>

            {(modo === 'login' || modo === 'cadastro') && (
              <div
                role='group'
                aria-label='Tipo de perfil'
                className='mt-6 grid grid-cols-2 gap-1 rounded-xl bg-(--azul-fundo) p-1'
              >
                {[
                  { id: 'pessoal', rotulo: 'Pessoal' },
                  { id: 'empresa', rotulo: 'Empresa' },
                ].map(item => (
                  <button
                    key={item.id}
                    type='button'
                    aria-pressed={tipoPerfil === item.id}
                    onClick={() => {
                      if (item.id === 'empresa' && modo === 'cadastro') {
                        navegar('/empresa/cadastro');
                        return;
                      }
                      atualizarUrl(modo, item.id);
                    }}
                    className={`min-h-10 cursor-pointer rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                      tipoPerfil === item.id
                        ? 'bg-(--azul-titulo) text-white'
                        : 'text-(--texto-apoio) hover:bg-white'
                    }`}
                  >
                    {item.rotulo}
                  </button>
                ))}
              </div>
            )}

            {modo === 'login' && (
              <div className='mt-6 space-y-5'>
                <button
                  type='button'
                  onClick={() => concluirAcesso()}
                  className='flex min-h-[50px] w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-(--borda-suave) bg-white px-4 font-bold text-(--azul-titulo) transition-colors hover:bg-(--azul-fundo)'
                >
                  <img
                    src={iconeGoogle}
                    alt=''
                    className='size-5 object-contain'
                  />
                  Continuar com Google
                </button>

                <div className='flex items-center gap-3 text-xs text-(--texto-apoio)'>
                  <span className='h-px flex-1 bg-(--borda-suave)' />
                  <span>ou com e-mail</span>
                  <span className='h-px flex-1 bg-(--borda-suave)' />
                </div>

                <form onSubmit={lidarLogin} noValidate className='space-y-4'>
                  <div className='flex flex-col gap-2'>
                    <label
                      htmlFor='email-login'
                      className='text-sm font-bold text-(--azul-titulo)'
                    >
                      {tipoPerfil === 'empresa' ? 'E-mail comercial' : 'E-mail'}
                    </label>
                    <input
                      id='email-login'
                      type='email'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder='seu@email.com'
                      autoComplete='email'
                      className='h-[50px] w-full rounded-xl border border-(--borda-suave) bg-white px-4 text-base text-(--azul-titulo) placeholder:text-(--texto-apoio)'
                    />
                  </div>

                  <div className='flex flex-col gap-2'>
                    <label
                      htmlFor='senha-login'
                      className='text-sm font-bold text-(--azul-titulo)'
                    >
                      Senha
                    </label>
                    <div className='relative'>
                      <input
                        id='senha-login'
                        type={mostrarSenha ? 'text' : 'password'}
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        placeholder='••••••••••'
                        autoComplete='current-password'
                        className='h-[50px] w-full rounded-xl border border-(--borda-suave) bg-white pr-12 pl-4 text-base text-(--azul-titulo) placeholder:text-(--texto-apoio)'
                      />
                      <button
                        type='button'
                        onClick={() => setMostrarSenha(v => !v)}
                        aria-label={
                          mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'
                        }
                        className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-1.5 text-(--texto-apoio) hover:text-(--azul-titulo)'
                      >
                        {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className='flex flex-wrap items-center justify-between gap-2 text-sm'>
                    <label className='inline-flex cursor-pointer items-center gap-2 text-(--azul-titulo)'>
                      <input
                        type='checkbox'
                        checked={lembrar}
                        onChange={e => setLembrar(e.target.checked)}
                        className='size-4 accent-(--laranja-principal)'
                      />
                      Lembrar de mim
                    </label>
                    <button
                      type='button'
                      onClick={() => atualizarUrl('recuperar')}
                      className='cursor-pointer font-bold text-(--laranja-principal) hover:underline'
                    >
                      Esqueci a senha
                    </button>
                  </div>

                  {erroFormulario && (
                    <p
                      role='alert'
                      className='text-sm font-semibold text-(--vermelho-alerta)'
                    >
                      {erroFormulario}
                    </p>
                  )}

                  <Botao type='submit' cor='laranja' classe='w-full! min-h-[52px]!'>
                    {tipoPerfil === 'empresa'
                      ? 'Entrar no painel →'
                      : 'Entrar no meu cantinho →'}
                  </Botao>
                </form>

                <p className='text-center text-sm text-(--texto-apoio)'>
                  {tipoPerfil === 'empresa'
                    ? 'Ainda não cadastrou sua empresa?'
                    : 'Ainda não tem conta?'}{' '}
                  {tipoPerfil === 'empresa' ? (
                    <Link
                      to='/empresa/cadastro'
                      className='font-bold text-(--laranja-principal) hover:underline'
                    >
                      Cadastrar empresa →
                    </Link>
                  ) : (
                    <button
                      type='button'
                      onClick={() => atualizarUrl('cadastro')}
                      className='cursor-pointer font-bold text-(--laranja-principal) hover:underline'
                    >
                      Criar conta →
                    </button>
                  )}
                </p>
              </div>
            )}

            {modo === 'cadastro' && (
              <form
                onSubmit={lidarCadastro}
                noValidate
                className='mt-6 space-y-4'
              >
                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='nome-cadastro'
                    className='text-sm font-bold text-(--azul-titulo)'
                  >
                    Nome completo
                  </label>
                  <input
                    id='nome-cadastro'
                    type='text'
                    value={nomeCompleto}
                    onChange={e => setNomeCompleto(e.target.value)}
                    placeholder='Seu nome'
                    className='h-[50px] w-full rounded-xl border border-(--borda-suave) bg-white px-4 text-base text-(--azul-titulo)'
                  />
                </div>

                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='email-cadastro'
                    className='text-sm font-bold text-(--azul-titulo)'
                  >
                    E-mail
                  </label>
                  <input
                    id='email-cadastro'
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder='seu@email.com'
                    autoComplete='email'
                    className='h-[50px] w-full rounded-xl border border-(--borda-suave) bg-white px-4 text-base text-(--azul-titulo)'
                  />
                </div>

                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='senha-cadastro'
                    className='text-sm font-bold text-(--azul-titulo)'
                  >
                    Senha
                  </label>
                  <div className='relative'>
                    <input
                      id='senha-cadastro'
                      type={mostrarSenha ? 'text' : 'password'}
                      value={senha}
                      onChange={e => setSenha(e.target.value)}
                      placeholder='Crie uma senha segura'
                      autoComplete='new-password'
                      className='h-[50px] w-full rounded-xl border border-(--borda-suave) bg-white pr-12 pl-4 text-base text-(--azul-titulo)'
                    />
                    <button
                      type='button'
                      onClick={() => setMostrarSenha(v => !v)}
                      aria-label={
                        mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'
                      }
                      className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-1.5 text-(--texto-apoio)'
                    >
                      {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className='space-y-1.5 pt-1 text-sm'>
                  <p className='font-bold text-(--azul-titulo)'>
                    Sua senha deve conter:
                  </p>
                  {regrasSenha.map(regra => {
                    const atendida = regra.validar(senha);
                    return (
                      <p
                        key={regra.id}
                        className={`flex items-center gap-2 ${
                          atendida
                            ? 'font-semibold text-(--verde-sucesso)'
                            : 'text-(--texto-apoio)'
                        }`}
                      >
                        <Check size={15} aria-hidden='true' />
                        {regra.rotulo}
                      </p>
                    );
                  })}
                </div>

                <label className='flex cursor-pointer items-center gap-2.5 pt-1 text-sm text-(--azul-titulo)'>
                  <input
                    type='checkbox'
                    checked={aceitouTermos}
                    onChange={e => setAceitouTermos(e.target.checked)}
                    className='size-4 accent-(--laranja-principal)'
                  />
                  <span>
                    Li e aceito os{' '}
                    <Link
                      to='/termos'
                      className='font-semibold underline hover:text-(--laranja-principal)'
                    >
                      Termos de Uso
                    </Link>{' '}
                    e a{' '}
                    <Link
                      to='/privacidade'
                      className='font-semibold underline hover:text-(--laranja-principal)'
                    >
                      Política de Privacidade
                    </Link>
                  </span>
                </label>

                {erroFormulario && (
                  <p
                    role='alert'
                    className='text-sm font-semibold text-(--vermelho-alerta)'
                  >
                    {erroFormulario}
                  </p>
                )}

                <Botao type='submit' cor='laranja' classe='w-full! min-h-[52px]!'>
                  Criar minha conta →
                </Botao>

                <p className='text-center text-sm text-(--texto-apoio)'>
                  Já tem uma conta?{' '}
                  <button
                    type='button'
                    onClick={() => atualizarUrl('login')}
                    className='cursor-pointer font-bold text-(--laranja-principal) hover:underline'
                  >
                    Entrar agora →
                  </button>
                </p>
              </form>
            )}

            {modo === 'recuperar' && (
              <form
                onSubmit={lidarRecuperar}
                noValidate
                className='mt-6 space-y-5'
              >
                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='email-recuperar'
                    className='text-sm font-bold text-(--azul-titulo)'
                  >
                    E-mail
                  </label>
                  <input
                    id='email-recuperar'
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder='seu@email.com'
                    className='h-[50px] w-full rounded-xl border border-(--borda-suave) bg-white px-4 text-base text-(--azul-titulo)'
                  />
                </div>

                {erroFormulario && (
                  <p
                    role='alert'
                    className='text-sm font-semibold text-(--vermelho-alerta)'
                  >
                    {erroFormulario}
                  </p>
                )}

                <Botao type='submit' cor='laranja' classe='w-full! min-h-[52px]!'>
                  Enviar instruções →
                </Botao>

                <button
                  type='button'
                  onClick={() => atualizarUrl('login')}
                  className='inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-(--azul-titulo) hover:text-(--laranja-principal)'
                >
                  ← Voltar para o login
                </button>
              </form>
            )}

            {modo === 'verificar' && (
              <form
                onSubmit={lidarVerificarCodigo}
                noValidate
                className='mt-6 space-y-5'
              >
                <div className='flex items-center justify-between gap-3 rounded-xl bg-(--azul-fundo) px-4 py-3'>
                  <div className='flex items-center gap-2.5 truncate text-sm text-(--azul-titulo)'>
                    <Mail
                      size={16}
                      className='shrink-0 text-(--texto-apoio)'
                      aria-hidden='true'
                    />
                    <span className='truncate'>
                      {email.trim() || 'seu@email.com'}
                    </span>
                  </div>
                  <button
                    type='button'
                    onClick={() =>
                      atualizarUrl(
                        origemFluxo === 'recuperar' ? 'recuperar' : 'cadastro'
                      )
                    }
                    className='shrink-0 cursor-pointer text-xs font-bold text-(--laranja-principal) hover:underline'
                  >
                    Alterar
                  </button>
                </div>

                <div>
                  <p className='text-sm font-bold text-(--azul-titulo)'>
                    Código de verificação
                  </p>
                  <div className='mt-2.5 grid grid-cols-6 gap-2.5'>
                    {codigo.map((digito, indice) => (
                      <input
                        key={indice}
                        ref={el => {
                          referenciasOtp.current[indice] = el;
                        }}
                        type='text'
                        inputMode='numeric'
                        maxLength={1}
                        aria-label={`Dígito ${indice + 1} do código`}
                        value={digito}
                        onChange={e => alterarDigitoCodigo(indice, e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Backspace' && !digito && indice > 0) {
                            referenciasOtp.current[indice - 1]?.focus();
                          }
                        }}
                        className={`h-14 w-full rounded-xl border text-center text-lg font-bold text-(--azul-titulo) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--laranja-principal) ${
                          digito
                            ? 'border-(--azul-titulo)'
                            : 'border-(--borda-suave)'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className='flex flex-wrap items-center justify-between gap-2 text-xs'>
                  <span className='text-(--texto-apoio)'>
                    Não recebeu o código?
                  </span>
                  <button
                    type='button'
                    disabled={segundosReenvio > 0}
                    onClick={() => setSegundosReenvio(59)}
                    className='cursor-pointer font-bold text-(--laranja-principal) disabled:cursor-default disabled:opacity-75'
                  >
                    {segundosReenvio > 0
                      ? `Reenviar código (00:${String(segundosReenvio).padStart(2, '0')})`
                      : 'Reenviar código agora'}
                  </button>
                </div>

                {erroFormulario && (
                  <p
                    role='alert'
                    className='text-sm font-semibold text-(--vermelho-alerta)'
                  >
                    {erroFormulario}
                  </p>
                )}

                <Botao type='submit' cor='laranja' classe='w-full! min-h-[52px]!'>
                  Confirmar e continuar →
                </Botao>

                <button
                  type='button'
                  onClick={() =>
                    atualizarUrl(
                      origemFluxo === 'recuperar' ? 'recuperar' : 'cadastro'
                    )
                  }
                  className='inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-(--azul-titulo) hover:text-(--laranja-principal)'
                >
                  ← Voltar
                </button>
              </form>
            )}

            {modo === 'novaSenha' && (
              <form
                onSubmit={lidarSalvarNovaSenha}
                noValidate
                className='mt-6 space-y-4'
              >
                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='nova-senha-campo'
                    className='text-sm font-bold text-(--azul-titulo)'
                  >
                    Nova senha
                  </label>
                  <div className='relative'>
                    <input
                      id='nova-senha-campo'
                      type={mostrarSenha ? 'text' : 'password'}
                      value={senha}
                      onChange={e => setSenha(e.target.value)}
                      placeholder='Crie uma nova senha'
                      className='h-[50px] w-full rounded-xl border border-(--borda-suave) bg-white pr-12 pl-4 text-base text-(--azul-titulo)'
                    />
                    <button
                      type='button'
                      onClick={() => setMostrarSenha(v => !v)}
                      aria-label={
                        mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'
                      }
                      className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-1.5 text-(--texto-apoio)'
                    >
                      {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className='space-y-1.5 text-sm'>
                  <p className='font-bold text-(--azul-titulo)'>
                    Sua senha deve conter:
                  </p>
                  {regrasSenha.map(regra => {
                    const atendida = regra.validar(senha);
                    return (
                      <p
                        key={regra.id}
                        className={`flex items-center gap-2 ${
                          atendida
                            ? 'font-semibold text-(--verde-sucesso)'
                            : 'text-(--texto-apoio)'
                        }`}
                      >
                        <Check size={15} aria-hidden='true' />
                        {regra.rotulo}
                      </p>
                    );
                  })}
                </div>

                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='confirmar-nova-senha'
                    className='text-sm font-bold text-(--azul-titulo)'
                  >
                    Confirmar nova senha
                  </label>
                  <div className='relative'>
                    <input
                      id='confirmar-nova-senha'
                      type={mostrarConfirmar ? 'text' : 'password'}
                      value={confirmarSenha}
                      onChange={e => setConfirmarSenha(e.target.value)}
                      placeholder='Digite novamente sua senha'
                      className='h-[50px] w-full rounded-xl border border-(--borda-suave) bg-white pr-12 pl-4 text-base text-(--azul-titulo)'
                    />
                    <button
                      type='button'
                      onClick={() => setMostrarConfirmar(v => !v)}
                      aria-label={
                        mostrarConfirmar ? 'Ocultar senha' : 'Mostrar senha'
                      }
                      className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-1.5 text-(--texto-apoio)'
                    >
                      {mostrarConfirmar ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {erroFormulario && (
                  <p
                    role='alert'
                    className='text-sm font-semibold text-(--vermelho-alerta)'
                  >
                    {erroFormulario}
                  </p>
                )}

                <Botao type='submit' cor='laranja' classe='w-full! min-h-[52px]!'>
                  Salvar nova senha →
                </Botao>

                <button
                  type='button'
                  onClick={() => atualizarUrl('login')}
                  className='inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-(--azul-titulo) hover:text-(--laranja-principal)'
                >
                  ← Voltar
                </button>
              </form>
            )}
          </section>

          <div className='hidden lg:block'>
            <EmblemaChaveiro />
          </div>
        </main>
      )}

      {modalEmailEnviado && (
        <div
          role='dialog'
          aria-modal='true'
          aria-labelledby='titulo-modal-email'
          className='fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/55 p-4 backdrop-blur-xs'
        >
          <div className='w-full max-w-[680px] rounded-2xl bg-white p-8 shadow-2xl sm:p-10'>
            <SeloEditorial texto='IAGORA · UM PASSO DE CADA VEZ' />
            <h2
              id='titulo-modal-email'
              className='font-titulo mt-5 text-3xl font-extrabold text-(--azul-titulo) sm:text-4xl'
            >
              Confira seu e-mail.
            </h2>
            <p className='mt-3 max-w-[540px] text-lg leading-relaxed text-(--texto-apoio)'>
              Se o endereço estiver cadastrado, você receberá instruções para
              redefinir sua senha.
            </p>
            <div className='mt-7'>
              <Botao
                type='button'
                cor='laranja'
                onClick={() => {
                  setModalEmailEnviado(false);
                  setSegundosReenvio(59);
                  atualizarUrl('verificar');
                }}
                classe='px-10!'
              >
                Continuar
              </Botao>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
