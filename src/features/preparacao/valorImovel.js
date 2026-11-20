export function tipoValorImovel(imovel) {
  if (imovel?.valor_tipo) return imovel.valor_tipo;
  if (imovel?.valor == null) return null;
  return /casa|sobrado/i.test(imovel.tipo ?? '') ? 'total' : 'mensal';
}
