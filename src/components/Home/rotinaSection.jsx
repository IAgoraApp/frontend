import { Title, Button } from '../shared/ui';
import Checklist from '../../assets/images/checklist.png'

export default function RotinaSection() {
  return (
    <section className='bg-(--laranja-fundo) w-full h-full flex items-center p-10'>
      <div className='w-full flex justify-between'>
        <div className='w-[60%]'>
          <Title as='h2' variant='pequenoLj'>
            Minha rotina
          </Title>
          <Title as='h1' variant='normal' className='mt-2'>
            Adicione sua primeira tarefa.
          </Title>
          <p className='text-(--texto-claro) mt-5'>
            Organize o que você precisa fazer na semana: casa, contas, compras e
            mais.
          </p>
          <Button variant='solido' color='laranja' className='mt-4'>Adicionar Tarefa</Button>
        </div>
        <div>
          <img className='w-full' src={Checklist} alt="" />
        </div>
      </div>
    </section>
  );
}
