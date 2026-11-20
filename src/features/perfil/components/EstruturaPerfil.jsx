import { useState } from 'react';
import { Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Botao } from '../../../shared/ui';
import { extrairIniciais } from '../content';

function RetratoPerfil({ nome, foto }) {
  const [falhou, setFalhou] = useState(false);
  return foto && !foto.startsWith('/mock/') && !falhou ? (
    <img
      src={foto}
      alt=''
      referrerPolicy='no-referrer'
      onError={() => setFalhou(true)}
      className='size-full rounded-full object-cover'
    />
  ) : (
    <span
      aria-hidden='true'
      className='grid size-full place-items-center rounded-full bg-(--laranja-fundo) font-titulo text-3xl font-extrabold sm:text-4xl text-[#9d2c08]'
    >
      {extrairIniciais(nome)}
    </span>
  );
}

export function IdentidadePerfil({
  nome,
  email,
  foto,
  situacao,
  aoAlterarFoto,
  rotuloFoto = 'Alterar foto',
}) {
  return (
    <section
      aria-labelledby='perfil-nome'
      className='mb-4 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-3 rounded-2xl border border-(--borda-suave) bg-white p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-4 sm:p-5'
    >
      <div className='size-16 shrink-0 rounded-full bg-(--azul-fundo) p-1 sm:size-20'>
        <RetratoPerfil key={foto ?? 'padrao'} nome={nome} foto={foto} />
      </div>
      <div className='min-w-0 flex-1'>
        <h1
          id='perfil-nome'
          className='font-titulo text-2xl leading-tight font-extrabold wrap-anywhere sm:text-3xl'
        >
          {nome}
        </h1>
        <p className='text-sm wrap-anywhere text-(--texto-apoio)'>{email}</p>
        <p className='mt-1 text-sm font-bold text-[#9d2c08]'>{situacao}</p>
      </div>
      {aoAlterarFoto && (
        <Botao
          type='button'
          variante='contorno'
          classe='col-span-full justify-self-start gap-2 text-sm sm:col-span-1'
          onClick={aoAlterarFoto}
        >
          <Camera size={17} aria-hidden='true' /> {rotuloFoto}
        </Botao>
      )}
    </section>
  );
}

export function NavegacaoPerfil({ areas, rota, visao }) {
  return (
    <nav
      aria-label='Áreas do perfil'
      className='grid grid-cols-3 gap-1 rounded-xl border border-(--borda-suave) bg-white p-1.5 sm:p-2'
    >
      {areas.map(([id, nome, Icone]) => (
        <Link
          key={id}
          to={id === 'perfil' ? rota : rota + '?visao=' + id}
          aria-current={visao === id ? 'page' : undefined}
          className='flex min-h-11 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-center text-xs font-bold text-(--texto-apoio) hover:bg-(--azul-fundo) aria-[current=page]:bg-(--laranja-fundo) aria-[current=page]:text-[#9d2c08] sm:flex-row sm:gap-2 sm:px-3 sm:text-sm'
        >
          <Icone size={17} aria-hidden='true' className='shrink-0' /> {nome}
        </Link>
      ))}
    </nav>
  );
}
