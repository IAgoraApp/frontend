import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArteResponsiva,
  Botao,
  CampoFormulario,
  Container,
  Rodape,
  SeloEditorial,
  Titulo,
} from '../../compartilhado/indice';
import EquipeServicos from '../../ativos/imagens/fotografias/equipe-servicos.png';
import { atualizarEmpresa } from '../../aplicacao/estado/estadoEmpresa';
import { camposEmpresa } from './conteudo';

export function EmpresaAcesso({ modoInicial = 'divisao' }) {
  const navegar = useNavigate();
  const [parametros] = useSearchParams();
  const entrarQuery = parametros.get('modo') === 'entrar';
  const [valores, setValores] = useState({
    nomeEmpresa: '',
    email: '',
    senha: '',
  });
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [erro, setErro] = useState('');

  if (modoInicial === 'divisao' && entrarQuery) {
    return <Navigate to='/login?perfil=empresa' replace />;
  }

  const enviarCadastro = evento => {
    evento.preventDefault();
    if (
      !valores.nomeEmpresa.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email) ||
      valores.senha.length < 8 ||
      !aceitouTermos
    ) {
      setErro(
        'Informe o nome, um e-mail válido, uma senha com ao menos 8 caracteres e aceite os termos.'
      );
      return;
    }
    try {
      atualizarEmpresa(anterior => ({
        ...anterior,
        empresa: {
          ...anterior.empresa,
          nome: valores.nomeEmpresa.trim(),
          email: valores.email.trim(),
        },
      }));
      navegar('/empresa');
    } catch (falha) {
      setErro(falha.message);
    }
  };

  const enviarLogin = evento => {
    evento.preventDefault();
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email) ||
      valores.senha.length < 4
    ) {
      setErro('Informe seu e-mail comercial e senha para acessar o painel.');
      return;
    }
    navegar('/empresa');
  };

  if (modoInicial === 'cadastro' || modoInicial === 'login') {
    const ehCadastro = modoInicial === 'cadastro';
    const campos = ehCadastro
      ? camposEmpresa
      : camposEmpresa.filter(campo => campo.nome !== 'nomeEmpresa');

    return (
      <>
        <main className='bg-white py-10 text-(--azul-titulo) sm:py-14'>
          <Container classe='max-w-[740px]!'>
            <Link
              to='/sejaparceiro'
              className='inline-flex items-center gap-2 text-sm font-bold text-(--azul-titulo) hover:text-(--laranja-principal)'
            >
              ← Voltar
            </Link>

            <div className='mt-4'>
              <SeloEditorial texto='SEU AGORA COMEÇA AQUI' />
            </div>

            <h1 className='font-titulo mt-4 text-[clamp(2rem,3.6vw,3rem)] leading-[1.1] font-extrabold text-(--azul-titulo)'>
              {ehCadastro
                ? 'Seu serviço merece um lugar'
                : 'Seu negócio continua aqui'}
            </h1>
            <p className='mt-2.5 text-lg text-(--texto-apoio)'>
              {ehCadastro
                ? 'Crie seu acesso para apresentar sua empresa.'
                : 'Entre para acompanhar anúncios e contatos.'}
            </p>

            <form
              noValidate
              onSubmit={ehCadastro ? enviarCadastro : enviarLogin}
              className='mt-8 space-y-5 rounded-xl bg-(--azul-fundo) p-6 sm:p-8'
            >
              {campos.map(campo => (
                <CampoFormulario
                  key={campo.id}
                  id={campo.id}
                  rotulo={campo.rotulo}
                  type={campo.type}
                  placeholder={campo.placeholder}
                  value={valores[campo.nome]}
                  onChange={e =>
                    setValores({ ...valores, [campo.nome]: e.target.value })
                  }
                />
              ))}

              {ehCadastro && (
                <label className='flex cursor-pointer items-start gap-4 rounded-xl bg-white p-5 text-(--azul-titulo)'>
                  <input
                    type='checkbox'
                    checked={aceitouTermos}
                    onChange={e => setAceitouTermos(e.target.checked)}
                    className='mt-1 size-5 shrink-0 accent-(--laranja-principal)'
                  />
                  <span>
                    <strong className='block text-base font-bold'>
                      Li os Termos de Uso e a Política de Privacidade
                    </strong>
                    <span className='mt-0.5 block text-sm text-(--texto-apoio)'>
                      Confira os documentos antes de continuar.
                    </span>
                  </span>
                </label>
              )}

              {erro && (
                <p
                  role='alert'
                  className='text-sm font-semibold text-(--vermelho-alerta)'
                >
                  {erro}
                </p>
              )}

              <div className='flex flex-wrap gap-3 pt-1'>
                <Botao type='submit' cor='laranja' classe='px-8!'>
                  Continuar
                </Botao>
                <Botao
                  como={Link}
                  to='/login?modo=recuperar&perfil=empresa'
                  variante='secundario'
                >
                  Recuperar senha
                </Botao>
              </div>
            </form>
          </Container>
        </main>
        <Rodape variante='empresa' />
      </>
    );
  }

  return (
    <>
      <main
        className='bg-white py-6 wrap-anywhere sm:py-8 lg:pt-8 lg:pb-12'
        aria-labelledby='titulo-empresa-acesso'
      >
        <Container classe='grid items-center gap-6 lg:grid-cols-[minmax(0,632fr)_minmax(0,552fr)] lg:gap-[clamp(2rem,7.917vw,7.125rem)]'>
          <section
            aria-label='Área da empresa prestadora'
            className='grid min-w-0 grid-cols-2 items-center gap-x-4 gap-y-3 rounded-xl bg-(--azul-escuro) p-5 text-white lg:flex lg:flex-col lg:items-start lg:justify-center lg:gap-6 lg:p-8'
          >
            <p className='col-span-2 text-xs leading-4 font-bold lg:text-[15px] lg:leading-[18px]'>
              ÁREA DA EMPRESA PRESTADORA
            </p>
            <Titulo
              como='h1'
              id='titulo-empresa-acesso'
              classe='text-[clamp(1.75rem,4.25vw,4.5rem)] leading-[1.06] font-extrabold tracking-[-0.035em] text-white'
            >
              Quem faz.
              <br />
              Acontece.
            </Titulo>
            <ArteResponsiva largura={584.492} altura={359.275}>
              <img
                src={EquipeServicos}
                alt='Equipe de profissionais com materiais de limpeza e ferramentas'
                width='568'
                height='330'
                className='absolute top-1/2 left-1/2 h-[330px] w-[568px] max-w-none -translate-1/2 rotate-3 object-cover'
              />
            </ArteResponsiva>
            <p className='col-span-2 text-sm leading-6 text-white/95 lg:text-xl lg:leading-7'>
              Uma conta para divulgar serviços, cuidar do perfil da empresa e
              organizar seus anúncios.
            </p>
          </section>

          <form
            id='cadastro-empresa'
            noValidate
            onSubmit={enviarCadastro}
            aria-labelledby='titulo-formulario-empresa'
            className='flex min-w-0 flex-col justify-center gap-4 rounded-xl py-4 lg:py-8'
          >
            <p className='text-xs leading-4 font-bold text-(--laranja-destaque) lg:text-[15px]'>
              VAMOS COLOCAR SUA EMPRESA NO MAPA
            </p>
            <Titulo
              como='h2'
              id='titulo-formulario-empresa'
              classe='text-[clamp(1.5rem,2.36vw,2.125rem)] leading-[1.2] font-extrabold text-(--azul-titulo)'
            >
              Comece pela sua conta.
            </Titulo>

            {camposEmpresa.map(campo => (
              <CampoFormulario
                key={campo.id}
                id={campo.id}
                rotulo={campo.rotulo}
                type={campo.type}
                placeholder={campo.placeholder}
                value={valores[campo.nome]}
                onChange={e =>
                  setValores({ ...valores, [campo.nome]: e.target.value })
                }
              />
            ))}

            <label className='inline-flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-(--texto-apoio)'>
              <input
                name='aceitouTermos'
                type='checkbox'
                checked={aceitouTermos}
                onChange={e => setAceitouTermos(e.target.checked)}
                className='size-4 shrink-0 cursor-pointer accent-(--laranja-principal)'
              />
              <span>
                Li e aceito os{' '}
                <Link
                  to='/termos'
                  className='font-semibold underline hover:text-(--azul-titulo)'
                >
                  Termos de Uso
                </Link>{' '}
                e a{' '}
                <Link
                  to='/privacidade'
                  className='font-semibold underline hover:text-(--azul-titulo)'
                >
                  Política de Privacidade
                </Link>
                .
              </span>
            </label>

            <Botao
              type='submit'
              cor='laranja'
              classe='min-h-[52px]! w-full text-base!'
            >
              Criar conta da empresa ↗
            </Botao>

            {erro && (
              <p
                role='alert'
                className='text-sm font-semibold text-(--vermelho-alerta)'
              >
                {erro}
              </p>
            )}

            <p className='text-sm font-bold text-(--azul-titulo)'>
              Já tem uma conta? Entre com seu e-mail e senha.
            </p>
            <Botao
              como={Link}
              to='/empresa/login'
              cor='marinho'
              classe='min-h-[52px]! w-full text-[15px]!'
            >
              Entrar no painel ↗
            </Botao>

            <p className='text-sm text-(--texto-apoio)'>
              Quer cuidar da sua própria casa?{' '}
              <Link
                to='/login'
                className='font-bold text-(--laranja-principal) underline-offset-2 hover:underline'
              >
                Acesse como consumidor.
              </Link>
            </p>
          </form>
        </Container>
      </main>
      <Rodape variante='empresa' />
    </>
  );
}
