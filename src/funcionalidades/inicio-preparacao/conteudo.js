import iconeJornada from '../../ativos/vetores/modulos/mudanca-jornada.svg';
import iconeFinancas from '../../ativos/vetores/modulos/mudanca-financas.svg';
import iconeAprendendo from '../../ativos/vetores/modulos/mudanca-aprendendo.svg';
import iconeEncontrarCasa from '../../ativos/vetores/modulos/mudanca-encontrar-casa.svg';
import iconeMetas from '../../ativos/vetores/modulos/mudanca-metas.svg';
import iconeChecklists from '../../ativos/vetores/modulos/mudanca-checklists.svg';

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
