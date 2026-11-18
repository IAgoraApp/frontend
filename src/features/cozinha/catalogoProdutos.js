export const unidadesProduto = [
  ['un', 'unidades'],
  ['kg', 'kg'],
  ['g', 'g'],
  ['L', 'L'],
  ['ml', 'ml'],
];

export function medidaProduto(produto) {
  return (
    unidadesProduto.find(([id]) => id === produto?.unidade)?.[1] ||
    produto?.unidade ||
    'unidades'
  );
}
