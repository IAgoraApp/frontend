import { useEffect } from 'react';
import { BotaoFecharRotina } from './routineUi';
import classesRotina from '../routineClasses';

export default function AvisoFlutuanteRotina({ aviso, aoDispensar }) {
  useEffect(() => {
    const temporizador = window.setTimeout(
      aoDispensar,
      aviso.acao ? 9000 : 5000
    );
    return () => window.clearTimeout(temporizador);
  }, [aviso, aoDispensar]);

  return (
    <div className={classesRotina.notificacaoToast} role='status' aria-live='polite'>
      <span>{aviso.mensagem}</span>
      {aviso.acao && (
        <button type='button' onClick={aviso.acao}>
          {aviso.rotuloAcao ?? 'Desfazer'}
        </button>
      )}
      <BotaoFecharRotina aoClicar={aoDispensar} rotulo='Dispensar aviso' />
    </div>
  );
}
