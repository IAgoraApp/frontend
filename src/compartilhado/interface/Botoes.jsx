
const variantes = {
  solido: 'rounded-full px-7 py-3 min-h-[48px] font-bold',
  secundario:
    'rounded-full border border-[#dbe5ed] bg-[#f4f7fa] px-6 py-3 min-h-[48px] font-bold text-(--azul-titulo) hover:bg-[#e7eef4]',
  fantasma:
    'rounded-full bg-white px-6 py-3 min-h-[48px] font-bold text-(--azul-titulo) hover:bg-[#f4f7fa]',
  escuro:
    'rounded-full bg-[#102a43] px-7 py-3 min-h-[48px] font-bold text-white hover:bg-[#0c1f32]',
  contorno:
    'rounded-full border border-[#dbe5ed] bg-white px-6 py-3 min-h-[48px] font-bold text-(--azul-titulo) hover:bg-[#f4f7fa]',
  link: 'gap-2 font-bold',
};

const cores = {
  azul: {
    solido: 'bg-(--azul-principal) text-white hover:opacity-90',
    link: 'text-(--azul-principal)',
  },
  laranja: {
    solido: 'bg-(--laranja-principal) text-white hover:bg-[#c43300]',
    link: 'text-(--laranja-principal)',
  },
  marinho: {
    solido: 'bg-(--azul-titulo) text-white hover:bg-[#0c1f32]',
    link: 'text-(--azul-titulo)',
  },
  preto: {
    solido: 'bg-gray-900 text-white hover:bg-gray-700',
    link: 'text-gray-900',
  },
  branco: {
    solido: 'bg-white text-(--azul-titulo) hover:bg-[#f4f7fa]',
    link: 'text-white',
  },
};

export function Botao({
  como: Etiqueta = 'button',
  variante = 'solido',
  cor = 'laranja',
  children,
  classe = '',
  semEstilo = false,
  ...propriedades
}) {
  const estiloVariante = variantes[variante] ?? variantes.solido;
  const estiloCor =
    variante === 'solido' || variante === 'link'
      ? (cores[cor]?.[variante] ?? cores.laranja.solido)
      : '';

  return (
    <Etiqueta
      className={`inline-flex cursor-pointer items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(--laranja-principal) ${
        semEstilo ? '' : `${estiloVariante} ${estiloCor}`
      } ${classe}`}
      {...propriedades}
    >
      {children}
    </Etiqueta>
  );
}
