import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { Page, Panel, Shortcut } from '../components/App/ui';
import { serviceCategories } from '../data/demo';
import Services from '../assets/images/services.png';
import styles from '../styles/app.module.css';

export default function CadastroEmpresa() {
  return (
    <Page
      title='Você cuida de casas. A gente aproxima caminhos.'
      eyebrow='IAGORA PARA PRESTADORES DE SERVIÇO'
      description='Um espaço para apresentar seu trabalho e ser encontrado por quem precisa.'
      action={
        <Button as={Link} to='/cadastro' color='laranja'>
          Começar meu cadastro
        </Button>
      }
    >
      <section className={styles.hero}>
        <div className={styles.stack}>
          <h2>Seu negócio, mais perto de quem precisa.</h2>
          <p>
            Organize seus serviços, descreva seu atendimento e mantenha seu
            perfil comercial em um só lugar.
          </p>
          <p className={styles.muted}>
            Nesta versão, você pode experimentar o fluxo completo com
            publicações e contatos locais, sem pagamento ou contratação real.
          </p>
          <Button as={Link} to='/login' color='laranja'>
            Experimentar como anunciante ↗
          </Button>
        </div>
        <img src={Services} alt='Profissional com materiais de limpeza' />
      </section>
      <div className={styles.grid3}>
        {[
          [
            'Mostre seu trabalho',
            'Descreva o que está incluído, adicione fotos locais e defina sua região.',
          ],
          [
            'Organize seus anúncios',
            'Salve rascunhos, publique na demonstração e acompanhe cada status.',
          ],
          [
            'Entenda sua presença',
            'Veja indicadores gerados pelas interações feitas neste navegador.',
          ],
        ].map(([title, description]) => (
          <Panel key={title} title={title}>
            <p className={styles.muted}>{description}</p>
          </Panel>
        ))}
      </div>
      <Panel title='Tem espaço para o que você faz.'>
        <div className={styles.grid}>
          {serviceCategories.map(title => (
            <Shortcut
              key={title}
              to='/login'
              title={title}
              description='Conheça a experiência de divulgação local'
            />
          ))}
        </div>
      </Panel>
      <Panel title='Como funciona.'>
        <ol className='grid md:grid-cols-3 gap-8 list-decimal list-inside'>
          {[
            [
              'Crie seu perfil',
              'Cadastre uma conta local e escolha “Quero anunciar meu serviço”.',
            ],
            [
              'Apresente seu negócio',
              'Complete informações comerciais, contatos e região atendida.',
            ],
            [
              'Publique seu serviço',
              'Preencha o anúncio e veja como ele aparece no Marketplace demonstrativo.',
            ],
          ].map(([title, description]) => (
            <li key={title}>
              <strong className='font-heading text-xl'>{title}</strong>
              <p className='mt-3'>{description}</p>
            </li>
          ))}
        </ol>
      </Panel>
      <Panel title='Perguntas de quem quer anunciar.'>
        {[
          [
            'A publicação já fica disponível na internet?',
            'Não. Nesta versão os anúncios ficam salvos somente no seu navegador. A publicação para outros usuários depende da futura integração com backend.',
          ],
          [
            'Preciso pagar para experimentar?',
            'Esta demonstração não realiza cobranças ou pagamentos. As condições comerciais de um serviço real ainda não estão definidas.',
          ],
          [
            'Posso cadastrar vários serviços?',
            'Sim. Crie, edite, pause e exclua seus anúncios pelo Dashboard local.',
          ],
          [
            'Como funcionam os contatos?',
            'Você pode salvar uma solicitação demonstrativa no Marketplace. Nenhuma mensagem é enviada ao anunciante.',
          ],
        ].map(([question, answer]) => (
          <details key={question}>
            <summary className={styles.summary}>{question}</summary>
            <p className={styles.muted}>{answer}</p>
          </details>
        ))}
      </Panel>
      <Panel title='Vamos conversar.' className={styles.dark}>
        <p>
          Dúvidas sobre o projeto? Use o canal de contato informado pelo Iagora.
        </p>
        <div className={styles.actions}>
          <Button as='a' href='mailto:Iagora@hotmail.com' color='laranja'>
            Contato e suporte por e-mail
          </Button>
          <Button as={Link} to='/cadastro' color='branco'>
            Cadastrar meu negócio ↗
          </Button>
        </div>
      </Panel>
    </Page>
  );
}
