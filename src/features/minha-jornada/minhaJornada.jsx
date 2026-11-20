import { useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  CircleCheck,
  Plus,
  Trash2,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { acessoLocal } from '../../app/dados/acessoLocal';
import { useBancoMvp } from '../../app/dados/bancoMvp';
import { DialogoCasa } from '../casa/components/casaUi';
import LayoutPreparacao from '../preparacao/LayoutPreparacao';
import RegistrosPreparacao from '../preparacao/RegistrosPreparacao';
import { EditorMvp } from '../../shared/ui/mvp';
import { atualizarGuia } from './jornadaDados';
import { modelo } from '../preparacao/modelo';
import { descricaoGuia, lerGuia, nomeGuia } from './guiaMudanca';
import './minhaJornada.css';

const ehJornadaPersonalizada = jornada =>
  jornada.nome !== nomeGuia || jornada.descricao !== descricaoGuia;

function GuiaMudanca() {
  const { b, perfil } = useBancoMvp();
  const usuario = perfil?.user_id;
  const [params, setParams] = useSearchParams();
  const [erro, setErro] = useState('');
  const [editor, setEditor] = useState(null);
  const [remocao, setRemocao] = useState(null);
  const [itemAberto, setItemAberto] = useState(null);
  const editavel = acessoLocal && !!usuario;
  const {
    etapas,
    feitas,
    total,
    proxima: pendente,
  } = lerGuia(b, acessoLocal ? usuario : undefined);
  const ativa = etapas.find(item => item.id === params.get('etapa'));
  const proxima = ativa && etapas[etapas.indexOf(ativa) + 1];
  const tarefaAberta = ativa?.tarefas.find(item => item.titulo === itemAberto);

  function abrirEtapa(id) {
    setErro('');
    setEditor(null);
    setRemocao(null);
    setItemAberto(null);
    setParams(
      anterior => {
        const proximo = new URLSearchParams(anterior);
        if (id) proximo.set('etapa', id);
        else proximo.delete('etapa');
        return proximo;
      },
      { replace: true, preventScrollReset: true }
    );
  }

  function salvar(acao, dados) {
    if (!editavel)
      throw new Error('As alterações estão disponíveis na prévia local.');
    atualizarGuia(usuario, ativa, acao, dados);
    setErro('');
  }

  function executar(acao, dados) {
    try {
      salvar(acao, dados);
      if (acao === 'remover-etapa') abrirEtapa();
      if (acao === 'remover-item') setItemAberto(null);
      setRemocao(null);
    } catch (falha) {
      setErro(falha.message);
      setRemocao(null);
    }
  }

  function formulario(tipo) {
    const entidade = tipo === 'etapa' ? 'etapa_jornada' : 'tarefa_jornada';
    return (
      <EditorMvp
        cabecalho={false}
        campos={modelo[entidade].campos
          .filter(item => ['titulo', 'descricao'].includes(item.nome))
          .map(item => ({
            ...item,
            limite: item.maxLength,
            obrigatorio: !item.opcional,
            rotulo:
              item.nome === 'descricao' && tipo === 'item'
                ? 'Dica para realizar a tarefa (opcional)'
                : item.rotulo,
          }))}
        onSave={dados => salvar('adicionar-' + tipo, dados)}
        onClose={() => setEditor(null)}
      />
    );
  }

  return (
    <LayoutPreparacao
      titulo='Minha jornada'
      chaveSecao={ativa?.id ?? 'guia-mudanca'}
      descricao='Da escolha do imóvel aos primeiros dias na casa, siga os checklists no seu ritmo.'
    >
      <div className='jornada-guia'>
        <div className='jornada-guia-progresso'>
          <div>
            <strong>
              {total > 0 && feitas === total
                ? 'Checklist completo'
                : 'Progresso da mudança'}
            </strong>
            <p>
              {feitas} de {total} itens concluídos
            </p>
          </div>
          <progress
            aria-label='Progresso da mudança'
            max={total || 1}
            value={feitas}
          />
          <Link to='?visao=jornadas'>
            Jornadas cadastradas <ChevronRight size={16} aria-hidden='true' />
          </Link>
        </div>
        {editavel && !ativa && (
          <div className='jornada-guia-personalizar'>
            <button type='button' onClick={() => setEditor('etapa')}>
              <Plus size={17} aria-hidden='true' /> Adicionar etapa
            </button>
          </div>
        )}
        {!etapas.length && (
          <p>Adicione uma etapa para montar seu checklist de mudança.</p>
        )}
        {erro && !ativa && <p role='alert'>{erro}</p>}
        {editor === 'etapa' && !ativa && (
          <section
            className='jornada-guia-checklist'
            aria-label='Adicionar etapa'
          >
            <h2>Adicionar etapa</h2>
            {formulario('etapa')}
          </section>
        )}
        {!ativa && (
          <nav className='jornada-guia-etapas' aria-label='Etapas da mudança'>
            {etapas.map((etapa, indice) => (
              <button
                className='jornada-guia-cartao'
                type='button'
                key={etapa.id}
                data-proxima={pendente?.id === etapa.id}
                onClick={() => abrirEtapa(etapa.id)}
              >
                <img src={etapa.foto} alt='' />
                <span className='jornada-guia-cartao-texto'>
                  <span className='jornada-guia-cartao-ordem'>
                    Etapa {indice + 1} · {etapa.feitas}/{etapa.tarefas.length}
                    {etapa.tarefas.length > 0 &&
                      etapa.feitas === etapa.tarefas.length && (
                        <CircleCheck size={15} aria-label='Concluída' />
                      )}
                  </span>
                  <strong>{etapa.titulo}</strong>
                  <span className='jornada-guia-cartao-descricao'>
                    {etapa.descricao}
                  </span>
                </span>
              </button>
            ))}
          </nav>
        )}
        {ativa && (
          <section
            className='jornada-guia-detalhe'
            aria-labelledby='jornada-etapa-titulo'
          >
            <button
              className='jornada-guia-voltar'
              type='button'
              onClick={() => abrirEtapa()}
            >
              <ArrowLeft size={17} aria-hidden='true' /> Todas as etapas
            </button>
            <header className='jornada-guia-etapa-capa'>
              <img src={ativa.foto} alt='' />
              <div>
                <span>
                  Etapa {etapas.indexOf(ativa) + 1} de {etapas.length}
                </span>
                <h2 id='jornada-etapa-titulo'>{ativa.titulo}</h2>
                {ativa.descricao && <p>{ativa.descricao}</p>}
                <progress
                  aria-label='Progresso desta etapa'
                  value={ativa.feitas}
                  max={ativa.tarefas.length || 1}
                />
                <p aria-live='polite'>
                  {ativa.feitas} de {ativa.tarefas.length} itens concluídos
                </p>
                {ativa.apoio && (
                  <Link to={ativa.apoio.rota}>
                    {ativa.apoio.rotulo}{' '}
                    <ArrowUpRight size={16} aria-hidden='true' />
                  </Link>
                )}
              </div>
            </header>
            <div className='jornada-guia-checklist'>
              <h3>Checklist da etapa</h3>
              <p>Marque o que já fez ou abra um item para ver como fazer.</p>
              {!editavel && (
                <p>As marcações estão disponíveis na prévia local.</p>
              )}
              {erro && !tarefaAberta && <p role='alert'>{erro}</p>}
              <ul>
                {ativa.tarefas.map(tarefa => (
                  <li
                    className='jornada-guia-linha'
                    key={tarefa.id ?? tarefa.titulo}
                  >
                    <input
                      type='checkbox'
                      aria-label={'Concluir: ' + tarefa.titulo}
                      checked={tarefa.concluida}
                      disabled={!editavel}
                      onChange={() => executar('alternar-item', tarefa)}
                    />
                    <button
                      type='button'
                      aria-haspopup='dialog'
                      onClick={() => {
                        setErro('');
                        setRemocao(null);
                        setItemAberto(tarefa.titulo);
                      }}
                    >
                      <span>
                        <strong>{tarefa.titulo}</strong>
                        <small>Ver orientações</small>
                      </span>
                      <ChevronRight size={18} aria-hidden='true' />
                    </button>
                  </li>
                ))}
              </ul>
              {!ativa.tarefas.length && (
                <p>Adicione um item para começar este checklist.</p>
              )}
              {editavel && (
                <div className='jornada-guia-personalizar'>
                  <button
                    type='button'
                    onClick={() => {
                      setEditor('item');
                      setRemocao(null);
                    }}
                  >
                    <Plus size={16} aria-hidden='true' /> Adicionar item
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setRemocao({ acao: 'remover-etapa' });
                      setEditor(null);
                    }}
                  >
                    Remover etapa
                  </button>
                </div>
              )}
              {remocao?.acao === 'remover-etapa' && (
                <div className='jornada-guia-confirmar'>
                  <p>Remover esta etapa e todos os seus itens?</p>
                  <button type='button' onClick={() => setRemocao(null)}>
                    Cancelar
                  </button>
                  <button type='button' onClick={() => executar(remocao.acao)}>
                    Remover etapa e itens
                  </button>
                </div>
              )}
              {editor === 'item' && formulario('item')}
              {proxima && (
                <div className='jornada-guia-acoes'>
                  <button type='button' onClick={() => abrirEtapa(proxima.id)}>
                    Próxima etapa <ChevronRight size={17} aria-hidden='true' />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
        {tarefaAberta && (
          <DialogoCasa
            titulo={tarefaAberta.titulo}
            aoFechar={() => {
              setItemAberto(null);
              setRemocao(null);
            }}
            classe='jornada-guia-modal'
          >
            <img className='jornada-guia-capa-modal' src={ativa.foto} alt='' />
            <h3 className='font-bold'>Como fazer</h3>
            <p className='mt-1 whitespace-pre-line text-(--texto-apoio)'>
              {tarefaAberta.descricao ||
                'Este item ainda não tem uma dica cadastrada.'}
            </p>
            {tarefaAberta.referencia && (
              <div className='jornada-guia-item-acoes'>
                <a
                  href={tarefaAberta.referencia[1]}
                  target='_blank'
                  rel='noreferrer'
                >
                  {tarefaAberta.referencia[0]}{' '}
                  <ArrowUpRight size={14} aria-hidden='true' />
                </a>
              </div>
            )}
            {erro && <p role='alert'>{erro}</p>}
            {editavel && (
              <div className='jornada-guia-personalizar'>
                <button
                  type='button'
                  onClick={() => executar('alternar-item', tarefaAberta)}
                >
                  {tarefaAberta.concluida
                    ? 'Marcar como pendente'
                    : 'Marcar como concluído'}
                </button>
                {remocao?.acao !== 'remover-item' && (
                  <button
                    type='button'
                    onClick={() => setRemocao({ acao: 'remover-item' })}
                  >
                    <Trash2 size={16} aria-hidden='true' /> Remover item
                  </button>
                )}
              </div>
            )}
            {remocao?.acao === 'remover-item' && (
              <div className='jornada-guia-confirmar'>
                <p>Remover este item do checklist?</p>
                <button type='button' onClick={() => setRemocao(null)}>
                  Cancelar
                </button>
                <button
                  type='button'
                  onClick={() => executar('remover-item', tarefaAberta)}
                >
                  Confirmar remoção
                </button>
              </div>
            )}
          </DialogoCasa>
        )}
      </div>
    </LayoutPreparacao>
  );
}

export default function MinhaJornada() {
  const [params] = useSearchParams();
  if (params.has('entidade') || params.get('visao') === 'jornadas') {
    return (
      <RegistrosPreparacao
        raiz='jornada'
        filtrarRaiz={ehJornadaPersonalizada}
        titulo='Jornadas cadastradas'
        descricao='Acompanhe suas jornadas e gerencie as etapas e tarefas.'
      />
    );
  }
  return <GuiaMudanca />;
}
