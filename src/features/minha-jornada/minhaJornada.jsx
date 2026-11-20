import { useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  ImagePlus,
  Plus,
  Route,
  Trash2,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDadosServidor } from '../../app/dados/contextoServidor';
import { atualizarGuiaApi } from './jornadaApi';
import { useBancoMvp } from '../../app/dados/bancoMvp';
import { useAvisoPerfilA } from '../../app/avisos/avisosPerfilA';
import {
  AcaoFinancas,
  DialogoFinancas,
} from '../financas/components/financeUi';
import CartoesEtapas from './CartoesEtapas';
import { DialogoCasa } from '../casa/components/casaUi';
import LayoutPreparacao from '../preparacao/LayoutPreparacao';
import { EditorMvp } from '../../shared/ui/mvp';
import { atualizarGuia } from './jornadaDados';
import { modelo } from '../preparacao/modelo';
import { fotosEtapa, lerGuia } from './guiaMudanca';
import './minhaJornada.css';

export default function MinhaJornada() {
  const { b, perfil } = useBancoMvp();
  const servidor = useDadosServidor();
  const [salvando, setSalvando] = useState(false);
  const usuario = perfil?.user_id;
  const [params, setParams] = useSearchParams();
  const [erro, setErro] = useState('');
  const notificar = useAvisoPerfilA();
  const [editor, setEditor] = useState(null);
  const [fotoEtapa, setFotoEtapa] = useState(null);
  const [galeriaAberta, setGaleriaAberta] = useState(false);
  const [remocao, setRemocao] = useState(null);
  const [itemAberto, setItemAberto] = useState(null);
  const editavel = !!usuario;
  const {
    etapas,
    feitas,
    total,
    proxima: pendente,
  } = lerGuia(b, usuario);
  const ativa = etapas.find(item => item.id === params.get('etapa'));
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

  async function salvar(acao, dados, etapa = ativa) {
    if (!editavel || salvando) return;
    setSalvando(true);
    try {
      if (servidor) {
        await atualizarGuiaApi(b, usuario, etapa, acao, dados);
        await servidor.atualizar();
      } else atualizarGuia(usuario, etapa, acao, dados);
      setErro('');
    } finally {
      setSalvando(false);
    }
  }

  async function executar(acao, dados, etapa = ativa) {
    try {
      if (salvando) return;
      await salvar(acao, dados, etapa);
      if (acao === 'mover-etapa') notificar('Ordem das etapas atualizada.');
      if (acao.startsWith('remover-'))
        notificar(
          acao === 'remover-etapa' ? 'Etapa excluída.' : 'Item removido.'
        );
      if (acao === 'remover-etapa') abrirEtapa();
      if (acao === 'remover-item') setItemAberto(null);
      setRemocao(null);
    } catch (falha) {
      setErro(falha.message);
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
              tipo === 'etapa'
                ? item.nome === 'titulo'
                  ? 'Nome da etapa'
                  : 'Descrição (opcional)'
                : item.nome === 'descricao'
                  ? 'Dica para realizar a tarefa (opcional)'
                  : item.rotulo,
          }))}
        rotuloSalvar={
          tipo === 'etapa' ? 'Criar etapa' : 'Adicionar ao checklist'
        }
        onSave={dados =>
          salvar(
            'adicionar-' + tipo,
            tipo === 'etapa' ? { ...dados, foto: fotoEtapa?.id } : dados
          )
        }
        onClose={() => setEditor(null)}
      />
    );
  }

  return (
    <LayoutPreparacao
      titulo='Minha jornada'
      acao={
        ativa && (
          <button
            className='jornada-guia-voltar'
            type='button'
            onClick={() => abrirEtapa()}
          >
            <ArrowLeft size={17} aria-hidden='true' /> Voltar às etapas
          </button>
        )
      }
      chaveSecao={ativa?.id ?? 'guia-mudanca'}
      descricao={
        ativa
          ? undefined
          : 'Da escolha do imóvel aos primeiros dias na casa, siga os checklists no seu ritmo.'
      }
    >
      <div
        className={ativa ? 'jornada-guia jornada-guia-ativa' : 'jornada-guia'}
      >
        {!ativa && (
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
          </div>
        )}
        {!ativa && (
          <section
            className='jornada-convite-ia'
            aria-labelledby='jornada-convite-titulo'
          >
            <Route
              className='jornada-convite-icone'
              size={32}
              aria-hidden='true'
            />
            <div>
              <h2 id='jornada-convite-titulo'>Sua mudança, do seu jeito</h2>
              <p>
                Cada pessoa tem uma jornada diferente. Se quiser personalizar a
                sua, converse com a iA sobre o que você precisa para morar
                sozinho.
              </p>
            </div>
            <Link to='/ia-b'>Conversar com a iA</Link>
          </section>
        )}
        {!etapas.length && (
          <p>Adicione uma etapa para montar seu checklist de mudança.</p>
        )}
        {erro && !ativa && <p role='alert'>{erro}</p>}
        {editor === 'etapa' && !ativa && (
          <DialogoCasa
            titulo='Adicionar etapa'
            classe='jornada-nova-etapa'
            aoFechar={() => setEditor(null)}
          >
            <div className='jornada-nova-etapa-grade'>
              <div className='jornada-nova-etapa-foto'>
                <button
                  type='button'
                  className='jornada-escolher-foto'
                  aria-expanded={galeriaAberta}
                  aria-controls='jornada-opcoes-foto'
                  onClick={() => setGaleriaAberta(aberta => !aberta)}
                >
                  <img src={fotoEtapa?.foto ?? fotosEtapa[0].foto} alt='' />
                  <span>
                    <ImagePlus size={16} aria-hidden='true' /> Escolher foto
                  </span>
                </button>
                <div
                  id='jornada-opcoes-foto'
                  className='jornada-opcoes-foto'
                  hidden={!galeriaAberta}
                >
                  {fotosEtapa.map(imagem => (
                    <button
                      key={imagem.id}
                      type='button'
                      aria-label={'Usar foto de ' + imagem.titulo}
                      aria-pressed={imagem.id === fotoEtapa?.id}
                      onClick={() => {
                        setFotoEtapa(imagem);
                        setGaleriaAberta(false);
                      }}
                    >
                      <img src={imagem.foto} alt='' />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className='jornada-nova-etapa-ajuda'>
                  Dê um nome à etapa. Depois, você pode montar o checklist dela.
                </p>
                {formulario('etapa')}
              </div>
            </div>
          </DialogoCasa>
        )}
        {!ativa && (
          <CartoesEtapas
            etapas={etapas}
            pendente={pendente}
            editavel={editavel}
            abrir={abrirEtapa}
            adicionar={() => {
              setFotoEtapa(
                fotosEtapa[Math.floor(Math.random() * fotosEtapa.length)]
              );
              setGaleriaAberta(false);
              setEditor('etapa');
            }}
            renomear={etapa => {
              setErro('');
              setEditor({ etapa });
            }}
            remover={etapa => {
              setErro('');
              setRemocao({ acao: 'remover-etapa', etapa });
            }}
            mover={(origem, destino, lado) =>
              executar('mover-etapa', { ...destino, lado }, origem)
            }
          />
        )}
        {editor?.etapa && (
          <DialogoCasa
            titulo='Renomear etapa'
            classe='jornada-nova-etapa'
            aoFechar={() => setEditor(null)}
          >
            <EditorMvp
              cabecalho={false}
              inicial={editor.etapa}
              campos={[
                { nome: 'titulo', rotulo: 'Nome da etapa', limite: 150 },
              ]}
              rotuloSalvar='Salvar nome'
              onSave={async dados => {
                await salvar('renomear-etapa', dados, editor.etapa);
                notificar('Nome da etapa atualizado.');
              }}
              onClose={() => setEditor(null)}
            />
          </DialogoCasa>
        )}
        {ativa && (
          <section
            className='jornada-guia-detalhe'
            aria-labelledby='jornada-etapa-titulo'
          >
            <header className='jornada-guia-etapa-capa'>
              <div className='jornada-etapa-foto'>
                <img src={ativa.foto} alt='' />
              </div>
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
              <header className='jornada-checklist-topo'>
                <h3 id='jornada-checklist-titulo'>Checklist</h3>
              </header>
              <div
                className='jornada-checklist-corpo'
                id='jornada-checklist-corpo'
                tabIndex={0}
                role='region'
                aria-labelledby='jornada-checklist-titulo'
              >
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
              </div>
              {editavel && (
                <footer className='jornada-checklist-rodape'>
                  <button
                    className='jornada-checklist-adicionar'
                    type='button'
                    aria-haspopup='dialog'
                    onClick={() => setEditor('item')}
                  >
                    <Plus size={17} aria-hidden='true' /> Adicionar item
                  </button>
                </footer>
              )}
            </div>
          </section>
        )}
        {ativa && editor === 'item' && (
          <DialogoCasa
            titulo='Adicionar item'
            classe='jornada-nova-etapa'
            aoFechar={() => setEditor(null)}
          >
            <div className='jornada-nova-etapa-grade'>
              <img src={ativa.foto} alt='' />
              <div>
                <p className='jornada-nova-etapa-ajuda'>
                  Checklist de {ativa.titulo}
                </p>
                {formulario('item')}
              </div>
            </div>
          </DialogoCasa>
        )}
        {tarefaAberta && !remocao && (
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
                <button
                  type='button'
                  onClick={() => {
                    setErro('');
                    setRemocao({
                      acao: 'remover-item',
                      etapa: ativa,
                      tarefa: tarefaAberta,
                    });
                  }}
                >
                  <Trash2 size={16} aria-hidden='true' /> Remover item
                </button>
              </div>
            )}
          </DialogoCasa>
        )}
        {remocao && (
          <DialogoFinancas
            titulo={
              remocao.tarefa ? 'Remover item do checklist?' : 'Excluir etapa?'
            }
            Icone={Trash2}
            destrutivo
            aoFechar={() => {
              setRemocao(null);
              setErro('');
            }}
          >
            <p className='text-(--texto-apoio)'>
              {remocao.tarefa
                ? '“' + remocao.tarefa.titulo + '” será removido do checklist.'
                : '“' +
                  remocao.etapa.titulo +
                  '” e todos os seus itens serão removidos da jornada.'}
            </p>
            {erro && (
              <p role='alert' className='mt-3 text-(--vermelho-alerta)'>
                {erro}
              </p>
            )}
            <div className='finance-dialog-actions'>
              <AcaoFinancas
                secundario
                onClick={() => {
                  setRemocao(null);
                  setErro('');
                }}
              >
                Cancelar
              </AcaoFinancas>
              <AcaoFinancas
                classe='finance-dialog-delete'
                onClick={() =>
                  executar(remocao.acao, remocao.tarefa, remocao.etapa)
                }
              >
                {remocao.tarefa ? 'Remover item' : 'Excluir etapa'}
              </AcaoFinancas>
            </div>
          </DialogoFinancas>
        )}
      </div>
    </LayoutPreparacao>
  );
}
