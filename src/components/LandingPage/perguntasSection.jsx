import { Title, Button } from '../ui';

const perguntas = [
  {
    id: 1,
    pergunta: 'Preciso de conta para conhecer o Iagora?',
    resposta:
      'Você pode explorar sem login. Para salvar listas e acompanhar sua rotina, crie uma conta.',
  },
  {
    id: 2,
    pergunta: 'O que encontro na plataforma?',
    resposta:
      'Guias, checklists, calculadoras, receitas e orientações para cuidar da sua casa.',
  },
  {
    id: 3,
    pergunta: 'É só para quem vai morar sozinho?',
    resposta:
      'Não. O Iagora também ajuda quem já mora sozinho e quer organizar o dia a dia.',
  },
];

export default function PerguntasSection() {
  return (
    <section id='perguntas-frequentes' className='px-30 bg-(--laranja-principal) py-20'>
      <Title variant='pequenoBc'>Sem complicação</Title>
      <Title variant='normal' className='text-6xl text-white'>
        Antes de começar
      </Title>

      <div className='flex flex-col gap-3 mt-5'>
        {perguntas.map(item => (
          <div key={item.id} className='p-6 bg-white'>
            <h3 className='text-xl font-bold text-(--azul-escuro) mb-2'>{item.pergunta}</h3>
            <p className='text-(--azul-escuro)'>{item.resposta}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
