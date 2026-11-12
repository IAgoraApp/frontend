import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoLaranja from '../../shared/assets/logoLaranja.png';
import caixaMudancaImg from '../landing-page/assets/caixa.png';
import ondaDecorativa from './assets/onda.svg';
import {
  Botao,
  Cabecalho,
  Container,
  Rodape,
  SeloEditorial,
} from '../../shared/index';
import {
  lerEstadoPlataforma,
  salvarEstadoPlataforma,
} from '../../app/estado/estadoPlataforma';
import { opcoesMomento, opcoesPrioridades } from './content';

export function Integracao() {
  const navegar = useNavigate();
  const estadoInicial = lerEstadoPlataforma();

  const [etapa, setEtapa] = useState('momento');
  const [momentoSelecionado, setMomentoSelecionado] = useState(
    estadoInicial.perfil.momento === 'morando' ? 'living-alone' : 'planning'
  );
  const [prioridades, setPrioridades] = useState(
    estadoInicial.perfil.prioridades || ['Planejar minha mudança']
  );

  const persistirMomento = (idOpcao, avancar = true) => {
    const opcao =
      opcoesMomento.find(item => item.id === idOpcao) ?? opcoesMomento[0];
    setMomentoSelecionado(opcao.id);
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

  const irParaExperiencia = idMomentoForcado => {
    const idFinal = idMomentoForcado || momentoSelecionado;
    persistirMomento(idFinal, false);
    const destino = idFinal === 'planning' ? '/home-b' : '/home';
    navegar(destino);
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
            aria-label='Voltar para a página inicial'
            className='inline-flex items-center rounded-xl bg-white px-3.5 py-1.5 shadow-xs'
          >
            <img
              src={logoLaranja}
              alt='IAgora'
              className='h-7 w-auto object-contain sm:h-8'
            />
          </Link>
          <p className='flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-white/85'>
            <span className='size-2 rounded-full bg-(--laranja-principal)' />
            SEU MOMENTO · 01 / 01
          </p>
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
          <span className='font-bold text-(--laranja-principal)'>↗</span>
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
          {etapa === 'prioridades' ? (
            <>
              <div className='flex flex-col-reverse items-start justify-between gap-8 lg:flex-row lg:items-center'>
                <div className='max-w-[700px]'>
                  <button
                    type='button'
                    onClick={() => setEtapa('momento')}
                    className='inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-(--azul-titulo) hover:text-(--laranja-principal)'
                  >
                    ← Voltar
                  </button>
                  <div className='mt-4'>
                    <SeloEditorial texto='SEU AGORA COMEÇA AQUI' />
                  </div>
                  <h1 className='font-titulo mt-4 text-[clamp(2rem,3.6vw,3rem)] leading-[1.1] font-extrabold'>
                    O que você quer organizar primeiro?
                  </h1>
                  <p className='mt-2 text-lg text-(--texto-apoio)'>
                    Você pode mudar essas escolhas depois.
                  </p>
                </div>

                <img
                  src={caixaMudancaImg}
                  alt='Caixa de mudança IAgora com itens da casa'
                  className='h-40 w-40 shrink-0 object-contain sm:h-52 sm:w-52'
                />
              </div>

              <div className='mt-8 space-y-3'>
                {opcoesPrioridades.map(item => {
                  const marcada = prioridades.includes(item);
                  return (
                    <button
                      key={item}
                      type='button'
                      role='checkbox'
                      aria-checked={marcada}
                      onClick={() => alternarPrioridade(item)}
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
                        ✓
                      </span>
                      <span>
                        <span className='block text-lg font-bold text-(--azul-titulo)'>
                          {item}
                        </span>
                        <span className='mt-0.5 block text-sm text-(--texto-apoio)'>
                          Escolha o que faz sentido agora.
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
                  onClick={() => irParaExperiencia('living-alone')}
                >
                  Já moro sozinho
                </Botao>
                <Botao
                  type='button'
                  variante='secundario'
                  onClick={() => irParaExperiencia('planning')}
                >
                  Vou morar sozinho
                </Botao>
                <Botao
                  como={Link}
                  to='/cadastro-empresa'
                  variante='secundario'
                >
                  Quero anunciar
                </Botao>
                <Botao
                  type='button'
                  variante='fantasma'
                  classe='border border-(--borda-suave)'
                  onClick={() => setEtapa('explorar')}
                >
                  Ver próximos passos →
                </Botao>
              </div>
            </>
          ) : (
            <div className='flex flex-col-reverse items-start justify-between gap-8 lg:flex-row lg:items-center'>
              <div className='max-w-[700px]'>
                <button
                  type='button'
                  onClick={() => setEtapa('prioridades')}
                  className='inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-(--azul-titulo) hover:text-(--laranja-principal)'
                >
                  ← Voltar
                </button>
                <div className='mt-4'>
                  <SeloEditorial texto='SEU AGORA COMEÇA AQUI' />
                </div>
                <h1 className='font-titulo mt-4 text-[clamp(2rem,3.6vw,3rem)] leading-[1.1] font-extrabold'>
                  Conheça seu próximo passo.
                </h1>
                <p className='mt-2 text-lg text-(--texto-apoio)'>
                  Explore as áreas e escolha seu momento quando quiser.
                </p>

                <div className='mt-8 flex flex-wrap gap-3'>
                  <Botao
                    type='button'
                    cor='laranja'
                    onClick={() => irParaExperiencia()}
                  >
                    Conhecer a plataforma
                  </Botao>
                  <Botao
                    type='button'
                    variante='secundario'
                    onClick={() => setEtapa('momento')}
                  >
                    Escolher meu momento
                  </Botao>
                  <Botao como={Link} to='/sejaparceiro' variante='secundario'>
                    Sou prestador de serviço
                  </Botao>
                </div>
              </div>

              <img
                src={caixaMudancaImg}
                alt='Caixa de mudança IAgora com objetos do lar'
                className='h-44 w-44 shrink-0 object-contain sm:h-56 sm:w-56'
              />
            </div>
          )}
        </Container>
      </main>

      <Rodape />
    </div>
  );
}
