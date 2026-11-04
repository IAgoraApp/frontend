import { Accordion, Container, SectionHeading } from '../../../shared/ui';
import { questions } from '../content';

export default function QuestionsSection() {
  return (
    <section
      id='perguntas-frequentes'
      aria-labelledby='perguntas-title'
      className='scroll-mt-6 bg-white'
    >
      <Container className='py-11 lg:min-h-[302px]'>
        <SectionHeading
          id='perguntas-title'
          eyebrow='DÚVIDAS FREQUENTES'
          className='lg:h-[60px] lg:justify-center'
        >
          Tudo o que você precisa saber.
        </SectionHeading>
        <div className='mt-4 grid items-start gap-[18px] lg:min-h-[138px] lg:grid-cols-2'>
          <Accordion items={questions.slice(0, 2)} />
          <Accordion items={questions.slice(2)} />
        </div>
      </Container>
    </section>
  );
}
