import SectionHeading from '../Household/sectionHeading';
import Checklist from '../Household/checklist';
import { shoppingSteps } from '../../data/cozinha';

export default function ComprasSection() {
  return (
    <section
      id='lista-compras'
      aria-labelledby='compras-titulo'
      className='flex flex-col gap-10'
    >
      <SectionHeading
        id='compras-titulo'
        eyebrow='ANTES DO MERCADO'
        title='Abra a geladeira. Depois, a lista.'
      />
      <Checklist
        items={shoppingSteps}
        storageKey='iagora:cozinha:compras'
        label='Preparação para as compras'
      />
    </section>
  );
}
