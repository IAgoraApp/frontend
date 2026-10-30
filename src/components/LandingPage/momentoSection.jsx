import { Title, Button } from '../shared/ui';

export default function MomentoSection() {
  return (
    <section
      id='como-funciona'
      className='bg-(--azul-escuro) px-30 py-20 mt-40'
    >
      <Title variant='pequenoBc'>Cada começo tem seu jeito.</Title>
      <Title variant='normal' className='text-white text-7xl mb-10'>
        Em que momento você está?
      </Title>

      <div className='flex gap-10'>
        <div className='bg-(--laranja-principal) flex-1 p-10'>
          <Title as='h2' variant='pequenoBc' className='mb-2'>
            01 / Antes das chaves
          </Title>
          <Title as='h1' variant='normal' className='text-white text-5xl mb-5'>
            Vou morar sozinho
          </Title>
          <p className='text-white text-2xl mb-7'>
            Descubra quanto vai gastar e o que precisa levar antes de pegar as
            chaves.
          </p>
          <Button variant='link' color='branco'>
            Planejar minha mudança
          </Button>
        </div>
        <div className='bg-white flex-1 p-10'>
          <Title
            as='h2'
            variant='pequenoBc'
            className='mb-2 text-(--azul-escuro)!'
          >
            02 / A vida no seu canto{' '}
          </Title>
          <Title
            as='h1'
            variant='normal'
            className='text-(--azul-escuro) text-5xl mb-5'
          >
            Já tenho meu canto
          </Title>
          <p className='text-(--azul-escuro) text-2xl mb-7'>
            Organize contas, tarefas e refeições sem resolver tudo de uma vez.
          </p>
          <Button
            variant='link'
            color='branco'
            className='text-(--azul-escuro)!'
          >
            Cuidar da minha rotina
          </Button>
        </div>
      </div>
    </section>
  );
}
