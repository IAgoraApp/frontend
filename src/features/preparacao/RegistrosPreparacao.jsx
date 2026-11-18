import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Botao, EstadoVazio, ModalConfirmacao, Titulo } from '../../shared/ui';
import {
  alterarBancoPreparacao,
  dataCurta,
  moeda,
  useBancoMvp,
} from '../../app/dados/bancoMvp';
import { acessoLocal } from '../../app/dados/acessoLocal';
import ComparacaoSimulacoes from './ComparacaoSimulacoes';
import LayoutPreparacao, { campo, painel } from './LayoutPreparacao';
import {
  listar,
  modelo,
  nomeRegistro,
  proximoId,
  removerRegistro,
  resumoMoradia,
} from './modelo';

function Campo({ def, valor }) {
  const { nome, rotulo, maxLength, tipo = 'text', opcional, opcoes } = def;
  const props = {
    name: nome,
    className: campo,
    required: !opcional,
    defaultValue: valor ?? (tipo === 'number' && !opcional ? 0 : ''),
    maxLength,
    pattern: nome === 'cep' ? '[0-9]{5}-?[0-9]{3}' : undefined,
  };
  return (
    <label className='grid gap-1.5 text-sm font-semibold'>
      {rotulo}
      {opcional ? ' (opcional)' : ''}
      {opcoes ? (
        <select {...props}>
          <option value=''>Selecione</option>
          {Object.entries(opcoes).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      ) : tipo === 'textarea' ? (
        <textarea {...props} rows={2} />
      ) : (
        <input
          {...props}
          type={tipo}
          min={tipo === 'number' ? 0 : undefined}
          max={tipo === 'number' ? 9999999999.99 : undefined}
          step={tipo === 'number' ? '.01' : undefined}
        />
      )}
    </label>
  );
}

function Metricas({ entidade, registro, banco, usuario }) {
  const config = modelo[entidade];
  const filhos = config.filhos?.[0];
  if (entidade === 'plano_moradia' || entidade === 'simulacao_moradia') {
    const valores = resumoMoradia(
      registro.renda_mensal,
      registro.reserva_atual ?? registro.reserva,
      listar(banco, filhos, usuario, registro.id)
    );
    return (
      <dl className='mt-3 grid grid-cols-2 gap-3 rounded-lg bg-(--azul-fundo) p-3 sm:grid-cols-4'>
        {Object.entries({
          mensal: 'Custo mensal',
          inicial: 'Custo inicial',
          saldoMensal: 'Saldo mensal',
          saldoInicial: 'Saldo da reserva',
        }).map(([chave, rotulo]) => (
          <div key={chave}>
            <dt className='text-xs text-(--texto-apoio)'>{rotulo}</dt>
            <dd className='font-bold'>{moeda(valores[chave])}</dd>
          </div>
        ))}
      </dl>
    );
  }
  if (entidade === 'casa_desejada' && registro.valor != null) {
    const plano = listar(banco, 'plano_moradia', usuario).find(
      item => item.status === 'ativo'
    );
    if (!plano)
      return (
        <Link
          className='mt-2 inline-block text-sm font-bold underline'
          to='/financas-b'
        >
          Criar um plano para comparar
        </Link>
      );
    const custos = listar(banco, 'custo_moradia', usuario, plano.id);
    const { mensal } = resumoMoradia(
      plano.renda_mensal,
      plano.reserva_atual,
      custos
    );
    return (
      <div className='mt-3 rounded-lg bg-(--azul-fundo) p-3 text-sm'>
        {plano.renda_mensal > 0 && (
          <p>
            Comparação com a renda mensal: o valor informado representa{' '}
            {new Intl.NumberFormat('pt-BR', {
              style: 'percent',
              maximumFractionDigits: 1,
            }).format(registro.valor / plano.renda_mensal)}{' '}
            da renda mensal do plano. Use essa comparação para aluguel mensal.
          </p>
        )}
        {custos.some(item => item.tipo === 'mensal') && (
          <p>Gastos mensais já registrados no plano: {moeda(mensal)}.</p>
        )}
        <Link
          className='mt-1 inline-block font-bold underline'
          to={'/financas-b?visao=simulacoes&plano=' + plano.id}
        >
          Testar este valor em uma simulação
        </Link>
      </div>
    );
  }
  if (entidade === 'jornada' || entidade === 'etapa_jornada') {
    const registros = listar(banco, filhos, usuario, registro.id);
    const feitas = registros.filter(
      item => item.concluida || item.status === 'concluida'
    ).length;
    return (
      <p className='mt-2 text-sm text-(--texto-apoio)'>
        {feitas} de {registros.length} {modelo[filhos].plural.toLowerCase()}{' '}
        concluídas
      </p>
    );
  }
  return null;
}

function Registro({
  registro,
  usuario,
  entidade,
  banco,
  editar,
  excluir,
  executar,
  mover,
  anterior,
  seguinte,
}) {
  const config = modelo[entidade];
  const endereco =
    entidade === 'casa_desejada' &&
    banco.endereco.find(item => item.id === registro.endereco_id);
  const concluido =
    registro.concluida || ['concluida', 'concluido'].includes(registro.status);
  function mudarStatus() {
    executar(db => {
      const atual = db[entidade].find(item => item.id === registro.id);
      if (entidade === 'tarefa_jornada') atual.concluida = !atual.concluida;
      if (entidade === 'etapa_jornada') {
        atual.status = concluido ? 'pendente' : 'concluida';
        atual.concluida_em = concluido ? null : new Date().toISOString();
      }
      if (entidade === 'jornada')
        atual.status = concluido ? 'em_andamento' : 'concluida';
      if (entidade === 'plano_moradia')
        atual.status = atual.status === 'ativo' ? 'concluido' : 'ativo';
    });
  }
  return (
    <article className={painel}>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div>
          <h3 className='text-lg font-bold'>
            {config.filhos ? (
              <Link
                className='hover:underline'
                to={'?' + new URLSearchParams({ entidade, id: registro.id })}
              >
                {nomeRegistro(registro)}
              </Link>
            ) : (
              nomeRegistro(registro)
            )}
          </h3>
          {registro.descricao && (
            <p className='text-sm text-(--texto-apoio)'>{registro.descricao}</p>
          )}
          <p className='text-sm text-(--texto-apoio)'>
            {[
              config.status?.[registro.status],
              registro.categoria,
              registro.tipo,
              registro.valor != null && moeda(registro.valor),
              registro.prazo && dataCurta(registro.prazo),
              registro.mudanca_prevista &&
                'Mudança em ' + dataCurta(registro.mudanca_prevista),
              endereco &&
                [
                  endereco.rua,
                  endereco.numero,
                  endereco.bairro,
                  endereco.cidade,
                  endereco.estado,
                ]
                  .filter(Boolean)
                  .join(', '),
            ]
              .filter(Boolean)
              .join(' • ')}
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-3 text-sm font-bold'>
          {config.filhos && (
            <Link to={'?' + new URLSearchParams({ entidade, id: registro.id })}>
              Abrir
            </Link>
          )}
          <button type='button' onClick={editar}>
            Editar
          </button>
          <button
            type='button'
            className='text-(--vermelho-alerta)'
            onClick={excluir}
          >
            Excluir
          </button>
        </div>
      </div>
      <Metricas
        entidade={entidade}
        registro={registro}
        banco={banco}
        usuario={usuario}
      />
      <div className='mt-2 flex flex-wrap items-center gap-3 text-sm font-semibold text-(--azul-principal) empty:hidden'>
        {(config.status || entidade === 'tarefa_jornada') && (
          <button type='button' onClick={mudarStatus}>
            {entidade === 'plano_moradia' && registro.status !== 'ativo'
              ? 'Reativar'
              : concluido
                ? 'Reabrir'
                : 'Concluir'}
          </button>
        )}
        {entidade === 'plano_moradia' && registro.status !== 'arquivado' && (
          <button
            type='button'
            onClick={() =>
              executar(db => {
                db.plano_moradia.find(item => item.id === registro.id).status =
                  'arquivado';
              })
            }
          >
            Arquivar
          </button>
        )}
        {anterior && (
          <button type='button' onClick={() => mover(anterior)}>
            Mover para cima
          </button>
        )}
        {seguinte && (
          <button type='button' onClick={() => mover(seguinte)}>
            Mover para baixo
          </button>
        )}
      </div>
    </article>
  );
}

const enderecoCampos = [
  ['rua', 'Rua', 255],
  ['numero', 'Número', 20, true],
  ['bairro', 'Bairro', 150],
  ['cidade', 'Cidade', 150],
  ['estado', 'Estado', 100],
  ['cep', 'CEP', 9],
  ['pais', 'País', 100],
  ['complemento', 'Complemento', 150, true],
].map(([nome, rotulo, maxLength, opcional]) => ({
  nome,
  rotulo,
  maxLength,
  opcional,
}));

function Lista({ banco, entidade, pai, usuario, filtrar }) {
  const [editor, setEditor] = useState(null);
  const [exclusao, setExclusao] = useState(null);
  const [erro, setErro] = useState('');
  const config = modelo[entidade];
  const registros = listar(banco, entidade, usuario, pai).filter(
    item => !filtrar || filtrar(item)
  );
  function executar(operacao) {
    try {
      alterarBancoPreparacao(operacao);
      setErro('');
      return true;
    } catch (falha) {
      setErro(falha.message);
      return false;
    }
  }
  function salvar(evento) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    const valores = Object.fromEntries(
      config.campos.map(def => {
        const valor = String(dados.get(def.nome) ?? '').trim();
        return [
          def.nome,
          valor === '' ? null : def.tipo === 'number' ? Number(valor) : valor,
        ];
      })
    );
    if (
      config.campos.some(def => !def.opcional && valores[def.nome] === null)
    ) {
      setErro('Preencha os campos obrigatórios.');
      return;
    }
    if (
      entidade === 'casa_desejada' &&
      dados.has('rua') &&
      enderecoCampos.some(
        def => !def.opcional && !String(dados.get(def.nome) ?? '').trim()
      )
    ) {
      setErro('Preencha os campos obrigatórios do endereço.');
      return;
    }
    if (
      executar(db => {
        const atuais = db[entidade];
        const atual = atuais.find(item => item.id === editor.id);
        if (entidade === 'casa_desejada') {
          valores.endereco_id = editor.semEndereco
            ? null
            : (atual?.endereco_id ?? null);
          if (dados.has('rua')) {
            const endereco = Object.fromEntries(
              enderecoCampos.map(def => [
                def.nome,
                String(dados.get(def.nome)).trim() || null,
              ])
            );
            const salvo = db.enderecos_preparacao.find(
              item => item.id === atual?.endereco_id
            );
            if (salvo) {
              Object.assign(salvo, endereco);
              Object.assign(
                db.endereco.find(item => item.id === salvo.id),
                endereco
              );
              valores.endereco_id = salvo.id;
            } else {
              const id = proximoId(db.endereco);
              db.endereco.push({ ...endereco, id });
              db.enderecos_preparacao.push({ ...endereco, id });
              valores.endereco_id = id;
            }
          }
        }
        if (atual) {
          Object.assign(atual, valores);
          return;
        }
        const novo = { id: proximoId(atuais), ...valores };
        novo[config.vinculo ?? 'user_id'] = config.vinculo ? pai : usuario;
        if (config.ordenavel)
          novo.ordem =
            Math.max(
              0,
              ...listar(db, entidade, usuario, pai).map(item => item.ordem)
            ) + 1;
        if (config.status) novo.status = Object.keys(config.status)[0];
        if (entidade === 'tarefa_jornada') novo.concluida = false;
        if (entidade === 'etapa_jornada') novo.concluida_em = null;
        if (['jornada', 'simulacao_moradia'].includes(entidade))
          novo.criada_em = new Date().toISOString();
        atuais.push(novo);
      })
    )
      setEditor(null);
  }
  return (
    <section className='space-y-3'>
      <header className='flex flex-wrap items-center justify-between gap-2'>
        <Titulo como='h2' classe='text-xl font-bold'>
          {config.plural}
        </Titulo>
        <Botao type='button' onClick={() => setEditor({})}>
          Adicionar {config.singular}
        </Botao>
      </header>
      {erro && (
        <p role='alert' className='text-(--vermelho-alerta)'>
          {erro}
        </p>
      )}
      {editor && (
        <form
          className={painel + ' grid gap-3 sm:grid-cols-2'}
          key={editor.id ?? 'novo'}
          onSubmit={salvar}
        >
          <h3 className='font-bold sm:col-span-2'>
            {editor.id ? 'Editar' : 'Cadastrar'} {config.singular}
          </h3>
          {config.campos.map(def => (
            <Campo key={def.nome} def={def} valor={editor[def.nome]} />
          ))}
          {entidade === 'casa_desejada' && (
            <>
              <label className='sm:col-span-2'>
                <input
                  type='checkbox'
                  checked={!!editor.editarEndereco}
                  onChange={e =>
                    setEditor({
                      ...editor,
                      editarEndereco: e.target.checked,
                      semEndereco: false,
                    })
                  }
                />{' '}
                Informar endereço
              </label>
              {editor.endereco_id && !editor.editarEndereco && (
                <label className='sm:col-span-2'>
                  <input
                    type='checkbox'
                    checked={!!editor.semEndereco}
                    onChange={e =>
                      setEditor({ ...editor, semEndereco: e.target.checked })
                    }
                  />{' '}
                  Remover vínculo com endereço
                </label>
              )}
              {editor.editarEndereco &&
                enderecoCampos.map(def => (
                  <Campo
                    key={def.nome}
                    def={def}
                    valor={
                      banco.endereco.find(e => e.id === editor.endereco_id)?.[
                        def.nome
                      ] ?? (def.nome === 'pais' ? 'Brasil' : undefined)
                    }
                  />
                ))}
            </>
          )}
          <div className='flex flex-wrap gap-2 sm:col-span-2'>
            <Botao type='submit'>Salvar</Botao>
            <Botao
              type='button'
              variante='contorno'
              onClick={() => {
                setEditor(null);
                setErro('');
              }}
            >
              Cancelar
            </Botao>
          </div>
        </form>
      )}
      {!registros.length && !editor && (
        <EstadoVazio
          titulo='Nenhum registro por aqui'
          descricao={'Adicione ' + config.singular + ' para começar.'}
        />
      )}
      {registros.map((registro, indice) => (
        <Registro
          key={registro.id}
          {...{ registro, entidade, banco, executar, usuario }}
          editar={() => setEditor(registro)}
          excluir={() => setExclusao(registro)}
          anterior={config.ordenavel && registros[indice - 1]}
          seguinte={config.ordenavel && registros[indice + 1]}
          mover={vizinho =>
            executar(db => {
              const lista = listar(db, entidade, usuario, pai);
              lista[indice] = vizinho;
              lista[registros.findIndex(item => item.id === vizinho.id)] =
                registro;
              lista.forEach((item, ordem) => {
                db[entidade].find(atual => atual.id === item.id).ordem =
                  ordem + 1;
              });
            })
          }
        />
      ))}
      <ModalConfirmacao
        aberto={!!exclusao}
        titulo={'Excluir ' + config.singular + '?'}
        descricao='O registro e seus itens vinculados serão removidos.'
        destrutivo
        textoConfirmar='Excluir'
        aoCancelar={() => setExclusao(null)}
        aoConfirmar={() => {
          if (executar(db => removerRegistro(db, entidade, exclusao.id)))
            setExclusao(null);
        }}
      />
    </section>
  );
}

const trilhas = {
  jornada: ['jornada', 'etapa_jornada'],
  plano_moradia: ['plano_moradia', 'simulacao_moradia'],
  casa_desejada: [],
};

export default function RegistrosPreparacao({
  raiz,
  titulo,
  descricao,
  filtrarRaiz,
}) {
  const { b, perfil } = useBancoMvp();
  const usuario = perfil?.user_id;
  const [params] = useSearchParams();
  const entidade = params.get('entidade');
  const id = Number(params.get('id'));
  const atual =
    trilhas[raiz].includes(entidade) &&
    b[entidade].find(item => item.id === id);
  const pai =
    atual &&
    entidade !== raiz &&
    b[raiz].find(item => item.id === atual[modelo[entidade].vinculo]);
  const registro = atual && (pai || atual).user_id === usuario ? atual : null;
  return (
    <LayoutPreparacao
      titulo={acessoLocal && registro ? nomeRegistro(registro) : titulo}
      descricao={descricao}
    >
      {!acessoLocal ? (
        <EstadoVazio
          titulo='Disponível na prévia local'
          descricao='Este módulo aguarda a integração com o servidor.'
        />
      ) : registro ? (
        <>
          <Link
            className='inline-flex py-2 font-bold'
            to={
              pai
                ? '?' + new URLSearchParams({ entidade: raiz, id: pai.id })
                : '.'
            }
          >
            Voltar
          </Link>
          <Metricas
            entidade={entidade}
            registro={registro}
            banco={b}
            usuario={usuario}
          />
          {entidade === 'plano_moradia' && (
            <ComparacaoSimulacoes
              simulacoes={listar(b, 'simulacao_moradia', usuario, registro.id)}
              itens={b.simulacao_item}
            />
          )}
          {modelo[entidade].filhos.map(filho => (
            <Lista
              key={filho + registro.id}
              banco={b}
              usuario={usuario}
              entidade={filho}
              pai={registro.id}
            />
          ))}
        </>
      ) : (
        <Lista
          key={raiz}
          banco={b}
          entidade={raiz}
          usuario={usuario}
          filtrar={filtrarRaiz}
        />
      )}
    </LayoutPreparacao>
  );
}
