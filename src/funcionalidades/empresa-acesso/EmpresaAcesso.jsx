import { useState } from 'react';
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import {
  destinoAposAcesso,
  iniciarSessao,
} from '../../aplicacao/utilitarios/sessao';
import {
  Botao,
  CampoFormulario,
  Container,
  Rodape,
  SeloEditorial,
} from '../../compartilhado/indice';
import { atualizarEmpresa } from '../../aplicacao/estado/estadoEmpresa';
import { camposEmpresa } from './conteudo';

export function EmpresaAcesso({ modoInicial = 'cadastro' }) {
  const navegar = useNavigate();
  const localizacao = useLocation();
  const [parametros] = useSearchParams();
  const [valores, setValores] = useState({
    nomeEmpresa: '',
    email: '',
    senha: '',
  });
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [erro, setErro] = useState('');

  if (modoInicial === 'divisao') {
    const consulta = new URLSearchParams(parametros);
    const destino = consulta.get('modo') === 'entrar'
      ? '/empresa/login'
      : '/empresa/cadastro';
    consulta.delete('modo');
    const busca = consulta.toString();
    return (
      <Navigate
        to={destino + (busca ? '?' + busca : '') + localizacao.hash}
        replace
        state={localizacao.state}
      />
    );
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
      iniciarSessao('empresa');
      navegar(destinoAposAcesso(localizacao.state?.destino, '/empresa', 'empresa'), {
        replace: true,
      });
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
    iniciarSessao('empresa');
    navegar(destinoAposAcesso(localizacao.state?.destino, '/empresa', 'empresa'), {
      replace: true,
    });
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
 Voltar
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
                  {ehCadastro ? 'Criar conta da empresa' : 'Entrar no painel'}
                </Botao>
                <Botao
                  como={Link}
                  to={ehCadastro ? '/empresa/login' : '/login?modo=recuperar&perfil=empresa'}
                  state={localizacao.state}
                  variante='secundario'
                >
                  {ehCadastro ? 'Já tenho uma conta' : 'Recuperar senha'}
                </Botao>
              </div>
            </form>

            {!ehCadastro && (
              <p className='mt-5 text-sm text-(--texto-apoio)'>
                Ainda não cadastrou sua empresa?{' '}
                <Link
                  to='/empresa/cadastro'
                  state={localizacao.state}
                  className='font-bold text-(--laranja-principal) hover:underline'
                >
                  Cadastrar empresa
                </Link>
              </p>
            )}
          </Container>
        </main>
        <Rodape variante='empresa' />
      </>
    );
  }

  return <Navigate to='/empresa/cadastro' replace state={localizacao.state} />;
}
