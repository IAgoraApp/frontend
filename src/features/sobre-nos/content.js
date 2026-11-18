import fotoKauavitor from './assets/kaua.png';
import fotoGabriel from './assets/gomes.png';
import fotoFernando from './assets/fernando.jpg';
import fotoIgor from './assets/igor.jpg';
import fotoEmily from './assets/emily.png';
import fotoEmilly from './assets/emilly-barauna.png';
import fotoJoao from './assets/joao.png';
import fotoDavi from './assets/davi-antonio.jpg';
import iconeReact from './assets/tecnologia-react.svg';
import iconeMysql from './assets/tecnologia-mysql.svg';
import iconeJavascript from './assets/tecnologia-javascript.svg';
import iconeJava from './assets/tecnologia-java.svg';
import iconeAutonomia from './assets/autonomia.svg';
import iconePraticidade from './assets/praticidade.svg';
import iconeAcolhimento from './assets/coracao.svg';

export const membrosEquipe = [
  {
    id: 'kaua-vitor',
    nome: 'Kauã Vitor',
    cargo: 'Product owner e full stack',
    foto: fotoKauavitor,
    github: 'https://github.com/KauaRDESIGN',
  },
  {
    id: 'gabriel-gomes',
    nome: 'Gabriel Gomes',
    cargo: 'Back-end e vendas',
    foto: fotoGabriel,
    github: 'https://github.com/gomeszyk',
  },
  {
    id: 'fernando-vieira',
    nome: 'Fernando Vieira',
    cargo: 'Design UI/UX e front-end',
    foto: fotoFernando,
    github: 'https://github.com/euFehVieira',
  },
  {
    id: 'igor-vasconcelos',
    nome: 'Igor Vasconcelos',
    cargo: 'Back-end e vendas',
    foto: fotoIgor,
    github: 'https://github.com/igorvasconcelos11-web',
  },
  {
    id: 'emily-batista',
    nome: 'Emily Batista',
    cargo: 'Back-end e vendas',
    foto: fotoEmily,
    github: 'https://github.com/emilybatista123',
  },
  {
    id: 'emilly-barauna',
    nome: 'Emilly Barauna',
    cargo: 'Back-end e vendas',
    foto: fotoEmilly,
    github: 'https://github.com/Emilly-Barauna',
  },
  {
    id: 'joao-vitor',
    nome: 'João Vitor',
    cargo: 'Scrum master e back-end',
    foto: fotoJoao,
    github: 'https://github.com/joaovpr156',
  },
  {
    id: 'davi-antonio',
    nome: 'Davi Antônio',
    cargo: 'Back-end e vendas',
    foto: fotoDavi,
    github: 'https://github.com/davizin-ra',
  },
];

export const tecnologiasEquipe = [
  { nome: 'React', icone: iconeReact },
  { nome: 'MySQL', icone: iconeMysql },
  { nome: 'JavaScript', icone: iconeJavascript },
  { nome: 'Java', icone: iconeJava },
];

export const valoresEquipe = [
  {
    titulo: 'Autonomia',
    descricao: 'Conquiste sua liberdade para morar sozinho.',
    icone: iconeAutonomia,
    alt: 'Ícone de autonomia',
  },
  {
    titulo: 'Praticidade',
    descricao: 'Resolva os desafios do dia a dia em um só lugar.',
    icone: iconePraticidade,
    alt: 'Ícone de praticidade',
  },
  {
    titulo: 'Acolhimento',
    descricao: 'Faça escolhas com mais confiança e tranquilidade.',
    icone: iconeAcolhimento,
    alt: 'Ícone de acolhimento',
  },
];
