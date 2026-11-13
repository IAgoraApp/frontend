import { Link } from 'react-router-dom';
import { Botao, Titulo } from '../../../compartilhado/interface/indice';
import fotoApartamento from '../../../ativos/imagens/fotografias/jornada-apartamento.png';
import fotoEssenciais from '../../../ativos/imagens/fotografias/editorial-essenciais.png';

export default function CartoesJornada() {
  const cartoes = [
    {
      imagem: fotoApartamento,
      alt: 'Sala e cozinha integrada de um studio mobiliado e bem iluminado',
      eyebrow: '01 / ENCONTRE SEU LUGAR',
      titulo: 'Um endereço para o seu agora',
      descricao:
        'Compare o espaço, a região e o gasto total antes de escolher.',
      acao: "Encontrar casa",
      rota: '/encontrar-casa',
    },
    {
      imagem: fotoEssenciais,
      alt: 'Utensílios básicos de cozinha e limpeza organizados sobre mesa de madeira',
      eyebrow: '02 / APRENDA O BÁSICO',
      titulo: 'Chegar com mais repertório',
      descricao: 'O essencial para cuidar da casa desde os primeiros dias.',
      acao: "Aprender a morar",
      rota: '/aprendendo',
    },
  ];

  return (
    <section className='mt-10 grid gap-6 md:grid-cols-2'>
      {cartoes.map(cartao => (
        <article
          key={cartao.rota}
          className='flex flex-col overflow-hidden rounded-lg bg-(--azul-fundo)'
        >
          <img
            src={cartao.imagem}
            alt={cartao.alt}
            className='aspect-[636/350] w-full object-cover'
          />
          <div className='flex flex-1 flex-col justify-between gap-4 p-6'>
            <div className='space-y-2.5'>
              <p className='text-xs font-bold tracking-[0.06em] text-[#d54c15]'>
                {cartao.eyebrow}
              </p>
              <Titulo classe='text-2xl leading-tight font-extrabold sm:text-3xl'>
                {cartao.titulo}
              </Titulo>
              <p className='text-sm leading-relaxed text-(--texto-apoio)'>
                {cartao.descricao}
              </p>
            </div>
            <Botao
              como={Link}
              to={cartao.rota}
              cor='laranja'
              classe='w-full rounded-full whitespace-nowrap'
            >
              {cartao.acao}
            </Botao>
          </div>
        </article>
      ))}
    </section>
  );
}
