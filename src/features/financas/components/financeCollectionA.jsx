import { useState } from 'react';
import {
  ChartPie,
  ChevronRight,
  List,
  Pencil,
  Repeat,
  Tags,
  Target,
  Trash2,
  Wallet,
} from 'lucide-react';
import { EditorMvp } from '../../../shared/ui/mvp';
import { atualizarFinancas, excluirFinancas } from '../financasDados';
import {
  AcaoFinancas,
  DialogoFinancas,
  EstadoVazioFinancas,
  PainelFinancas,
} from './financeUi';

const nomeRegistro = item => item.nome || item.descricao;

const tiposRegistro = {
  transacao_financeira: ['Lançamentos', List],
  conta_financeira: ['Contas', Wallet],
  orcamento: ['Orçamentos', ChartPie],
  meta_financeira: ['Metas', Target],
  categoria_financas: ['Categorias', Tags],
  recorrencia_financeira: ['Recorrências', Repeat],
};

export default function ColecaoFinancas({
  titulo,
  classe,
  colecao,
  registros,
  campos,
  padrao,
  detalhe,
  acoes,
  nomeNovo,
  emGrade = false,
  imagem,
  lista,
  filtros,
  onSave,
  onSaved,
  registroInicial,
  criarAoAbrir = false,
  onCloseRegistro,
}) {
  const [selecionado, setSelecionado] = useState(null);
  const [edicao, setEdicao] = useState(null);
  const editor = edicao ?? (criarAoAbrir ? padrao : null);
  const [exclusao, setExclusao] = useState(false);
  const [aviso, setAviso] = useState('');
  const [erro, setErro] = useState('');
  const [rotulo, Icone] = tiposRegistro[colecao];
  const item = registros.find(r => r.id === (selecionado ?? registroInicial));

  function fechar() {
    setSelecionado(null);
    setEdicao(null);
    setExclusao(false);
    setErro('');
    onCloseRegistro?.();
  }

  function executar(acao, mensagem, fecharDepois = false) {
    try {
      const resultado = acao();
      if (fecharDepois) fechar();
      setErro('');
      setAviso(typeof mensagem === 'function' ? mensagem(resultado) : mensagem);
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    }
  }

  function abrir(registro) {
    setAviso('');
    setSelecionado(registro.id);
  }

  return (
    <PainelFinancas titulo={titulo} classe={classe}>
      {aviso && !item && !editor && (
        <p role='status' className='mb-2 shrink-0 text-sm text-(--texto-apoio)'>
          {aviso}
        </p>
      )}
      {filtros}
      {registros.length ? (
        lista ? (
          lista(abrir)
        ) : (
          <ul
            className={
              emGrade
                ? 'grid gap-3 sm:grid-cols-2 xl:grid-cols-3'
                : 'divide-y divide-[#e6edf2]'
            }
          >
            {registros.map(registro => (
              <li key={registro.id}>
                <button
                  type='button'
                  onClick={() => abrir(registro)}
                  className={
                    'flex h-full w-full cursor-pointer items-center gap-3 rounded-xl py-3 text-left hover:bg-(--azul-fundo) ' +
                    (emGrade ? 'border border-(--borda-suave) px-3' : 'px-2')
                  }
                >
                  {imagem?.(registro)}
                  <div className='min-w-0 flex-1'>
                    <strong className='block'>{nomeRegistro(registro)}</strong>
                    <div className='mt-1 whitespace-pre-line text-sm text-(--texto-apoio)'>
                      {detalhe(registro, false)}
                    </div>
                  </div>
                  <ChevronRight
                    size={17}
                    className='shrink-0 text-(--texto-apoio)'
                    aria-hidden='true'
                  />
                </button>
              </li>
            ))}
          </ul>
        )
      ) : (
        <EstadoVazioFinancas>
          Nenhum registro nesta visualização.
        </EstadoVazioFinancas>
      )}
      {(editor || item) && (
        <DialogoFinancas
          rotulo={rotulo}
          Icone={exclusao ? Trash2 : Icone}
          destrutivo={exclusao}
          titulo={
            editor
              ? editor.id
                ? 'Editar ' + nomeRegistro(editor)
                : nomeNovo
              : exclusao
                ? 'Excluir ' + nomeRegistro(item) + '?'
                : nomeRegistro(item)
          }
          aoFechar={fechar}
        >
          {editor ? (
            <EditorMvp
              key={editor.id ?? 'novo'}
              cabecalho={false}
              campos={campos}
              inicial={editor}
              onClose={fechar}
              onSave={valores => {
                if (onSave) onSave(valores);
                else atualizarFinancas(colecao, valores);
                onSaved?.(valores);
                setAviso('Alterações salvas.');
              }}
            />
          ) : exclusao ? (
            <>
              <p className='text-sm leading-relaxed text-(--texto-apoio)'>
                {colecao === 'conta_financeira' ||
                colecao === 'recorrencia_financeira'
                  ? 'O registro será excluído. Os lançamentos vinculados serão mantidos.'
                  : 'Esta exclusão é permanente.'}
              </p>
              <div className='finance-dialog-actions'>
                <AcaoFinancas
                  secundario
                  onClick={() => {
                    setExclusao(false);
                    setErro('');
                  }}
                >
                  Manter
                </AcaoFinancas>
                <AcaoFinancas
                  classe='finance-dialog-delete'
                  onClick={() =>
                    executar(
                      () => excluirFinancas(colecao, item),
                      'Registro excluído.',
                      true
                    )
                  }
                >
                  Excluir
                </AcaoFinancas>
              </div>
            </>
          ) : (
            <>
              <div className='finance-dialog-details space-y-3 whitespace-pre-line text-sm'>
                {imagem && (
                  <div className='flex items-center gap-3'>
                    {imagem(item)}
                    <div className='min-w-0 flex-1'>{detalhe(item, true)}</div>
                  </div>
                )}
                {!imagem && detalhe(item, true)}
              </div>
              {acoes && (
                <div className='finance-dialog-operations'>
                  {acoes(item, executar)}
                </div>
              )}
              <div className='finance-dialog-actions'>
                <AcaoFinancas
                  secundario
                  onClick={() => {
                    setErro('');
                    setEdicao(item);
                  }}
                >
                  <Pencil size={16} /> Editar
                </AcaoFinancas>
                <AcaoFinancas
                  secundario
                  classe='finance-dialog-danger-link'
                  onClick={() => {
                    setErro('');
                    setExclusao(true);
                  }}
                >
                  <Trash2 size={16} /> Excluir
                </AcaoFinancas>
              </div>
            </>
          )}
          {aviso && !editor && (
            <p
              role='status'
              className='mt-4 rounded-lg bg-[#e7f5ed] px-3 py-2 text-sm text-(--verde-sucesso)'
            >
              {aviso}
            </p>
          )}
          {erro && (
            <p
              role='alert'
              className='mt-4 rounded-lg bg-[#fff1ee] px-3 py-2 text-sm text-(--vermelho-alerta)'
            >
              {erro}
            </p>
          )}
        </DialogoFinancas>
      )}
    </PainelFinancas>
  );
}
