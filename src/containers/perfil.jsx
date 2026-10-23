import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { Page, Panel, Field, Confirm, Badge } from '../components/App/ui';
import { useAppStore } from '../store/useAppStore';
import { profiles } from '../data/demo';
import styles from '../styles/app.module.css';

export default function Perfil() {
  const { person, profile, house } = useAppStore(state => state.data);
  const update = useAppStore(state => state.update);
  const notify = useAppStore(state => state.notify);
  const [deleting, setDeleting] = useState(false);
  const [switchProfile, setSwitchProfile] = useState(profile);
  const navigate = useNavigate();
  function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (!values.name.trim()) {
      notify('Informe seu nome para salvar.');
      return;
    }
    const email = values.email.trim().toLowerCase();
    update({
      person: {
        ...person,
        name: values.name.trim(),
        email,
        phone: values.phone,
        city: values.city,
        bio: values.bio,
      },
    });
    const account = useAppStore.getState().account;
    if (account && !account.demo)
      useAppStore.setState({ account: { ...account, email } });
    notify('Seu perfil foi atualizado neste navegador.');
  }
  return (
    <Page
      title='Meu perfil'
      eyebrow='SEU CANTO, DO SEU JEITO'
      description='Cuide dos seus dados e escolha o seu momento.'
    >
      <div className={styles.grid}>
        <Panel title='Sobre você'>
          <Badge>Conta demonstrativa local</Badge>
          <form className={styles.form} onSubmit={submit}>
            <Field
              label='Nome'
              name='name'
              defaultValue={person.name}
              maxLength={80}
              required
            />
            <Field
              label='E-mail de acesso local'
              name='email'
              type='email'
              defaultValue={person.email || 'demo@iagora.local'}
              required
              maxLength={120}
            />
            <small className={styles.muted}>
              A alteração também atualiza o login da conta local, sem
              confirmação por e-mail.
            </small>
            <Field
              label='Telefone'
              type='tel'
              name='phone'
              defaultValue={person.phone}
              maxLength={30}
            />
            <Field
              label='Cidade'
              name='city'
              defaultValue={person.city}
              maxLength={80}
            />
            <Field
              label='Sobre você'
              name='bio'
              multiline
              defaultValue={person.bio}
              maxLength={500}
            />
            <Button color='laranja'>Salvar informações</Button>
          </form>
        </Panel>
        <div className={styles.stack}>
          <Panel title='Seu momento'>
            <p className={styles.muted}>
              Troque de perfil para experimentar cada jornada. Seus registros
              permanecem salvos.
            </p>
            <Field
              label='Tipo de perfil'
              value={switchProfile}
              onChange={event => setSwitchProfile(event.target.value)}
            >
              {profiles.map(item => (
                <option value={item.id} key={item.id}>
                  {item.title}
                </option>
              ))}
            </Field>
            <Button
              color='laranja'
              onClick={() => {
                update({ profile: switchProfile });
                notify('Seu momento foi atualizado.');
                navigate('/home');
              }}
            >
              Usar este perfil
            </Button>
          </Panel>
          <Panel title='Preferências e privacidade'>
            {[
              ['notifications', 'Mostrar lembretes e notificações locais'],
              ['suggestions', 'Mostrar sugestões demonstrativas'],
              [
                'privacy',
                'Manter minhas preferências de privacidade restritas',
              ],
            ].map(([key, label]) => (
              <label key={key} className={styles.check}>
                <input
                  type='checkbox'
                  checked={person[key]}
                  onChange={event => {
                    update({
                      person: { ...person, [key]: event.target.checked },
                    });
                    notify('Preferência salva.');
                  }}
                />
                {label}
              </label>
            ))}
            <p className={styles.muted}>
              Nenhum dado é enviado a um servidor nesta versão. As preferências
              de privacidade ficam registradas para a futura integração.
            </p>
          </Panel>
          <Panel title='Dados de moradia'>
            <p>
              {house
                ? `${house.name} · ${house.city}`
                : 'Você ainda não cadastrou sua residência.'}
            </p>
            {profile === 'morando' ? (
              <Button as={Link} to='/casa' color='azul'>
                Editar minha residência
              </Button>
            ) : (
              <>
                <Field
                  label='Moradia atual'
                  value={person.housing || ''}
                  onChange={event =>
                    update({
                      person: { ...person, housing: event.target.value },
                    })
                  }
                  maxLength={120}
                  placeholder='Ex.: Moro com a família'
                />
                <p className={styles.muted}>
                  Essa informação é salva automaticamente.
                </p>
              </>
            )}
          </Panel>
        </div>
      </div>
      <Panel title='Sua sessão' className={styles.white}>
        <div className={styles.actions}>
          <Button
            color='azul'
            onClick={() => {
              useAppStore.getState().logout();
              navigate('/login');
            }}
          >
            Sair da conta local
          </Button>
          <button
            className={styles.textButton}
            onClick={() => setDeleting(true)}
          >
            Excluir conta e dados locais
          </button>
        </div>
        <p className={styles.muted}>
          A exclusão demonstrativa apaga os registros do Iagora deste navegador.
          Não há solicitação enviada a um servidor.
        </p>
      </Panel>
      {deleting && (
        <Confirm
          title='Excluir sua conta local?'
          description='Seu perfil, tarefas, favoritos, finanças e anúncios serão apagados deste navegador. Esta ação não pode ser desfeita.'
          onClose={() => setDeleting(false)}
          onConfirm={() => {
            useAppStore.getState().deleteAccount();
            navigate('/login', { replace: true });
          }}
        />
      )}
    </Page>
  );
}
