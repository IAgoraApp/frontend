import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  lerEstadoPlataforma,
  salvarEstadoPlataforma,
} from '../../app/estado/estadoPlataforma';
import { acessoLocal } from '../../app/dados/acessoLocal';
import { contaApi, lerSessao, salvarSessao } from '../../app/dados/contaApi';
import {
  definirUsuarioMvpAtivo,
  lerUsuarioMvpAtivo,
} from '../../app/dados/perfilNavegacao';
import { salvarMomentoPerfil } from '../perfil/perfilDados';
import { EtapaCadastro } from '../auth/components/EtapaCadastro';
import { opcoesMomento } from './content';

export function Integracao({ cadastro = false }) {
  const navegar = useNavigate();
  const { state } = useLocation();
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const conta = acessoLocal ? null : lerSessao();
  const sessao = conta?.tipo === 1 ? conta : null;
  if (!acessoLocal && sessao?.tipo !== 1)
    return <Navigate to='/login' replace />;

  if (cadastro && sessao && !sessao.cadastroPendente)
    return <Navigate to='/perfil' replace />;

  async function escolherMomento(opcao) {
    if (salvando) return;
    setSalvando(true);
    setErro('');
    try {
      const tipo = opcao.id === 'living-alone' ? 1 : 2;
      if (acessoLocal && !cadastro) {
        const usuario = lerUsuarioMvpAtivo() ?? state?.usuarioMvp;
        if (usuario) {
          salvarMomentoPerfil(usuario, tipo);
          definirUsuarioMvpAtivo(usuario);
        }
      }
      if (sessao) {
        const perfil = await contaApi(`/perfis/user/${sessao.id}`, {
          token: sessao.token,
        });
        await contaApi(`/perfis/${perfil.id}`, {
          metodo: 'PATCH',
          token: sessao.token,
          dados: { tipo },
        });
      }
      if (acessoLocal) try {
        localStorage.setItem('iagora:situacao-moradia', opcao.id);
      } catch {
        // A escolha também é guardada no perfil da plataforma.
      }
      const estado = acessoLocal && lerEstadoPlataforma();
      if (estado) salvarEstadoPlataforma({
        ...estado,
        perfil: {
          ...estado.perfil,
          momento: opcao.momento,
          momentoRotulo: opcao.momentoRotulo,
        },
      });
      if (sessao)
        salvarSessao({
          ...sessao,
          momentoMoradia: tipo,
          cadastroPendente: false,
        });
      navegar(opcao.rotaDestino, { replace: cadastro });
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <EtapaCadastro
      sessao={sessao}
      ocupado={salvando}
      permiteCancelar={cadastro}
    >
      <div className='onboarding-onda' aria-hidden='true' />
      <section
        className='etapa-cadastro-conteudo'
        aria-labelledby='titulo-moradia'
      >
        <h1 id='titulo-moradia'>Em que momento você está?</h1>
        <p>Escolha o que melhor descreve sua relação com a casa hoje.</p>
        {erro && <p role='alert'>{erro}</p>}
        <section
          className='etapa-cadastro-momentos'
          aria-label='Escolha o seu momento de vida'
        >
          {opcoesMomento.map(opcao => (
            <button
              key={opcao.id}
              type='button'
              disabled={salvando}
              onClick={() => escolherMomento(opcao)}
            >
              <img src={opcao.imagem} alt='' />
              <div>
                <h2>{opcao.titulo}</h2>
                <p>{opcao.descricao}</p>
              </div>
            </button>
          ))}
        </section>
      </section>
    </EtapaCadastro>
  );
}
