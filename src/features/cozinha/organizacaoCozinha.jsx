import { useState } from 'react';
import { DialogoCasa } from '../casa/components/casaUi';
import { EditorMvp } from '../../shared/ui/mvp';

export function EditorCozinha({
  titulo,
  inicial,
  campos,
  aoSalvar,
  aoExcluir,
  aoFechar,
}) {
  const [confirmar, setConfirmar] = useState(false);
  const [erro, setErro] = useState('');

  return (
    <DialogoCasa titulo={titulo} aoFechar={aoFechar}>
      <div className='cozinha-editor'>
        {confirmar ? (
          <div>
            <p>
              Confirma a exclusão de{' '}
              {inicial.nome || inicial.nome_item || 'este item'}?
            </p>
            {erro && (
              <p role='alert' className='cozinha-erro'>
                {erro}
              </p>
            )}
            <div className='cozinha-editor-acoes'>
              <button
                type='button'
                className='cozinha-botao'
                onClick={() => setConfirmar(false)}
              >
                Voltar
              </button>
              <button
                type='button'
                className='cozinha-botao cozinha-perigo'
                onClick={() => {
                  try {
                    aoExcluir();
                    aoFechar();
                  } catch (falha) {
                    setErro(falha.message);
                  }
                }}
              >
                Confirmar exclusão
              </button>
            </div>
          </div>
        ) : (
          <EditorMvp
            cabecalho={false}
            titulo={titulo}
            inicial={inicial}
            campos={campos}
            onSave={aoSalvar}
            onClose={aoFechar}
            acaoSecundaria={
              aoExcluir && (
                <button
                  type='button'
                  className='cozinha-excluir'
                  onClick={() => setConfirmar(true)}
                >
                  Excluir
                </button>
              )
            }
          />
        )}
      </div>
    </DialogoCasa>
  );
}
