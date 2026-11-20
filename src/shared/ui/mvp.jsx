import { useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { removerRegistro, salvarRegistro } from '../../app/dados/bancoMvp';
import './mvp.css';

export function PaginaMvp({
  titulo,
  descricao,
  acao,
  children,
  cabecalho = true,
  classe = '',
}) {
  return (
    <main className={`mvp-pagina ${classe}`}>
      {cabecalho && (
        <header className='mvp-cabecalho'>
          <div>
            <h1>{titulo}</h1>
            {descricao && <p>{descricao}</p>}
          </div>
          {acao}
        </header>
      )}
      {children}
    </main>
  );
}
export function AbasMvp({ itens, atual, caminho }) {
  return (
    <nav className='mvp-abas' aria-label='Seções'>
      {itens.map(([id, nome]) => (
        <Link
          key={id}
          to={`${caminho}?visao=${id}`}
          aria-current={atual === id ? 'page' : undefined}
        >
          {nome}
        </Link>
      ))}
    </nav>
  );
}
export function VazioMvp({
  children = 'Nenhum registro por aqui. Use o botão de adicionar para começar.',
}) {
  return <p className='mvp-vazio'>{children}</p>;
}
export function ResumoMvp({ itens }) {
  return (
    <div className='mvp-resumo'>
      {itens.map(([nome, valor, detalhe]) => (
        <div key={nome}>
          <span>{nome}</span>
          <strong>{valor}</strong>
          {detalhe && <small>{detalhe}</small>}
        </div>
      ))}
    </div>
  );
}
export function EditorMvp({
  titulo,
  campos,
  secoes,
  grupoSecoes,
  inicial,
  onSave,
  onClose,
  cabecalho = true,
  acaoSecundaria,
  rotuloSalvar = 'Salvar',
  mostrarCancelar = true,
}) {
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const camposFormulario = secoes
    ? [...secoes.flatMap(secao => secao.campos), ...(campos ?? [])]
    : campos;
  const renderizarCampos = lista => (
    <div className='mvp-campos'>
      {lista.map(c =>
        c.renderizar ? (
          <fieldset key={c.nome} className='col-span-full min-w-0'>
            <legend className='mb-2 text-sm font-bold'>{c.rotulo}</legend>
            {c.renderizar(inicial?.[c.nome], c)}
          </fieldset>
        ) : (
          <label key={c.nome}>
            {c.rotulo}
            {c.opcoes ? (
              <select
                aria-label={c.rotulo}
                name={c.nome}
                defaultValue={inicial?.[c.nome] ?? ''}
                required={c.obrigatorio !== false}
              >
                <option value=''>Selecione</option>
                {c.opcoes.map(([valor, nome]) => (
                  <option key={valor} value={valor}>
                    {nome}
                  </option>
                ))}
              </select>
            ) : c.tipo === 'textarea' ? (
              <textarea
                aria-label={c.rotulo}
                name={c.nome}
                defaultValue={inicial?.[c.nome] ?? ''}
                required={c.obrigatorio !== false}
                maxLength={2000}
              />
            ) : (
              <input
                aria-label={c.rotulo}
                name={c.nome}
                type={c.tipo || 'text'}
                min={c.min ?? (c.tipo === 'number' ? 0 : undefined)}
                step={c.tipo === 'number' ? 'any' : undefined}
                defaultValue={inicial?.[c.nome] ?? ''}
                required={c.obrigatorio !== false}
                maxLength={c.tipo === 'number' ? undefined : (c.limite ?? 250)}
              />
            )}
          </label>
        )
      )}
    </div>
  );
  return (
    <div className='mvp-editor'>
      <form
        onInvalid={evento => {
          if (secoes) {
            const secao = evento.target.closest('details');
            if (secao) secao.open = true;
          }
        }}
        onSubmit={async evento => {
          evento.preventDefault();
          if (salvando) return;
          setErro('');
          setSalvando(true);
          const form = new FormData(evento.currentTarget);
          const valores = { ...inicial };
          camposFormulario.forEach(c => {
            const valor = form.get(c.nome)?.trim() ?? '';
            valores[c.nome] =
              c.tipo === 'number' || c.numero
                ? valor === ''
                  ? null
                  : Number(valor)
                : valor || null;
          });
          try {
            const vazio = camposFormulario.find(
              c => c.obrigatorio !== false && valores[c.nome] === null
            );
            if (vazio)
              throw new Error(
                `Preencha o campo ${vazio.rotulo.toLowerCase()}.`
              );
            await onSave(valores);
            onClose?.();
          } catch (e) {
            setErro(e.message);
          } finally {
            setSalvando(false);
          }
        }}
      >
        {cabecalho && (
          <div className='mvp-editor-titulo'>
            <h2>{titulo}</h2>
            <button
              aria-label='Fechar formulário'
              type='button'
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className='mvp-editor-conteudo'>
          {secoes ? (
            <div className='mvp-editor-secoes'>
              {secoes.map(({ titulo, descricao, aberta, Icone, campos }) => (
                <details key={titulo} name={grupoSecoes} open={aberta}>
                  <summary>
                    {Icone && <Icone size={18} aria-hidden='true' />} {titulo}
                    {descricao && (
                      <small className='mvp-secao-descricao'>{descricao}</small>
                    )}
                  </summary>
                  {renderizarCampos(campos)}
                </details>
              ))}
            </div>
          ) : null}
          {campos && renderizarCampos(campos)}
          {erro && <p role='alert'>{erro}</p>}
        </div>
        <div className='mvp-form-acoes'>
          {acaoSecundaria}
          {mostrarCancelar && (
            <button type='button' onClick={onClose}>
              Cancelar
            </button>
          )}
          <button className='mvp-primario' type='submit' disabled={salvando}>
            {salvando ? 'Salvando…' : rotuloSalvar}
          </button>
        </div>
      </form>
    </div>
  );
}
export function ColecaoMvp({
  titulo,
  colecao,
  registros,
  campos,
  padrao = {},
  detalhe,
  acoes,
  podeEditar = true,
  podeExcluir = true,
  onSave,
  onDelete,
  onSuccess,
}) {
  const [editor, setEditor] = useState(null);
  const [exclusao, setExclusao] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState('');
  return (
    <section className='mvp-painel'>
      <div className='mvp-painel-topo'>
        <h2>{titulo}</h2>
        {podeEditar && (
          <button
            type='button'
            className='mvp-primario'
            onClick={() => setEditor({ ...padrao })}
          >
            <Plus size={16} />
            Adicionar
          </button>
        )}
      </div>
      {editor && (
        <EditorMvp
          key={editor.id ?? 'novo'}
          titulo={
            editor.id ? 'Editar registro' : `Adicionar: ${titulo.toLowerCase()}`
          }
          campos={campos}
          inicial={editor}
          onSave={async valores => {
            if (onSave) await onSave(valores);
            else await salvarRegistro(colecao, valores);
            onSuccess?.(
              valores.id ? 'Alterações salvas.' : 'Registro adicionado.'
            );
          }}
          onClose={() => setEditor(null)}
        />
      )}
      {exclusao && (
        <div className='mvp-confirmacao' role='alert'>
          <span>
            Excluir “{exclusao.nome || exclusao.descricao || exclusao.nome_item}
            ” e seus registros relacionados?
          </span>
          <button type='button' onClick={() => setExclusao(null)}>
            Manter
          </button>
          <button
            type='button'
            disabled={excluindo}
            onClick={async () => {
              setExcluindo(true);
              setErro('');
              try {
                if (onDelete) await onDelete(exclusao.id);
                else await removerRegistro(colecao, exclusao.id);
                setExclusao(null);
                onSuccess?.('Registro excluído.');
              } catch (falha) {
                setErro(falha.message);
              } finally {
                setExcluindo(false);
              }
            }}
          >
            Excluir
          </button>
        </div>
      )}
      {erro && <p role='alert'>{erro}</p>}
      {!registros.length ? (
        <VazioMvp />
      ) : (
        <div className='mvp-registros'>
          {registros.map(item => (
            <div className='mvp-registro' key={item.id}>
              <div className='mvp-registro-corpo'>
                <strong>{item.nome || item.descricao || item.nome_item}</strong>
                <div className='mvp-detalhe'>{detalhe?.(item)}</div>
              </div>
              <div className='mvp-acoes'>
                {acoes?.(item)}
                {podeEditar && (
                  <button
                    type='button'
                    aria-label={`Editar ${item.nome || item.descricao || item.nome_item}`}
                    onClick={() => setEditor(item)}
                  >
                    <Pencil size={16} />
                  </button>
                )}
                {podeExcluir && (
                  <button
                    type='button'
                    aria-label={`Excluir ${item.nome || item.descricao || item.nome_item}`}
                    onClick={() => setExclusao(item)}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
