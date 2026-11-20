import { useEffect, useEffectEvent, useState } from 'react';
import { contaApi } from '../../app/dados/contaApi';

function ImagemProtegida({ src, onError, ...props }) {
  const avisarErro = useEffectEvent(() => onError?.());
  const [url, setUrl] = useState(null);
  useEffect(() => {
    const cancelamento = new AbortController();
    let objeto;
    contaApi(src, { signal: cancelamento.signal, responseType: 'blob' })
      .then(blob => {
        if (cancelamento.signal.aborted) return;
        objeto = URL.createObjectURL(blob);
        setUrl(objeto);
      })
      .catch(() => {
        if (!cancelamento.signal.aborted) avisarErro();
      });
    return () => {
      cancelamento.abort();
      if (objeto) URL.revokeObjectURL(objeto);
    };
  }, [src]);
  return url ? <img {...props} src={url} onError={onError} /> : null;
}

export default function ImagemMarketplace({ src, ...props }) {
  return /^\/(?:imagens-marketplace\/|receitas\/\d+\/imagem$)/.test(src ?? '')
    ? <ImagemProtegida key={src} src={src} {...props} />
    : <img {...props} src={src} />;
}
