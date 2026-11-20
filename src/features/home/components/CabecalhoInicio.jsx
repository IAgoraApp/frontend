import { Link } from 'react-router-dom';
import { Titulo } from '../../../shared/ui';

export default function CabecalhoInicio({
  titulo,
  rotulo,
  contexto,
  destino,
  estado,
  acao,
  atalhos,
}) {
  return (
    <>
      <div className='inicio-boas-vindas flex flex-col justify-between gap-6 lg:flex-row lg:items-center'>
        <Titulo
          como='h1'
          classe='text-3xl leading-tight font-extrabold sm:text-4xl'
        >
          {titulo}
        </Titulo>
        <div className='flex min-w-0 items-center justify-between gap-6 rounded-[10px] bg-(--azul-fundo) px-5 py-4 lg:w-[445px]'>
          <div className='min-w-0'>
            <p className='text-xs font-bold tracking-[1.5px] text-(--laranja-principal)'>
              {rotulo}
            </p>
            <p className='mt-1 truncate font-bold text-(--azul-titulo)'>
              {contexto}
            </p>
          </div>
          <Link
            to={destino}
            state={estado}
            className='inline-flex min-h-11 shrink-0 items-center font-bold text-(--laranja-principal)'
          >
            {acao}
          </Link>
        </div>
      </div>

      <nav
        className='inicio-ferramentas'
        aria-label='Ferramentas'
        data-preparacao={atalhos.length === 4}
      >
        {atalhos.map(item => (
          <Link key={item.rota} to={item.rota}>
            {item.Icone ? (
              <item.Icone
                size={24}
                aria-hidden='true'
                className='shrink-0 text-(--azul-principal)'
              />
            ) : (
              <span
                aria-hidden='true'
                className='inicio-ferramentas-icone'
                style={{ '--ferramenta-icone': `url("${item.icone}")` }}
              />
            )}
            {item.rotulo}
          </Link>
        ))}
      </nav>
    </>
  );
}
