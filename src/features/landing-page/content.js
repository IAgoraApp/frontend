import guiasImg from './assets/01-guias-e-dicas-3d.png';
import checklistImg from './assets/checklist_3d.png';
import calculadorasImg from './assets/02-calculadoras-3d.png';
import cozinhaImg from './assets/03-cozinha-3d.png';
import segurancaImg from './assets/04-seguranca-3d.png';
import financasImg from './assets/05-financas-3d.png';
import caixaContaImg from './assets/passo-criar-conta.png';
import caixaMomentoImg from './assets/passo-escolher-momento.png';
import caixaRotinaImg from './assets/passo-organizar-rotina.png';

export const categoriasRecursos = [
  {
    id: 'guias',
    rotulo: 'Guias e dicas',
    titulo: 'Aprenda o que ninguém te ensinou',
    descricao:
      'Lavar roupa, limpar a casa e montar sua primeira cozinha. Dicas, tutoriais e explicações sem complicação.',
    imagem: guiasImg,
  },
  {
    id: 'checklists',
    rotulo: 'Checklists',
    titulo: 'Não esqueça nada importante na mudança',
    descricao:
      'Listas completas de itens essenciais para cada cômodo, vistoria de contrato e compras do mês.',
    imagem: checklistImg,
  },
  {
    id: 'calculadoras',
    rotulo: 'Planejamento',
    titulo: 'Descubra quanto custa seu canto',
    descricao:
      'Simule o custo real do aluguel, condomínio, contas de consumo e alimentação antes de assinar contrato.',
    imagem: calculadorasImg,
  },
  {
    id: 'cozinha',
    rotulo: 'Cozinha',
    titulo: 'Coma bem gastando pouco tempo',
    descricao:
      'Receitas rápidas com ingredientes básicos, conservação de alimentos e utensílios que realmente valem a pena.',
    imagem: cozinhaImg,
  },
  {
    id: 'seguranca',
    rotulo: 'Segurança',
    titulo: 'Cuide do seu cantinho com tranquilidade',
    descricao:
      'Dicas sobre fechaduras, extintores, quadro de luz e direitos fundamentais do inquilino.',
    imagem: segurancaImg,
  },
  {
    id: 'financas',
    rotulo: 'Finanças',
    titulo: 'Suas contas em dia sem sufoco',
    descricao:
      'Métodos simples para controlar boletos, criar reserva de emergência e evitar o cheque especial.',
    imagem: financasImg,
  },
];

export const passosInicio = [
  {
    numero: '01',
    titulo: 'Crie sua\nconta',
    imagem: caixaContaImg,
  },
  {
    numero: '02',
    titulo: 'Escolha\nseu momento',
    imagem: caixaMomentoImg,
  },
  {
    numero: '03',
    titulo: 'Viva\nseu canto',
    imagem: caixaRotinaImg,
  },
];

export const perguntasFrequentes = [
  {
    id: 1,
    pergunta: 'O que posso conhecer antes de entrar?',
    resposta:
      'Aqui você pode conhecer os recursos para planejar a mudança e cuidar da casa. Na plataforma, você escolhe seu momento de moradia e organiza suas listas, tarefas e contas.',
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
