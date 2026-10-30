import { Title } from '../shared/ui';
import { IconCard } from '../shared/cards';
import { Items } from '../../data/home';

const items = Items;

export default function NavSection() {
  return (
    <section className='bg-(--azul-fundo) w-full p-5 flex flex-col gap-2 mt-5'>
      <Title as='h2' variant='pequenoLj'>
        Ferramentas para a vida real
      </Title>

      <div className='flex justify-between pr-10'>
        {items.map(i => {
          const Icone = i.icone;

          return (
            <IconCard
              icone={
                <Icone
                  size={30}
                  className='group-hover:text-(--laranja-principal) transition-all'
                />
              }
              className='group w-full hover:bg-(--laranja-principal) transition-all cursor-pointer hover:text-white'
            >
              <span className='group-hover:text-white transition-all'>
                {i.texto}
              </span>
            </IconCard>
          );
        })}
      </div>
    </section>
  );
}
