import { Titulo } from './Titulos';

export function CabecalhoSecao({
  sobretitulo,
  children,
  inverso = false,
  id,
  classe = '',
  classeSobretitulo = '',
  classeTitulo = '',
}) {
  return (
    <header className={`flex min-w-0 flex-col gap-[5px] ${classe}`}>
      <Titulo
        como='p'
        variante={inverso ? 'pequenoBranco' : 'pequenoLaranja'}
        classe={`shrink-0 font-corpo! text-sm leading-[21px] font-bold tracking-[1px] sm:text-base ${classeSobretitulo}`}
      >
        {sobretitulo}
      </Titulo>
      <Titulo
        como='h2'
        id={id}
        variante='normal'
        classe={`shrink-0 text-[clamp(1.75rem,2.5vw,2.25rem)]! leading-[1.15] font-extrabold! ${
          inverso ? 'text-white!' : ''
        } ${classeTitulo}`}
      >
        {children}
      </Titulo>
    </header>
  );
}
