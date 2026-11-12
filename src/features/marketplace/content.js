import iconeLimpeza from './assets/limpeza.svg';
import iconeManutencao from './assets/manutencao.svg';
import iconeMudancas from './assets/mudancas.svg';
import iconeInstalacoes from './assets/instalacoes.svg';
import iconeReparos from './assets/reparos.svg';
import iconeJardinagem from './assets/jardinagem.svg';
import iconeDedetizacao from './assets/dedetizacao.svg';
import iconeOutros from './assets/outros.svg';
import editorialServicos from '../empresa-acesso/assets/equipe-servicos.png';
import editorialApartamento from '../casa/assets/PhotoAmbienteDaResidencia.png';
import editorialEssenciais from '../empresa/assets/PhotoEssentials.png';
import equipeServicos from '../empresa/assets/ServiceCover.png';
import empresaFotoUm from '../empresa/assets/PhotoServices.png';
import empresaFotoDois from '../empresa/assets/empresa-foto-2.png';
import empresaAnuncioPrevia from '../empresa/assets/EditorialPhotoServices.png';
import empresaPortfolioAmostra from '../empresa/assets/empresa-portfolio-amostra.png';
import planejamentoMudanca from '../home-B/assets/planejamento-mudanca.png';
import mapaSaoPaulo from './assets/mapa-sao-paulo.png';
import { normalizarTexto } from '../../app/estado/estadoEmpresa';

export const fotosMercado = {
  editorialServicos,
  editorialApartamento,
  editorialEssenciais,
  equipeServicos,
  empresaFotoUm,
  empresaFotoDois,
  empresaAnuncioPrevia,
  empresaPortfolioAmostra,
  planejamentoMudanca,
  mapaSaoPaulo,
};

export const categoriasMercado = [
  {
    slug: 'limpeza',
    nome: 'Limpeza',
    descricao: 'Diaristas, pós-mudança e limpeza comercial.',
    icone: iconeLimpeza,
    subcategorias: ['Residencial', 'Pós-mudança', 'Comercial'],
  },
  {
    slug: 'manutencao',
    nome: 'Manutenção',
    descricao: 'Hidráulica, elétrica e ajustes preventivos.',
    icone: iconeManutencao,
    subcategorias: ['Hidráulica', 'Elétrica', 'Preventiva'],
  },
  {
    slug: 'mudancas',
    nome: 'Mudanças',
    descricao: 'Carretos, desmontagem e transporte seguro.',
    icone: iconeMudancas,
    subcategorias: ['Residencial', 'Frete rápido', 'Montagem'],
  },
  {
    slug: 'instalacoes',
    nome: 'Instalações',
    descricao: 'Chuveiros, luminárias, suportes e eletro.',
    icone: iconeInstalacoes,
    subcategorias: ['Elétrica', 'Eletrodomésticos', 'Suportes'],
  },
  {
    slug: 'reparos',
    nome: 'Reparos',
    descricao: 'Pequenos consertos rápidos no dia a dia.',
    icone: iconeReparos,
    subcategorias: ['Portas e janelas', 'Marcenaria', 'Vedação'],
  },
  {
    slug: 'jardinagem',
    nome: 'Jardinagem',
    descricao: 'Vasos, varandas, poda e cuidado com plantas.',
    icone: iconeJardinagem,
    subcategorias: ['Varandas', 'Poda', 'Paisagismo'],
  },
  {
    slug: 'dedetizacao',
    nome: 'Dedetização',
    descricao: 'Controle preventivo e higienização segura.',
    icone: iconeDedetizacao,
    subcategorias: ['Preventiva', 'Residencial', 'Comercial'],
  },
  {
    slug: 'outros',
    nome: 'Outros',
    descricao: 'Organização de ambientes e apoios sob medida.',
    icone: iconeOutros,
    subcategorias: ['Organização', 'Montagem', 'Personalizado'],
  },
];

export const empresasExemplo = [
  {
    id: 'fabio-manutencao',
    nome: 'Fábio Manutenção',
    categoria: 'Manutenção',
    subcategoria: 'Hidráulica',
    regiao: 'São Paulo, SP · Zona Sul e Centro',
    sobre:
      'Atendimento rápido em hidráulica, troca de registros, reparos em torneiras, sifões e pequenos consertos residenciais com garantia.',
    horario: 'Segunda a sábado, das 8h às 19h',
    nota: 4.8,
    totalAvaliacoes: 56,
    tempoResposta: 'Responde em até 1 hora',
    portfolio: [editorialEssenciais, empresaFotoUm],
    imagem: editorialEssenciais,
    logo: '',
    site: '',
    exemplo: true,
  },
  {
    id: 'prime-mudancas',
    nome: 'Prime Mudanças',
    categoria: 'Mudanças',
    subcategoria: 'Transporte',
    regiao: 'São Paulo, SP e Grande São Paulo',
    sobre:
      'Equipe especializada em embalagem cuidadosa, desmontagem básica e transporte seguro para sua primeira mudança ou troca de apartamento.',
    horario: 'Todos os dias, sob agendamento',
    nota: 4.7,
    totalAvaliacoes: 92,
    tempoResposta: 'Responde em até 2 horas',
    portfolio: [planejamentoMudanca, equipeServicos],
    imagem: planejamentoMudanca,
    logo: '',
    site: '',
    exemplo: true,
  },
  {
    id: 'luz-ideal',
    nome: 'Luz Ideal',
    categoria: 'Instalações',
    subcategoria: 'Elétrica',
    regiao: 'São Paulo, SP · Pinheiros, Vila Mariana e região',
    sobre:
      'Instalação de luminárias, tomadas, disjuntores, chuveiros e pontos elétricos com acabamento limpo e vistoria de segurança.',
    horario: 'Segunda a sexta, das 8h às 18h',
    nota: 4.9,
    totalAvaliacoes: 41,
    tempoResposta: 'Responde em até 30 minutos',
    portfolio: [empresaFotoDois, editorialApartamento],
    imagem: empresaFotoDois,
    logo: '',
    site: '',
    exemplo: true,
  },
  {
    id: 'brilho-clean',
    nome: 'Brilho Clean',
    categoria: 'Limpeza',
    subcategoria: 'Residencial',
    regiao: 'São Paulo, SP · Vila Mariana e Paulista',
    sobre:
      'Higienização detalhada para apartamentos e studios, com lista clara de cômodos e atendimento pontual.',
    horario: 'Segunda a sábado, das 8h às 18h',
    nota: 4.8,
    totalAvaliacoes: 64,
    tempoResposta: 'Responde no mesmo dia',
    portfolio: [empresaFotoUm, editorialServicos],
    imagem: empresaFotoUm,
    logo: '',
    site: '',
    exemplo: true,
  },
  {
    id: 'limpa-mais',
    nome: 'Limpa Mais',
    categoria: 'Limpeza',
    subcategoria: 'Pós-mudança',
    regiao: 'São Paulo, SP e ABC',
    sobre:
      'Limpeza pesada e pós-obra para deixar pisos, vidros, armários e banheiros prontos para receber seus móveis.',
    horario: 'Segunda a sábado, das 7h às 18h',
    nota: 4.7,
    totalAvaliacoes: 38,
    tempoResposta: 'Responde em até 2 horas',
    portfolio: [editorialApartamento, empresaPortfolioAmostra],
    imagem: editorialApartamento,
    logo: '',
    site: '',
    exemplo: true,
  },
  {
    id: 'top-clean',
    nome: 'Top Clean',
    categoria: 'Limpeza',
    subcategoria: 'Comercial',
    regiao: 'São Paulo, SP · Centro e Zona Oeste',
    sobre:
      'Cuidado recorrente para escritórios compactos, consultórios e áreas de trabalho em casa.',
    horario: 'Segunda a sexta, das 7h às 19h',
    nota: 4.9,
    totalAvaliacoes: 47,
    tempoResposta: 'Responde em até 1 hora',
    portfolio: [empresaPortfolioAmostra, editorialServicos],
    imagem: empresaPortfolioAmostra,
    logo: '',
    site: '',
    exemplo: true,
  },
  {
    id: 'liga-resolve',
    nome: 'Liga & Resolve',
    categoria: 'Reparos',
    subcategoria: 'Pequenos reparos',
    regiao: 'São Paulo, SP e região',
    sobre:
      'Pequenos reparos e cuidados para deixar a casa funcionando sem dor de cabeça.',
    horario: 'Segunda a sexta, sob consulta',
    nota: 4.8,
    totalAvaliacoes: 33,
    tempoResposta: 'Responde no mesmo dia',
    portfolio: [editorialEssenciais],
    imagem: editorialEssenciais,
    logo: '',
    site: '',
    exemplo: true,
  },
  {
    id: 'mudae',
    nome: 'Mudaê Transportes',
    categoria: 'Mudanças',
    subcategoria: 'Transporte',
    regiao: 'São Paulo, SP e região',
    sobre:
      'Transporte e apoio para levar seu próximo capítulo para outro endereço com tranquilidade.',
    horario: 'Sob agendamento',
    nota: 4.7,
    totalAvaliacoes: 29,
    tempoResposta: 'Responde em até 3 horas',
    portfolio: [planejamentoMudanca],
    imagem: planejamentoMudanca,
    logo: '',
    site: '',
    exemplo: true,
  },
];

export const servicosExemplo = [
  {
    id: 'limpeza-residencial',
    titulo: 'Limpeza residencial',
    empresaId: 'casa-em-dia',
    categoria: 'Limpeza',
    subcategoria: 'Residencial',
    regiao: 'São Paulo, SP e região',
    preco: 'A partir de R$ 120,00',
    precoNumerico: 120,
    atendimento: 'Residencial',
    disponibilidade: 'Segunda a sábado, das 8h às 18h',
    descricao:
      'Limpeza completa para studios, apartamentos e casas, incluindo cozinha, banheiro, quartos e áreas comuns com produtos adequados a cada superfície.',
    itensIncluidos: [
      'Limpeza detalhada de cozinha, pia e fogão',
      'Higienização de banheiros, louças e box',
      'Aspiração e pano úmido em todos os ambientes',
    ],
    imagem: editorialServicos,
    fotos: [editorialServicos, empresaAnuncioPrevia, empresaFotoUm],
    nota: 4.9,
    totalAvaliacoes: 128,
    destaque: true,
  },
  {
    id: 'fabio-manutencao',
    titulo: 'Manutenção hidráulica e reparos',
    empresaId: 'fabio-manutencao',
    categoria: 'Manutenção',
    subcategoria: 'Hidráulica',
    regiao: 'São Paulo, SP · Zona Sul e Centro',
    preco: 'A partir de R$ 80,00',
    precoNumerico: 80,
    atendimento: 'Residencial',
    disponibilidade: 'Segunda a sábado, das 8h às 19h',
    descricao:
      'Conserto de vazamentos, troca de torneiras, sifões, reparos em descarga e revisão hidráulica rápida para evitar desperdício e dor de cabeça.',
    itensIncluidos: [
      'Diagnóstico inicial e teste de pressão',
      'Troca de vedantes, flexíveis e sifões',
      'Limpeza do local após o término do reparo',
    ],
    imagem: editorialEssenciais,
    fotos: [editorialEssenciais, empresaFotoUm],
    nota: 4.8,
    totalAvaliacoes: 56,
    destaque: true,
  },
  {
    id: 'prime-mudancas',
    titulo: 'Mudança residencial e carreto',
    empresaId: 'prime-mudancas',
    categoria: 'Mudanças',
    subcategoria: 'Transporte',
    regiao: 'São Paulo, SP e Grande São Paulo',
    preco: 'A partir de R$ 300,00',
    precoNumerico: 300,
    atendimento: 'Residencial',
    disponibilidade: 'Todos os dias, sob agendamento',
    descricao:
      'Transporte protegido com mantas e cintas para mudanças compactas e apartamentos completos, com opção de ajudantes para carga e descarga.',
    itensIncluidos: [
      'Proteção com mantas acolchoadas e plástico bolha',
      'Desmontagem básica de cama e mesa',
      'Acompanhamento do horário combinado',
    ],
    imagem: planejamentoMudanca,
    fotos: [planejamentoMudanca, equipeServicos],
    nota: 4.7,
    totalAvaliacoes: 92,
    destaque: true,
  },
  {
    id: 'luz-ideal',
    titulo: 'Instalações elétricas e luminárias',
    empresaId: 'luz-ideal',
    categoria: 'Instalações',
    subcategoria: 'Elétrica',
    regiao: 'São Paulo, SP · Pinheiros, Vila Mariana e região',
    preco: 'A partir de R$ 100,00',
    precoNumerico: 100,
    atendimento: 'Ambos',
    disponibilidade: 'Segunda a sexta, das 8h às 18h',
    descricao:
      'Instalação de chuveiros, plafons, pendentes, tomadas adicionais e revisão elétrica para sua casa nova ficar pronta com segurança.',
    itensIncluidos: [
      'Teste de carga e aterramento no ponto',
      'Instalação de até 3 pontos ou luminárias no pacote base',
      'Verificação de disjuntor e fiação aparente',
    ],
    imagem: empresaFotoDois,
    fotos: [empresaFotoDois, editorialApartamento],
    nota: 4.9,
    totalAvaliacoes: 41,
    destaque: true,
  },
  {
    id: 'brilho-clean',
    titulo: 'Limpeza recorrente de apartamento',
    empresaId: 'brilho-clean',
    categoria: 'Limpeza',
    subcategoria: 'Residencial',
    regiao: 'São Paulo, SP · Vila Mariana e Paulista',
    preco: 'A partir de R$ 135,00',
    precoNumerico: 135,
    atendimento: 'Residencial',
    disponibilidade: 'Segunda a sábado, das 8h às 18h',
    descricao:
      'Atendimento semanal ou quinzenal pensado para quem trabalha fora e quer chegar em casa com tudo limpo e organizado.',
    itensIncluidos: [
      'Checklist padronizado por cômodo',
      'Troca de roupa de cama sob solicitação',
      'Atendimento em apartamentos compactos e médios',
    ],
    imagem: empresaFotoUm,
    fotos: [empresaFotoUm, editorialServicos],
    nota: 4.8,
    totalAvaliacoes: 64,
  },
  {
    id: 'limpa-mais',
    titulo: 'Limpeza pós-mudança detalhada',
    empresaId: 'limpa-mais',
    categoria: 'Limpeza',
    subcategoria: 'Pós-mudança',
    regiao: 'São Paulo, SP e ABC',
    preco: 'A partir de R$ 220,00',
    precoNumerico: 220,
    atendimento: 'Residencial',
    disponibilidade: 'Segunda a sábado, das 7h às 18h',
    descricao:
      'Ideal antes de desempacotar as caixas: remove poeira acumulada de armários, rodapés, vidros e revestimentos.',
    itensIncluidos: [
      'Interior e exterior de armários planejados',
      'Vidros, trilhos de janela e sacada',
      'Remoção de respingos leves de pintura',
    ],
    imagem: editorialApartamento,
    fotos: [editorialApartamento, empresaPortfolioAmostra],
    nota: 4.7,
    totalAvaliacoes: 38,
  },
  {
    id: 'top-clean',
    titulo: 'Limpeza para escritório e estúdio',
    empresaId: 'top-clean',
    categoria: 'Limpeza',
    subcategoria: 'Comercial',
    regiao: 'São Paulo, SP · Centro e Zona Oeste',
    preco: 'A partir de R$ 160,00',
    precoNumerico: 160,
    atendimento: 'Comercial',
    disponibilidade: 'Segunda a sexta, das 7h às 19h',
    descricao:
      'Higienização prática para estações de trabalho, copas, salas de reunião e ambientes compartilhados.',
    itensIncluidos: [
      'Higienização de mesas, cadeiras e equipamentos',
      'Organização de copa e descarte seletivo',
      'Horários flexíveis fora do expediente',
    ],
    imagem: empresaPortfolioAmostra,
    fotos: [empresaPortfolioAmostra, editorialServicos],
    nota: 4.9,
    totalAvaliacoes: 47,
  },
  {
    id: 'reparos',
    titulo: 'Pequenos reparos residenciais',
    empresaId: 'liga-resolve',
    categoria: 'Reparos',
    subcategoria: 'Portas e janelas',
    regiao: 'São Paulo, SP e região',
    preco: 'A partir de R$ 90,00',
    precoNumerico: 90,
    atendimento: 'Residencial',
    disponibilidade: 'Segunda a sexta, sob consulta',
    descricao:
      'Regulagem de dobradiças, instalação de prateleiras, cortinas, quadros e reparos rápidos em casa.',
    itensIncluidos: [
      'Alinhamento de portas e armários',
      'Fixação segura em alvenaria ou drywall',
      'Vedação com silicone em pias e box',
    ],
    imagem: editorialEssenciais,
    fotos: [editorialEssenciais],
    nota: 4.8,
    totalAvaliacoes: 33,
  },
  {
    id: 'mudanca',
    titulo: 'Mudanças e transporte rápido',
    empresaId: 'mudae',
    categoria: 'Mudanças',
    subcategoria: 'Frete rápido',
    regiao: 'São Paulo, SP e região',
    preco: 'A partir de R$ 260,00',
    precoNumerico: 260,
    atendimento: 'Residencial',
    disponibilidade: 'Sob agendamento',
    descricao:
      'Frete ágil para mudanças de quarto, studio e transporte de móveis comprados pela internet.',
    itensIncluidos: [
      'Motorista experiente e amarração com cintas',
      'Ajuda na acomodação dos volumes',
      'Roteiro direto dentro da região metropolitana',
    ],
    imagem: planejamentoMudanca,
    fotos: [planejamentoMudanca],
    nota: 4.7,
    totalAvaliacoes: 29,
  },
];

export const avaliacoesIniciais = [
  {
    id: 'av-1',
    servicoId: 'limpeza-residencial',
    autor: 'Camila Ferreira',
    nota: 5,
    data: 'Há 4 dias',
    comentario:
      'Chegaram no horário combinado e deixaram cozinha e banheiro impecáveis antes da minha mudança.',
  },
  {
    id: 'av-2',
    servicoId: 'limpeza-residencial',
    autor: 'Rafael Mendes',
    nota: 5,
    data: 'Há 2 semanas',
    comentario:
      'Orçamento claro desde a primeira mensagem e cuidado enorme com os móveis da sala.',
  },
  {
    id: 'av-3',
    servicoId: 'limpeza-residencial',
    autor: 'Beatriz Alves',
    nota: 4,
    data: 'Há 1 mês',
    comentario:
      'Atendimento muito atencioso. Já deixei salvo nos favoritos para contratar novamente no mês que vem.',
  },
  {
    id: 'av-4',
    servicoId: 'fabio-manutencao',
    autor: 'Lucas Nogueira',
    nota: 5,
    data: 'Há 1 semana',
    comentario:
      'Resolveu o vazamento embaixo da pia em menos de 40 minutos e ainda regulou a torneira.',
  },
  {
    id: 'av-5',
    servicoId: 'prime-mudancas',
    autor: 'Juliana Rocha',
    nota: 5,
    data: 'Há 10 dias',
    comentario:
      'Embalaram a geladeira e a escrivaninha com muita atenção. Nenhum arranhão na entrega.',
  },
  {
    id: 'av-6',
    servicoId: 'luz-ideal',
    autor: 'Pedro Duarte',
    nota: 5,
    data: 'Há 6 dias',
    comentario:
      'Instalou meu chuveiro e três luminárias no mesmo dia com acabamento muito limpo.',
  },
];

export const contatosExemploCliente = [
  {
    id: 'contato-casa-em-dia',
    empresaId: 'casa-em-dia',
    empresaNome: 'Casa em Dia Serviços',
    anuncioId: 'limpeza-residencial',
    servico: 'Limpeza residencial',
    regiao: 'Vila Mariana, São Paulo',
    situacao: 'Em andamento',
    atualizadoEm: 'Hoje · 14:20',
    mensagens: [
      {
        id: 'm-cd-1',
        autor: 'cliente',
        texto:
          'Olá! Preciso de uma limpeza completa para um studio na Vila Mariana nesta sexta-feira pela manhã.',
        data: new Date().toISOString(),
      },
      {
        id: 'm-cd-2',
        autor: 'empresa',
        texto:
          'Oi! Temos horário disponível na sexta às 9h. Para studio, o pacote completo fica em R$ 135,00 com duração média de 4 horas.',
        data: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'contato-fabio-exemplo',
    empresaId: 'fabio-manutencao',
    empresaNome: 'Fábio Manutenção',
    anuncioId: 'fabio-manutencao',
    servico: 'Manutenção hidráulica e reparos',
    regiao: 'Pinheiros, São Paulo',
    situacao: 'Respondido',
    atualizadoEm: 'Ontem · 17:10',
    mensagens: [
      {
        id: 'm-fm-1',
        autor: 'cliente',
        texto:
          'Boa tarde, o sifão da minha cozinha está pingando bastante quando abro a torneira.',
        data: new Date().toISOString(),
      },
      {
        id: 'm-fm-2',
        autor: 'empresa',
        texto:
          'Consigo passar amanhã às 15h para trocar o sifão e testar toda a vedação.',
        data: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'contato-prime-exemplo',
    empresaId: 'prime-mudancas',
    empresaNome: 'Prime Mudanças',
    anuncioId: 'prime-mudancas',
    servico: 'Mudança residencial e carreto',
    regiao: 'Bela Vista, São Paulo',
    situacao: 'Concluído',
    atualizadoEm: 'Há 5 dias',
    mensagens: [
      {
        id: 'm-pm-1',
        autor: 'cliente',
        texto: 'Frete de 1 quarto da Bela Vista até Saúde confirmado para sábado.',
        data: new Date().toISOString(),
      },
      {
        id: 'm-pm-2',
        autor: 'empresa',
        texto: 'Atendimento finalizado! Obrigado por confiar na Prime Mudanças.',
        data: new Date().toISOString(),
      },
    ],
  },
];

export const pinosMapaSaoPaulo = [
  {
    id: 'limpeza-residencial',
    titulo: 'Casa em Dia Serviços',
    categoria: 'Limpeza',
    bairro: 'Vila Mariana',
    preco: 'R$ 120',
    topo: '38%',
    esquerda: '47%',
  },
  {
    id: 'fabio-manutencao',
    titulo: 'Fábio Manutenção',
    categoria: 'Manutenção',
    bairro: 'Saúde',
    preco: 'R$ 80',
    topo: '58%',
    esquerda: '56%',
  },
  {
    id: 'prime-mudancas',
    titulo: 'Prime Mudanças',
    categoria: 'Mudanças',
    bairro: 'Pinheiros',
    preco: 'R$ 300',
    topo: '32%',
    esquerda: '28%',
  },
  {
    id: 'luz-ideal',
    titulo: 'Luz Ideal',
    categoria: 'Instalações',
    bairro: 'Moema',
    preco: 'R$ 100',
    topo: '64%',
    esquerda: '36%',
  },
];

export function extrairValorNumerico(textoPreco) {
  const apenasDigitos = String(textoPreco || '').match(/\d+/g);
  if (!apenasDigitos) return 150;
  return Number(apenasDigitos[0]) || 150;
}

export function obterCatalogoMercado(dadosEmpresa, estadoPlataforma) {
  const propriaEmpresa = {
    ...dadosEmpresa.empresa,
    subcategoria: 'Residencial e comercial',
    nota: 4.9,
    totalAvaliacoes: 128,
    tempoResposta: 'Responde em até 30 minutos',
    imagem:
      dadosEmpresa.empresa.portfolio?.[0] ??
      dadosEmpresa.empresa.logo ??
      editorialServicos,
    exemplo: dadosEmpresa.exemplo,
  };

  const empresas = [propriaEmpresa, ...empresasExemplo];

  const anunciosProprios = (dadosEmpresa.anuncios || [])
    .filter(anuncio => anuncio.situacao === 'ativo')
    .map(anuncio => {
      const referencia = servicosExemplo.find(item => item.id === anuncio.id);
      return {
        ...(referencia || {}),
        ...anuncio,
        empresaId: propriaEmpresa.id,
        subcategoria: referencia?.subcategoria || anuncio.atendimento || 'Residencial',
        imagem: anuncio.fotos?.[0] ?? referencia?.imagem ?? editorialServicos,
        fotos: anuncio.fotos?.length
          ? anuncio.fotos
          : referencia?.fotos || [editorialServicos],
        nota: referencia?.nota || 4.9,
        totalAvaliacoes: referencia?.totalAvaliacoes || 24,
        precoNumerico: extrairValorNumerico(anuncio.preco),
        itensIncluidos: referencia?.itensIncluidos || [
          'Atendimento combinado diretamente com a empresa',
          'Região e disponibilidade flexíveis',
        ],
      };
    });

  const idsProprios = new Set(anunciosProprios.map(item => item.id));
  const servicosRestantes = servicosExemplo.filter(
    item => !idsProprios.has(item.id)
  );

  const servicos = [...anunciosProprios, ...servicosRestantes];

  const avaliacoesSalvas = estadoPlataforma?.avaliacoesServicos || [];
  const avaliacoes = [...avaliacoesSalvas, ...avaliacoesIniciais];

  const contatosSalvosUsuario = estadoPlataforma?.contatosCliente || [];
  const mapaContatosEmpresa = new Map(
    (dadosEmpresa.contatos || []).map(c => [c.id, c])
  );

  const contatosMesclados = [
    ...contatosSalvosUsuario.map(c => {
      const sincronizado = mapaContatosEmpresa.get(c.id);
      if (!sincronizado) return c;
      return {
        ...c,
        situacao:
          sincronizado.situacao === 'concluido'
            ? 'Concluído'
            : sincronizado.situacao === 'andamento'
              ? 'Em andamento'
              : c.situacao,
        mensagens: sincronizado.mensagens?.length
          ? sincronizado.mensagens
          : c.mensagens,
      };
    }),
    ...contatosExemploCliente.filter(
      ex => !contatosSalvosUsuario.some(c => c.id === ex.id)
    ),
  ];

  return { empresas, servicos, avaliacoes, contatos: contatosMesclados };
}

export function filtrarServicosMercado(servicos, empresas, filtros) {
  const buscaNormalizada = normalizarTexto(filtros.busca || '');
  const regiaoNormalizada = normalizarTexto(filtros.regiao || '');
  const categoriaNormalizada = normalizarTexto(filtros.categoria || '');
  const subcategoriaNormalizada = normalizarTexto(filtros.subcategoria || '');
  const atendimentoNormalizado = normalizarTexto(filtros.atendimento || '');
  const notaMinima = Number(filtros.notaMinima || 0);
  const precoMaximo = Number(filtros.precoMaximo || 0);

  const filtrados = servicos.filter(servico => {
    const empresa = empresas.find(emp => emp.id === servico.empresaId);
    const textoBusca = normalizarTexto(
      `${servico.titulo} ${servico.descricao} ${servico.categoria} ${servico.subcategoria} ${empresa?.nome || ''}`
    );

    if (buscaNormalizada && !textoBusca.includes(buscaNormalizada)) {
      return false;
    }
    if (
      regiaoNormalizada &&
      !normalizarTexto(`${servico.regiao} ${empresa?.regiao || ''}`).includes(
        regiaoNormalizada
      )
    ) {
      return false;
    }
    if (
      categoriaNormalizada &&
      categoriaNormalizada !== 'todas' &&
      normalizarTexto(servico.categoria) !== categoriaNormalizada
    ) {
      return false;
    }
    if (
      subcategoriaNormalizada &&
      subcategoriaNormalizada !== 'todas' &&
      normalizarTexto(servico.subcategoria) !== subcategoriaNormalizada &&
      normalizarTexto(servico.atendimento) !== subcategoriaNormalizada
    ) {
      return false;
    }
    if (
      atendimentoNormalizado &&
      atendimentoNormalizado !== 'todos' &&
      normalizarTexto(servico.atendimento) !== atendimentoNormalizado
    ) {
      return false;
    }
    if (notaMinima > 0 && Number(servico.nota || 0) < notaMinima) {
      return false;
    }
    if (
      precoMaximo > 0 &&
      Number(servico.precoNumerico || 0) > precoMaximo
    ) {
      return false;
    }
    return true;
  });

  if (filtros.ordenacao === 'menor-preco') {
    return [...filtrados].sort(
      (a, b) => (a.precoNumerico || 0) - (b.precoNumerico || 0)
    );
  }
  if (filtros.ordenacao === 'melhor-avaliacao') {
    return [...filtrados].sort((a, b) => (b.nota || 0) - (a.nota || 0));
  }
  return filtrados;
}
