import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { Page, Panel, Field, ImageInput, Modal } from '../components/App/ui';
import CompanyPreview from '../components/App/companyPreview';
import { useAppStore } from '../store/useAppStore';
import { serviceCategories } from '../data/demo';
import styles from '../styles/app.module.css';

export default function PerfilEmpresa() {
  const company = useAppStore(state => state.data.company);
  const { update, notify } = useAppStore();
  const [draft, setDraft] = useState(company);
  const [preview, setPreview] = useState(false);
  function change(key, value) {
    setDraft(current => ({ ...current, [key]: value }));
  }
  function submit(event) {
    event.preventDefault();
    if (
      !draft.name.trim() ||
      !draft.description.trim() ||
      !draft.categories.trim() ||
      !draft.region.trim()
    ) {
      notify(
        'Preencha nome, descrição, ao menos uma categoria e região do negócio.'
      );
      return;
    }
    update({ company: { ...draft, name: draft.name.trim() } });
    notify(
      'Perfil comercial salvo. A apresentação dos seus anúncios já foi atualizada.'
    );
  }
  return (
    <Page
      title='Sua empresa. Sua assinatura.'
      eyebrow='PERFIL COMERCIAL'
      description='Apresente quem faz e como você pode ajudar.'
      action={
        <Button color='azul' onClick={() => setPreview(true)}>
          Prévia pública local
        </Button>
      }
    >
      <div className={styles.grid}>
        <Panel title='Informações do seu negócio'>
          <form className={styles.form} onSubmit={submit}>
            <Field
              label='Nome comercial ou profissional'
              value={draft.name}
              onChange={event => change('name', event.target.value)}
              required
              maxLength={100}
            />
            <Field
              label='Descrição do negócio'
              multiline
              value={draft.description}
              onChange={event => change('description', event.target.value)}
              maxLength={1500}
              required
            />
            <fieldset className={styles.stack}>
              <legend className='font-bold mb-2'>Categorias de atuação</legend>
              <div className={styles.formGrid}>
                {serviceCategories.map(category => {
                  const selected = draft.categories
                    .split(',')
                    .map(value => value.trim())
                    .filter(Boolean);
                  return (
                    <label key={category} className={styles.check}>
                      <input
                        type='checkbox'
                        checked={selected.includes(category)}
                        onChange={event =>
                          change(
                            'categories',
                            (event.target.checked
                              ? [...selected, category]
                              : selected.filter(value => value !== category)
                            ).join(', ')
                          )
                        }
                      />
                      {category}
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <div className={styles.formGrid}>
              <Field
                label='Telefone comercial'
                type='tel'
                value={draft.phone}
                onChange={event => change('phone', event.target.value)}
                maxLength={30}
              />
              <Field
                label='E-mail de contato'
                type='email'
                value={draft.email}
                onChange={event => change('email', event.target.value)}
                maxLength={120}
              />
            </div>
            <Field
              label='Região atendida'
              value={draft.region}
              onChange={event => change('region', event.target.value)}
              maxLength={150}
              required
            />
            <Field
              label='Endereço comercial (opcional)'
              value={draft.address}
              onChange={event => change('address', event.target.value)}
              maxLength={200}
            />
            <Field
              label='Site ou portfólio (opcional)'
              type='url'
              value={draft.website}
              onChange={event => change('website', event.target.value)}
              placeholder='https://'
              maxLength={300}
            />
            <Field
              label='Rede social (opcional)'
              value={draft.social}
              onChange={event => change('social', event.target.value)}
              maxLength={150}
            />
            <Field
              label='Horário de atendimento'
              value={draft.hours}
              onChange={event => change('hours', event.target.value)}
              maxLength={200}
              required
            />
            <ImageInput
              label='Logo'
              value={draft.logo}
              onChange={value => change('logo', value)}
            />
            <ImageInput
              label='Imagem do negócio'
              value={draft.image}
              onChange={value => change('image', value)}
            />
            <Button color='laranja'>Salvar perfil comercial</Button>
          </form>
        </Panel>
        <div className={styles.stack}>
          <Panel title='Prévia do seu perfil' className={styles.white}>
            <CompanyPreview company={draft} />
          </Panel>
          <p className={styles.info}>
            As alterações na prévia só aparecem no Marketplace depois de salvar.
            Os contatos específicos de cada anúncio continuam configurados na
            edição do serviço.
          </p>
          <Button as={Link} to='/meus-servicos' color='laranja'>
            Anunciar meu serviço ↗
          </Button>
        </div>
      </div>
      {preview && (
        <Modal
          title='Prévia pública demonstrativa'
          onClose={() => setPreview(false)}
        >
          <CompanyPreview company={draft} />
          <p className={`mt-4 ${styles.muted}`}>
            Prévia do formulário atual. Salve para atualizar os anúncios.
          </p>
        </Modal>
      )}
    </Page>
  );
}
