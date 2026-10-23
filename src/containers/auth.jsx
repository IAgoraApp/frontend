import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/logoLaranja.png';
import Chave from '../assets/images/Group 7.png';
import { Button } from '../components/ui';
import { Field, Modal, Confirm } from '../components/App/ui';
import { useAppStore } from '../store/useAppStore';
import { passwordDigest } from '../utils/demoAuth';
import styles from '../styles/app.module.css';

const titles = {
  login: 'Que bom ter você de volta!',
  cadastro: 'Seu novo capítulo começa aqui.',
  recuperar: 'Vamos recuperar seu acesso.',
  redefinir: 'Escolha uma nova senha.',
};

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(
    location.pathname === '/cadastro'
      ? 'cadastro'
      : location.pathname === '/recuperar-senha'
        ? 'recuperar'
        : 'login'
  );
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [legal, setLegal] = useState('');
  const [replacement, setReplacement] = useState(null);
  const account = useAppStore(state => state.account);
  const notify = useAppStore(state => state.notify);

  function changeMode(value) {
    setMode(value);
    setError('');
  }
  function goHome() {
    const { data } = useAppStore.getState();
    navigate(data.profile ? '/home' : '/onboarding', { replace: true });
  }
  async function submit(event) {
    event.preventDefault();
    setError('');
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const normalizedEmail = email.trim().toLowerCase();
    setBusy(true);
    try {
      if (mode === 'recuperar') {
        if (!account || account.demo || account.email !== normalizedEmail) {
          setError(
            'Não existe uma conta local com este e-mail neste navegador. Crie uma conta ou explore a demonstração.'
          );
          return;
        }
        changeMode('redefinir');
        notify('Recuperação local liberada. Nenhum e-mail foi enviado.');
        return;
      }
      if (mode === 'cadastro' || mode === 'redefinir') {
        if (values.password !== values.confirm) {
          setError('As senhas precisam ser iguais.');
          return;
        }
        const salt = crypto.randomUUID();
        const digest = await passwordDigest(values.password, salt);
        if (mode === 'redefinir') {
          if (account?.email !== normalizedEmail || account.demo) {
            setError('Reinicie a recuperação com o e-mail da conta local.');
            return;
          }
          useAppStore.setState({ account: { ...account, salt, digest } });
          changeMode('login');
          notify('Senha da demonstração redefinida neste navegador.');
          return;
        }
        const newAccount = {
          name: values.name.trim(),
          email: normalizedEmail,
          salt,
          digest,
          acceptedAt: new Date().toISOString(),
        };
        if (!newAccount.name) {
          setError('Informe seu nome.');
          return;
        }
        if (account) {
          setReplacement(newAccount);
          return;
        }
        useAppStore.getState().register(newAccount);
        navigate('/onboarding');
        return;
      }
      if (
        !account ||
        account.demo ||
        account.email !== normalizedEmail ||
        (await passwordDigest(values.password, account.salt)) !== account.digest
      ) {
        setError(
          'E-mail ou senha não correspondem à conta salva neste navegador.'
        );
        return;
      }
      useAppStore.getState().login();
      goHome();
    } catch {
      setError('Não foi possível concluir o acesso local. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={`${styles.auth} ${styles.app}`}>
      <header>
        <Link to='/' aria-label='Página inicial Iagora'>
          <img src={Logo} alt='Iagora' />
        </Link>
        <span className={styles.eyebrow}>SEU NOVO CAPÍTULO</span>
      </header>
      <div className={styles.authContent}>
        <div className={styles.stack}>
          <p className={styles.eyebrow}>UM PASSO DE CADA VEZ</p>
          <h1>{titles[mode]}</h1>
          <p className={styles.muted}>
            Demonstração local: a conta e os dados ficam apenas neste navegador.
            Nenhum acesso externo ou envio de e-mail é realizado.
          </p>
          <form onSubmit={submit} className={styles.form} key={mode}>
            {mode === 'cadastro' && (
              <Field
                label='Seu nome'
                name='name'
                autoComplete='name'
                required
                maxLength={80}
              />
            )}
            <Field
              label='E-mail'
              name='email'
              type='email'
              autoComplete='email'
              value={email}
              onChange={event => setEmail(event.target.value)}
              readOnly={mode === 'redefinir'}
              required
            />
            {mode !== 'recuperar' && (
              <Field
                label={
                  mode === 'redefinir'
                    ? 'Nova senha (mínimo 8 caracteres)'
                    : 'Senha (mínimo 8 caracteres)'
                }
                name='password'
                type='password'
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                minLength={8}
                maxLength={128}
                required
              />
            )}
            {['cadastro', 'redefinir'].includes(mode) && (
              <Field
                label='Confirme a senha'
                name='confirm'
                type='password'
                autoComplete='new-password'
                minLength={8}
                required
              />
            )}
            {mode === 'cadastro' && (
              <>
                <label className={styles.check}>
                  <input type='checkbox' required />
                  Li e aceito os termos e a política de privacidade desta
                  demonstração.
                </label>
                <div className={styles.actions}>
                  <button
                    type='button'
                    className={styles.textButton}
                    onClick={() => setLegal('Termos de uso')}
                  >
                    Ler termos
                  </button>
                  <button
                    type='button'
                    className={styles.textButton}
                    onClick={() => setLegal('Política de privacidade')}
                  >
                    Ler política de privacidade
                  </button>
                </div>
              </>
            )}
            {error && (
              <p role='alert' className={styles.error}>
                {error}
              </p>
            )}
            <Button color='laranja' disabled={busy}>
              {busy
                ? 'Aguarde…'
                : mode === 'login'
                  ? 'Entrar no meu cantinho →'
                  : mode === 'cadastro'
                    ? 'Criar conta local →'
                    : mode === 'recuperar'
                      ? 'Continuar recuperação local'
                      : 'Salvar nova senha'}
            </Button>
          </form>
          <div className={styles.actions}>
            {mode === 'login' ? (
              <>
                <button
                  className={styles.textButton}
                  onClick={() => changeMode('cadastro')}
                >
                  Criar conta
                </button>
                <button
                  className={styles.textButton}
                  onClick={() => changeMode('recuperar')}
                >
                  Esqueci a senha
                </button>
              </>
            ) : (
              <button
                className={styles.textButton}
                onClick={() => changeMode('login')}
              >
                Voltar para login
              </button>
            )}
          </div>
          <Button
            color='azul'
            onClick={() => {
              if (useAppStore.getState().startDemo()) goHome();
            }}
          >
            Explorar demonstração
          </Button>
          <small className={styles.muted}>
            O acesso com Google estará disponível quando houver integração de
            autenticação.
          </small>
        </div>
        <img src={Chave} alt='Chaves para seu novo capítulo' />
      </div>
      {legal && (
        <Modal title={legal} onClose={() => setLegal('')}>
          <div className={styles.stack}>
            <p>
              Esta versão permite experimentar os fluxos do Iagora com dados
              locais e exemplos fictícios. Não realiza contratação, pagamentos
              ou autenticação em serviços externos.
            </p>
            <p>
              Os dados de perfil, preferências e registros ficam no
              armazenamento deste navegador. A senha é representada por um
              resumo criptográfico local. Esta demonstração não oferece
              segurança de autenticação para uso em produção.
            </p>
            <p>
              Você pode apagar os dados em Meu perfil. Evite usar dados
              sensíveis. Termos definitivos serão necessários antes da
              disponibilização do serviço real.
            </p>
            <Button onClick={() => setLegal('')}>Entendi</Button>
          </div>
        </Modal>
      )}
      {replacement && (
        <Confirm
          title='Substituir a conta local?'
          description='Esta demonstração mantém uma conta por navegador. Criar outra conta remove os registros locais da conta anterior.'
          onClose={() => setReplacement(null)}
          onConfirm={() => {
            useAppStore.getState().deleteAccount();
            useAppStore.getState().register(replacement);
            navigate('/onboarding');
          }}
        />
      )}
    </main>
  );
}
