import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Botao,
  CabecalhoSubpagina,
  CampoFormulario,
  Container,
  EstadoVazio,
  Titulo,
} from '../../compartilhado/interface/indice';
import Rodape from '../../compartilhado/Rodape';
import {
  analisarNumero,
  buscarCalculadoraPorSlug,
  calculadorasLista,
  categoriasCalculadoras,
  formatarMoeda,
} from './conteudo';
import buscaIcone from '../../ativos/vetores/calculadoras/busca.svg';
import fechoCarteira from '../../ativos/vetores/calculadoras/fecho-carteira.svg';
import moedaGrande from '../../ativos/vetores/calculadoras/moeda-grande.svg';
import moedaMedia from '../../ativos/vetores/calculadoras/moeda-media.svg';
import moedaPequena from '../../ativos/vetores/calculadoras/moeda-pequena.svg';
import pranchetaChecklist from '../../ativos/vetores/calculadoras/prancheta-checklist.svg';

function IlustracaoCarteiraEditorial() {
  return (
    <div
      aria-hidden='true'
      className='relative hidden h-[170px] w-[224px] shrink-0 select-none sm:block'
    >
      <div className='animar-pulsar absolute top-4 left-0 h-[72px] w-[138px] rotate-8 rounded-[7px] border border-white bg-[#f4f7fa] p-2.5 shadow-xs'>
        <span className='font-titulo text-xl leading-none font-extrabold text-(--azul-titulo)'>
          R$
        </span>
        <span className='ml-2 text-[9px] font-bold text-(--azul-titulo)'>
          SEU MÊS
        </span>
        <div className='mt-3 h-[2px] w-4/5 bg-[#9fb0bf]' />
        <div className='mt-1.5 h-[2px] w-1/2 bg-[#9fb0bf]' />
      </div>
      <img
        src={moedaGrande}
        alt=''
        className='animar-moeda absolute top-4 right-5 size-9'
      />
      <img
        src={moedaMedia}
        alt=''
        className='animar-moeda absolute bottom-4 left-5 size-5 [animation-delay:0.25s]'
      />
      <img
        src={moedaPequena}
        alt=''
        className='animar-moeda absolute bottom-2 left-11 size-3.5 [animation-delay:0.5s]'
      />
      <div className='absolute right-2 bottom-3 h-[76px] w-[146px] rounded-[10px] border-2 border-white bg-(--laranja-principal) shadow-sm'>
        <div className='mt-6 h-[46px] rounded-[8px] border border-white bg-[#b64217]' />
        <img
          src={fechoCarteira}
          alt=''
          className='absolute right-1 bottom-2.5 h-6 w-12 object-contain'
        />
      </div>
    </div>
  );
}

function HubCalculadoras() {
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [entradasRapidas, setEntradasRapidas] = useState('');
  const [saidasRapidas, setSaidasRapidas] = useState('');
  const [calculoRapido, setCalculoRapido] = useState(null);

  const filtradas = calculadorasLista.filter(item => {
    const bateCategoria = categoria === 'todas' || item.categoria === categoria;
    const termo = busca.trim().toLowerCase();
    const bateBusca =
      !termo ||
      item.titulo.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo) ||
      item.categoriaRotulo.toLowerCase().includes(termo);
    return bateCategoria && bateBusca;
  });

  function calcularOrcamentoRapido(evento) {
    evento.preventDefault();
    const entra = analisarNumero(entradasRapidas);
    const sai = analisarNumero(saidasRapidas);
    setCalculoRapido({ entra, sai, saldo: entra - sai });
  }

  return (
    <>
      <section className='relative pb-6'>
        <div className='flex flex-col justify-between gap-8 lg:flex-row lg:items-center'>
          <div className='max-w-[920px] space-y-2'>
            <p className='text-[13px] font-normal tracking-wide text-(--laranja-destaque) uppercase'>
              CALCULADORAS / PLANOS QUE CABEM NO BOLSO
            </p>
            <h1 className='font-titulo text-[clamp(2.6rem,5.5vw,4.625rem)] leading-[1.03] font-extrabold text-(--azul-titulo)'>
              Faz as contas.
              <span className='block text-(--laranja-destaque)'>
                Tira do papel
              </span>
            </h1>
          </div>
          <IlustracaoCarteiraEditorial />
        </div>

        <div className='mt-6 flex justify-end'>
          <span className='inline-block rotate-3 bg-(--azul-titulo) px-4 py-2 text-xs font-medium tracking-wider text-white uppercase'>
            DO SEU JEITO. NO SEU TEMPO
          </span>
        </div>
      </section>

      <section
        aria-label='Calculadora rápida de orçamento mensal'
        className='mt-2 grid items-center gap-8 rounded-[4px] bg-(--laranja-principal) p-6 sm:p-10 lg:grid-cols-[1fr_minmax(0,616px)] lg:gap-12'
      >
        <div className='space-y-5 text-white'>
          <p className='text-xs font-bold tracking-wider uppercase'>
            SEU DINHEIRO, SEU PRÓXIMO PASSO
          </p>
          <Titulo
            como='h2'
            classe='text-3xl leading-[1.08] font-extrabold text-white! sm:text-[52px]'
          >
            Um plano pro bolso.
            <span className='block'>Um respiro pra você</span>
          </Titulo>
          <p className='max-w-[508px] text-lg leading-relaxed text-white/95 sm:text-xl'>
            Da primeira mudança às contas do mês: faça as contas antes de
            decidir.
          </p>
          <a
            href='#todas-calculadoras'
            className='inline-flex min-h-11 items-center text-base font-bold text-white hover:underline'
          >
            Encontre outras calculadoras
          </a>
        </div>

        <form
          onSubmit={calcularOrcamentoRapido}
          className='space-y-4 rounded-[16px] bg-white p-5 sm:p-6'
        >
          <p className='text-xs font-bold tracking-wider text-(--laranja-destaque) uppercase'>
            ORÇAMENTO MENSAL
          </p>
          <Titulo classe='text-2xl font-extrabold sm:text-[28px]'>
            Seu mês, na ponta do lápis
          </Titulo>

          <div className='grid gap-4 sm:grid-cols-2'>
            <CampoFormulario
              id='hub-entra'
              rotulo='Quanto entra no mês?'
              placeholder='R$ 0,00'
              value={entradasRapidas}
              onChange={e => setEntradasRapidas(e.target.value)}
            />
            <CampoFormulario
              id='hub-sai'
              rotulo='Quanto sai no mês?'
              placeholder='R$ 0,00'
              value={saidasRapidas}
              onChange={e => setSaidasRapidas(e.target.value)}
            />
          </div>

          <Botao
            type='submit'
            cor='marinho'
            classe='w-full rounded-full min-h-[52px] text-[15px]'
          >
            Calcular meu orçamento
          </Botao>

          <div className='flex flex-wrap items-center justify-between gap-4 rounded-[8px] bg-(--azul-fundo) p-4'>
            <div>
              <p className='text-sm font-bold text-(--azul-titulo)'>
                Saldo estimado do mês
              </p>
              <p className='text-[13px] text-(--texto-apoio)'>
                {calculoRapido
                  ? `${formatarMoeda(calculoRapido.entra)} - ${formatarMoeda(calculoRapido.sai)}`
                  : 'Preencha os valores para calcular.'}
              </p>
            </div>
            <p className='font-titulo text-2xl font-extrabold text-(--azul-titulo) sm:text-[28px]'>
              {calculoRapido ? formatarMoeda(calculoRapido.saldo, 0) : 'R$ —'}
            </p>
          </div>
        </form>
      </section>

      <section id='todas-calculadoras' className='mt-12 scroll-mt-6 space-y-6'>
        <div className='flex flex-col justify-between gap-5 lg:flex-row lg:items-end'>
          <div className='space-y-1.5'>
            <p className='text-xs font-bold tracking-wider text-(--laranja-destaque) uppercase'>
              UMA FERRAMENTA PARA CADA MOMENTO
            </p>
            <Titulo classe='text-2xl font-extrabold sm:text-[34px]'>
              Qual conta vamos resolver?
            </Titulo>
          </div>

          <label className='flex h-14 w-full items-center gap-3 rounded-[8px] bg-(--azul-fundo) px-4 lg:w-[400px]'>
            <img src={buscaIcone} alt='' className='size-6 shrink-0' />
            <input
              type='search'
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder='Busque uma calculadora'
              aria-label='Busque uma calculadora'
              className='w-full bg-transparent text-[15px] text-(--azul-titulo) placeholder:text-(--texto-apoio) focus:outline-none'
            />
          </label>
        </div>

        <div className='flex flex-wrap gap-3'>
          {categoriasCalculadoras.map(item => {
            const contagem =
              item.id === 'todas'
                ? calculadorasLista.length
                : calculadorasLista.filter(c => c.categoria === item.id).length;
            const ativo = categoria === item.id;
            return (
              <button
                key={item.id}
                type='button'
                onClick={() => setCategoria(item.id)}
                className={
                  'min-h-11 rounded-full px-5 text-[15px] font-bold transition-colors ' +
                  (ativo
                    ? 'bg-(--laranja-destaque) text-white'
                    : 'bg-(--azul-fundo) text-(--azul-titulo) hover:bg-[#e7eef5]')
                }
              >
                {item.rotulo} · {contagem}
              </button>
            );
          })}
        </div>

        {filtradas.length ? (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filtradas.map(item => (
              <Link
                key={item.slug}
                to={`/calculadoras/${item.slug}`}
                className={
                  'flex min-h-[248px] flex-col justify-between border border-(--azul-titulo) p-6 transition-transform hover:-translate-y-0.5 ' +
                  (item.destaquePessego ? 'bg-(--laranja-fundo)' : 'bg-white')
                }
              >
                <div className='flex items-center justify-between gap-4'>
                  <span className='text-[11px] font-bold tracking-wider text-(--laranja-destaque) uppercase'>
                    {item.numero} / {item.categoriaRotulo}
                  </span>
                  <span className='flex size-14 shrink-0 items-center justify-center rounded-[12px] bg-(--laranja-fundo)'>
                    <img src={item.icone} alt='' className='size-7' />
                  </span>
                </div>

                <div className='my-4 space-y-2'>
                  <h3 className='font-titulo text-2xl leading-tight font-extrabold text-(--azul-titulo) sm:text-[30px]'>
                    {item.titulo}
                  </h3>
                  <p className='text-[15px] leading-[22px] text-(--azul-titulo)'>
                    {item.descricao}
                  </p>
                </div>

                <span className='text-[15px] font-bold text-(--laranja-destaque)'>
                  {item.acao}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <EstadoVazio
            titulo='Nenhuma calculadora encontrada'
            descricao='Tente buscar por outro termo ou limpe o filtro de categoria.'
            textoAcao='Mostrar todas'
            aoClicar={() => {
              setBusca('');
              setCategoria('todas');
            }}
          />
        )}
      </section>

      <section className='mt-10 flex flex-col items-start justify-between gap-6 rounded-[8px] bg-(--laranja-fundo) p-6 sm:flex-row sm:items-center sm:p-8'>
        <div className='flex items-center gap-6'>
          <img
            src={pranchetaChecklist}
            alt=''
            className='hidden h-24 w-20 shrink-0 -rotate-6 object-contain sm:block'
          />
          <div className='space-y-1.5'>
            <Titulo classe='text-2xl font-extrabold sm:text-[28px]'>
              Antes de calcular, vale entender
            </Titulo>
            <p className='text-base text-(--texto-apoio)'>
              Aprenda o básico e cuide do seu dinheiro com mais confiança.
            </p>
          </div>
        </div>
        <Botao
          como={Link}
          to='/aprendendo?visao=guia&guia=despesas'
          cor='laranja'
          classe='shrink-0 rounded-full px-7 min-h-[52px]'
        >
          Aprender sobre finanças
        </Botao>
      </section>
    </>
  );
}

function DetalheCalculadora({ calculadora }) {
  const navegar = useNavigate();
  const [valores, setValores] = useState(() =>
    Object.fromEntries(calculadora.campos.map(campo => [campo.id, campo.padrao]))
  );
  const [resultado, setResultado] = useState(null);

  function lidarEnvio(evento) {
    evento.preventDefault();
    setResultado(calculadora.calcular(valores));
  }

  function limparCampos() {
    setValores(Object.fromEntries(calculadora.campos.map(campo => [campo.id, ''])));
    setResultado(null);
  }

  return (
    <div className='space-y-6'>
      <CabecalhoSubpagina
        voltarPara='/calculadoras'
        rotuloVoltar=" Voltar"
        selo='FERRAMENTAS PARA A VIDA REAL'
        titulo={calculadora.tituloPagina}
        subtitulo={
          resultado
            ? 'Resultado do cenário preenchido.'
            : 'Preencha os valores para explorar uma estimativa.'
        }
        assinatura=''
      />

      {resultado ? (
        <div className='grid items-start gap-6 lg:grid-cols-[1fr_340px]'>
          <div className='space-y-5'>
            <div className='rounded-[12px] bg-(--azul-titulo) p-6 text-white sm:p-8'>
              <p className='text-sm text-white/85'>{resultado.rotuloMetrica}</p>
              <p className='font-titulo mt-2 text-4xl font-extrabold text-white sm:text-5xl'>
                {resultado.valorPrincipal}
              </p>
              <p className='mt-3 text-base text-white/85'>{resultado.formula}</p>
            </div>

            <div className='rounded-[10px] bg-(--azul-fundo) p-5'>
              <strong className='block text-sm font-bold text-(--azul-titulo)'>
                Como usar este resultado
              </strong>
              <p className='mt-1 text-sm text-(--texto-apoio)'>
                {calculadora.dicaResultado}
              </p>
            </div>

            <div className='flex flex-wrap gap-3'>
              <Botao
                como={Link}
                to={calculadora.rotaAcaoPrincipal}
                cor='laranja'
                classe='rounded-full px-7'
              >
                {calculadora.rotuloAcaoPrincipal}
              </Botao>
              <Botao
                type='button'
                variante='secundario'
                classe='rounded-full px-6 border border-[#dbe5ed] bg-white'
                onClick={() => setResultado(null)}
              >
                Ajustar valores
              </Botao>
              <Botao
                type='button'
                variante='secundario'
                classe='rounded-full px-6'
                onClick={() => navegar('/calculadoras')}
              >
                Fazer outra conta
              </Botao>
            </div>
          </div>

          <aside className='space-y-4 rounded-[12px] bg-(--laranja-fundo) p-6'>
            <p className='text-[11px] font-bold tracking-wider text-(--azul-titulo) uppercase'>
              COMO A CONTA CHEGA AQUI
            </p>
            <div className='space-y-3'>
              {resultado.detalhes.map(detalhe => (
                <div key={detalhe.rotulo}>
                  <strong className='block text-sm font-bold text-(--azul-titulo)'>
                    {detalhe.rotulo}
                  </strong>
                  <span className='text-sm text-(--texto-apoio)'>
                    {detalhe.valor}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      ) : (
        <div className='grid items-start gap-6 lg:grid-cols-[1fr_340px]'>
          <form
            onSubmit={lidarEnvio}
            className='space-y-5 rounded-[12px] bg-(--azul-fundo) p-5 sm:p-7'
          >
            <div className='grid gap-4 sm:grid-cols-2'>
              {calculadora.campos.map(campo => (
                <CampoFormulario
                  key={campo.id}
                  id={`calc-${calculadora.slug}-${campo.id}`}
                  rotulo={campo.rotulo}
                  placeholder={campo.placeholder}
                  value={valores[campo.id] || ''}
                  onChange={e =>
                    setValores(anterior => ({
                      ...anterior,
                      [campo.id]: e.target.value,
                    }))
                  }
                  classe={campo.larguraTotal ? 'sm:col-span-2' : ''}
                  classeEntrada='bg-white'
                  required
                />
              ))}
            </div>

            <div className='flex flex-wrap gap-3 pt-1'>
              <Botao type='submit' cor='laranja' classe='rounded-full px-8'>
                Calcular
              </Botao>
              <Botao
                type='button'
                variante='secundario'
                classe='rounded-full px-8 border border-[#dbe5ed] bg-white'
                onClick={limparCampos}
              >
                Limpar
              </Botao>
            </div>
          </form>

          <aside className='space-y-4'>
            <div className='space-y-2 rounded-[12px] bg-(--laranja-fundo) p-6'>
              <p className='text-[11px] font-bold tracking-wider text-(--azul-titulo) uppercase'>
                ANTES DE CALCULAR
              </p>
              <p className='text-[15px] leading-relaxed text-(--azul-titulo)'>
                {calculadora.notaAntes}
              </p>
            </div>

            <div className='space-y-1.5 rounded-[12px] bg-(--azul-fundo) p-6'>
              <strong className='block text-base font-bold text-(--azul-titulo)'>
                Use os valores do seu contexto
              </strong>
              <p className='text-sm leading-relaxed text-(--texto-apoio)'>
                {calculadora.notaContexto}
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default function Calculadoras() {
  const { tipo } = useParams();
  const calculadora = buscarCalculadoraPorSlug(tipo);

  return (
    <div
      lang='pt-BR'
      className='min-w-0 flex-1 bg-white font-corpo text-(--azul-titulo) [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-(--laranja-principal)'
    >
      <Container como='main' classe='py-8 sm:py-10'>
        {!tipo ? (
          <HubCalculadoras />
        ) : calculadora ? (
          <DetalheCalculadora
            key={calculadora.slug}
            calculadora={calculadora}
          />
        ) : (
          <EstadoVazio
            varianteAlerta='erro'
            titulo='Calculadora não encontrada'
            descricao='Essa ferramenta não está disponível neste endereço. Escolha uma das calculadoras da lista.'
            textoAcao='Ver todas as calculadoras'
            rotaAcao='/calculadoras'
          />
        )}
      </Container>
      <Rodape />
    </div>
  );
}
