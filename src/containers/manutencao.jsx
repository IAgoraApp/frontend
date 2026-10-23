import { Link } from 'react-router-dom';
import { LandingLayout } from '../layouts';
import { Button } from '../components/ui';
import { Page, Panel } from '../components/App/ui';

export default function Manutencao() {
  return (
    <LandingLayout>
      <Page
        title='Este recurso está em preparação.'
        eyebrow='UM PASSO DE CADA VEZ'
        description='Você pode continuar explorando os módulos disponíveis do Iagora.'
      >
        <Panel title='Seu agora continua por aqui.'>
          <p>
            As integrações externas serão disponibilizadas em uma etapa futura.
            A demonstração já permite organizar sua rotina, planejar sua mudança
            e conhecer a experiência de divulgação de serviços.
          </p>
          <Button as={Link} to='/home' color='laranja'>
            Abrir minha experiência
          </Button>
          <Button as={Link} to='/' color='azul'>
            Voltar ao início
          </Button>
        </Panel>
      </Page>
    </LandingLayout>
  );
}
