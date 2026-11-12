const variantes = {
  normal: 'font-titulo text-4xl font-extrabold text-(--azul-titulo)',
  pequenoLaranja: 'text-sm font-bold uppercase tracking-[1px] text-(--laranja-principal)',
  pequenoBranco: 'text-sm font-bold uppercase tracking-[1px] text-white',
};

export function Titulo({
  variante = '',
  classe = '',
  children,
  como: Etiqueta = 'h2',
  ...propriedades
}) {
  return (
    <Etiqueta
      className={`font-titulo ${variantes[variante] ?? ''} ${classe}`}
      {...propriedades}
    >
      {children}
    </Etiqueta>
  );
}
