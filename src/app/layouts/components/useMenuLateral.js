import { useState, useSyncExternalStore } from 'react';

const consulta = '(min-width: 768px) and (hover: hover) and (pointer: fine)';

function observarModo(avisar) {
  const midia = window.matchMedia(consulta);
  midia.addEventListener('change', avisar);
  return () => midia.removeEventListener('change', avisar);
}

const suportaHover = () => window.matchMedia(consulta).matches;
const semHover = () => false;

export default function useMenuLateral() {
  const automatico = useSyncExternalStore(observarModo, suportaHover, semHover);
  const [sobreMenu, setSobreMenu] = useState(false);
  const [focoTeclado, setFocoTeclado] = useState(false);
  const [recolhidoManual, setRecolhidoManual] = useState(false);
  const recolhido = automatico ? !sobreMenu && !focoTeclado : recolhidoManual;

  const interacoes = automatico
    ? {
        onPointerEnter: evento => {
          if (evento.pointerType === 'mouse') setSobreMenu(true);
        },
        onPointerLeave: () => setSobreMenu(false),
        onPointerDown: () => setFocoTeclado(false),
        onFocus: evento => {
          if (evento.target.matches(':focus-visible')) setFocoTeclado(true);
        },
        onBlur: evento => {
          if (!evento.currentTarget.contains(evento.relatedTarget))
            setFocoTeclado(false);
        },
      }
    : {};

  return { automatico, recolhido, setRecolhidoManual, interacoes };
}
