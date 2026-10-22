import SectionHeading from '../Household/sectionHeading';
import Checklist from '../Household/checklist';
import { houseChecklist } from '../../data/casa';

export default function CuidadosSection() {
  return (
    <section aria-labelledby='cuidados-titulo' className='flex flex-col gap-10'>
      <SectionHeading
        id='cuidados-titulo'
        eyebrow='PEQUENOS CUIDADOS'
        title='O básico que faz diferença.'
      />
      <Checklist
        items={houseChecklist}
        storageKey='iagora:casa:cuidados'
        label='Pequenos cuidados da casa'
      />
    </section>
  );
}
