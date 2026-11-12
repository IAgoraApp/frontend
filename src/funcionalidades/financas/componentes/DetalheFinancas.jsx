import { useState } from 'react';
import { CampoFormulario } from '../../../compartilhado/interface/indice';
import { AcaoFinancas } from './InterfaceFinancas';
import {
  analisarCentavos,
  dataCurta,
  formatarMoeda,
  statusConta,
  vencimentoConta,
} from '../conteudo';

export default function DetalheFinancas({
  dialogo,
  dados,
  mes,
  aoEditar,
  aoExcluir,
  aoPagar,
  aoDepositar,
}) {
  const { item, tipo } = dialogo;
  const [deposito, setDeposito] = useState('');
  const [erro, setErro] = useState('');
  const contaPaga =
    tipo === 'bill' && statusConta(item, mes, dados.payments) === 'paga';

  return (
    <div className='space-y-5'>
      <p className='font-titulo text-3xl font-extrabold'>
        {formatarMoeda(item.amount)}
      </p>
      {tipo === 'transaction' && (
        <dl className='grid grid-cols-2 gap-3 text-sm'>
          <dt className='text-(--texto-apoio)'>Tipo</dt>
          <dd>{item.type === 'income' ? 'Entrada' : 'Saída'}</dd>
          <dt className='text-(--texto-apoio)'>Categoria</dt>
          <dd>
            {dados.categories.find(cat => cat.id === item.categoryId)?.name}
          </dd>
          <dt className='text-(--texto-apoio)'>Data</dt>
          <dd>{dataCurta(item.date)}</dd>
          <dt className='text-(--texto-apoio)'>Pagamento</dt>
          <dd>{item.payment ?? 'Não informado'}</dd>
        </dl>
      )}
      {tipo === 'bill' && (
        <>
          <p className='text-sm text-(--texto-apoio)'>
            Vencimento: {dataCurta(vencimentoConta(item, mes))} ·{' '}
            {contaPaga
              ? 'Paga'
              : statusConta(item, mes, dados.payments) === 'vencida'
                ? 'Vencida'
                : 'A vencer'}
          </p>
          {!contaPaga && (
            <AcaoFinancas onClick={aoPagar}>Marcar como paga</AcaoFinancas>
          )}
        </>
      )}
      {tipo === 'goal' && (
        <>
          <p className='text-(--texto-apoio)'>
            {formatarMoeda(item.saved)} guardados · Faltam{' '}
            {formatarMoeda(Math.max(0, item.amount - item.saved))}
          </p>
          {item.saved < item.amount && (
            <form
              className='space-y-3'
              onSubmit={evento => {
                evento.preventDefault();
                const quantia = analisarCentavos(deposito);
                if (
                  !Number.isSafeInteger(quantia) ||
                  quantia <= 0 ||
                  quantia > item.amount - item.saved
                ) {
                  setErro(
                    'Informe um valor maior que zero e até ' +
                      formatarMoeda(item.amount - item.saved) +
                      '.'
                  );
                  return;
                }
                aoDepositar(quantia);
              }}
            >
              <CampoFormulario
                id='financas-deposito'
                rotulo='Adicionar ao valor guardado (R$)'
                value={deposito}
                onChange={evento => setDeposito(evento.target.value)}
                inputMode='decimal'
                required
                maxLength={18}
                placeholder='0,00'
              />
              {erro && (
                <p role='alert' className='text-sm text-[#b42318]'>
                  {erro}
                </p>
              )}
              <AcaoFinancas type='submit'>Atualizar progresso</AcaoFinancas>
              <p className='text-xs text-(--texto-apoio)'>
                Este acompanhamento não gera um lançamento financeiro.
              </p>
            </form>
          )}
        </>
      )}
      <div className='flex flex-wrap items-center gap-3 border-t border-[#e6edf2] pt-5'>
        <AcaoFinancas secundario onClick={aoEditar}>
          Editar
        </AcaoFinancas>
        <button
          type='button'
          onClick={aoExcluir}
          className='min-h-11 rounded-full px-5 text-sm font-bold text-[#b42318] hover:bg-red-50'
        >
          Excluir
        </button>
      </div>
    </div>
  );
}
