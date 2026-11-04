import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  Container,
  FormField,
  ResponsiveArtwork,
  Title,
} from '../../shared/ui';
import Equipe from './assets/equipe-servicos.png';
import { companyFields } from './content';
import './motion.css';

const panelMotion =
  'origin-top-left motion-safe:[transform:translateY(calc(var(--motion-translate-y,0)*1px))]';

export default function EmpresaAcesso() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get('modo') === 'entrar';
  const [values, setValues] = useState({
    companyName: '',
    email: '',
    password: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  if (isLogin) return <Navigate to='/login?perfil=empresa' replace />;

  function handleContinue(event) {
    event.preventDefault();
    navigate('/dashboard');
  }

  return (
    <>
      <main
        className="bg-white py-3 wrap-anywhere sm:py-4 lg:pt-6 lg:pb-8 [--laranja-principal:#e03b00] [font-optical-sizing:none] [font-variation-settings:'opsz'_14]"
        aria-labelledby='empresa-title'
      >
        <Container className='grid items-center gap-4 lg:grid-cols-[minmax(0,632fr)_minmax(0,552fr)] lg:gap-[clamp(2rem,7.917vw,7.125rem)] [@media(orientation:landscape)_and_(width<1024px)]:grid-cols-2'>
          <section
            data-node-id='1348:4387'
            aria-label='Área da empresa prestadora'
            className={`grid min-w-0 grid-cols-2 items-center gap-x-4 gap-y-2 rounded-[6px] bg-(--azul-escuro) p-4 text-white lg:flex lg:flex-col lg:items-start lg:justify-center lg:gap-6 lg:p-8 motion-safe:animate-[companyEditorialTranslate_2s_linear_forwards,companyEditorialOpacity_2s_linear_forwards] ${panelMotion}`}
          >
            <p className='col-span-2 text-xs leading-4 font-bold lg:text-[15px] lg:leading-[18px]'>
              ÁREA DA EMPRESA PRESTADORA
            </p>
            <Title
              as='h1'
              id='empresa-title'
              className='text-[clamp(1.5rem,4.25vw,4.5rem)] leading-[1.05556] font-extrabold tracking-[-0.035em] text-white lg:text-[clamp(2.5rem,5vw,4.5rem)]'
            >
              Quem faz.
              <br />
              Acontece.
            </Title>
            <ResponsiveArtwork
              width={584.492}
              height={359.275}
              className='w-[calc(100%+16.492px)]!'
            >
              <img
                src={Equipe}
                alt='Equipe de profissionais com materiais de limpeza e ferramentas'
                width='568'
                height='330'
                className='absolute top-1/2 left-1/2 h-[330px] w-[568px] max-w-none -translate-1/2 rotate-3 object-cover'
              />
            </ResponsiveArtwork>
            <p className='col-span-2 text-sm leading-5 lg:text-xl lg:leading-7'>
              Uma conta para divulgar serviços, cuidar do perfil da empresa e
              organizar seus anúncios.
            </p>
          </section>

          <form
            id='cadastro-empresa'
            data-node-id='1348:4392'
            noValidate
            onSubmit={handleContinue}
            aria-labelledby='empresa-form-title'
            className={`flex min-w-0 flex-col justify-center gap-3 rounded-[6px] px-4 py-5 sm:px-6 lg:gap-4 lg:px-0 lg:py-8 motion-safe:animate-[companyFormTranslate_2s_linear_forwards,companyFormOpacity_2s_linear_forwards] ${panelMotion}`}
          >
            <p className='text-xs leading-4 font-bold text-[#d54c15] lg:text-[15px] lg:leading-[18px]'>
              VAMOS COLOCAR SUA EMPRESA NO MAPA
            </p>
            <Title
              as='h2'
              id='empresa-form-title'
              className='text-[clamp(1.5rem,2.362vw,2.125rem)] leading-[1.2] font-extrabold tracking-[-0.015em] text-(--azul-titulo)'
            >
              Comece pela sua conta.
            </Title>
            {companyFields.map(field => (
              <FormField
                key={field.id}
                {...field}
                className='gap-1! lg:gap-2!'
                inputClassName='h-11! lg:h-[52px]!'
                value={values[field.name]}
                onChange={event =>
                  setValues({ ...values, [field.name]: event.target.value })
                }
              />
            ))}
            <label className='inline-flex min-h-11 cursor-pointer items-center gap-2 text-xs leading-4 text-(--texto-apoio) lg:min-h-[22px] lg:text-sm lg:leading-[22px]'>
              <input
                name='acceptedTerms'
                type='checkbox'
                checked={acceptedTerms}
                onChange={event => setAcceptedTerms(event.target.checked)}
                className='size-3.5 shrink-0 cursor-pointer accent-(--laranja-principal)'
              />
              <span>
                Li e aceito os termos de uso e a política de privacidade.
              </span>
            </label>
            <Button
              type='submit'
              color='laranja'
              className='min-h-11 w-full px-4! py-2! text-sm leading-[1.45] font-bold! lg:min-h-[52px] lg:text-base'
            >
              Criar conta da empresa ↗
            </Button>
            <p className='text-xs leading-[18px] font-bold text-(--azul-titulo) lg:text-[15px] lg:leading-[22px]'>
              Já tem uma conta? Entre com seu e-mail e senha.
            </p>
            <Button
              as={Link}
              to='/login?perfil=empresa'
              color='azul'
              className='min-h-11 w-full bg-(--azul-escuro)! px-4! py-2! text-sm leading-[22px] font-bold! lg:min-h-[52px] lg:text-[15px]'
            >
              Entrar no painel ↗
            </Button>
            <p className='text-xs leading-[18px] text-(--texto-apoio) lg:text-[15px] lg:leading-[22px]'>
              Quer cuidar da sua própria casa?{' '}
              <Link
                to='/login'
                className='underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--laranja-principal)'
              >
                Acesse como consumidor.
              </Link>
            </p>
          </form>
        </Container>
      </main>
    </>
  );
}
