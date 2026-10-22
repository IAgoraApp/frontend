import SectionHeading from '../Household/sectionHeading';
import { featuredRecipe } from '../../data/cozinha';

export default function ReceitaSection() {
  return (
    <section
      id='receita-do-dia'
      aria-labelledby='receita-titulo'
      className='flex flex-col gap-10'
    >
      <SectionHeading
        id='receita-titulo'
        eyebrow='RECEITA PRA HOJE'
        title='Poucos ingredientes. Muito sabor.'
      />
      <article className='grid min-w-0 gap-8 rounded-lg bg-(--azul-fundo) p-6 lg:grid-cols-[minmax(0,600fr)_minmax(0,616fr)]'>
        <img
          src={featuredRecipe.image}
          alt='Macarrão com molho de tomate e manjericão em um prato escuro'
          width={600}
          height={380}
          loading='lazy'
          className='aspect-[600/380] h-auto w-full rounded-lg object-cover lg:h-[380px]'
        />
        <div className='flex min-w-0 flex-col gap-4'>
          <p className='text-xs leading-[18px] font-bold text-(--laranja-principal)'>
            {featuredRecipe.name}
          </p>
          <h3 className='font-heading text-[34px] leading-10 font-extrabold'>
            Uma panela,
            <br />
            um almoço resolvido.
          </h3>
          <p className='text-xs leading-[18px] font-bold text-(--texto-apoio)'>
            {featuredRecipe.metadata}
          </p>
          <p className='text-lg leading-[26px]'>{featuredRecipe.ingredients}</p>
          <ol className='list-inside list-decimal text-[17px] leading-7 text-(--texto-apoio)'>
            {featuredRecipe.steps.map(step => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </article>
    </section>
  );
}
