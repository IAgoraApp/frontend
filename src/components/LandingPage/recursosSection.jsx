import { Button, Title } from '../ui';
import { useState } from 'react';
import { Content } from '../../data/landingPage';

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

      <div className='flex gap-3 bg-(--azul-fundo) p-10 mt-10'>
        {Object.entries(content).map(([id, item]) => (
          <button
            key={id}
            onClick={() => {
              setValor(id);
            }}
            className={`
             ${
               id == valor
                 ? 'bg-(--azul-principal) text-white'
                 : 'bg-white text-(--azul-principal)'
             } rounded-full w-50 py-3 font-semibold `}
          >
            {item.nome}
          </button>
        ))}
      </div>
    </section>
  );
}
