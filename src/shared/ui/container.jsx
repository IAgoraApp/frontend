export function Container({
  como: Etiqueta = 'div',
  classe = '',
  children,
  ...propriedades
}) {
  return (
    <Etiqueta
      className={`mx-auto w-full max-w-(--largura-pagina) min-w-0 px-(--margem-pagina) ${classe}`}
      {...propriedades}
    >
      {children}
    </Etiqueta>
  );
}
