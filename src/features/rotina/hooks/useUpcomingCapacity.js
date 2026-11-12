import { useLayoutEffect, useRef, useState } from 'react';

export function useCapacidadeProximas(total) {
  const referencia = useRef(null);
  const [capacidade, setCapacidade] = useState(Math.min(total || 1, 3));

  useLayoutEffect(() => {
    const elemento = referencia.current;
    if (!elemento || !total) return;
    const atualizar = () => {
      const linha = elemento.firstElementChild;
      if (!linha) return;
      const intervalo = parseFloat(getComputedStyle(elemento).rowGap) || 0;
      const alturaLinha = linha.getBoundingClientRect().height;
      if (!alturaLinha) return;
      setCapacidade(
        Math.max(
          1,
          Math.min(
            total,
            Math.floor(
              (elemento.clientHeight + intervalo) / (alturaLinha + intervalo)
            )
          )
        )
      );
    };
    const observador = new ResizeObserver(atualizar);
    observador.observe(elemento);
    observador.observe(elemento.firstElementChild);
    atualizar();
    return () => observador.disconnect();
  }, [total]);

  return { referencia, capacidade };
}
