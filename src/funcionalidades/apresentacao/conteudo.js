import guiasImg from '../../ativos/imagens/ilustracoes/recurso-guias-dicas-3d.png';
import checklistImg from '../../ativos/imagens/ilustracoes/checklist-3d.png';
import calculadorasImg from '../../ativos/imagens/ilustracoes/recurso-calculadoras-3d.png';
import cozinhaImg from '../../ativos/imagens/ilustracoes/recurso-cozinha-3d.png';
import segurancaImg from '../../ativos/imagens/ilustracoes/recurso-seguranca-3d.png';
import financasImg from '../../ativos/imagens/ilustracoes/recurso-financas-3d.png';

export const categoriasRecursos = [
  {
    id: 'guias',
    rotulo: 'Guias e dicas',
    selo: '01 / GUIAS E DICAS',
    titulo: 'Aprenda o que ninguém te ensinou.',
    descricao:
      'Lavar roupa, limpar a casa e montar sua primeira cozinha. Dicas, tutoriais e explicações sem complicação.',
    chamada: 'Explorar guias',
    rota: '/aprendendo',
    imagem: guiasImg,
  },
  {
    id: 'checklists',
    rotulo: 'Checklists',
    selo: '02 / CHECKLISTS PRÁTICOS',
    titulo: 'Não esqueça nada importante na mudança.',
    descricao:
      'Listas completas de itens essenciais para cada cômodo, vistoria de contrato e compras do mês.',
    chamada: 'Ver checklists',
    rota: '/checklists',
    imagem: checklistImg,
  },
  {
    id: 'calculadoras',
    rotulo: 'Calculadoras',
    selo: '03 / PLANEJAMENTO FINANCEIRO',
    titulo: 'Descubra quanto custa seu canto.',
    descricao:
      'Simule o custo real do aluguel, condomínio, contas de consumo e alimentação antes de assinar contrato.',
    chamada: 'Calcular custos',
    rota: '/calculadoras',
    imagem: calculadorasImg,
  },
  {
    id: 'cozinha',
    rotulo: 'Cozinha',
    selo: '04 / COZINHA SEM MISTÉRIO',
    titulo: 'Coma bem gastando pouco tempo.',
    descricao:
      'Receitas rápidas com ingredientes básicos, conservação de alimentos e utensílios que realmente valem a pena.',
    chamada: 'Acessar receitas',
    rota: '/cozinha',
    imagem: cozinhaImg,
  },
  {
    id: 'seguranca',
    rotulo: 'Segurança',
    selo: '05 / SEGURANÇA E MANUTENÇÃO',
    titulo: 'Cuide do seu cantinho com tranquilidade.',
    descricao:
      'Dicas sobre fechaduras, extintores, quadro de luz e direitos fundamentais do inquilino.',
    chamada: 'Dicas de segurança',
    rota: '/seguranca',
    imagem: segurancaImg,
  },
  {
    id: 'financas',
    rotulo: 'Finanças',
    selo: '06 / ORGANIZAÇÃO DA CARTEIRA',
    titulo: 'Suas contas em dia sem sufoco.',
    descricao:
      'Métodos simples para controlar boletos, criar reserva de emergência e evitar o cheque especial.',
    chamada: 'Organizar finanças',
    rota: '/financas',
    imagem: financasImg,
  },
];

export const passosInicio = [
  {
    numero: '01',
    aba: '01 Conta',
    titulo: 'Crie sua conta',
    descricao: 'Salve seus interesses e acompanhe o que já fez.',
  },
  {
    numero: '02',
    aba: '02 Seu momento',
    titulo: 'Escolha o seu momento',
    descricao:
      'Diga se está se preparando para sair de casa ou se já está no seu canto precisando de organização.',
  },
  {
    numero: '03',
    aba: '03 Seu dia',
    titulo: 'Viva seu dia a dia com leveza',
    descricao:
      'Acesse roteiros prontos para cada semana: receitas práticas, listas de compras e controle financeiro.',
  },
];

export const perguntasFrequentes = [
  {
    id: 1,
    pergunta: 'Preciso de conta para conhecer o Iagora?',
    resposta:
      'Não! Você pode navegar pelos guias essenciais, checklists de introdução e ferramentas básicas livremente. Criar uma conta gratuita é útil para salvar seu progresso, personalizar custos e guardar suas listas favoritas.',
  },
  {
    id: 2,
    pergunta: 'O que encontro na plataforma?',
    resposta:
      'Uma central completa para a vida adulta independente: calculadoras de orçamento de aluguel e despesas, checklists de vistoria e mudança, guias práticos de culinária e manutenção doméstica, além de ferramentas de rotina.',
  },
  {
    id: 3,
    pergunta: 'É só para quem vai morar sozinho?',
    resposta:
      'Não apenas! O Iagora atende tanto quem está planejando dar o primeiro passo e sair da casa dos pais quanto quem já mora sozinho, divide apartamento com amigos ou simplesmente deseja organizar melhor suas tarefas e contas.',
  },
];
