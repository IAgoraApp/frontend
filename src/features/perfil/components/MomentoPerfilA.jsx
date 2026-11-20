import { useDadosServidor } from '../../../app/dados/contextoServidor';
import { salvarPerfilPessoal } from '../perfilApi';
import { useAvisoPerfilA } from '../../../app/avisos/avisosPerfilA';
import { useState } from 'react';
import { ArrowRight, Check, House, KeyRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { definirUsuarioMvpAtivo, rotaPerfilMoradia } from '../../../app/dados/perfilNavegacao';
import { Botao, Titulo } from '../../../shared/ui';
import fotoPlanejamento from '../../onboarding/assets/onboarding-quero-morar-sozinho.jpg';
import fotoCasa from '../../onboarding/assets/onboarding-ja-moro-sozinho.jpg';
import { salvarMomentoPerfil } from '../perfilDados';

const momentos = [
  {
    id: 1,
    titulo: 'Já tenho minha casa',
    descricao: 'Organize a casa, a rotina e as contas do dia a dia.',
    foto: fotoCasa,
    Icone: House,
    rota: '/casa',
    destino: 'Abrir Minha casa',
  },
  {
    id: 2,
    titulo: 'Planejo morar sozinho',
    descricao: 'Estime os custos, planeje a mudança e encontre seu espaço.',
    foto: fotoPlanejamento,
    Icone: KeyRound,
    rota: '/minhajornada',
    destino: 'Abrir Minha Jornada',
  },
];

export default function MomentoPerfilA({ perfil }) {
  const navegar = useNavigate();
  const servidor = useDadosServidor();
  const [salvando, setSalvando] = useState(false);
  const [escolha, setEscolha] = useState(perfil.tipo);
  const [erro, setErro] = useState('');
  const notificar = useAvisoPerfilA();
  const atual = momentos.find(item => item.id === perfil.tipo);
  const selecionado = momentos.find(item => item.id === escolha);
  const alterado = !!selecionado && escolha !== perfil.tipo;

  async function salvar(evento) {
    evento.preventDefault();
    if (!alterado || salvando) return;
    setSalvando(true);

    try {
      if (servidor) {
        await salvarPerfilPessoal(perfil.id, { tipo: escolha });
        await servidor.atualizar();
      } else {
        salvarMomentoPerfil(perfil.user_id, escolha);
        definirUsuarioMvpAtivo(perfil.user_id);
      }
      setErro('');
      notificar('Alteração salva.');
      navegar(rotaPerfilMoradia(escolha), { replace: true });
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section aria-labelledby='perfil-momento' className='perfil-momento'>
      <div className='perfil-momento-foto' aria-hidden='true'>
        <img src={(selecionado || atual || momentos[0]).foto} alt='' />
      </div>

      <form className='perfil-momento-form' onSubmit={salvar}>
        <header>
          <Titulo id='perfil-momento' classe='perfil-momento-titulo'>
            Seu momento de moradia
          </Titulo>
          <p>
            Escolha a opção que combina com o que você quer organizar no IAgora.
          </p>
        </header>
        <fieldset className='perfil-momento-opcoes'>
          <legend className='sr-only'>Momento de moradia</legend>
          {momentos.map(({ id, titulo, descricao, Icone }) => (
            <label key={id} className='perfil-momento-opcao'>
              <input
                type='radio'
                className='sr-only'
                name='momento'
                value={id}
                checked={escolha === id}
                onChange={() => {
                  setEscolha(id);
                  setErro('');
                }}
              />
              <span className='perfil-momento-opcao-corpo'>
                <span className='perfil-momento-icone'>
                  <Icone size={20} aria-hidden='true' />
                </span>
                <span className='perfil-momento-opcao-texto'>
                  <strong>{titulo}</strong>
                  <span>{descricao}</span>
                  <small
                    aria-hidden={perfil.tipo !== id}
                    className={perfil.tipo === id ? undefined : 'invisible'}
                  >
                    Seu momento atual
                  </small>
                </span>
                <span className='perfil-momento-indicador' aria-hidden='true'>
                  {escolha === id && <Check size={13} />}
                </span>
              </span>
            </label>
          ))}
        </fieldset>
        {erro && (
          <p role='alert' className='perfil-momento-erro'>
            {erro}
          </p>
        )}
        <div className='perfil-momento-acoes'>
          {alterado ? (
            <>
              <Botao
                type='button'
                variante='contorno'
                classe='text-sm px-3! whitespace-nowrap'
                onClick={() => {
                  setEscolha(perfil.tipo);
                  setErro('');
                }}
              >
                Cancelar
              </Botao>
              <Botao type='submit' disabled={salvando} classe='text-sm px-3! whitespace-nowrap'>
                Salvar meu momento
              </Botao>
            </>
          ) : (
            atual && (
              <Link to={atual.rota} className='perfil-momento-destino'>
                {atual.destino} <ArrowRight size={16} aria-hidden='true' />
              </Link>
            )
          )}
        </div>
      </form>
    </section>
  );
}
