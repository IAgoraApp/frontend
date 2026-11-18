import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Botao, Titulo } from '../../../shared/ui';
import fotoPlanejamento from '../../onboarding/assets/onboarding-quero-morar-sozinho.jpg';
import fotoCasa from '../../onboarding/assets/onboarding-ja-moro-sozinho.jpg';
import { salvarMomentoPerfil } from '../perfilDados';

const momentos = [
  [
    1,
    'Já tenho minha casa',
    'Cuidar da casa, da rotina e das contas do dia a dia.',
    fotoCasa,
  ],
  [
    2,
    'Quero morar sozinho',
    'Planejar a mudança, estimar custos e encontrar meu espaço.',
    fotoPlanejamento,
  ],
];

export default function MomentoPerfilA({ perfil, aoSalvar }) {
  const [escolha, setEscolha] = useState(perfil.tipo);
  const [erro, setErro] = useState('');
  return (
    <section
      aria-labelledby='perfil-momento'
      className='rounded-2xl bg-(--azul-titulo) p-4 text-white sm:p-6'
    >
      <Titulo
        id='perfil-momento'
        classe='text-2xl font-extrabold text-white sm:text-3xl'
      >
        Escolha seu momento
      </Titulo>
      <p className='mt-1 text-sm text-[#d8e5ee]'>
        Em que etapa da sua vida você está?
      </p>
      <form
        onSubmit={evento => {
          evento.preventDefault();
          try {
            salvarMomentoPerfil(perfil.user_id, escolha);
            setErro('');
            aoSalvar('Seu momento foi atualizado.');
          } catch (falha) {
            setErro(falha.message);
          }
        }}
      >
        <fieldset className='mt-4 grid min-w-0 gap-3 sm:grid-cols-2'>
          <legend className='sr-only'>Momento de moradia</legend>
          {momentos.map(([id, titulo, descricao, foto]) => (
            <label key={id} className='relative block min-w-0 cursor-pointer'>
              <input
                type='radio'
                className='peer sr-only'
                name='momento'
                value={id}
                checked={escolha === id}
                onChange={() => setEscolha(id)}
              />
              <span className='block h-full overflow-hidden rounded-xl bg-white text-(--azul-titulo) ring-2 ring-transparent peer-checked:ring-[#ffb591] peer-focus-visible:ring-4 peer-focus-visible:ring-white'>
                <img
                  src={foto}
                  alt=''
                  className='h-28 w-full object-cover object-[center_38%] sm:h-40'
                />
                <span className='block p-3 sm:p-4'>
                  <strong className='block font-titulo text-lg leading-tight'>
                    {titulo}
                  </strong>
                  <span className='mt-1 block text-sm text-(--texto-apoio)'>
                    {descricao}
                  </span>
                </span>
              </span>
              {escolha === id && (
                <span className='absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-(--azul-titulo) text-white'>
                  <Check size={16} aria-hidden='true' />
                </span>
              )}
            </label>
          ))}
        </fieldset>
        {erro && (
          <p role='alert' className='mt-3 text-sm text-[#ffd4c9]'>
            {erro}
          </p>
        )}
        {escolha !== perfil.tipo ? (
          <div className='mt-4 flex flex-wrap justify-end gap-2'>
            <Botao
              type='button'
              variante='contorno'
              classe='text-sm'
              onClick={() => setEscolha(perfil.tipo)}
            >
              Cancelar
            </Botao>
            <Botao type='submit' classe='text-sm'>
              Salvar meu momento
            </Botao>
          </div>
        ) : (
          <Link
            to={perfil.tipo === 2 ? '/minhajornada' : '/casa'}
            className='mt-3 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[#ffcfb8] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2'
          >
            {perfil.tipo === 2 ? 'Abrir Minha Jornada' : 'Abrir Minha casa'}{' '}
            <ArrowRight size={16} aria-hidden='true' />
          </Link>
        )}
      </form>
    </section>
  );
}
