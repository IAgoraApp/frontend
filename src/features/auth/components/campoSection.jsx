import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title } from '../../../shared/ui';
import { Entradas } from '../content';

const rememberedEmailKey = 'iagora:remembered-email';

function readRememberedEmail() {
  try {
    return localStorage.getItem(rememberedEmailKey) || '';
  } catch {
    return '';
  }
}

function rememberEmail(email, remember) {
  try {
    if (remember && email) {
      localStorage.setItem(rememberedEmailKey, email);
    } else {
      localStorage.removeItem(rememberedEmailKey);
    }
  } catch {
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
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [values, setValues] = useState(() => ({
    email: readRememberedEmail(),
    password: '',
    confirmPassword: '',
  }));
  const [remember, setRemember] = useState(() =>
    Boolean(readRememberedEmail())
  );
  const entradas = Object.values(Entradas).filter(
    ({ id }) => isRegistering || id !== 'confirmPassword'
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    if (name === 'email') rememberEmail(value, remember);
  }

  function handleContinue() {
    rememberEmail(values.email, remember);
    navigate(isRegistering ? '/onboarding' : '/home');
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
      className='relative my-auto flex w-full max-w-[25rem] min-w-0 flex-col gap-6 wrap-anywhere [@media(height<=760px)]:gap-4 [@media(height<=500px)_and_(width>=520px)]:max-w-[37.5rem] [&_:is(button,input):focus-visible]:outline-2 [&_:is(button,input):focus-visible]:outline-offset-3 [&_:is(button,input):focus-visible]:outline-(--azul-principal)'
      aria-labelledby='auth-title'
    >
      <header>
        <Title
          as='h1'
          id='auth-title'
          variant='normal'
          className='font-body! leading-[1.15] font-extrabold! text-black! [@media(height<=620px)]:text-[1.75rem]'
        >
          {isRegistering ? 'Crie sua conta' : 'Login'}
        </Title>
        <p className='mt-2 text-(--texto-apoio) [@media(height<=620px)]:mt-1 [@media(height<=620px)]:text-sm'>
          {isRegistering
            ? 'Cadastre-se para começar a experiência'
            : 'Faça login para começar a experiência'}
        </p>
      </header>

      <button
        type='button'
        className='flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-[5px] border border-black bg-white px-4 py-2.5 font-bold hover:bg-(--azul-fundo) [@media(height<=760px)]:min-h-11 [@media(height<=760px)]:py-2'
        onClick={handleContinue}
      >
        <GoogleIcon />
        Continuar com Google
      </button>

      <form
        key={isRegistering ? 'register' : 'login'}
        onSubmit={handleSubmit}
        noValidate
        className='flex flex-col gap-5 [@media(height<=760px)]:gap-4'
      >
        <div className='grid min-w-0 grid-cols-1 gap-4 [@media(height<=760px)]:gap-3 [@media(height<=500px)_and_(width>=520px)]:grid-cols-[repeat(auto-fit,minmax(0,1fr))]'>
          {entradas.map(({ id, nome, type }) => (
            <div
              key={id}
              className='flex min-w-0 flex-col gap-1.5 [@media(height<=760px)]:gap-1'
            >
              <label
                htmlFor={`auth-${id}`}
                className='font-bold [@media(height<=760px)]:text-sm'
              >
                {nome}
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

        {!isRegistering && (
          <div className='flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm'>
            <label className='inline-flex min-h-11 cursor-pointer items-center gap-2'>
              <input
                type='checkbox'
                name='remember'
                className='size-5 shrink-0 cursor-pointer accent-(--azul-escuro)'
                checked={remember}
                onChange={event => {
                  setRemember(event.target.checked);
                  rememberEmail(values.email, event.target.checked);
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
        )}

        <button
          type='submit'
          className='flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-[5px] bg-(--azul-escuro) px-4 py-2.5 text-xl font-bold text-white hover:bg-(--azul-principal) [@media(height<=760px)]:min-h-11 [@media(height<=760px)]:py-2'
        >
          {isRegistering ? 'Criar conta' : 'Fazer login'}
        </button>
      </form>

      <p className='text-center [@media(height<=620px)]:text-sm'>
        {isRegistering ? 'Já tem uma conta? ' : 'Ainda não tem conta? '}
        <button
          type='button'
          onClick={toggleMode}
          className='inline-flex min-h-11 cursor-pointer items-center font-bold text-(--laranja-principal) hover:underline'
        >
          {isRegistering ? 'Faça login' : 'Cadastre-se'}
        </button>
      </p>

    </section>
  );
}
