import { useState } from 'react';
import Chave from '../../assets/images/Group 7.png';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/images/logoLaranja.png';

const ORANGE = '#C64411';
const ORANGE_BRAND = '#D54C15';
const NAVY = '#102A43';
const GREY = '#526579';
const BORDER = '#D8E1E8';
const SURFACE = '#FFFFFF';
const SOFT = '#F4F7FA';
const GOOGLE_ACCOUNT_KEY = 'iagora_google_account';

function EyeIcon({ open }) {
  return (
    <svg
      width='22'
      height='22'
      viewBox='0 0 24 24'
      fill='none'
      stroke={NAVY}
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      {open ? (
        <>
          <path d='M3 3l18 18' />
          <path d='M10.6 10.6a2 2 0 002.8 2.8' />
          <path d='M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.1-2.2 3' />
          <path d='M6.2 6.2C3.8 7.7 2.5 10 2 12c1 2.5 4.5 7 10 7 1.1 0 2.1-.2 3-.5' />
        </>
      ) : (
        <>
          <path d='M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z' />
          <circle cx='12' cy='12' r='3' />
        </>
      )}
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width='24' height='24' viewBox='0 0 48 48' aria-hidden='true'>
      <path
        fill='#EA4335'
        d='M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6C12.3 13.5 17.7 9.5 24 9.5z'
      />
      <path
        fill='#4285F4'
        d='M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.5z'
      />
      <path
        fill='#FBBC05'
        d='M10.4 28.8c-.5-1.4-.8-2.9-.8-4.8s.3-3.4.8-4.8l-7.8-6C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.8-6z'
      />
      <path
        fill='#34A853'
        d='M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.7-4.2-13.6-9.9l-7.8 6C6.5 42.6 14.6 48 24 48z'
      />
    </svg>
  );
}

// eslint-disable-next-line no-unused-vars
function Illustration() {
  return (
    <svg
      width='392'
      height='392'
      viewBox='0 0 392 392'
      aria-hidden='true'
      style={{ display: 'block' }}
    >
      <path
        d='M168 140 L160 158 L180 150 Z'
        fill={SURFACE}
        stroke={NAVY}
        strokeWidth='7'
        strokeLinejoin='round'
      />

      <ellipse
        cx='190'
        cy='126'
        rx='34'
        ry='30'
        fill={SURFACE}
        stroke={NAVY}
        strokeWidth='7'
      />

      <g transform='rotate(14 150 230)'>
        <circle
          cx='138'
          cy='172'
          r='20'
          fill={SURFACE}
          stroke={NAVY}
          strokeWidth='7'
        />
        <rect
          x='131'
          y='190'
          width='14'
          height='112'
          rx='3'
          fill={SURFACE}
          stroke={NAVY}
          strokeWidth='7'
        />
        <rect
          x='145'
          y='262'
          width='12'
          height='12'
          fill={SURFACE}
          stroke={NAVY}
          strokeWidth='6'
        />
        <rect
          x='145'
          y='284'
          width='10'
          height='12'
          fill={SURFACE}
          stroke={NAVY}
          strokeWidth='6'
        />
      </g>

      <path
        d='M254 164 L300 204 L300 302 L210 302 L210 204 Z'
        fill={SURFACE}
        stroke={NAVY}
        strokeWidth='7'
        strokeLinejoin='round'
      />

      <rect
        x='252'
        y='264'
        width='16'
        height='22'
        fill={ORANGE_BRAND}
        stroke={NAVY}
        strokeWidth='5'
      />
    </svg>
  );
}

// eslint-disable-next-line no-unused-vars
function BoxIllustration() {
  return (
    <svg width='135' height='106' viewBox='0 0 135 106' aria-hidden='true'>
      <path
        d='M14 46 L42 26 L94 26 L120 46 Z'
        fill='none'
        stroke={NAVY}
        strokeWidth='6'
        strokeLinejoin='round'
      />
      <path
        d='M14 46 L14 92 L72 98 L72 52 Z'
        fill={SURFACE}
        stroke={NAVY}
        strokeWidth='6'
        strokeLinejoin='round'
      />
      <path
        d='M72 52 L120 46 L120 88 L72 98 Z'
        fill={SOFT}
        stroke={NAVY}
        strokeWidth='6'
        strokeLinejoin='round'
      />
      <path
        d='M52 14 L60 36'
        stroke={ORANGE_BRAND}
        strokeWidth='5'
        strokeLinecap='round'
      />
      <path
        d='M96 66 L104 84'
        stroke={ORANGE_BRAND}
        strokeWidth='5'
        strokeLinecap='round'
      />
    </svg>
  );
}

function readSavedGoogleAccount() {
  try {
    const raw = localStorage.getItem(GOOGLE_ACCOUNT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveGoogleAccountLocally(account) {
  try {
    localStorage.setItem(GOOGLE_ACCOUNT_KEY, JSON.stringify(account));
  } catch {
    // Armazenamento indisponível: segue sem salvar localmente.
  }
}

export default function Auth({
  onLogin,
  onRegister,
  onForgotPassword,
  onGoogleLogin,
  onSaveGoogleAccount,
  googleAccount: googleAccountProp,
}) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const [showGoogleConfirm, setShowGoogleConfirm] = useState(false);
  const [googleView, setGoogleView] = useState('confirm'); // "confirm" | "type"
  const [googleBusy, setGoogleBusy] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleEmailError, setGoogleEmailError] = useState('');
  const [savedGoogleAccount, setSavedGoogleAccount] = useState(() =>
    readSavedGoogleAccount()
  );

  const googleAccount = googleAccountProp || savedGoogleAccount;

  const isLogin = mode === 'login';

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    const normalizedEmail = email.trim();

    // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    //   setMessage("Informe um e-mail válido.");
    //   return;
    // }

    // if (!password) {
    //   setMessage("Informe sua senha.");
    //   return;
    // }

    // if (!isLogin && password !== confirmPassword) {
    //   setMessage("As senhas não coincidem.");
    //   return;
    // }

    // const handler = isLogin ? onLogin : onRegister;

    // if (typeof handler !== "function") {
    //   setMessage(
    //     isLogin
    //       ? "Configure onLogin para conectar o serviço de autenticação."
    //       : "Configure onRegister para conectar o serviço de cadastro."
    //   );
    //   return;
    // }

    // setBusy(true);

    // try {
    //   const result = await handler(
    //     isLogin
    //       ? {
    //           email: normalizedEmail,
    //           password,
    //           rememberMe,
    //         }
    //       : {
    //           email: normalizedEmail,
    //           password,
    //         }
    //   );

    //   if (result?.error) {
    //     throw new Error(
    //       result.error.message ||
    //         "Não foi possível concluir a operação."
    //     );
    //   }

    //   setMessage(
    //     isLogin
    //       ? "Login realizado com sucesso."
    //       : "Cadastro realizado com sucesso."
    //   );
    // } catch (error) {
    //   setMessage(
    //     error?.message || "Ocorreu um erro. Tente novamente."
    //   );
    // } finally {
    //   setBusy(false);
    // }
  }

  function toggleMode() {
    setMode(current => (current === 'login' ? 'register' : 'login'));
    setMessage('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  async function handleForgotPassword() {
    setMessage('');

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setMessage('Informe seu e-mail para recuperar a senha.');
      return;
    }

    if (typeof onForgotPassword !== 'function') {
      setMessage();
      return;
    }

    try {
      await onForgotPassword({ email: normalizedEmail });
      setMessage(
        'Se houver uma conta para este e-mail, você receberá instruções de recuperação.'
      );
    } catch (error) {
      setMessage(error?.message || 'Não foi possível solicitar a recuperação.');
    }
  }

  function openGoogleConfirm() {
    setMessage('');
    setGoogleView('confirm');
    setGoogleEmailError('');
    setShowGoogleConfirm(true);
  }

  function closeGoogleConfirm() {
    if (googleBusy) return;
    setShowGoogleConfirm(false);
    setGoogleView('confirm');
    setGoogleEmailError('');
  }

  async function runGoogleLogin(options) {
    if (typeof onGoogleLogin !== 'function') {
      setShowGoogleConfirm(false);
      setMessage();
      return;
    }

    setGoogleBusy(true);

    try {
      await onGoogleLogin(options);
      setShowGoogleConfirm(false);
      setGoogleView('confirm');
    } catch (error) {
      setShowGoogleConfirm(false);
      setGoogleView('confirm');
      setMessage(
        error?.message ||
          'Não foi possível entrar com o Google. Tente novamente.'
      );
    } finally {
      setGoogleBusy(false);
    }
  }

  // Confirma a conta Google que está sendo mostrada no modal
  function confirmCurrentGoogleAccount() {
    runGoogleLogin(
      googleAccount?.email ? { loginHint: googleAccount.email } : {}
    );
  }

  // Mostra o campo para digitar outra conta Google
  function showAnotherAccountForm() {
    setGoogleEmailInput('');
    setGoogleEmailError('');
    setGoogleView('type');
  }

  function backToConfirm() {
    setGoogleEmailError('');
    setGoogleView('confirm');
  }

  // Salva a conta digitada no site e inicia o login com ela
  function saveAndUseTypedAccount(event) {
    event.preventDefault();

    const normalizedEmail = googleEmailInput.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setGoogleEmailError('Informe um e-mail do Google válido.');
      return;
    }

    if (
      !normalizedEmail.endsWith('@gmail.com') &&
      !normalizedEmail.includes('.')
    ) {
      setGoogleEmailError('Verifique o e-mail informado.');
      return;
    }

    const account = {
      email: normalizedEmail,
      name: '',
      avatarUrl: '',
    };

    setSavedGoogleAccount(account);
    saveGoogleAccountLocally(account);

    try {
      onSaveGoogleAccount?.(account);
    } catch {
      // Falha ao salvar no backend não impede o login.
    }

    runGoogleLogin({
      loginHint: normalizedEmail,
      prompt: 'select_account',
    });
  }

  const googleInitial =
    googleAccount?.name?.charAt(0) || googleAccount?.email?.charAt(0) || 'G';

  const inputBox =
    'w-full h-[56px] pl-[16px] pr-[8px] bg-white rounded-[8px] border border-[#D8E1E8] flex items-center gap-[8px]';

  const inputClass =
    'w-full min-w-0 bg-transparent text-[#526579] text-[16px] leading-[24px] font-normal outline-none placeholder:text-[#526579]';

  const labelClass = 'text-[#102A43] text-[14px] leading-[18px] font-bold';

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;700&display=swap");

        * {
          box-sizing: border-box;
        }
      `}</style>

      <div
        className='min-h-screen w-full overflow-x-hidden bg-white'
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className='mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-6 md:px-12 lg:px-[72px]'>
          {/* Cabeçalho */}
          <header className='flex w-full items-center justify-between gap-4 py-7'>
            <img
              src={Logo}
              alt='IAGORA'
              className='mb-2 h-[47px] w-[126px] object-contain object-left'
              onError={e => {
                e.currentTarget.style.display = 'none';
              }}
            />

            <div
              className='text-right text-[10px] font-bold leading-[16px] tracking-[0.7px] sm:text-[12px]'
              style={{ color: GREY }}
            >
              IAGORA · SEU NOVO CAPÍTULO
            </div>
          </header>

          {/* Conteúdo principal: formulário + imagem lateral */}
          <main className='flex flex-1 flex-col items-center justify-center gap-10 py-8 md:flex-row md:items-center md:justify-between md:gap-8 lg:gap-12'>
            {/* Formulário */}
            <form
              onSubmit={handleSubmit}
              className='flex w-full max-w-[520px] flex-col items-start gap-[12px] bg-white md:w-[46%] md:shrink-0 lg:w-[44%]'
            >
              {/* Cabeçalho do formulário */}
              <div className='flex w-full flex-col items-start gap-[8px]'>
                <span
                  className='text-[12px] font-bold leading-[16px] tracking-[0.7px]'
                  style={{ color: ORANGE }}
                >
                  {isLogin ? 'OLHA QUEM VOLTOU!' : 'SEJA BEM-VINDO AO IAGORA'}
                </span>

                <h1
                  className='text-[42px] font-extrabold leading-[1.08] tracking-[-1px] sm:text-[50px] lg:text-[56px]'
                  style={{
                    color: NAVY,
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                  }}
                >
                  {isLogin ? (
                    <>
                      Que bom ter você
                      <br />
                      de volta!
                    </>
                  ) : (
                    <>
                      Vamos começar
                      <br />
                      seu capítulo?
                    </>
                  )}
                </h1>

                <p
                  className='text-[16px] font-normal leading-[24px]'
                  style={{ color: GREY }}
                >
                  {isLogin
                    ? 'Seu cantinho no Iagora está te esperando.'
                    : 'Crie sua conta para começar sua jornada no Iagora.'}
                </p>
              </div>

              {/* Login com Google */}
              <button
                type='button'
                onClick={openGoogleConfirm}
                className='flex h-[56px] w-full cursor-pointer items-center gap-[14px] rounded-[12px] border border-[#D8E1E8] bg-white px-[14px] transition-colors hover:bg-[#F4F7FA]'
              >
                <GoogleIcon />
                <span
                  className='text-left text-[15px] font-bold leading-[20px]'
                  style={{ color: NAVY }}
                >
                  Continuar com Google
                </span>
              </button>

              {/* Divisor */}
              <div className='flex h-[20px] w-full items-center gap-[10px]'>
                <div
                  className='h-px flex-1'
                  style={{ backgroundColor: BORDER }}
                />
                <span
                  className='whitespace-nowrap text-[12px] font-normal leading-[16px]'
                  style={{ color: GREY }}
                >
                  ou com e-mail
                </span>
                <div
                  className='h-px flex-1'
                  style={{ backgroundColor: BORDER }}
                />
              </div>

              {/* E-mail */}
              <div className='flex w-full flex-col items-start gap-[8px]'>
                <label htmlFor='auth-email' className={labelClass}>
                  E-mail
                </label>

                <div className={inputBox}>
                  <input
                    id='auth-email'
                    name='email'
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete='email'
                    placeholder='seu@email.com'
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Senha */}
              <div className='flex w-full flex-col items-start gap-[8px]'>
                <label htmlFor='auth-password' className={labelClass}>
                  Senha
                </label>

                <div className={inputBox}>
                  <input
                    id='auth-password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    placeholder='••••••••••'
                    className={inputClass}
                  />

                  <button
                    type='button'
                    aria-label={
                      showPassword ? 'Ocultar senha' : 'Mostrar senha'
                    }
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword(value => !value)}
                    className='flex h-[44px] w-[44px] shrink-0 cursor-pointer items-center justify-center'
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              {/* Confirmar senha no cadastro */}
              {!isLogin && (
                <div className='flex w-full flex-col items-start gap-[8px]'>
                  <label htmlFor='auth-confirm-password' className={labelClass}>
                    Confirmar senha
                  </label>

                  <div className={inputBox}>
                    <input
                      id='auth-confirm-password'
                      name='confirmPassword'
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      autoComplete='new-password'
                      placeholder='Repita sua senha'
                      className={inputClass}
                    />

                    <button
                      type='button'
                      aria-label={
                        showConfirmPassword
                          ? 'Ocultar confirmação da senha'
                          : 'Mostrar confirmação da senha'
                      }
                      aria-pressed={showConfirmPassword}
                      onClick={() => setShowConfirmPassword(value => !value)}
                      className='flex h-[44px] w-[44px] shrink-0 cursor-pointer items-center justify-center'
                    >
                      <EyeIcon open={showConfirmPassword} />
                    </button>
                  </div>
                </div>
              )}

              {/* Mensagens */}
              {message && (
                <p
                  role='status'
                  aria-live='polite'
                  className='w-full text-[14px] leading-[20px]'
                  style={{ color: ORANGE }}
                >
                  {message}
                </p>
              )}

              {/* Lembrar de mim e recuperar senha */}
              {isLogin && (
                <div className='flex min-h-[44px] w-full items-center justify-between gap-3'>
                  <label className='flex cursor-pointer items-center gap-[10px]'>
                    <input
                      type='checkbox'
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className='h-[18px] w-[18px] cursor-pointer'
                      style={{ accentColor: ORANGE }}
                    />
                    <span
                      className='text-[14px] font-normal leading-[20px]'
                      style={{ color: NAVY }}
                    >
                      Lembrar de mim
                    </span>
                  </label>

                  <button
                    type='button'
                    onClick={handleForgotPassword}
                    className='cursor-pointer text-[14px] font-bold leading-[18px] hover:underline'
                    style={{ color: ORANGE }}
                  >
                    Esqueci a senha
                  </button>
                </div>
              )}

              {/* Botão principal */}

              <Link
                to={'/onboarding'}
                disabled={busy}
                style={{ backgroundColor: ORANGE }}
                className='h-[56px] w-full cursor-pointer rounded-[28px] text-[15px] font-bold leading-[20px] text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center'
              >
                {busy
                  ? 'Aguarde...'
                  : isLogin
                    ? 'Entrar no meu cantinho →'
                    : 'Criar minha conta →'}
              </Link>

              {/* Alternar entre login e cadastro */}
              <div className='flex min-h-[44px] w-full flex-wrap items-center justify-center gap-[6px]'>
                <span
                  className='text-[14px] font-normal leading-[20px]'
                  style={{ color: GREY }}
                >
                  {isLogin ? 'Ainda não tem conta?' : 'Já tem uma conta?'}
                </span>

                <button
                  type='button'
                  onClick={toggleMode}
                  className='cursor-pointer text-[14px] font-bold leading-[18px] hover:underline'
                  style={{ color: ORANGE }}
                >
                  {isLogin ? 'Criar conta →' : 'Fazer login →'}
                </button>
              </div>
            </form>

            {/* IMAGEM NA LATERAL DIREITA */}
            <aside className='hidden md:flex md:w-[54%] md:flex-none items-center justify-center'>
              <div className='relative flex w-full items-center justify-center'>
                <img
                  src={Chave}
                  alt='Ilustração da chave do Iagora'
                  className='h-auto w-full max-w-[720px] object-contain'
                />
              </div>
            </aside>
          </main>

          {/* Rodapé decorativo opcional */}
          <footer className='h-6 shrink-0' />
        </div>
      </div>

      {/* Modal de confirmação da conta Google */}
      {showGoogleConfirm && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-[#102A43]/40 px-6'
          onClick={closeGoogleConfirm}
          onKeyDown={e => {
            if (e.key === 'Escape') closeGoogleConfirm();
          }}
          role='presentation'
        >
          <div
            role='dialog'
            aria-modal='true'
            aria-labelledby='google-confirm-title'
            className='w-full max-w-[400px] rounded-[16px] bg-white p-[28px] shadow-xl'
            onClick={e => e.stopPropagation()}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {googleView === 'confirm' ? (
              <>
                <div className='flex flex-col items-center gap-[16px] text-center'>
                  <div className='flex h-[56px] w-[56px] items-center justify-center rounded-full border border-[#D8E1E8] bg-white'>
                    <GoogleIcon />
                  </div>

                  <h2
                    id='google-confirm-title'
                    className='text-[22px] font-extrabold leading-[1.2] tracking-[-0.3px]'
                    style={{
                      color: NAVY,
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                    }}
                  >
                    Confirme sua conta Google
                  </h2>

                  <p
                    className='text-[15px] leading-[22px]'
                    style={{ color: GREY }}
                  >
                    Você está entrando no Iagora com esta conta:
                  </p>
                </div>

                {/* Conta Google atual */}
                <div className='mt-[20px] flex items-center gap-[12px] rounded-[12px] border border-[#D8E1E8] bg-[#F4F7FA] p-[14px]'>
                  {googleAccount?.avatarUrl ? (
                    <img
                      src={googleAccount.avatarUrl}
                      alt=''
                      className='h-[44px] w-[44px] shrink-0 rounded-full object-cover'
                    />
                  ) : (
                    <div
                      className='flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-white text-[18px] font-bold uppercase'
                      style={{ color: NAVY }}
                      aria-hidden='true'
                    >
                      {googleInitial}
                    </div>
                  )}

                  <div className='flex min-w-0 flex-col'>
                    <span
                      className='truncate text-[15px] font-bold leading-[20px]'
                      style={{ color: NAVY }}
                    >
                      {googleAccount?.name || 'Conta Google'}
                    </span>
                    <span
                      className='truncate text-[14px] leading-[20px]'
                      style={{ color: GREY }}
                    >
                      {googleAccount?.email || 'Conta atual do navegador'}
                    </span>
                  </div>
                </div>

                <div className='mt-[24px] flex flex-col gap-[10px]'>
                  <button
                    type='button'
                    onClick={confirmCurrentGoogleAccount}
                    disabled={googleBusy}
                    className='h-[52px] w-full cursor-pointer rounded-[26px] text-[15px] font-bold leading-[20px] text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60'
                    style={{ backgroundColor: ORANGE }}
                  >
                    {googleBusy ? 'Aguarde...' : 'Confirmar e continuar'}
                  </button>

                  <button
                    type='button'
                    onClick={showAnotherAccountForm}
                    disabled={googleBusy}
                    className='h-[52px] w-full cursor-pointer rounded-[26px] border border-[#D8E1E8] bg-white text-[15px] font-bold leading-[20px] transition-colors hover:bg-[#F4F7FA] disabled:cursor-not-allowed disabled:opacity-60'
                    style={{ color: NAVY }}
                  >
                    Usar outra conta Google
                  </button>

                  <button
                    type='button'
                    onClick={closeGoogleConfirm}
                    disabled={googleBusy}
                    className='cursor-pointer py-[6px] text-[14px] font-bold leading-[18px] hover:underline disabled:cursor-not-allowed disabled:opacity-60'
                    style={{ color: ORANGE }}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={saveAndUseTypedAccount}>
                <div className='flex flex-col items-center gap-[16px] text-center'>
                  <div className='flex h-[56px] w-[56px] items-center justify-center rounded-full border border-[#D8E1E8] bg-white'>
                    <GoogleIcon />
                  </div>

                  <h2
                    id='google-confirm-title'
                    className='text-[22px] font-extrabold leading-[1.2] tracking-[-0.3px]'
                    style={{
                      color: NAVY,
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                    }}
                  >
                    Digite sua conta Google
                  </h2>

                  <p
                    className='text-[15px] leading-[22px]'
                    style={{ color: GREY }}
                  >
                    Informe o e-mail da conta que você quer usar no Iagora. Ela
                    ficará salva para os próximos acessos.
                  </p>
                </div>

                <div className='mt-[20px] flex w-full flex-col items-start gap-[8px]'>
                  <label htmlFor='google-account-email' className={labelClass}>
                    E-mail da conta Google
                  </label>

                  <div className={inputBox}>
                    <input
                      id='google-account-email'
                      type='email'
                      value={googleEmailInput}
                      onChange={e => {
                        setGoogleEmailInput(e.target.value);
                        setGoogleEmailError('');
                      }}
                      autoComplete='email'
                      placeholder='seuemail@gmail.com'
                      autoFocus
                      className={inputClass}
                    />
                  </div>

                  {googleEmailError && (
                    <p
                      role='status'
                      aria-live='polite'
                      className='w-full text-[14px] leading-[20px]'
                      style={{ color: ORANGE }}
                    >
                      {googleEmailError}
                    </p>
                  )}
                </div>

                <div className='mt-[24px] flex flex-col gap-[10px]'>
                  <button
                    type='submit'
                    disabled={googleBusy}
                    className='h-[52px] w-full cursor-pointer rounded-[26px] text-[15px] font-bold leading-[20px] text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60'
                    style={{ backgroundColor: ORANGE }}
                  >
                    {googleBusy ? 'Aguarde...' : 'Salvar e continuar'}
                  </button>

                  <button
                    type='button'
                    onClick={backToConfirm}
                    disabled={googleBusy}
                    className='h-[52px] w-full cursor-pointer rounded-[26px] border border-[#D8E1E8] bg-white text-[15px] font-bold leading-[20px] transition-colors hover:bg-[#F4F7FA] disabled:cursor-not-allowed disabled:opacity-60'
                    style={{ color: NAVY }}
                  >
                    Voltar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
