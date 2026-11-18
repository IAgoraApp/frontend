import { ArrowUpRight, Plus } from 'lucide-react';
import { dataCurta } from '../../../app/dados/bancoMvp';
import { ordenarLimpezas } from '../utils/agendaLimpeza';

import { imagemComodo } from '../utils/imagemComodo';

export default function CardsComodos({
  comodos,
  limpezas,
  aoSelecionar,
  aoAdicionar,
  hoje,
}) {
  return (
    <div className='limpeza-comodos'>
      {comodos.map(comodo => {
        const atividades = limpezas.filter(l => l.comodo_id === comodo.id);
        const pendentes = ordenarLimpezas(
          atividades.filter(l => l.ultima_vez !== hoje),
          hoje
        );
        const proxima = pendentes.find(l => l.proxima_vez);
        return (
          <button
            key={comodo.id}
            type='button'
            className='limpeza-comodo'
            aria-label={`Ver limpezas de ${comodo.nome}`}
            aria-haspopup='dialog'
            onClick={() => aoSelecionar(comodo.id)}
          >
            <img src={imagemComodo(comodo.tipo)} alt='' loading='lazy' />
            <span className='limpeza-comodo-corpo'>
              <span className='limpeza-comodo-nome'>
                <strong>{comodo.nome}</strong>
                <ArrowUpRight size={18} aria-hidden='true' />
              </span>
              <span>
                {atividades.length}{' '}
                {atividades.length === 1 ? 'atividade' : 'atividades'}
                <span aria-hidden='true'> · </span>
                {atividades.filter(l => l.ultima_vez === hoje).length} feitas
                hoje
              </span>
              <small>
                {proxima
                  ? `Próxima: ${dataCurta(proxima.proxima_vez)}`
                  : pendentes.length
                    ? 'Defina a próxima data'
                    : atividades.length
                      ? 'Tudo em dia por aqui'
                      : 'Adicione a primeira limpeza'}
              </small>
            </span>
          </button>
        );
      })}
      <button
        className='limpeza-adicionar-comodo'
        type='button'
        onClick={aoAdicionar}
      >
        <span>
          <Plus size={27} aria-hidden='true' />
        </span>
        <strong>Adicionar cômodo</strong>
        <small>Mais um espaço para cuidar.</small>
      </button>
    </div>
  );
}
