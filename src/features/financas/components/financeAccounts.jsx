import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Banknote, Check, ChevronRight, Plus, Wallet } from 'lucide-react';
import { moeda } from '../../../app/dados/bancoMvp';
import { EditorMvp } from '../../../shared/ui/mvp';
import {
  atualizarFinancas,
  camposConta,
  tiposConta,
  tipoNomeConta,
} from '../financasDados';
import { AcaoFinancas, DialogoFinancas, IconeFinancas } from './financeUi';

function ImagemConta({ tipo }) {
  const icone = tiposConta.find(([id]) => id === tipo)?.[2] ?? 'Wallet';
  return (
    <span
      className={
        'grid size-12 shrink-0 place-items-center rounded-xl ' +
        (tipo === 'poupanca'
          ? 'bg-[#e7f5ed]'
          : tipo === 'corrente'
            ? 'bg-(--azul-fundo)'
            : 'bg-(--laranja-fundo)')
      }
    >
      <IconeFinancas nome={icone} classe='size-6' />
    </span>
  );
}

function SeletorContas({
  contas,
  selecionada,
  saldoConta,
  userId,
  aoSelecionar,
  aoFechar,
  permiteSemConta,
}) {
  const [criando, setCriando] = useState(false);
  function selecionar(id) {
    aoSelecionar(id);
    aoFechar();
  }
  return createPortal(
    <DialogoFinancas
      titulo={criando ? 'Nova conta' : 'Escolher conta'}
      Icone={Wallet}
      aoFechar={aoFechar}
    >
      {criando ? (
        <EditorMvp
          titulo='Nova conta'
          cabecalho={false}
          campos={camposConta}
          inicial={{ user_id: userId, saldo_inicial: 0 }}
          rotuloSalvar='Cadastrar e selecionar'
          onClose={() => setCriando(false)}
          onSave={dados =>
            selecionar(atualizarFinancas('conta_financeira', dados).id)
          }
        />
      ) : (
        <>
          {contas.length > 0 && (
            <ul className='grid gap-2'>
              {contas.map(conta => (
                <li key={conta.id}>
                  <button
                    type='button'
                    aria-pressed={conta.id === selecionada}
                    onClick={() => selecionar(conta.id)}
                    className='flex min-h-16 w-full cursor-pointer items-center gap-3 rounded-xl border border-(--borda-suave) px-3 py-2 text-left hover:bg-(--azul-fundo) aria-pressed:border-(--laranja-destaque) aria-pressed:bg-[#fff7f2]'
                  >
                    <ImagemConta tipo={conta.tipo} />
                    <span className='min-w-0 flex-1'>
                      <strong className='block wrap-anywhere'>
                        {conta.nome}
                      </strong>
                      <span className='text-xs text-(--texto-apoio)'>
                        {tipoNomeConta(conta.tipo)}
                      </span>
                    </span>
                    <strong className='text-right text-sm tabular-nums'>
                      {moeda(saldoConta(conta))}
                    </strong>
                    {conta.id === selecionada && (
                      <Check
                        size={17}
                        className='shrink-0 text-[#9d2c08]'
                        aria-hidden='true'
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {permiteSemConta && (
            <button
              type='button'
              onClick={() => selecionar(null)}
              className='mt-2 flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left text-sm font-bold text-(--texto-apoio) hover:bg-(--azul-fundo)'
            >
              <Banknote size={17} aria-hidden='true' /> Sem conta vinculada
            </button>
          )}
          <div className='finance-dialog-actions'>
            <AcaoFinancas onClick={() => setCriando(true)}>
              <Plus size={17} aria-hidden='true' /> Nova conta
            </AcaoFinancas>
          </div>
        </>
      )}
    </DialogoFinancas>,
    document.body
  );
}

export function ContasFinanceiras({
  contas,
  ativa,
  saldoConta,
  userId,
  aoAtivar,
  aoAbrir,
}) {
  const [escolhendo, setEscolhendo] = useState(false);
  if (!ativa) return null;
  const outras = contas.filter(conta => conta.id !== ativa.id);
  return (
    <div className='grid gap-4'>
      <section
        aria-label='Conta ativa'
        className='rounded-2xl border border-[#f0d3c0] bg-[#fff7f2] p-4 sm:p-5'
      >
        <div className='flex flex-wrap items-center gap-3'>
          <ImagemConta tipo={ativa.tipo} />
          <div className='min-w-0 flex-1'>
            <span className='text-xs font-bold text-[#9d2c08]'>
              Conta ativa
            </span>
            <h3 className='font-titulo text-xl font-extrabold'>{ativa.nome}</h3>
            <p className='text-sm text-(--texto-apoio)'>
              {tipoNomeConta(ativa.tipo)}
            </p>
          </div>
          <div>
            <p className='text-xs text-(--texto-apoio)'>Saldo atual</p>
            <strong className='font-titulo text-2xl font-extrabold tabular-nums'>
              {moeda(saldoConta(ativa))}
            </strong>
          </div>
        </div>
        <div className='mt-3 flex flex-wrap gap-x-5 border-t border-[#f0d3c0] pt-1'>
          <button
            type='button'
            onClick={() => aoAbrir(ativa)}
            className='min-h-11 cursor-pointer text-sm font-bold text-(--azul-titulo) hover:underline'
          >
            Ver extrato
          </button>
          <button
            type='button'
            onClick={() => setEscolhendo(true)}
            className='min-h-11 cursor-pointer text-sm font-bold text-[#9d2c08] hover:underline'
          >
            Mudar conta
          </button>
        </div>
      </section>
      {outras.length > 0 && (
        <section aria-labelledby='outras-contas'>
          <h3
            id='outras-contas'
            className='mb-2 font-titulo text-base font-extrabold'
          >
            Outras contas
          </h3>
          <ul className='grid gap-2 md:grid-cols-2'>
            {outras.map(conta => (
              <li key={conta.id}>
                <button
                  type='button'
                  onClick={() => aoAbrir(conta)}
                  className='flex h-full w-full cursor-pointer items-center gap-3 rounded-xl border border-(--borda-suave) p-3 text-left hover:bg-(--azul-fundo)'
                >
                  <ImagemConta tipo={conta.tipo} />
                  <span className='min-w-0 flex-1'>
                    <strong className='block'>{conta.nome}</strong>
                    <span className='text-sm text-(--texto-apoio)'>
                      {moeda(saldoConta(conta))}
                    </span>
                  </span>
                  <ChevronRight
                    size={17}
                    className='shrink-0'
                    aria-hidden='true'
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {escolhendo && (
        <SeletorContas
          contas={contas}
          selecionada={ativa.id}
          saldoConta={saldoConta}
          userId={userId}
          aoSelecionar={aoAtivar}
          aoFechar={() => setEscolhendo(false)}
        />
      )}
    </div>
  );
}

export function ContaDoLancamento({
  inicial,
  contas,
  saldoConta,
  userId,
  aoAtivar,
}) {
  const [contaId, setContaId] = useState(inicial ?? null);
  const [escolhendo, setEscolhendo] = useState(false);
  const conta = contas.find(item => item.id === contaId);
  return (
    <div className='flex flex-wrap items-center gap-2 rounded-xl border border-(--borda-suave) bg-(--azul-fundo) px-3 py-1'>
      <input type='hidden' name='conta_id' value={conta?.id ?? ''} />
      {conta && <ImagemConta tipo={conta.tipo} />}
      <strong className='min-w-0 flex-1 wrap-anywhere'>
        {conta?.nome ?? 'Sem conta vinculada'}
      </strong>
      <button
        type='button'
        className='min-h-11 cursor-pointer px-2 text-sm font-bold text-[#9d2c08] hover:underline'
        onClick={() => setEscolhendo(true)}
      >
        Mudar
      </button>
      {escolhendo && (
        <SeletorContas
          contas={contas}
          selecionada={conta?.id}
          saldoConta={saldoConta}
          userId={userId}
          permiteSemConta
          aoFechar={() => setEscolhendo(false)}
          aoSelecionar={id => {
            setContaId(id);
            if (id !== null) aoAtivar?.(id);
          }}
        />
      )}
    </div>
  );
}
