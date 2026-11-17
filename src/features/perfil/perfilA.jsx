import { useState } from 'react';
import { Link } from 'react-router-dom';
import { salvarRegistro, useBancoMvp } from '../../app/dados/bancoMvp';
import { EditorMvp, PaginaMvp } from '../../shared/ui/mvp';

export default function PerfilA() {
  const { b, perfil, casa, endereco } = useBancoMvp();
  const [editar, setEditar] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const usuario = b.users.find(u => u.id === perfil.user_id);
  return (
    <PaginaMvp
      titulo='Meu perfil'
      descricao='Suas informações e seu lugar no IAgora.'
      acao={
        <button className='mvp-primario' onClick={() => setEditar(true)}>
          Editar perfil
        </button>
      }
    >
      {salvo && (
        <p role='status' className='mvp-sucesso'>
          Perfil atualizado nesta sessão.
        </p>
      )}
      {editar && (
        <EditorMvp
          titulo='Editar perfil'
          inicial={perfil}
          campos={[{ nome: 'nome', rotulo: 'Nome completo' }]}
          onClose={() => setEditar(false)}
          onSave={v => {
            salvarRegistro('perfil', v);
            setSalvo(true);
          }}
        />
      )}
      <div className='mvp-grade'>
        <section className='mvp-painel'>
          <div className='mvp-conteudo'>
            <div className='mvp-avatar' aria-hidden='true'>
              {perfil.nome
                .split(' ')
                .map(p => p[0])
                .slice(0, 2)
                .join('')}
            </div>
            <h2>{perfil.nome}</h2>
            <p>{usuario.email}</p>
            <p>Já tenho minha casa</p>
          </div>
        </section>
        <section className='mvp-painel'>
          <div className='mvp-painel-topo'>
            <h2>Minha residência</h2>
            <Link className='mvp-link' to='/casa?visao=residencia'>
              Editar residência
            </Link>
          </div>
          <div className='mvp-conteudo'>
            <h3>{casa.nome}</h3>
            {endereco && (
              <p>
                {endereco.rua}, {endereco.numero}
                <br />
                {endereco.bairro}, {endereco.cidade} — {endereco.estado}
              </p>
            )}
            <Link className='mvp-link' to='/meus-contatos'>
              Acompanhar serviços e conversas
            </Link>
          </div>
        </section>
      </div>
    </PaginaMvp>
  );
}
