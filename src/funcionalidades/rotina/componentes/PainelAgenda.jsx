import { useState } from 'react';
import { preferenciasAgenda } from '../conteudo';
import { AvisoRotina, BotaoRotina, CabecalhoModalRotina } from './InterfaceRotina';
import classesRotina from '../classesRotina';

export default function PainelAgenda({
  agenda,
  aoConectar,
  aoSalvar,
  aoDesconectar,
  aoCancelar,
  idTitulo,
}) {
  const [preferencias, setPreferencias] = useState(agenda.preferences);
  return (
    <div className={classesRotina.conteudoModal}>
      <CabecalhoModalRotina
        arte
        id={idTitulo}
        titulo={
          agenda.connected
            ? 'Agenda conectada no exemplo.'
            : 'Sua rotina junto da sua agenda.'
        }
        descricao={
          agenda.connected
            ? 'Escolha o que deseja sincronizar.'
            : 'A integração é opcional e simulada nesta demonstração.'
        }
      />
      {agenda.connected ? (
        <>
          <div className={classesRotina.preferenciasAgenda}>
            {preferenciasAgenda.map(item => (
              <label key={item.id}>
                <input
                  type='checkbox'
                  checked={Boolean(preferencias[item.id])}
                  onChange={evento =>
                    setPreferencias(anterior => ({
                      ...anterior,
                      [item.id]: evento.target.checked,
                    }))
                  }
                />
                <span>
                  <strong>{item.rotulo}</strong>
                  <span>Preferência demonstrativa</span>
                </span>
              </label>
            ))}
          </div>
          <div className={classesRotina.acoes} data-acoes>
            <BotaoRotina onClick={() => aoSalvar(preferencias)}>
              Salvar preferências
            </BotaoRotina>
            <BotaoRotina tom='secundario' onClick={aoDesconectar}>
              Desconectar
            </BotaoRotina>
          </div>
        </>
      ) : (
        <>
          <AvisoRotina titulo='Antes de conectar'>
            Você poderá escolher sincronizar suas tarefas e remover a conexão
            quando quiser. Nenhuma conta será acessada aqui.
          </AvisoRotina>
          <div className={classesRotina.acoes} data-acoes>
            <BotaoRotina onClick={aoConectar}>
              Simular conexão Google Agenda
            </BotaoRotina>
            <BotaoRotina tom='secundario' onClick={aoCancelar}>
              Continuar sem conectar
            </BotaoRotina>
          </div>
        </>
      )}
    </div>
  );
}
