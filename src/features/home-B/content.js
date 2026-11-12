import iconeJornada from './assets/mudanca-jornada.svg';
import iconeFinancas from './assets/mudanca-financas.svg';
import iconeAprendendo from './assets/mudanca-aprendendo.svg';
import iconeEncontrarCasa from './assets/mudanca-encontrar-casa.svg';
import iconeMetas from './assets/mudanca-metas.svg';
import iconeChecklists from './assets/mudanca-checklists.svg';

export const atalhosPreparacao = [
  { rotulo: 'Minha jornada', rota: '/minhajornada', icone: iconeJornada },
  { rotulo: 'Finanças', rota: '/planejamento', icone: iconeFinancas },
  {
    rotulo: 'Aprendendo a morar',
    rota: '/aprendendo',
    icone: iconeAprendendo,
  },
  {
    rotulo: 'Encontrar casa',
    rota: '/encontrar-casa',
    icone: iconeEncontrarCasa,
  },
  {
    rotulo: 'Metas',
    rota: '/minhajornada?visao=metas',
    icone: iconeMetas,
  },
  { rotulo: 'Checklists', rota: '/checklists', icone: iconeChecklists },
];
