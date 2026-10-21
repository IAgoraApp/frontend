import { Button, Title } from '../ui';
import { useState } from 'react';
import { Content } from '../../data/landingPage';
import { ArrowUpRight } from 'lucide-react';
import Prancheta from '../../assets/images/prancheta.png'

export default function RecursosSection() {
  const content = Content;
  const [valor, setValor] = useState(1);

  return (
    <section className='px-30 py-30'>
      <Title as='h2' variant='pequenoLj'>
        A vida real pede
      </Title>

      <Title as='h2' variant='normal' className='text-7xl'>
        Sua casa tem muitas partes. <br /> A ajuda também.
      </Title>

      <div className='bg-(--azul-fundo) p-10 pb-0 mt-10'>
        <div className='justify-between flex gap-5'>
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

        <div className='mt-10 flex'>
          <div className='w-1/3'><img src={Prancheta} alt="" /></div>
          <div>
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
    </section>
  );
}
