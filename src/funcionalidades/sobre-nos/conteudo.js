import fotoKauavitor from '../../ativos/imagens/equipe/kaua-vitor.png';
import fotoGabriel from '../../ativos/imagens/equipe/gabriel-gomes.png';
import fotoFernando from '../../ativos/imagens/equipe/fernando-vieira.jpg';
import fotoIgor from '../../ativos/imagens/equipe/igor-vasconcelos.jpg';
import fotoEmily from '../../ativos/imagens/equipe/emily-batista.png';
import fotoEmilly from '../../ativos/imagens/equipe/emilly-barauna.png';
import fotoJoao from '../../ativos/imagens/equipe/joao-vitor.png';
import fotoDavi from '../../ativos/imagens/equipe/davi-antonio.jpg';
import iconeReact from '../../ativos/vetores/sobre-nos/tecnologia-react.svg';
import iconeMysql from '../../ativos/vetores/sobre-nos/tecnologia-mysql.svg';
import iconeJavascript from '../../ativos/vetores/sobre-nos/tecnologia-javascript.svg';
import iconeJava from '../../ativos/vetores/sobre-nos/tecnologia-java.svg';
import iconeAutonomia from '../../ativos/vetores/sobre-nos/valor-autonomia.svg';
import iconePraticidade from '../../ativos/vetores/sobre-nos/valor-praticidade.svg';
import iconeAcolhimento from '../../ativos/vetores/sobre-nos/valor-acolhimento.svg';

export const membrosEquipe = [
  {
    id: 'kaua-vitor',
    nome: 'Kauã Vitor',
    cargo: 'PRODUCT OWNER E FULL STACK',
    foto: fotoKauavitor,
    github: 'https://github.com/KauaRDESIGN',
  },
  {
    id: 'gabriel-gomes',
    nome: 'Gabriel Gomes',
    cargo: 'DESENVOLVEDOR BACK-END E VENDAS',
    foto: fotoGabriel,
    github: 'https://github.com/gomeszyk',
  },
  {
    id: 'fernando-vieira',
    nome: 'Fernando Vieira',
    cargo: 'DESIGNER UI/UX E FRONT-END',
    foto: fotoFernando,
    github: 'https://github.com/euFehVieira',
  },
  {
    id: 'igor-vasconcelos',
    nome: 'Igor Vasconcelos',
    cargo: 'DESENVOLVEDOR BACK-END E VENDAS',
    foto: fotoIgor,
    github: 'https://github.com/igorvasconcelos11-web',
  },
  {
    id: 'emily-batista',
    nome: 'Emily Batista',
    cargo: 'DESENVOLVEDORA BACK-END E VENDAS',
    foto: fotoEmily,
    github: 'https://github.com/emilybatista123',
  },
  {
    id: 'emilly-barauna',
    nome: 'Emilly Barauna',
    cargo: 'DESENVOLVEDORA BACK-END E VENDAS',
    foto: fotoEmilly,
    github: 'https://github.com/Emilly-Barauna',
  },
  {
    id: 'joao-vitor',
    nome: 'João Vitor',
    cargo: 'SCRUM MASTER E BACK-END',
    foto: fotoJoao,
    github: 'https://github.com/joaovpr156',
  },
  {
    id: 'davi-antonio',
    nome: 'Davi Antônio',
    cargo: 'DESENVOLVEDOR BACK-END E VENDAS',
    foto: fotoDavi,
    github: 'https://github.com/davizin-ra',
  },
];

export const tecnologiasEquipe = [
  { nome: 'REACT', icone: iconeReact },
  { nome: 'MYSQL', icone: iconeMysql },
  { nome: 'JAVASCRIPT', icone: iconeJavascript },
  { nome: 'JAVA', icone: iconeJava },
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
