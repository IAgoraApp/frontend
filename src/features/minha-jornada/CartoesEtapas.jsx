import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import '../../shared/ui/seloConcluido.css';

export default function CartoesEtapas({
  etapas,
  pendente,
  editavel,
  abrir,
  adicionar,
  renomear,
  remover,
  mover,
}) {
  const [menu, setMenu] = useState(null);
  const [destino, setDestino] = useState(null);
  const origem = useRef(null);
  const menuRef = useRef(null);
  const grade = useRef(null);
  const posicoes = useRef(null);

  useLayoutEffect(() => {
    const anteriores = posicoes.current;
    posicoes.current = null;
    if (!anteriores) return;
    for (const cartao of grade.current.children) {
      const anterior = anteriores.get(cartao.dataset.etapa);
      if (!anterior) continue;
      const atual = cartao.getBoundingClientRect();
      const x = anterior.left - atual.left;
      const y = anterior.top - atual.top;
      if (x || y)
        cartao.animate(
          [
            { transform: `translate(${x}px, ${y}px)` },
            { transform: 'translate(0, 0)' },
          ],
          { duration: 230, easing: 'cubic-bezier(.2,.75,.3,1)' }
        );
    }
  }, [etapas]);

  function posicao(evento) {
    const { left, width } = evento.currentTarget.getBoundingClientRect();
    return evento.clientX < left + width / 2 ? 'antes' : 'depois';
  }

  function moverCartao(anterior, alvo, lado) {
    const origem = etapas.indexOf(anterior);
    const destino = etapas.indexOf(alvo) + (lado === 'depois' ? 1 : 0);
    if (destino === origem || destino === origem + 1) return;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      posicoes.current = new Map(
        Array.from(grade.current.children, item => [
          item.dataset.etapa,
          item.getBoundingClientRect(),
        ])
      );
    }
    mover(anterior, alvo, lado);
  }

  useEffect(() => {
    if (!menu) return;
    menuRef.current?.querySelector('button')?.focus();
    function fecharFora(evento) {
      if (!menuRef.current?.parentElement.contains(evento.target))
        setMenu(null);
    }
    function fecharTeclado(evento) {
      if (evento.key === 'Escape') {
        menuRef.current?.parentElement
          .querySelector('[aria-expanded]')
          ?.focus();
        setMenu(null);
      }
    }
    document.addEventListener('pointerdown', fecharFora);
    document.addEventListener('keydown', fecharTeclado);
    return () => {
      document.removeEventListener('pointerdown', fecharFora);
      document.removeEventListener('keydown', fecharTeclado);
    };
  }, [menu]);

  function fimArrasto() {
    origem.current = null;
    setDestino(null);
  }

  function iniciarArrasto(evento, etapa) {
    origem.current = etapa.id;
    evento.dataTransfer.setData('text/plain', etapa.id);
    evento.dataTransfer.effectAllowed = 'move';
    evento.dataTransfer.setDragImage(
      evento.currentTarget.closest('.jornada-etapa-celula'),
      20,
      20
    );
    setMenu(null);
  }

  return (
    <nav
      ref={grade}
      className='jornada-guia-etapas'
      aria-label='Etapas da mudança'
    >
      {etapas.map((etapa, indice) => (
        <div
          key={etapa.id}
          className='jornada-etapa-celula'
          data-etapa={etapa.id}
          data-insercao={destino?.id === etapa.id ? destino.lado : undefined}
          onDragOver={evento => {
            if (!origem.current || origem.current === etapa.id) return;
            evento.preventDefault();
            evento.dataTransfer.dropEffect = 'move';
            const lado = posicao(evento);
            setDestino(atual =>
              atual?.id === etapa.id && atual.lado === lado
                ? atual
                : { id: etapa.id, lado }
            );
          }}
          onDragLeave={evento => {
            if (
              !(evento.relatedTarget instanceof Node) ||
              !evento.currentTarget.contains(evento.relatedTarget)
            )
              setDestino(atual => (atual?.id === etapa.id ? null : atual));
          }}
          onDrop={evento => {
            if (!origem.current) return;
            evento.preventDefault();
            const anterior = etapas.find(item => item.id === origem.current);
            if (anterior && anterior.id !== etapa.id)
              moverCartao(anterior, etapa, posicao(evento));
            fimArrasto();
          }}
          onContextMenu={evento => {
            if (!editavel) return;
            evento.preventDefault();
            setMenu(etapa.id);
          }}
        >
          <button
            className='jornada-guia-cartao'
            type='button'
            draggable={editavel}
            onDragStart={evento => iniciarArrasto(evento, etapa)}
            onDragEnd={fimArrasto}
            data-proxima={pendente?.id === etapa.id}
            onClick={() => {
              setMenu(null);
              abrir(etapa.id);
            }}
          >
            <span className='jornada-guia-cartao-foto'>
              <img src={etapa.foto} alt='' draggable={false} />
              {etapa.tarefas.length > 0 &&
                etapa.feitas === etapa.tarefas.length && (
                  <span className='selo-concluido'>Concluído</span>
                )}
            </span>
            <span className='jornada-guia-cartao-texto'>
              <span className='jornada-guia-cartao-ordem'>
                Etapa {indice + 1}
              </span>
              <strong>{etapa.titulo}</strong>
              <span className='jornada-guia-cartao-descricao'>
                {etapa.descricao}
              </span>
              <progress
                className='jornada-guia-cartao-progresso'
                value={etapa.feitas}
                max={etapa.tarefas.length || 1}
                aria-hidden='true'
              />
              <span className='sr-only'>
                {etapa.feitas} de {etapa.tarefas.length} itens concluídos
              </span>
            </span>
          </button>
          {editavel && (
            <>
              <div className='jornada-etapa-controles'>
                <button
                  type='button'
                  aria-label={'Opções de ' + etapa.titulo}
                  aria-expanded={menu === etapa.id}
                  onClick={() =>
                    setMenu(atual => (atual === etapa.id ? null : etapa.id))
                  }
                >
                  <MoreHorizontal size={19} aria-hidden='true' />
                </button>
              </div>
              {menu === etapa.id && (
                <div
                  className='jornada-etapa-menu'
                  ref={menuRef}
                  aria-label={'Opções de ' + etapa.titulo}
                >
                  <button
                    type='button'
                    onClick={() => {
                      setMenu(null);
                      renomear(etapa);
                    }}
                  >
                    <Pencil size={16} /> Renomear
                  </button>
                  <button
                    type='button'
                    disabled={indice === 0}
                    onClick={() => {
                      setMenu(null);
                      moverCartao(etapa, etapas[indice - 1], 'antes');
                    }}
                  >
                    <ArrowUp size={16} /> Mover para antes
                  </button>
                  <button
                    type='button'
                    disabled={indice === etapas.length - 1}
                    onClick={() => {
                      setMenu(null);
                      moverCartao(etapa, etapas[indice + 1], 'depois');
                    }}
                  >
                    <ArrowDown size={16} /> Mover para depois
                  </button>
                  <button
                    type='button'
                    className='jornada-etapa-perigo'
                    onClick={() => {
                      setMenu(null);
                      remover(etapa);
                    }}
                  >
                    <Trash2 size={16} /> Excluir etapa
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
      {editavel && (
        <button
          className='jornada-etapa-adicionar'
          type='button'
          aria-haspopup='dialog'
          onClick={adicionar}
        >
          <Plus size={44} strokeWidth={1.6} aria-hidden='true' />
          Adicionar etapa
        </button>
      )}
    </nav>
  );
}
