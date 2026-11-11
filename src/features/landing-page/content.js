import guiasImg from './assets/01-guias-e-dicas-3d.png';
import checklistImg from './assets/checklist_3d.png';
import calculadorasImg from './assets/02-calculadoras-3d.png';
import cozinhaImg from './assets/03-cozinha-3d.png';
import segurancaImg from './assets/04-seguranca-3d.png';
import financasImg from './assets/05-financas-3d.png';

export const categories = [
  {
    id: 'guias',
    label: 'Guias e dicas',
    badge: '01 / GUIAS E DICAS',
    title: 'Aprenda o que ninguém te ensinou.',
    description:
      'Lavar roupa, limpar a casa e montar sua primeira cozinha. Dicas, tutoriais e explicações sem complicação.',
    cta: 'Explorar guias',
    image: guiasImg,
  },
  {
    id: 'checklists',
    label: 'Checklists',
    badge: '02 / CHECKLISTS PRÁTICOS',
    title: 'Não esqueça nada importante na mudança.',
    description:
      'Listas completas de itens essenciais para cada cômodo, vistoria de contrato e compras do mês.',
    cta: 'Ver checklists',
    image: checklistImg,
  },
  {
    id: 'calculadoras',
    label: 'Calculadoras',
    badge: '03 / PLANEJAMENTO FINANCEIRO',
    title: 'Descubra quanto custa seu canto.',
    description:
      'Simule o custo real do aluguel, condomínio, contas de consumo e alimentação antes de assinar contrato.',
    cta: 'Calcular custos',
    image: calculadorasImg,
  },
  {
    id: 'cozinha',
    label: 'Cozinha',
    badge: '04 / COZINHA SEM MISTÉRIO',
    title: 'Coma bem gastando pouco tempo.',
    description:
      'Receitas rápidas com ingredientes básicos, conservação de alimentos e utensílios que realmente valem a pena.',
    cta: 'Acessar receitas',
    image: cozinhaImg,
  },
  {
    id: 'seguranca',
    label: 'Segurança',
    badge: '05 / SEGURANÇA E MANUTENÇÃO',
    title: 'Cuide do seu cantinho com tranquilidade.',
    description:
      'Dicas sobre fechaduras, extintores, quadro de luz e direitos fundamentais do inquilino.',
    cta: 'Dicas de segurança',
    image: segurancaImg,
  },
  {
    id: 'financas',
    label: 'Finanças',
    badge: '06 / ORGANIZAÇÃO DA CARTEIRA',
    title: 'Suas contas em dia sem sufoco.',
    description:
      'Métodos simples para controlar boletos, criar reserva de emergência e evitar o cheque especial.',
    cta: 'Organizar finanças',
    image: financasImg,
  },
];

export const steps = [
  {
    number: '01',
    tab: '01 Conta',
    title: 'Crie sua conta',
    description: 'Salve seus interesses e acompanhe o que já fez.',
  },
  {
    number: '02',
    tab: '02 Seu momento',
    title: 'Escolha o seu momento',
    description:
      'Diga se está se preparando para sair de casa ou se já está no seu canto precisando de organização.',
  },
  {
    number: '03',
    tab: '03 Seu dia',
    title: 'Viva seu dia a dia com leveza',
    description:
      'Acesse roteiros prontos para cada semana: receitas práticas, listas de compras e controle financeiro.',
  },
];

export const faqs = [
  {
    id: 1,
    question: 'Preciso de conta para conhecer o Iagora?',
    answer:
      'Não! Você pode navegar pelos guias essenciais, checklists de introdução e ferramentas básicas livremente. Criar uma conta gratuita é útil para salvar seu progresso, personalizar custos e guardar suas listas favoritas.',
  },
  {
    id: 2,
    question: 'O que encontro na plataforma?',
    answer:
      'Uma central completa para a vida adulta independente: calculadoras de orçamento de aluguel e despesas, checklists de vistoria e mudança, guias práticos de culinária e manutenção doméstica, além de ferramentas de rotina.',
  },
  {
    id: 3,
    question: 'É só para quem vai morar sozinho?',
    answer:
      'Não apenas! O Iagora atende tanto quem está planejando dar o primeiro passo e sair da casa dos pais quanto quem já mora sozinho, divide apartamento com amigos ou simplesmente deseja organizar melhor suas tarefas e contas.',
  },
];
