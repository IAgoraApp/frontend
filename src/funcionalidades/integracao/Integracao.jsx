import { IconeConcluido } from '../../compartilhado/interface/IndicadoresFuncionais';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  concluirOnboarding,
  destinoAposAcesso,
  encerrarSessao,
} from '../../aplicacao/utilitarios/sessao';
import logoLaranja from '../../ativos/imagens/marcas/logo-iagora-laranja.png';
import caixaMudancaImg from '../../ativos/imagens/ilustracoes/caixa-mudanca-3d.png';
import ondaDecorativa from '../../ativos/vetores/comuns/onda-integracao.svg';
import {
  Botao,
  Cabecalho,
  Container,
  Rodape,
  SeloEditorial,
} from '../../compartilhado/indice';
import {
  lerEstadoPlataforma,
  salvarEstadoPlataforma,
} from '../../aplicacao/estado/estadoPlataforma';
import { opcoesMomento, prioridadesPorMomento } from './conteudo';

export function Integracao() {
  const navegar = useNavigate();
  const localizacao = useLocation();
  const estadoInicial = lerEstadoPlataforma();

  const [etapa, setEtapa] = useState('momento');
  const [momentoSelecionado, setMomentoSelecionado] = useState(
    estadoInicial.perfil.momento === 'morando' ? 'living-alone' : 'planning'
  );
  const [prioridades, setPrioridades] = useState(
    Array.isArray(estadoInicial.perfil.prioridades)
      ? estadoInicial.perfil.prioridades
      : []
  );
  const conteudoPrioridades = prioridadesPorMomento[momentoSelecionado];
  const voltarAoInicio = () => {
    encerrarSessao();
    navegar('/', { replace: true });
  };

  const persistirMomento = (idOpcao, avancar = true) => {
    const opcao =
      opcoesMomento.find(item => item.id === idOpcao) ?? opcoesMomento[0];
    const prioridadesValidas = prioridades.filter(prioridade =>
      prioridadesPorMomento[opcao.id].opcoes.some(
        item => item.titulo === prioridade
      )
    );
    setMomentoSelecionado(opcao.id);
    setPrioridades(prioridadesValidas);
    try {
      localStorage.setItem('iagora:situacao-moradia', opcao.id);
    } catch (erro) {
      void erro;
    }
    const estadoAtual = lerEstadoPlataforma();
    salvarEstadoPlataforma({
      ...estadoAtual,
      perfil: {
        ...estadoAtual.perfil,
        momento: opcao.momento,
        momentoRotulo: opcao.momentoRotulo,
        prioridades: prioridadesValidas,
      },
    });
    if (avancar) setEtapa('prioridades');
  };

  const alternarPrioridade = item => {
    const existe = prioridades.includes(item);
    const proximas = existe
      ? prioridades.filter(p => p !== item)
      : [...prioridades, item];
    setPrioridades(proximas);
    const estadoAtual = lerEstadoPlataforma();
    salvarEstadoPlataforma({
      ...estadoAtual,
      perfil: {
        ...estadoAtual.perfil,
        prioridades: proximas,
      },
    });
  };

  const irParaExperiencia = () => {
    const idFinal = momentoSelecionado;
    persistirMomento(idFinal, false);
    concluirOnboarding();
    const destino = idFinal === 'planning' ? '/home-b' : '/home';
    const retorno = destinoAposAcesso(localizacao.state?.destino, destino);
    navegar(retorno.split(/[?#]/)[0] === '/onboarding' ? destino : retorno, {
      replace: true,
    });
  };

  if (etapa === 'momento') {
    return (
      <main
        className='relative isolate flex min-h-dvh flex-col justify-between overflow-hidden bg-(--azul-titulo) px-(--margem-pagina) py-8 text-white'
        aria-labelledby='titulo-integracao-momento'
      >
        <div className='mx-auto flex w-full max-w-[1280px] items-center justify-between'>
          <Link
            to='/'
            onClick={encerrarSessao}
            aria-label='Voltar para a página inicial'
            className='inline-flex items-center rounded-xl bg-white px-3.5 py-1.5 shadow-xs'
          >
            <img
              src={logoLaranja}
              alt='IAgora'
              className='h-7 w-auto object-contain sm:h-8'
            />
          </Link>
          <button
            type='button'
            onClick={voltarAoInicio}
            className='min-h-12 cursor-pointer rounded-lg border border-white/50 px-4 py-3 text-sm font-bold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'
          >
            Voltar ao início
          </button>
        </div>

        <div className='mx-auto my-8 w-full max-w-[1160px]'>
          <p className='text-xs font-bold tracking-[0.08em] text-(--laranja-principal) uppercase'>
            EI, QUE BOM TER VOCÊ AQUI!
          </p>
          <h1
            id='titulo-integracao-momento'
            className='font-titulo mt-2 max-w-[540px] text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.03] font-extrabold'
          >
            Seu agora começa onde?
          </h1>
          <p className='mt-3 text-base text-white/80 sm:text-lg'>
            Cada começo é diferente. Conta pra gente qual é o seu.
          </p>

          <section
            aria-label='Escolha o seu momento de vida'
            className='mt-8 grid gap-7 md:grid-cols-2'
          >
            {opcoesMomento.map(opcao => (
              <button
                key={opcao.id}
                type='button'
                onClick={() => persistirMomento(opcao.id, true)}
                className='group cursor-pointer overflow-hidden rounded-xl bg-white text-left text-(--azul-titulo) shadow-xl transition-transform hover:-translate-y-1 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-(--laranja-principal)'
              >
                <div className='aspect-[16/10] w-full overflow-hidden'>
                  <img
                    src={opcao.imagem}
                    alt={opcao.alt}
                    className='size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]'
                  />
                </div>
                <div className='p-6 sm:p-7'>
                  <h2 className='font-titulo text-2xl font-extrabold text-(--azul-titulo) sm:text-[1.75rem]'>
                    {opcao.titulo}
                  </h2>
                  <p className='mt-2 text-base leading-relaxed text-(--texto-apoio)'>
                    {opcao.descricao}
                  </p>
                </div>
              </button>
            ))}
          </section>
        </div>

        <div className='mx-auto flex w-full max-w-[1280px] items-center justify-center gap-2 text-center text-sm text-white/75'>
          <p>Pode mudar de ideia depois. Seu momento também muda!</p>
        </div>

        <img
          src={ondaDecorativa}
          alt=''
          aria-hidden='true'
          className='pointer-events-none absolute right-0 -bottom-16 left-0 -z-10 w-full opacity-15'
        />
      </main>
    );
  }

  return (
    <div className='flex min-h-dvh flex-col bg-white text-(--azul-titulo)'>
      <Cabecalho variante='publico' />

      <main className='flex-1 py-10 sm:py-14'>
        <Container>
          <div className='flex flex-col-reverse items-start justify-between gap-8 lg:flex-row lg:items-center'>
            <div className='max-w-[700px]'>
              <button
                type='button'
                onClick={() => setEtapa('momento')}
                className='inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-lg border border-(--borda-suave) bg-(--azul-fundo) px-5 py-3 text-base font-bold text-(--azul-titulo) hover:border-(--laranja-principal) hover:text-(--laranja-principal) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--laranja-principal)'
              >
                <ChevronLeft size={20} aria-hidden='true' />
                Voltar
              </button>
              <div className='mt-4'>
                <SeloEditorial texto='SEU AGORA COMEÇA AQUI' />
              </div>
              <h1 className='font-titulo mt-4 text-[clamp(2rem,3.6vw,3rem)] leading-[1.1] font-extrabold'>
                {conteudoPrioridades.titulo}
              </h1>
              <p className='mt-2 text-lg text-(--texto-apoio)'>
                {conteudoPrioridades.descricao}
              </p>
            </div>

            <img
              src={caixaMudancaImg}
              alt='Caixa de mudança IAgora com itens da casa'
              className='h-40 w-40 shrink-0 object-contain sm:h-52 sm:w-52'
            />
          </div>

          <div className='mt-8 space-y-3'>
            {conteudoPrioridades.opcoes.map(item => {
              const marcada = prioridades.includes(item.titulo);
              return (
                <button
                  key={item.titulo}
                  type='button'
                  role='checkbox'
                  aria-checked={marcada}
                  onClick={() => alternarPrioridade(item.titulo)}
                  className={`flex w-full cursor-pointer items-center gap-4 rounded-xl border p-5 text-left transition-colors ${
                    marcada
                      ? 'border-(--laranja-principal) bg-(--pessego-suave)/55'
                      : 'border-(--borda-suave) bg-white hover:bg-(--azul-fundo)'
                  }`}
                >
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                      marcada
                        ? 'border-(--laranja-principal) bg-(--laranja-principal) text-white'
                        : 'border-(--borda-suave) bg-white text-transparent'
                    }`}
                  >
                    <IconeConcluido />
                  </span>
                  <span>
                    <span className='block text-lg font-bold text-(--azul-titulo)'>
                      {item.titulo}
                    </span>
                    <span className='mt-0.5 block text-sm text-(--texto-apoio)'>
                      {item.descricao}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className='mt-8 flex flex-wrap gap-3'>
            <Botao
              type='button'
              cor='laranja'
              onClick={() => irParaExperiencia()}
            >
              Começar agora
            </Botao>
          </div>
        </Container>
      </main>

      <Rodape />
    </div>
  );
}
