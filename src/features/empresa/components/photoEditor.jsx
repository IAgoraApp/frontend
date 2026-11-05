import { useRef, useState } from 'react';
import { imageData } from '../content';
import { Action } from './empresaUi';

export default function PhotoEditor({
  photos,
  onChange,
  label = 'Fotos do serviço',
  limit = 5,
}) {
  const ref = useRef(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function upload(event) {
    const files = [...event.target.files];
    setError('');
    if (photos.length + files.length > limit) {
      setError('Use até ' + limit + ' imagem(ns).');
      event.target.value = '';
      return;
    }
    setBusy(true);
    try {
      const images = await Promise.all(files.map(imageData));
      onChange([...photos, ...images]);
    } catch (error) {
      setError(error.message || 'Não foi possível ler a imagem.');
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  }
  return (
    <div className='space-y-4'>
      <label className='block text-sm font-bold' htmlFor={'upload-' + label}>
        {label}
      </label>
      <input
        ref={ref}
        id={'upload-' + label}
        type='file'
        accept='image/jpeg,image/png,image/webp'
        multiple={limit > 1}
        onChange={upload}
        disabled={busy}
        className='min-h-12 w-full min-w-0 max-w-full rounded-lg border border-[#dbe5ed] p-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-(--azul-fundo) file:px-3 file:py-2'
      />
      <p className='text-xs text-(--texto-apoio)'>
        JPG, PNG ou WebP, até 5 MB por imagem. Use fotos autorizadas da equipe e
        dos trabalhos realizados. As fotos ficam somente neste navegador.
      </p>
      {busy && <p role='status'>Preparando imagem…</p>}
      {error && (
        <p role='alert' className='text-sm text-red-700'>
          {error}
        </p>
      )}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {photos.map((photo, index) => (
          <div
            key={photo + index}
            className='overflow-hidden rounded-lg border border-[#dbe5ed]'
          >
            <img
              src={photo}
              alt={
                index === 0
                  ? 'Foto principal'
                  : 'Foto do portfólio ' + (index + 1)
              }
              className='aspect-[1.5] w-full object-cover'
            />
            <div className='flex flex-wrap gap-2 p-3'>
              {index > 0 && (
                <Action
                  secondary
                  onClick={() =>
                    onChange([photo, ...photos.filter((_, i) => i !== index)])
                  }
                  type='button'
                >
                  Tornar principal
                </Action>
              )}
              <button
                type='button'
                aria-label={'Remover foto ' + (index + 1)}
                onClick={() => onChange(photos.filter((_, i) => i !== index))}
                className='min-h-11 px-2 text-sm font-bold text-red-700'
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
