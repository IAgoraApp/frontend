import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Title } from '../../../shared/ui';
import { accessModes, Entradas } from '../content';

// A grade reserva o espaço do maior texto, inclusive quando o zoom quebra linhas.
function AccessText({ mode, field }) {
  return (
    <span className='grid min-w-0 max-w-full'>
      {Object.entries(accessModes).map(([key, content]) => (
        <span
          key={key}
          aria-hidden={key !== mode}
          className={`col-start-1 row-start-1 ${key === mode ? '' : 'invisible'}`}
        >
          {content[field]}
        </span>
      ))}
    </span>
  );
}

function rememberedEmailKey(accountType) {
  return accountType === 'empresa'
    ? 'iagora:company-remembered-email'
    : 'iagora:remembered-email';
}

function readRememberedEmail(accountType) {
  try {
    return localStorage.getItem(rememberedEmailKey(accountType)) || '';
  } catch {
    return '';
  }
}

function rememberEmail(email, remember, accountType) {
  try {
    if (remember && email) {
      localStorage.setItem(rememberedEmailKey(accountType), email);
    } else {
      localStorage.removeItem(rememberedEmailKey(accountType));
    }
  } catch {
    // O formulário continua disponível quando o navegador bloqueia o armazenamento.
  }
}

function GoogleIcon() {
  return (
    <svg
      className='shrink-0'
      width='20'
      height='20'
      viewBox='0 0 48 48'
      aria-hidden='true'
    >
      <path
        fill='#4285F4'
        d='M43.61 24.46c0-1.36-.12-2.66-.35-3.92H24v7.42h11a9.4 9.4 0 0 1-4.08 6.17v5h6.6c3.86-3.56 6.09-8.8 6.09-14.67Z'
      />
      <path
        fill='#34A853'
        d='M24 44c5.51 0 10.13-1.83 13.51-4.87l-6.6-5C29.08 35.36 26.73 36.1 24 36.1c-5.32 0-9.83-3.59-11.44-8.42H5.74v5.15A20 20 0 0 0 24 44Z'
      />
      <path
        fill='#FBBC05'
        d='M12.56 27.68a12 12 0 0 1 0-7.36v-5.15H5.74a20 20 0 0 0 0 17.66l6.82-5.15Z'
      />
      <path
        fill='#EA4335'
        d='M24 11.9c3 0 5.69 1.03 7.81 3.05l5.86-5.86A19.57 19.57 0 0 0 24 4 20 20 0 0 0 5.74 15.17l6.82 5.15C14.17 15.49 18.68 11.9 24 11.9Z'
      />
    </svg>
  );
}

export default function CampoSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const accountType =
    searchParams.get('perfil') === 'empresa' ? 'empresa' : 'pessoal';

  function selectAccount(nextAccountType) {
    setSearchParams(
      previous => {
        const next = new URLSearchParams(previous);
        if (nextAccountType === 'empresa') next.set('perfil', 'empresa');
        else next.delete('perfil');
        return next;
      },
      { replace: true }
    );
  }

  return (
    <AccessForm
      key={accountType}
      accountType={accountType}
      onSelectAccount={selectAccount}
    />
  );
}

function AccessForm({ accountType, onSelectAccount }) {
  const navigate = useNavigate();
  const isCompany = accountType === 'empresa';
  const [isRegistering, setIsRegistering] = useState(false);
  const mode = isRegistering ? 'cadastro' : accountType;
  const [values, setValues] = useState(() => ({
    email: readRememberedEmail(accountType),
    password: '',
    confirmPassword: '',
  }));
  const [remember, setRemember] = useState(() =>
    Boolean(readRememberedEmail(accountType))
  );
  const entradas = Object.values(Entradas).filter(
    ({ id }) => id !== 'confirmPassword'
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    if (name === 'email') rememberEmail(value, remember, accountType);
  }

  function handleContinue() {
    rememberEmail(values.email, remember, accountType);
    navigate(
      isCompany ? '/dashboard' : isRegistering ? '/onboarding' : '/home'
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleContinue();
  }

  function toggleMode() {
    setIsRegistering(!isRegistering);
    setValues({ ...values, password: '', confirmPassword: '' });
  }

  return (
    <section
      className='relative my-auto flex w-full max-w-[25rem] min-w-0 flex-col gap-6 wrap-anywhere [@media(620px<height<=760px)]:gap-3 [@media(height<=620px)]:gap-2 [@media(height<=500px)_and_(width>=520px)]:max-w-[37.5rem] [&_:is(button,input):focus-visible]:outline-2 [&_:is(button,input):focus-visible]:outline-offset-3 [&_:is(button,input):focus-visible]:outline-(--azul-principal)'
      aria-labelledby='auth-title'
    >
      <header>
        <Title
          as='h1'
          id='auth-title'
          variant='normal'
          className='font-body! text-[2.25rem]! leading-[1.15] font-extrabold! text-black! [@media(height<=620px)]:text-[1.75rem]!'
        >
          <AccessText mode={mode} field='title' />
        </Title>
        <p className='mt-2 text-(--texto-apoio) [@media(height<=620px)]:mt-1 [@media(height<=620px)]:text-sm'>
          <AccessText mode={mode} field='description' />
        </p>
      </header>

      <div
        role='group'
        aria-label='Tipo de conta'
        className='grid grid-cols-2 gap-1 rounded-lg bg-(--azul-fundo) p-1'
      >
        {[
          { value: 'pessoal', label: 'Pessoal' },
          { value: 'empresa', label: 'Empresa' },
        ].map(account => (
          <button
            key={account.value}
            type='button'
            aria-pressed={accountType === account.value}
            onClick={() => onSelectAccount(account.value)}
            className={`min-h-11 cursor-pointer rounded-[5px] px-3 py-2 text-sm font-bold transition-colors ${accountType === account.value ? 'bg-(--azul-escuro) text-white' : 'text-(--texto-apoio) hover:bg-white'}`}
          >
            {account.label}
          </button>
        ))}
      </div>

      <button
        type='button'
        className='flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-[5px] border border-black bg-white px-4 py-2.5 font-bold hover:bg-(--azul-fundo) [@media(height<=760px)]:min-h-11 [@media(height<=760px)]:py-2'
        onClick={handleContinue}
      >
        <GoogleIcon />
        Continuar com Google
      </button>

      <form
        onSubmit={handleSubmit}
        noValidate
        className='flex flex-col gap-5 [@media(height<=760px)]:gap-3'
      >
        <div className='grid min-w-0 grid-cols-1 gap-4 [@media(height<=760px)]:gap-2 [@media(height<=500px)_and_(width>=520px)]:grid-cols-[repeat(auto-fit,minmax(0,1fr))]'>
          {entradas.map(({ id, nome, type }) => (
            <div
              key={id}
              className='flex min-w-0 flex-col gap-1.5 [@media(height<=760px)]:gap-1'
            >
              <label
                htmlFor={`auth-${id}`}
                className='font-bold [@media(height<=760px)]:text-sm'
              >
                {id === 'email' ? (
                  <AccessText mode={mode} field='emailLabel' />
                ) : (
                  nome
                )}
              </label>
              <input
                className='h-12 w-full min-w-0 rounded-[5px] border border-black bg-white px-3 py-2.5 text-base [@media(height<=760px)]:h-11 [@media(height<=760px)]:py-2'
                id={`auth-${id}`}
                name={id}
                type={type}
                value={values[id]}
                onChange={handleChange}
                autoComplete={
                  id === 'email'
                    ? 'email'
                    : isRegistering
                      ? 'new-password'
                      : 'current-password'
                }
              />
            </div>
          ))}
        </div>

        {/* Os dois modos compartilham o mesmo espaço, sem deslocar o formulário. */}
        <div className='grid'>
          <div
            className={`col-start-1 row-start-1 flex min-w-0 flex-col gap-1.5 [@media(height<=760px)]:gap-1 ${isRegistering ? '' : 'invisible'}`}
            inert={!isRegistering}
          >
            <label
              htmlFor='auth-confirmPassword'
              className='font-bold [@media(height<=760px)]:text-sm'
            >
              {Entradas[3].nome}
            </label>
            <input
              className='h-12 w-full min-w-0 rounded-[5px] border border-black bg-white px-3 py-2.5 text-base [@media(height<=760px)]:h-11 [@media(height<=760px)]:py-2'
              id='auth-confirmPassword'
              name='confirmPassword'
              type='password'
              value={values.confirmPassword}
              onChange={handleChange}
              autoComplete='new-password'
              disabled={!isRegistering}
            />
          </div>
          <div
            className={`col-start-1 row-start-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm ${isRegistering ? 'invisible' : ''}`}
            inert={isRegistering}
          >
            <label className='inline-flex min-h-11 cursor-pointer items-center gap-2'>
              <input
                type='checkbox'
                name='remember'
                className='size-5 shrink-0 cursor-pointer accent-(--azul-escuro)'
                checked={remember}
                onChange={event => {
                  setRemember(event.target.checked);
                  rememberEmail(
                    values.email,
                    event.target.checked,
                    accountType
                  );
                }}
              />
              Lembrar de mim
            </label>
            <button
              type='button'
              className='inline-flex min-h-11 cursor-pointer items-center text-right hover:underline'
            >
              Esqueci a senha
            </button>
          </div>
        </div>

        <button
          type='submit'
          className='flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-[5px] bg-(--azul-escuro) px-4 py-2.5 text-xl font-bold text-white hover:bg-(--azul-principal) [@media(height<=760px)]:min-h-11 [@media(height<=760px)]:py-2'
        >
          <AccessText mode={mode} field='submit' />
        </button>
      </form>

      <p className='flex flex-col items-center text-center [@media(height<=620px)]:text-sm'>
        <AccessText mode={mode} field='prompt' />
        {isCompany ? (
          <Link
            to='/cadastro-empresa'
            className='inline-flex min-h-11 max-w-full items-center font-bold text-(--azul-principal) hover:underline'
          >
            <AccessText mode={mode} field='switchLabel' />
          </Link>
        ) : (
          <button
            type='button'
            onClick={toggleMode}
            className='inline-flex min-h-11 max-w-full cursor-pointer items-center font-bold text-(--azul-principal) hover:underline'
          >
            <AccessText mode={mode} field='switchLabel' />
          </button>
        )}
      </p>
    </section>
  );
}
