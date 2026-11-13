import guiaPrimeirosCuidados from '../../ativos/imagens/fotografias/guia-primeiros-cuidados.png';
import apartamentoVilaMariana from '../../ativos/imagens/fotografias/apartamento-vila-mariana.jpg';
import studioSpIagora from '../../ativos/imagens/fotografias/studio-sp-iagora.jpg';
import imovelInterior from '../../ativos/imagens/fotografias/imovel-interior.png';
import imovelCasa from '../../ativos/imagens/fotografias/imovel-casa.png';
import editorialCozinha from '../../ativos/imagens/fotografias/editorial-cozinha.png';
import fachadaApartamentoSp from '../../ativos/imagens/fotografias/fachada-apartamento-sp.jpg';

export const CHAVE_BUSCA_CASA = 'iagora_encontrar_casa_filtros_v1';

export const imoveisExemplo = [
  {
    id: 'imovel-1',
    seloHub: 'APARTAMENTO · SÃO PAULO, SP',
    tituloHub: 'Um começo compacto e acolhedor',
    detalheHub: '38 m² · 1 quarto · cozinha integrada',
    titulo: 'Apartamento na Vila Mariana',
    bairro: 'Vila Mariana',
    cidade: 'São Paulo, SP',
    tipo: 'Apartamento',
    quartos: 1,
    area: 38,
    aluguel: 1200,
    condominio: 250,
    total: 1450,
    aceitaPet: true,
    proximoTransporte: true,
    mobiliado: false,
    imagem: guiaPrimeirosCuidados,
    alt: 'Apartamento compacto na Vila Mariana com sala e cozinha integradas',
    galeria: [
      guiaPrimeirosCuidados,
      imovelInterior,
      editorialCozinha,
      apartamentoVilaMariana,
    ],
    descricao:
      'Apartamento de exemplo com sala, cozinha, banheiro e um quarto. Transporte nas proximidades e fácil acesso a serviços essenciais.',
  },
  {
    id: 'imovel-2',
    seloHub: 'STUDIO · SÃO PAULO, SP',
    tituloHub: 'Praticidade perto de tudo',
    detalheHub: '32 m² · 1 quarto · próximo ao metrô',
    titulo: 'Studio em Pinheiros',
    bairro: 'Pinheiros',
    cidade: 'São Paulo, SP',
    tipo: 'Studio',
    quartos: 1,
    area: 32,
    aluguel: 1400,
    condominio: 300,
    total: 1700,
    aceitaPet: false,
    proximoTransporte: true,
    mobiliado: true,
    imagem: studioSpIagora,
    alt: 'Studio iluminado em Pinheiros com layout funcional',
    galeria: [studioSpIagora, imovelInterior, guiaPrimeirosCuidados],
    descricao:
      'Studio de exemplo bem iluminado com mobiliário básico, ideal para quem busca deslocamento rápido a pé ou de metrô.',
  },
  {
    id: 'imovel-3',
    seloHub: 'APARTAMENTO · SÃO PAULO, SP',
    tituloHub: 'Equilíbrio no orçamento',
    detalheHub: '32 m² · 1 quarto · bairro tranquilo',
    titulo: 'Apartamento na Saúde',
    bairro: 'Saúde',
    cidade: 'São Paulo, SP',
    tipo: 'Apartamento',
    quartos: 1,
    area: 32,
    aluguel: 1050,
    condominio: 200,
    total: 1250,
    aceitaPet: true,
    proximoTransporte: true,
    mobiliado: false,
    imagem: fachadaApartamentoSp,
    alt: 'Edifício residencial no bairro Saúde em São Paulo',
    galeria: [fachadaApartamentoSp, guiaPrimeirosCuidados, imovelInterior],
    descricao:
      'Apartamento de exemplo em rua arborizada próximo à estação Saúde, pensado para caber com folga no primeiro orçamento.',
  },
  {
    id: 'imovel-4',
    seloHub: 'CASA · REGIÃO METROPOLITANA',
    tituloHub: 'Mais espaço para chamar de seu',
    detalheHub: '2 quartos · quintal · espaço para dividir',
    titulo: 'Casa com quintal na Zona Sul',
    bairro: 'Jabaquara',
    cidade: 'Região Metropolitana',
    tipo: 'Casa',
    quartos: 2,
    area: 68,
    aluguel: 1850,
    condominio: 0,
    total: 1850,
    aceitaPet: true,
    proximoTransporte: true,
    mobiliado: false,
    imagem: imovelCasa,
    alt: 'Casa residencial amarela com jardim frontal',
    galeria: [imovelCasa, editorialCozinha, imovelInterior],
    descricao:
      'Casa de exemplo com dois quartos, quintal e possibilidade de dividir moradia para equilibrar custos fixos.',
  },
];

export const filtrosIniciaisCasa = {
  local: '',
  teto: '',
  tipo: '',
  quartos: '',
  prioridade: '',
  distancia: 'Até 30 minutos do trabalho',
  aceitaPet: false,
  proximoTransporte: false,
  mobiliado: false,
};

export function lerFiltrosCasa() {
  try {
    const salvo = localStorage.getItem(CHAVE_BUSCA_CASA);
    if (!salvo) return filtrosIniciaisCasa;
    return { ...filtrosIniciaisCasa, ...JSON.parse(salvo) };
  } catch {
    return filtrosIniciaisCasa;
  }
}

export function filtrarImoveis(lista, filtros) {
  return lista.filter(imovel => {
    if (filtros.local?.trim()) {
      const termo = filtros.local.trim().toLowerCase();
      const bate =
        imovel.bairro.toLowerCase().includes(termo) ||
        imovel.cidade.toLowerCase().includes(termo) ||
        imovel.titulo.toLowerCase().includes(termo);
      if (!bate) return false;
    }
    const tetoNum = Number(
      String(filtros.teto || '')
        .replace(/[^\d,.]/g, '')
        .replace(/\./g, '')
        .replace(',', '.')
    );
    if (tetoNum > 0 && imovel.total > tetoNum) return false;
    if (filtros.tipo?.trim()) {
      const termoTipo = filtros.tipo.trim().toLowerCase();
      if (!imovel.tipo.toLowerCase().includes(termoTipo)) return false;
    }
    const minQuartos = parseInt(String(filtros.quartos || ''), 10);
    if (Number.isFinite(minQuartos) && imovel.quartos < minQuartos) {
      return false;
    }
    if (filtros.aceitaPet && !imovel.aceitaPet) return false;
    if (filtros.proximoTransporte && !imovel.proximoTransporte) return false;
    if (filtros.mobiliado && !imovel.mobiliado) return false;
    return true;
  });
}
