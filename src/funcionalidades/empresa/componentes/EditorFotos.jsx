import { useRef, useState } from 'react';
import { Botao } from '../../../compartilhado/interface/indice';
import { lerImagemComoDados } from '../../../aplicacao/estado/estadoEmpresa';

export default function EditorFotos({
  fotos,
  aoAlterar,
  rotulo = 'Fotos do serviço',
  limite = 5,
}) {
  const referenciaEntrada = useRef(null);
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);

  async function enviarArquivos(evento) {
    const arquivos = [...(evento.target.files || [])];
    setErro('');
    if (!arquivos.length) return;
    if (fotos.length + arquivos.length > limite) {
      setErro(`Use até ${limite} ${limite === 1 ? 'imagem' : 'imagens'}.`);
      evento.target.value = '';
      return;
    }
    setOcupado(true);
    try {
      const imagens = await Promise.all(arquivos.map(lerImagemComoDados));
      aoAlterar([...fotos, ...imagens]);
    } catch (falha) {
      setErro(falha.message || 'Não foi possível ler a imagem selecionada.');
    } finally {
      setOcupado(false);
      evento.target.value = '';
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-2'>
        <label
          htmlFor={`upload-${rotulo}`}
          className='text-sm font-bold text-(--azul-titulo)'
        >
          {rotulo}
        </label>
        <input
          ref={referenciaEntrada}
          id={`upload-${rotulo}`}
          type='file'
          accept='image/jpeg,image/png,image/webp'
          multiple={limite > 1}
          disabled={ocupado}
          onChange={enviarArquivos}
          className='min-h-12 w-full min-w-0 max-w-full cursor-pointer rounded-xl border border-dashed border-[#9fb0bf] bg-[#f4f7fa] p-3 text-sm text-(--azul-titulo) file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#102a43] file:px-4 file:py-2 file:text-xs file:font-bold file:text-white'
        />
        <p className='text-xs text-(--texto-apoio)'>
          Formatos aceitos: JPG, PNG ou WebP, até 5 MB por arquivo. As imagens
          ficam armazenadas localmente neste navegador.
        </p>
      </div>

      {ocupado && (
        <p role='status' className='text-sm font-semibold text-(--azul-titulo)'>
          Preparando imagens…
        </p>
      )}

      {erro && (
        <p role='alert' className='text-sm font-semibold text-[#b42318]'>
          {erro}
        </p>
      )}

      {fotos.length > 0 && (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {fotos.map((foto, indice) => (
            <div
              key={`${foto}-${indice}`}
              className='overflow-hidden rounded-xl border border-[#dbe5ed] bg-white'
            >
              <img
                src={foto}
                alt={
                  indice === 0
                    ? 'Foto principal'
                    : `Foto complementar ${indice + 1}`
                }
                className='aspect-[1.5] w-full object-cover'
              />
              <div className='flex flex-wrap items-center justify-between gap-2 p-3'>
                {indice > 0 ? (
                  <Botao
                    type='button'
                    variante='secundario'
                    classe='min-h-[38px]! px-3! py-1! text-xs!'
                    onClick={() =>
                      aoAlterar([foto, ...fotos.filter((_, i) => i !== indice)])
                    }
                  >
                    Tornar principal
                  </Botao>
                ) : (
                  <span className='rounded-full bg-[#fce8dc] px-2.5 py-1 text-[11px] font-bold text-(--laranja-principal)'>
                    Principal
                  </span>
                )}
                <button
                  type='button'
                  aria-label={`Remover imagem ${indice + 1}`}
                  onClick={() => aoAlterar(fotos.filter((_, i) => i !== indice))}
                  className='min-h-[38px] cursor-pointer px-2 text-xs font-bold text-[#b42318] hover:underline'
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
