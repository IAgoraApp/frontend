import { Botao } from './Botoes';

export function ModalConfirmacao({
  aberto,
  titulo,
  descricao,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  aoConfirmar,
  aoCancelar,
  destrutivo = false,
}) {
  if (!aberto) return null;

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='titulo-modal-confirmacao'
      className='fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/60 p-4 backdrop-blur-xs'
    >
      <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8'>
        <h2
          id='titulo-modal-confirmacao'
          className='font-titulo text-2xl font-extrabold text-(--azul-titulo)'
        >
          {titulo}
        </h2>
        <p className='mt-3 text-base leading-relaxed text-(--texto-apoio)'>
          {descricao}
        </p>
        <div className='mt-6 flex flex-wrap justify-end gap-3'>
          <Botao
            type='button'
            variante='secundario'
            onClick={aoCancelar}
            classe='min-h-[44px]!'
          >
            {textoCancelar}
          </Botao>
          <Botao
            type='button'
            onClick={aoConfirmar}
            classe={`min-h-[44px]! ${
              destrutivo
                ? 'bg-[#b42318]! hover:bg-[#911d14]!'
                : 'bg-(--laranja-principal)!'
            }`}
          >
            {textoConfirmar}
          </Botao>
        </div>
      </div>
    </div>
  );
}
