import { useState, useSyncExternalStore } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CircleCheck,
  ChevronLeft,
  ChevronRight,
  ListChecks,
  Play,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { alterarBancoPreparacao, useBancoMvp } from '../../app/dados/bancoMvp';
import { acessoLocal } from '../../app/dados/acessoLocal';
import { Botao, EstadoVazio } from '../../shared/ui';
import LayoutPreparacao from '../preparacao/LayoutPreparacao';
import { proximoId } from '../preparacao/modelo';
import QuizAula from './QuizAula';
import fotoHero from '../landing-page/assets/momento-mudanca.jpg';
import fotoFinancas from '../onboarding/assets/onboarding-quero-morar-sozinho.jpg';
import fotoLimpeza from '../limpeza/assets/comodo-lavanderia.jpg';
import fotoCozinha from '../casa/assets/cozinha-comida-boa.jpg';
import fotoMoradia from '../encontrar-casa/assets/apartamento-vila-mariana.jpg';
import fotoManutencao from '../casa/assets/residencia-ambiente.png';
import '../../shared/ui/seloConcluido.css';
import './aprendendo.css';

const categorias = {
  financas: { nome: 'Finanças', foto: fotoFinancas, ordem: 1 },
  moradia: { nome: 'Moradia', foto: fotoMoradia, ordem: 2 },
  limpeza: { nome: 'Limpeza', foto: fotoLimpeza, ordem: 3 },
  culinaria: { nome: 'Culinária', foto: fotoCozinha, ordem: 4 },
  manutencao: {
    nome: 'Segurança e manutenção',
    foto: fotoManutencao,
    ordem: 5,
  },
};

function imagemAula(aula) {
  const foto = categorias[aula.categoria]?.foto ?? fotoHero;
  return (
    <img
      src={
        aula.imagem && !aula.imagem.startsWith('/mock/') ? aula.imagem : foto
      }
      onError={evento => {
        if (evento.currentTarget.getAttribute('src') !== foto)
          evento.currentTarget.src = foto;
      }}
      alt=''
    />
  );
}

const nomeCategoria = aula =>
  categorias[aula.categoria]?.nome ?? aula.categoria;

const titulosEtapas = {
  financas: [
    'Comece pela renda',
    'Separe os gastos',
    'Reserve para imprevistos',
  ],
  moradia: [
    'Compare o custo mensal',
    'Liste os gastos da entrada',
    'Use a visita para conferir',
  ],
  limpeza: [
    'Prepare os materiais',
    'Escolha por onde começar',
    'Separe os panos',
  ],
  culinaria: [
    'Monte um cardápio simples',
    'Prepare a bancada',
    'Planeje o reaproveitamento',
  ],
  manutencao: [
    'Conheça o imóvel',
    'Registre as pendências',
    'Organize os contatos',
  ],
};

const larguraTrilha = '(max-width: 680px)';
function observarLargura(notificar) {
  const consulta = window.matchMedia(larguraTrilha);
  consulta.addEventListener('change', notificar);
  return () => consulta.removeEventListener('change', notificar);
}
function tamanhoTrilha() {
  return window.matchMedia(larguraTrilha).matches ? 2 : 3;
}

function Estudo({
  aula,
  quizzes,
  banco,
  executar,
  usuario,
  concluida,
  alternarConclusao,
  concluirPeloQuiz,
  quizAtivo,
  alternarModo,
}) {
  const [passo, setPasso] = useState(0);
  const [indiceQuiz, setIndiceQuiz] = useState(0);
  const blocos =
    aula.conteudo
      ?.split(/\n\s*\n/)
      .map(trecho => trecho.trim())
      .filter(Boolean) ?? [];
  const bloco = blocos[passo];
  const pratica = bloco?.startsWith('Para praticar,');
  const tituloPasso = pratica
    ? 'Coloque em prática'
    : (titulosEtapas[aula.categoria]?.[passo] ?? 'Nesta aula');

  return (
    <div className='aprendendo-estudo'>
      <header className='aprendendo-aula-capa'>
        {imagemAula(aula)}
        <div>
          <p>{nomeCategoria(aula)}</p>
          <h1>{aula.titulo}</h1>
        </div>
      </header>
      {quizzes.length > 0 && (
        <div
          className='aprendendo-modos'
          role='group'
          aria-label='Atividade da aula'
        >
          <button
            type='button'
            aria-pressed={!quizAtivo}
            onClick={() => alternarModo(false)}
          >
            <BookOpen size={16} aria-hidden='true' /> Aula
          </button>
          <button
            type='button'
            aria-pressed={quizAtivo}
            onClick={() => alternarModo(true)}
          >
            <ListChecks size={16} aria-hidden='true' /> Quiz
          </button>
        </div>
      )}
      {quizAtivo && quizzes.length > 0 ? (
        <div className='aprendendo-pratica'>
          {quizzes.length > 1 && (
            <label className='aprendendo-escolher-quiz'>
              <span className='sr-only'>Escolher quiz</span>
              <select
                value={indiceQuiz}
                onChange={evento => setIndiceQuiz(Number(evento.target.value))}
              >
                {quizzes.map((quiz, indice) => (
                  <option key={quiz.id} value={indice}>
                    {quiz.titulo}
                  </option>
                ))}
              </select>
            </label>
          )}
          <QuizAula
            key={quizzes[indiceQuiz].id}
            quiz={quizzes[indiceQuiz]}
            banco={banco}
            executar={executar}
            usuario={usuario}
            onConcluir={concluirPeloQuiz}
          />
        </div>
      ) : (
        <article className='aprendendo-aula'>
          <div className='aprendendo-aula-corpo' aria-live='polite'>
            {bloco ? (
              <>
                <p className='aprendendo-passo'>
                  Passo {passo + 1} de {blocos.length}
                </p>
                <h3>{tituloPasso}</h3>
                <p className='aprendendo-texto-aula'>
                  {bloco.replace(/^\d+\.\s*/, '')}
                </p>
              </>
            ) : (
              <p>{aula.descricao}</p>
            )}
            {aula.video_url && (
              <a href={aula.video_url} className='aprendendo-voltar'>
                <Play size={17} aria-hidden='true' /> Assistir à aula
              </a>
            )}
          </div>
          <footer className='aprendendo-aula-acoes'>
            {passo > 0 && (
              <button
                type='button'
                className='aprendendo-seta'
                aria-label='Passo anterior'
                onClick={() => setPasso(passo - 1)}
              >
                <ChevronLeft size={20} aria-hidden='true' />
              </button>
            )}
            {passo + 1 < blocos.length ? (
              <Botao type='button' onClick={() => setPasso(passo + 1)}>
                Próximo passo <ChevronRight size={17} aria-hidden='true' />
              </Botao>
            ) : (
              <>
                <Botao
                  type='button'
                  variante='contorno'
                  onClick={alternarConclusao}
                >
                  <CircleCheck size={17} aria-hidden='true' />{' '}
                  {concluida ? 'Reabrir aula' : 'Concluir aula'}
                </Botao>
                {quizzes.length > 0 ? (
                  <Botao type='button' onClick={() => alternarModo(true)}>
                    Ir para o quiz
                  </Botao>
                ) : null}
              </>
            )}
          </footer>
        </article>
      )}
    </div>
  );
}

export default function Aprendendo() {
  const { b, perfil } = useBancoMvp();
  const usuario = perfil?.user_id;
  const [params, setParams] = useSearchParams();
  const [inicio, setInicio] = useState(0);
  const quantidade = useSyncExternalStore(
    observarLargura,
    tamanhoTrilha,
    () => 3
  );
  const [erro, setErro] = useState(null);
  const [filtro, setFiltro] = useState('todas');
  const aulas = b.aula.toSorted(
    (a, outra) =>
      (categorias[a.categoria]?.ordem ?? Infinity) -
        (categorias[outra.categoria]?.ordem ?? Infinity) || a.id - outra.id
  );
  const aula = aulas.find(item => item.id === Number(params.get('aula')));
  const progresso = new Set(
    b.progresso_aula
      .filter(item => item.user_id === usuario && item.concluida)
      .map(item => item.aula_id)
  );
  const concluidas = aulas.filter(item => progresso.has(item.id)).length;
  const continuar = aulas.find(item => !progresso.has(item.id)) ?? aulas[0];
  const quizzes = b.quiz.filter(item => item.aula_id === aula?.id);
  const proxima = aulas[aulas.indexOf(aula) + 1];
  const visiveis = aulas.filter(
    item =>
      filtro === 'todas' || progresso.has(item.id) === (filtro === 'concluidas')
  );
  const ultimoInicio = Math.max(0, visiveis.length - quantidade);
  const primeiro = Math.min(inicio, ultimoInicio);

  function alternarModo(quizAtivo) {
    const proximos = new URLSearchParams(params);
    if (quizAtivo) proximos.set('modo', 'quiz');
    else proximos.delete('modo');
    setParams(proximos);
  }

  function executar(operacao) {
    try {
      alterarBancoPreparacao(operacao);
      setErro(null);
      return true;
    } catch (falha) {
      setErro({ aulaId: aula?.id, mensagem: falha.message });
      return false;
    }
  }

  function salvarConclusao(concluida) {
    return executar(db => {
      const atual = db.progresso_aula.find(
        item => item.user_id === usuario && item.aula_id === aula.id
      );
      if (atual) atual.concluida = concluida;
      else
        db.progresso_aula.push({
          id: proximoId(db.progresso_aula),
          user_id: usuario,
          aula_id: aula.id,
          concluida,
        });
    });
  }

  return (
    <LayoutPreparacao
      titulo={aula && acessoLocal ? undefined : 'Aprendendo a morar'}
      chaveSecao={aula?.id ?? 'catalogo'}
    >
      <div className='aprendendo-tela'>
        {erro && erro.aulaId === aula?.id && (
          <p role='alert' className='aprendendo-erro'>
            {erro.mensagem}
          </p>
        )}
        {!acessoLocal ? (
          <EstadoVazio
            titulo='Disponível na prévia local'
            descricao='A biblioteca e seu progresso aguardam integração com o servidor.'
          />
        ) : aula ? (
          <>
            <nav
              className='aprendendo-navegacao-aula'
              aria-label='Navegação da aula'
            >
              <Link className='aprendendo-voltar' to='/aprendendo'>
                <ArrowLeft size={17} aria-hidden='true' /> Voltar para a trilha
              </Link>
              {proxima && (
                <Link className='aprendendo-voltar' to={'?aula=' + proxima.id}>
                  Próxima aula <ArrowRight size={16} aria-hidden='true' />
                </Link>
              )}
            </nav>
            <Estudo
              key={aula.id}
              aula={aula}
              quizzes={quizzes}
              banco={b}
              executar={executar}
              usuario={usuario}
              concluida={progresso.has(aula.id)}
              alternarConclusao={() => salvarConclusao(!progresso.has(aula.id))}
              concluirPeloQuiz={() => {
                if (salvarConclusao(true)) setParams({});
              }}
              quizAtivo={params.get('modo') === 'quiz'}
              alternarModo={alternarModo}
            />
          </>
        ) : (
          <>
            <section
              className='aprendendo-capa'
              aria-labelledby='aprendendo-capa-titulo'
            >
              <div className='aprendendo-capa-texto'>
                <h2 id='aprendendo-capa-titulo'>
                  Prepare-se para morar sozinho
                </h2>
                <p>
                  Aulas práticas para organizar seu dinheiro, escolher seu canto
                  e cuidar da casa.
                </p>
                {continuar && (
                  <Link className='aprendendo-cta' to={'?aula=' + continuar.id}>
                    <BookOpen size={18} aria-hidden='true' />
                    <span>
                      {concluidas === aulas.length
                        ? 'Rever a trilha'
                        : concluidas
                          ? 'Continuar a trilha'
                          : 'Começar a trilha'}
                    </span>
                  </Link>
                )}
                {aulas.length > 0 && (
                  <div className='aprendendo-progresso'>
                    <p>
                      {concluidas} de {aulas.length} aulas concluídas
                    </p>
                    <progress
                      max={aulas.length}
                      value={concluidas}
                      aria-label='Progresso na trilha'
                    />
                  </div>
                )}
              </div>
              <img src={fotoHero} alt='' />
            </section>
            <section aria-labelledby='aprendendo-trilha-titulo'>
              <div className='aprendendo-cabecalho-trilha'>
                <h2 id='aprendendo-trilha-titulo'>Sua trilha</h2>
                <label>
                  <span className='sr-only'>Filtrar aulas por progresso</span>
                  <select
                    value={filtro}
                    onChange={evento => {
                      setFiltro(evento.target.value);
                      setInicio(0);
                    }}
                  >
                    <option value='todas'>Todas as aulas</option>
                    <option value='pendentes'>Aulas pendentes</option>
                    <option value='concluidas'>Aulas concluídas</option>
                  </select>
                </label>
                <div className='aprendendo-setas-trilha'>
                  <button
                    type='button'
                    className='aprendendo-seta'
                    aria-label='Ver aulas anteriores'
                    disabled={primeiro === 0}
                    onClick={() => setInicio(primeiro - 1)}
                  >
                    <ChevronLeft size={19} aria-hidden='true' />
                  </button>
                  <button
                    type='button'
                    className='aprendendo-seta'
                    aria-label='Ver mais aulas'
                    disabled={primeiro === ultimoInicio}
                    onClick={() => setInicio(primeiro + 1)}
                  >
                    <ChevronRight size={19} aria-hidden='true' />
                  </button>
                </div>
              </div>
              {visiveis.length ? (
                <ol className='aprendendo-cartoes' aria-live='polite'>
                  {visiveis.slice(primeiro, primeiro + quantidade).map(item => (
                    <li key={item.id}>
                      <Link
                        to={'?aula=' + item.id}
                        className='aprendendo-cartao'
                      >
                        <div className='aprendendo-cartao-foto'>
                          {imagemAula(item)}
                          {progresso.has(item.id) && (
                            <span className='selo-concluido'>Concluído</span>
                          )}
                        </div>
                        <div className='aprendendo-cartao-texto'>
                          <p className='aprendendo-categoria'>
                            {nomeCategoria(item)}
                          </p>
                          <h3>{item.titulo}</h3>

                          <span className='aprendendo-cartao-rodape'>
                            {b.quiz.some(quiz => quiz.aula_id === item.id) ? (
                              <>
                                <ListChecks size={15} aria-hidden='true' /> Aula
                                e quiz
                              </>
                            ) : (
                              'Aula'
                            )}
                            <ArrowRight size={16} aria-hidden='true' />
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : (
                <EstadoVazio
                  titulo={
                    aulas.length
                      ? 'Nenhuma aula neste filtro'
                      : 'Nenhuma aula disponível'
                  }
                />
              )}
            </section>
          </>
        )}
      </div>
    </LayoutPreparacao>
  );
}
