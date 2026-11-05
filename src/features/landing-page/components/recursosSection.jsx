import { Button, Container, Title } from '../../../shared/ui';
import { useState } from 'react';
import { Content } from '../content';
import { ArrowUpRight } from 'lucide-react';
import Prancheta from '../assets/prancheta.png';

export default function RecursosSection() {
  const content = Content;
  const [valor, setValor] = useState(1);

  return (
    <Container as='section' id='funcionalidades' className='py-16 sm:py-30'>
      <Title as='h2' variant='pequenoLj'>
        A vida real pede
      </Title>

      <Title
        as='h2'
        variant='normal'
        className='text-4xl! sm:text-5xl! lg:text-7xl!'
      >
        Sua casa tem muitas partes. <br /> A ajuda também.
      </Title>

      <div className='min-w-0 bg-(--azul-fundo) p-4 sm:p-10 pb-0! mt-10'>
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5'>
          {Object.entries(content).map(([id, item]) => (
            <button
              key={id}
              onClick={() => {
                setValor(id);
              }}
              className={`
             ${
               id == valor
                 ? 'bg-(--azul-escuro) text-white'
                 : 'bg-white text-(--azul-escuro) hover:bg-gray-200'
             } rounded-full w-full py-3 font-semibold transition-colors duration-300 cursor-pointer`}
            >
              {item.nome}
            </button>
          ))}
        </div>

        <div className='mt-10 flex min-w-0 flex-col gap-6 pb-6 md:flex-row'>
          <div className='w-full max-w-64 md:w-1/3 md:shrink-0'>
            <img src={Prancheta} alt='' />
          </div>
          <div className='min-w-0'>
            <Title variant='pequenoLj' className='mb-5'>
              {valor} / {content[valor].nome}
            </Title>
            <Title variant='normal' className='mb-4'>
              {content[valor].titulo}
            </Title>
            <p className='mb-7'>{content[valor].desc}</p>

            <Button color='laranja'>
              Explorar guias
              <ArrowUpRight />
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
