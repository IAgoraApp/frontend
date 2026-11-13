import { Link } from 'react-router-dom';
import {
  Botao,
  CabecalhoSubpagina,
  CampoFormulario,
  Titulo,
} from '../../../compartilhado/interface/indice';
import {
  analisarNumero,
  formatarMoeda,
  formatarNumero,
} from '../../calculadoras/conteudo';
import { resumirRealidade } from '../conteudo';
import fechoCarteira from '../../../ativos/vetores/calculadoras/fecho-carteira.svg';
import moedaGrande from '../../../ativos/vetores/calculadoras/moeda-grande.svg';
import moedaMedia from '../../../ativos/vetores/calculadoras/moeda-media.svg';
import moedaPequena from '../../../ativos/vetores/calculadoras/moeda-pequena.svg';

function EmblemaCarteiraSubpagina() {
  return (
    <div
      aria-hidden='true'
      className='relative h-[160px] w-[196px] shrink-0 select-none'
    >
      <div className='absolute top-2 left-6 h-[108px] w-[134px] -rotate-6 rounded-[12px] bg-[#fce8dc]' />
      <div className='absolute top-3 left-2 h-[54px] w-[104px] rotate-6 rounded-[6px] border border-white bg-[#f4f7fa] p-2 shadow-xs'>
        <span className='font-titulo text-sm font-extrabold text-(--azul-titulo)'>
          R$
        </span>
      </div>
      <img src={moedaGrande} alt='' className='absolute top-3 right-3 size-7' />
      <img src={moedaMedia} alt='' className='absolute bottom-8 left-2 size-4' />
      <img src={moedaPequena} alt='' className='absolute bottom-7 left-7 size-3' />
      <div className='absolute top-12 left-10 h-[62px] w-[118px] rounded-[8px] border border-white bg-(--laranja-principal)'>
        <div className='mt-5 h-[38px] rounded-[7px] border border-white bg-[#b64217]' />
        <img
          src={fechoCarteira}
          alt=''
          className='absolute right-1 bottom-2 h-4 w-9 object-contain'
        />
      </div>
      <div className='absolute bottom-2 left-8 rotate-2 bg-(--azul-titulo) px-3 py-1'>
        <span className='text-[10px] font-bold tracking-wider text-white uppercase'>
          DO SEU JEITO
        </span>
      </div>
    </div>
  );
}

export function VisaoRealidade({
  realidade,
  aoAlterar,
  aoAbrirVisao,
  aoVoltar,
}) {
  const resumo = resumirRealidade(realidade);
  const campos = [
    ['entradaMensal', 'Entrada mensal'],
    ['guardado', 'Dinheiro já guardado'],
    ['aluguel', 'Aluguel estimado'],
    ['contas', 'Contas e internet'],
    ['alimentacao', 'Alimentação'],
    ['transporte', 'Transporte'],
    ['outros', 'Outros gastos'],
  ];

  return (
    <div className='space-y-6'>
      <CabecalhoSubpagina
        aoVoltar={aoVoltar}
        rotuloVoltar=" Voltar"
        selo='PLANEJAR SUA INDEPENDÊNCIA'
        titulo='Seu próximo passo começa nos números'
        subtitulo='Informe estimativas. Você poderá ajustar tudo depois.'
        assinatura=''
      />

      <div className='grid items-start gap-6 lg:grid-cols-[1fr_340px]'>
        <form
          onSubmit={e => {
            e.preventDefault();
            aoAbrirVisao('cenario');
          }}
          className='space-y-5 rounded-[12px] bg-(--azul-fundo) p-5 sm:p-7'
        >
          <div className='grid gap-4 sm:grid-cols-2'>
            {campos.map(([chave, rotulo]) => (
              <CampoFormulario
                key={chave}
                id={`realidade-${chave}`}
                rotulo={rotulo}
                placeholder='0,00'
                value={realidade[chave] || ''}
                onChange={e => aoAlterar(chave, e.target.value)}
                classe={chave === 'outros' ? 'sm:col-span-2' : ''}
                classeEntrada='bg-white'
              />
            ))}
          </div>
          <div className='flex flex-wrap gap-3 pt-1'>
            <Botao type='submit' cor='laranja' classe='rounded-full px-7'>
              Ver meu cenário
            </Botao>
            <Botao
              type='button'
              variante='secundario'
              classe='rounded-full border border-[#dbe5ed] bg-white px-7'
              onClick={aoVoltar}
            >
              Voltar
            </Botao>
          </div>
        </form>

        <aside className='space-y-4'>
          <div className='rounded-[12px] bg-(--azul-titulo) p-6 text-white'>
            <p className='text-[11px] font-bold tracking-wider uppercase'>
              SEU CENÁRIO DE MUDANÇA
            </p>
            <p className='font-titulo mt-2 text-4xl font-extrabold text-white'>
              {resumo.renda || resumo.custoMensal
                ? formatarMoeda(resumo.margem, 0)
                : 'R$ —'}
            </p>
            <p className='mt-2 text-sm text-white/85'>
              de margem para planejar
            </p>
          </div>

          <div className='space-y-3 rounded-[12px] bg-(--laranja-fundo) p-6'>
            <strong className='block text-base font-bold text-(--azul-titulo)'>
              O mês tem mais que aluguel
            </strong>
            <p className='text-sm text-(--texto-apoio)'>
              Some contas, comida e deslocamento para enxergar o custo total.
            </p>
            <Botao
              type='button'
              variante='secundario'
              classe='w-full rounded-full bg-white'
              onClick={() => aoAbrirVisao('custo-de-vida')}
            >
              Ver o que entra na conta
            </Botao>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function VisaoCenario({ realidade, aoAbrirVisao, aoVoltar }) {
  const resumo = resumirRealidade(realidade);
  const linhas = [
    ['Aluguel estimado', resumo.aluguel],
    ['Contas e internet', resumo.contas],
    ['Alimentação', resumo.alimentacao],
    ['Transporte', resumo.transporte],
    ['Outros gastos', resumo.outros],
  ];

  return (
    <div className='space-y-6'>
      <div className='flex flex-col justify-between gap-6 border-b border-[#e6edf2] pb-8 md:flex-row md:items-center'>
        <div className='space-y-3'>
          <Botao
            type='button'
            onClick={aoVoltar}
            variante='fantasma'
            classe='px-4! min-h-[44px]! border border-[#dbe5ed] text-sm!'
          >
 Voltar
          </Botao>
          <div>
            <span className='inline-block rotate-[1.4deg] bg-(--laranja-principal) px-3 py-1 text-[11px] font-bold tracking-wider text-white uppercase'>
              PLANEJAR SUA INDEPENDÊNCIA
            </span>
          </div>
          <Titulo
            como='h1'
            classe='text-3xl leading-tight font-extrabold sm:text-5xl'
          >
            Seu plano, em perspectiva
          </Titulo>
          <p className='text-base text-(--texto-apoio) sm:text-lg'>
            Estimativa educativa com os valores informados.
          </p>
        </div>
        <div className='hidden sm:block'>
          <EmblemaCarteiraSubpagina />
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        {[
          ['Renda mensal', resumo.renda],
          ['Custo mensal estimado', resumo.custoMensal],
          ['Margem antes de imprevistos', resumo.margem],
        ].map(([rotulo, valor]) => (
          <div
            key={rotulo}
            className='rounded-[10px] border border-[#dbe5ed] bg-white p-5'
          >
            <p className='text-sm text-(--texto-apoio)'>{rotulo}</p>
            <p className='font-titulo mt-2 text-3xl font-extrabold text-(--azul-titulo)'>
              {formatarMoeda(valor, 0)}
            </p>
            <span className='mt-2 inline-block h-[3px] w-16 -rotate-2 rounded-full bg-(--laranja-principal)' />
          </div>
        ))}
      </div>

      <div className='rounded-[10px] bg-(--azul-fundo) p-5'>
        <strong className='block text-base font-bold text-(--azul-titulo)'>
          {resumo.margem >= 0
            ? 'Há espaço para planejar'
            : 'Os custos superaram a renda estimada'}
        </strong>
        <p className='mt-1 text-sm text-(--texto-apoio)'>
          Essa margem não é uma garantia. Inclua despesas pessoais, reajustes e
          imprevistos antes de decidir.
        </p>
      </div>

      <div className='flex flex-wrap gap-3'>
        <Botao
          type='button'
          cor='laranja'
          classe='rounded-full px-7'
          onClick={() => aoAbrirVisao('custos-iniciais')}
        >
          Ver custos iniciais
        </Botao>
        <Botao
          type='button'
          variante='secundario'
          classe='rounded-full px-7'
          onClick={() => aoAbrirVisao('comparar-cenarios')}
        >
          Comparar cenários
        </Botao>
        <Botao
          type='button'
          variante='secundario'
          classe='rounded-full px-7'
          onClick={() => aoAbrirVisao('meta-economia')}
        >
          Montar meta de economia
        </Botao>
      </div>

      <div className='space-y-3 rounded-[12px] bg-(--azul-fundo) p-4 sm:p-6'>
        {linhas.map(([rotulo, valor]) => (
          <div
            key={rotulo}
            className='flex items-center justify-between gap-4 rounded-[10px] bg-white p-4 sm:px-6'
          >
            <div className='flex items-center gap-4'>

              <div>
                <strong className='block text-base font-bold text-(--azul-titulo)'>
                  {rotulo}
                </strong>
                <span className='text-sm text-(--texto-apoio)'>
                  {formatarMoeda(valor, 2)}
                </span>
              </div>
            </div>
            <button
              type='button'
              onClick={() => aoAbrirVisao('realidade')}
              className='min-h-11 text-sm font-bold text-(--azul-titulo) hover:text-(--laranja-principal)'
            >
              Ajustar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VisaoCustosIniciais({
  custos,
  guardado,
  aoAlterar,
  aoAbrirVisao,
  aoVoltar,
}) {
  const garantia = analisarNumero(custos.garantia);
  const mudanca = analisarNumero(custos.mudanca);
  const moveis = analisarNumero(custos.moveis);
  const primeiraCompra = analisarNumero(custos.primeiraCompra);
  const total = garantia + mudanca + moveis + primeiraCompra;
  const jaTem = analisarNumero(guardado);
  const falta = Math.max(0, total - jaTem);

  return (
    <div className='space-y-6'>
      <CabecalhoSubpagina
        aoVoltar={aoVoltar}
        rotuloVoltar=" Voltar"
        selo='PLANEJAR SUA INDEPENDÊNCIA'
        titulo='Antes das chaves, os primeiros custos'
        subtitulo='Separe o que você paga uma vez do que se repete todo mês.'
        assinatura=''
      />

      <div className='grid items-start gap-6 lg:grid-cols-[1fr_340px]'>
        <div className='space-y-5 rounded-[12px] bg-(--azul-fundo) p-5 sm:p-7'>
          <div className='grid gap-4 sm:grid-cols-2'>
            {[
              ['garantia', 'Garantia ou caução'],
              ['mudanca', 'Mudança'],
              ['moveis', 'Móveis e eletros essenciais'],
              ['primeiraCompra', 'Primeira compra e utensílios'],
            ].map(([chave, rotulo]) => (
              <CampoFormulario
                key={chave}
                id={`custo-${chave}`}
                rotulo={rotulo}
                value={custos[chave] || ''}
                onChange={e => aoAlterar(chave, e.target.value)}
                classeEntrada='bg-white'
              />
            ))}
          </div>

          <div className='pt-1'>
            <strong className='block text-base font-bold text-(--azul-titulo)'>
              Custo inicial estimado: {formatarMoeda(total, 2)}
            </strong>
            <p className='mt-1 text-sm text-(--texto-apoio)'>
              Com {formatarMoeda(jaTem, 2)} guardados, faltam{' '}
              {formatarMoeda(falta, 2)} para este cenário, sem contar a reserva.
            </p>
          </div>

          <div className='flex flex-wrap gap-3'>
            <Botao
              type='button'
              cor='laranja'
              classe='rounded-full px-7'
              onClick={() => aoAbrirVisao('meta-economia', falta)}
            >
              Planejar economia
            </Botao>
            <Botao
              type='button'
              variante='secundario'
              classe='rounded-full border border-[#dbe5ed] bg-white px-7'
              onClick={() => aoAbrirVisao('comparar-cenarios')}
            >
              Comparar opções
            </Botao>
          </div>
        </div>

        <aside className='space-y-4'>
          <div className='rounded-[12px] bg-(--azul-titulo) p-6 text-white'>
            <p className='text-[11px] font-bold tracking-wider uppercase'>
              PARA PEGAR AS CHAVES
            </p>
            <p className='font-titulo mt-2 text-4xl font-extrabold text-white'>
              {formatarMoeda(total, 0)}
            </p>
            <p className='mt-2 text-sm text-white/85'>
              de custos iniciais no exemplo
            </p>
          </div>

          <div className='space-y-4 rounded-[12px] bg-(--laranja-fundo) p-6'>
            <div>
              <strong className='block text-sm font-bold text-(--azul-titulo)'>
                Já guardado
              </strong>
              <span className='text-sm text-(--texto-apoio)'>
                {formatarMoeda(jaTem, 2)}
              </span>
            </div>
            <div>
              <strong className='block text-sm font-bold text-(--azul-titulo)'>
                Ainda falta
              </strong>
              <span className='text-sm text-(--texto-apoio)'>
                {formatarMoeda(falta, 2)}, sem incluir a reserva.
              </span>
            </div>
            <Botao
              type='button'
              variante='secundario'
              classe='w-full rounded-full bg-white'
              onClick={() => aoAbrirVisao('meta-economia', falta)}
            >
              Planejar esse valor
            </Botao>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function VisaoCompararCenarios({
  realidade,
  aoAplicarCenario,
  aoAbrirVisao,
  aoVoltar,
}) {
  const resumo = resumirRealidade(realidade);
  const aluguelSo = resumo.aluguel || 1000;
  const outros = resumo.custoMensal - resumo.aluguel || 1200;
  const renda = resumo.renda || 3200;

  const opcoes = [
    {
      id: 'morar-so',
      titulo: 'Morar só',
      aluguel: aluguelSo,
      custo: aluguelSo + outros,
      margem: renda - (aluguelSo + outros),
    },
    {
      id: 'dividir',
      titulo: 'Dividir moradia',
      aluguel: Math.round(aluguelSo * 0.65),
      custo: Math.round(aluguelSo * 0.65) + outros,
      margem: renda - (Math.round(aluguelSo * 0.65) + outros),
    },
  ];

  return (
    <div className='space-y-6'>
      <div className='flex flex-col justify-between gap-6 border-b border-[#e6edf2] pb-8 md:flex-row md:items-center'>
        <div className='space-y-3'>
          <Botao
            type='button'
            onClick={aoVoltar}
            variante='fantasma'
            classe='px-4! min-h-[44px]! border border-[#dbe5ed] text-sm!'
          >
 Voltar
          </Botao>
          <div>
            <span className='inline-block rotate-[1.4deg] bg-(--laranja-principal) px-3 py-1 text-[11px] font-bold tracking-wider text-white uppercase'>
              PLANEJAR SUA INDEPENDÊNCIA
            </span>
          </div>
          <Titulo
            como='h1'
            classe='text-3xl leading-tight font-extrabold sm:text-5xl'
          >
            Dois caminhos, lado a lado
          </Titulo>
          <p className='text-base text-(--texto-apoio) sm:text-lg'>
            Compare estimativas antes de escolher.
          </p>
        </div>
        <div className='hidden sm:block'>
          <EmblemaCarteiraSubpagina />
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        {opcoes.map(item => (
          <section
            key={item.id}
            className='space-y-3 rounded-[12px] bg-(--azul-fundo) p-6 sm:p-7'
          >
            <Titulo classe='text-2xl font-extrabold sm:text-3xl'>
              {item.titulo}
            </Titulo>
            <p className='text-base text-(--texto-apoio)'>
              Aluguel: {formatarMoeda(item.aluguel, 0)}
            </p>
            <p className='text-base text-(--texto-apoio)'>
              Custo mensal: {formatarMoeda(item.custo, 0)}
            </p>
            <p className='text-base font-bold text-(--azul-titulo)'>
              Margem estimada: {formatarMoeda(item.margem, 0)}
            </p>
            <Botao
              type='button'
              cor='laranja'
              classe='mt-2 w-full rounded-full sm:w-auto px-8'
              onClick={() => aoAplicarCenario(item.aluguel)}
            >
              Usar este cenário
            </Botao>
          </section>
        ))}
      </div>

      <div className='rounded-[10px] bg-(--azul-fundo) p-5'>
        <strong className='block text-base font-bold text-(--azul-titulo)'>
          Compare além do preço
        </strong>
        <p className='mt-1 text-sm text-(--texto-apoio)'>
          Considere localização, deslocamento, privacidade e acordos da moradia.
          Valores ilustrativos.
        </p>
      </div>

      <div className='flex flex-wrap gap-3'>
        <Botao
          type='button'
          cor='laranja'
          classe='rounded-full px-7'
          onClick={() => aoAbrirVisao('realidade')}
        >
          Ajustar valores
        </Botao>
        <Botao
          como={Link}
          to='/encontrar-casa'
          variante='secundario'
          classe='rounded-full px-7'
        >
          Encontrar imóveis
        </Botao>
      </div>
    </div>
  );
}

export function VisaoMetaEconomia({
  meta,
  aoAlterar,
  aoSalvarMeta,
  aoVoltar,
}) {
  const falta = analisarNumero(meta.valorFalta);
  const porMes = Math.max(1, analisarNumero(meta.guardarMes));
  const guardado = analisarNumero(meta.jaGuardado);
  const restante = Math.max(0, falta - guardado);
  const meses = restante === 0 ? 0 : Math.ceil(restante / porMes);

  return (
    <div className='space-y-6'>
      <CabecalhoSubpagina
        aoVoltar={aoVoltar}
        rotuloVoltar=" Voltar"
        selo='PLANEJAR SUA INDEPENDÊNCIA'
        titulo='Um pouco por mês, um passo mais perto'
        subtitulo='Defina uma meta possível para os custos iniciais.'
        assinatura=''
      />

      <div className='grid items-start gap-6 lg:grid-cols-[1fr_340px]'>
        <div className='space-y-4 rounded-[12px] bg-(--azul-fundo) p-5 sm:p-7'>
          <CampoFormulario
            id='meta-eco-falta'
            rotulo='Valor que falta'
            value={meta.valorFalta || ''}
            onChange={e => aoAlterar('valorFalta', e.target.value)}
            classeEntrada='bg-white'
          />
          <CampoFormulario
            id='meta-eco-mes'
            rotulo='Quanto guardar por mês'
            value={meta.guardarMes || ''}
            onChange={e => aoAlterar('guardarMes', e.target.value)}
            classeEntrada='bg-white'
          />
          <CampoFormulario
            id='meta-eco-guardado'
            rotulo='Já guardado para esta meta'
            value={meta.jaGuardado || ''}
            onChange={e => aoAlterar('jaGuardado', e.target.value)}
            classeEntrada='bg-white'
          />

          <div className='pt-2'>
            <strong className='block text-base font-bold text-(--azul-titulo)'>
              Prazo estimado: {meses} {meses === 1 ? 'mês' : 'meses'}
            </strong>
            <p className='mt-1 text-sm text-(--texto-apoio)'>
              {formatarMoeda(restante, 0)} ÷ {formatarMoeda(porMes, 0)} por mês.
              Sem rendimento, inflação ou variações de renda.
            </p>
          </div>

          <div className='flex flex-wrap gap-3 pt-1'>
            <Botao
              type='button'
              cor='laranja'
              classe='rounded-full px-7'
              onClick={() => aoSalvarMeta(restante, meses)}
            >
              Salvar meta
            </Botao>
            <Botao
              como={Link}
              to='/calculadoras/reserva-emergencia'
              variante='secundario'
              classe='rounded-full border border-[#dbe5ed] bg-white px-7'
            >
              Calcular reserva
            </Botao>
          </div>
        </div>

        <aside className='space-y-4'>
          <div className='rounded-[12px] bg-(--azul-titulo) p-6 text-white'>
            <p className='text-[11px] font-bold tracking-wider uppercase'>
              UMA META POSSÍVEL
            </p>
            <p className='font-titulo mt-2 text-4xl font-extrabold text-white'>
              {meses} {meses === 1 ? 'mês' : 'meses'}
            </p>
            <p className='mt-2 text-sm text-white/85'>
              guardando {formatarMoeda(porMes, 0)} por mês
            </p>
          </div>

          <div className='space-y-4 rounded-[12px] bg-(--laranja-fundo) p-6'>
            <div>
              <strong className='block text-sm font-bold text-(--azul-titulo)'>
                Ritmo de economia
              </strong>
              <span className='text-sm text-(--texto-apoio)'>
                {formatarMoeda(restante, 0)} ÷ {formatarMoeda(porMes, 0)} ={' '}
                {formatarNumero(meses)} meses
              </span>
            </div>
            <div>
              <strong className='block text-sm font-bold text-(--azul-titulo)'>
                Um plano que pode mudar
              </strong>
              <span className='text-sm text-(--texto-apoio)'>
                Revise o valor mensal se sua renda ou seus custos mudarem.
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function VisaoCustoDeVida({ aoAbrirVisao, aoVoltar }) {
  return (
    <div className='space-y-6'>
      <div className='flex flex-col justify-between gap-6 border-b border-[#e6edf2] pb-8 md:flex-row md:items-center'>
        <div className='space-y-3'>
          <Botao
            type='button'
            onClick={aoVoltar}
            variante='fantasma'
            classe='px-4! min-h-[44px]! border border-[#dbe5ed] text-sm!'
          >
 Voltar
          </Botao>
          <div>
            <span className='inline-block rotate-[1.4deg] bg-(--laranja-principal) px-3 py-1 text-[11px] font-bold tracking-wider text-white uppercase'>
              PLANEJAR SUA INDEPENDÊNCIA
            </span>
          </div>
          <Titulo
            como='h1'
            classe='text-3xl leading-tight font-extrabold sm:text-5xl'
          >
            O mês tem mais que aluguel
          </Titulo>
          <p className='text-base text-(--texto-apoio) sm:text-lg'>
            Uma visão das despesas para começar sua estimativa.
          </p>
        </div>
        <div className='hidden sm:block'>
          <EmblemaCarteiraSubpagina />
        </div>
      </div>

      <div className='space-y-4'>
        <Titulo classe='text-2xl font-extrabold sm:text-3xl'>
          O que considerar
        </Titulo>
        <div className='space-y-3 text-base leading-relaxed text-(--azul-titulo)'>
          <p>
            Moradia: aluguel, condomínio, tributos e eventuais custos de garantia.
          </p>
          <p>
            Serviços: energia, água, gás e internet. Os valores dependem do imóvel,
            da cidade e do consumo.
          </p>
          <p>
            Dia a dia: alimentação, transporte, saúde, limpeza e cuidados pessoais.
          </p>
          <p>
            Imprevistos e objetivos: defina uma margem que você consiga revisar.
          </p>
        </div>
      </div>

      <div className='flex flex-wrap gap-3 pt-2'>
        <Botao
          type='button'
          cor='laranja'
          classe='rounded-full px-7'
          onClick={() => aoAbrirVisao('realidade')}
        >
          Estimar meu custo mensal
        </Botao>
        <Botao
          como={Link}
          to='/calculadoras'
          variante='secundario'
          classe='rounded-full px-7'
        >
          Explorar calculadoras
        </Botao>
      </div>
    </div>
  );
}
