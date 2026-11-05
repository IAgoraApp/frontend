import { useState } from 'react';
import { agendaPreferences } from '../content';
import { ModalHeading, Notice, RoutineButton } from './routineUi';
import classes from '../routineClasses';

export default function AgendaPanel({
  agenda,
  onConnect,
  onSave,
  onDisconnect,
  onCancel,
  titleId,
}) {
  const [preferences, setPreferences] = useState(agenda.preferences);
  return (
    <div className={classes.modalContent}>
      <ModalHeading
        artwork
        id={titleId}
        title={
          agenda.connected
            ? 'Agenda conectada no exemplo.'
            : 'Sua rotina junto da sua agenda.'
        }
        description={
          agenda.connected
            ? 'Escolha o que deseja sincronizar.'
            : 'A integração é opcional e simulada nesta demonstração.'
        }
      />
      {agenda.connected ? (
        <>
          <div className={classes.agendaPreferences}>
            {agendaPreferences.map(item => (
              <label key={item.id}>
                <input
                  type='checkbox'
                  checked={Boolean(preferences[item.id])}
                  onChange={event =>
                    setPreferences(previous => ({
                      ...previous,
                      [item.id]: event.target.checked,
                    }))
                  }
                />
                <span>
                  <strong>{item.label}</strong>
                  <span>Preferência demonstrativa</span>
                </span>
              </label>
            ))}
          </div>
          <div className={classes.actions} data-actions>
            <RoutineButton onClick={() => onSave(preferences)}>
              Salvar preferências
            </RoutineButton>
            <RoutineButton tone='secondary' onClick={onDisconnect}>
              Desconectar
            </RoutineButton>
          </div>
        </>
      ) : (
        <>
          <Notice title='Antes de conectar'>
            Você poderá escolher sincronizar suas tarefas e remover a conexão
            quando quiser. Nenhuma conta será acessada aqui.
          </Notice>
          <div className={classes.actions} data-actions>
            <RoutineButton onClick={onConnect}>
              Simular conexão Google Agenda
            </RoutineButton>
            <RoutineButton tone='secondary' onClick={onCancel}>
              Continuar sem conectar
            </RoutineButton>
          </div>
        </>
      )}
    </div>
  );
}
