import { Button, Title} from '../components/shared/ui'
import { ArrowRight, BookOpen } from 'lucide-react'
export default function FinancasA() {
  return(
  <>
 <section className='mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-10'>

      <div className='w-full lg:max-w-160'>
  <Title
    as='p'
    variant='pequenoLj'
    className='mb-7'
    style={{
      color: '#102A43',
      fontSize: '12px'
    }}
  >
    ANTES DAS CHAVES · SEU PLANO FINANCEIRO
  </Title>

  <Title
  as='h1'
  variant='normal'
  style={{
    fontSize: 'clamp(36px, 4.5vw, 60px)',
    lineHeight: 1.1,
    letterSpacing: '-0.04em'
  }}
>
  Sua mudança.

  <span className='mt-3 block rotate-3 bg-(--laranja-principal) px-3 py-2 text-white transition-transform duration-500 ease-in-out hover:rotate-0'>
    No seu plano.
  </span>
</Title>

  <p className='mt-6 text-base leading-relaxed text-[#102A43]'>
    Planeje a chegada e as primeiras contas do seu novo canto.
  </p>

  <Button
    type='button'
    color='laranja'
    className='mt-6 gap-6'
  >
    Começar tutorial
    <ArrowRight size={18} />
  </Button>
</div>

    <div className='group relative h-[334px] w-[455px] shrink-0'>
  <div className='absolute left-[18px] top-[35px] h-[150px] w-[286px] origin-top-left translate-y-8 rotate-[8deg] rounded-[14px] bg-[#F4F7FA] outline-[3px] outline-white -outline-offset-3 transition-transform duration-1000 ease-in-out group-hover:-translate-y-12 motion-reduce:transition-none'>
    <div className='absolute left-[29.55px] top-[22.59px] text-[44px] font-extrabold leading-[48px] text-[#102A43]'>
      R$
    </div>

    <div className='absolute left-[123.56px] top-[46.15px] text-[13px] font-bold leading-[18.85px] text-[#102A43]'>
      SEU MÊS
    </div>

    <div className='absolute left-[28.05px] top-[104.07px] h-[3px] w-[226.70px] bg-[#9FB0BF]'></div>

    <div className='absolute left-[25.96px] top-[118.92px] h-[3.5px] w-[144.01px] bg-[#9FB0BF]'></div>
  </div>

  <div className='absolute left-[342px] top-[47px] flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-[#102A43] bg-[#FFD166]'>
    <span className='text-[22px] font-extrabold text-[#102A43]'>
      R$
    </span>
  </div>

  <div className='absolute left-[48px] top-[236px] flex h-[43px] w-[43px] items-center justify-center rounded-full border-[3px] border-[#D54C15] bg-[#FCE8DC]'>
    <span className='text-[22px] font-bold text-[#D54C15]'>
      +
    </span>
  </div>

  <div className='absolute left-[95px] top-[276px] h-[27px] w-[27px] rounded-full border-2 border-[#102A43] bg-[#FFD166]'></div>

  <div className='absolute left-[139px] top-[142px] h-[157px] w-[301px] rounded-[20px] bg-[#D54C15] outline-4 outline-white -outline-offset-4'>
    <div className='absolute left-0 top-[58px] h-[99px] w-[301px] rounded-[18px] border-[3px] border-white bg-[#B64217]'></div>

    <div className='absolute left-[15px] top-[59px] h-[3px] w-[271px] bg-[#FFD166]'></div>

    <div className='absolute left-[191px] top-[83px] flex h-[49px] w-[110px] items-center justify-center rounded-[14px] bg-[#102A43] outline-[3px] outline-white -outline-offset-3'>
      <div className='h-6 w-6 rounded-full border-2 border-white bg-[#D54C15]'></div>
    </div>
  </div>

  <div className='absolute left-[395px] top-[151px] h-1 w-9 origin-top-left rotate-[23deg] rounded-sm bg-[#FFD166]'></div>

  <div className='absolute left-[420px] top-[174px] h-1 w-[25px] origin-top-left rotate-[8deg] rounded-sm bg-[#FFD166]'></div>
</div>
    </section>
    <section className='mx-auto max-w-7xl px-6 py-12 lg:px-10'>
  <Title
    as='p'
    variant='pequenoLj'
    className='mb-2'
  >
    TRÊS PASSOS PRA SAIR DO ZERO
  </Title>

  <Title as='h2' variant='normal'>
    Seu caminho para organizar melhor suas finanças.
  </Title>

  <p className='mt-3 text-base text-[#627D98]'>
    Um passo a passo simples para aprender e aplicar no seu dia.
  </p>

  <div className='relative mt-10'>
    <div
      aria-hidden='true'
      className='absolute top-[38px] right-[16.666%] left-[16.666%] hidden h-0.5 bg-[#D9E2EC] md:block'
    ></div>

    <ol className='relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-0'>
      <li className='flex flex-col items-center gap-3 text-center'>
        <span className='flex h-[76px] w-[76px] items-center justify-center rounded-full border-2 border-(--laranja-principal) bg-[#FCE8DC] text-xl font-bold text-(--laranja-principal)'>
          01
        </span>

        <Title
          as='h3'
          className='text-lg font-bold text-(--azul-titulo)'
        >
          1 · Entenda sua renda
        </Title>
      </li>

      <li className='flex flex-col items-center gap-3 text-center'>
        <span className='flex h-[76px] w-[76px] items-center justify-center rounded-full border-2 border-[#102A43] bg-white text-xl font-bold text-[#102A43]'>
          02
        </span>

        <Title
          as='h3'
          className='text-lg font-bold text-(--azul-titulo)'
        >
          2 · Separe os gastos
        </Title>
      </li>

      <li className='flex flex-col items-center gap-3 text-center'>
        <span className='flex h-[76px] w-[76px] items-center justify-center rounded-full border-2 border-[#102A43] bg-white text-xl font-bold text-[#102A43]'>
          03
        </span>

        <Title
          as='h3'
          className='text-lg font-bold text-(--azul-titulo)'
        >
          3 · Planeje a chegada
        </Title>
      </li>
    </ol>
  </div>
</section>
 <section className='mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-10'>
  <div>
    <Title as='p' variant='pequenoLj' className='mb-2'>
      SEU DINHEIRO EM PERSPECTIVA
    </Title>

    <Title as='h2' variant='normal'>
      Minha mudança.
    </Title>

    <p className='mt-2 text-base text-[#627D98]'>
      Veja o que já separou e os gastos previstos para começar.
    </p>
  </div>

  <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
    <button
      type='button'
      className='flex h-11 items-center justify-center gap-2 rounded-lg border border-[#D9E2EC] bg-white px-7 text-sm font-semibold text-[#102A43]'
    >
      Este mês
      <span aria-hidden='true'>⌄</span>
    </button>

    <Button type='button' color='laranja'>
      + Adicionar lançamento
    </Button>
  </div>
</section>
<section className='mx-auto max-w-7xl px-6 pb-12 lg:px-10'>
  <nav
    aria-label='Seções do planejamento financeiro'
    className='flex gap-6 overflow-x-auto border-b border-[#D9E2EC] sm:gap-10'
  >
    <div className='shrink-0 border-b-[3px] border-(--laranja-principal) pb-3'>
      <Button type='button' variant='link' color='laranja'>
        Visão geral
      </Button>
    </div>

    <button
      type='button'
      className='shrink-0 pb-3 text-sm text-[#627D98]'
    >
      Lançamentos
    </button>

    <button
      type='button'
      className='shrink-0 pb-3 text-sm text-[#627D98]'
    >
      Categorias
    </button>

    <button
      type='button'
      className='shrink-0 pb-3 text-sm text-[#627D98]'
    >
      Metas
    </button>
  </nav>

  <div className='mt-8 grid grid-cols-1 divide-y divide-[#D9E2EC] md:grid-cols-3 md:divide-x md:divide-y-0'>
    <div className='flex items-center gap-4 py-5 md:py-2 md:pr-6'>
      <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E3F3E9] text-2xl font-bold text-[#15803D]'>
        +
      </span>

      <div>
        <p className='text-sm font-semibold text-[#627D98]'>
          Disponível
        </p>

        <Title
          as='h3'
          className='mt-1 text-3xl font-bold text-[#15803D]'
        >
          R$ 2.000,00
        </Title>
      </div>
    </div>

    <div className='flex items-center gap-4 py-5 md:px-6 md:py-2'>
      <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FDE8E8] text-2xl font-bold text-[#B91C1C]'>
        −
      </span>

      <div>
        <p className='text-sm font-semibold text-[#627D98]'>
          Planejado
        </p>

        <Title
          as='h3'
          className='mt-1 text-3xl font-bold text-[#B91C1C]'
        >
          R$ 1.400,00
        </Title>
      </div>
    </div>

    <div className='flex items-center gap-4 py-5 md:py-2 md:pl-6'>
      <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E1F0F6] text-2xl font-bold text-(--azul-titulo)'>
        =
      </span>

      <div>
        <p className='text-sm font-semibold text-[#627D98]'>
          Ainda livre
        </p>

        <Title
          as='h3'
          className='mt-1 text-3xl font-bold text-(--azul-titulo)'
        >
          R$ 600,00
        </Title>
      </div>
    </div>
  </div>
</section>
<section className='mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 pb-12 lg:grid-cols-2 lg:px-10'>

  <div className='rounded-xl bg-[#F4F7FA] p-6'>
    <Title
      as='h3'
      className='text-xl font-bold text-(--azul-titulo)'
    >
      Gastos por categoria
    </Title>

    <div className='mt-7 flex flex-col items-center gap-7 sm:flex-row'>

      <div
        role='img'
        aria-label='Gastos de R$ 1.400: nova moradia 64%, itens da casa 25%, transporte 11%.'
        className='flex h-48 w-48 shrink-0 items-center justify-center rounded-full bg-[conic-gradient(from_90deg,#102A43_0%_64%,#C64411_64%_89%,#3F8395_89%_100%)]'
      >
        <div className='flex h-[136px] w-[136px] flex-col items-center justify-center rounded-full bg-[#F4F7FA]'>
          <Title
            as='p'
            className='text-xl font-bold text-(--azul-titulo)'
          >
            R$ 1.400
          </Title>

          <p className='mt-1 text-xs text-[#627D98]'>
            em gastos
          </p>
        </div>
      </div>

      <ul className='w-full space-y-6 text-xs text-(--azul-titulo)'>
        <li className='flex items-center gap-2'>
          <span className='h-2.5 w-2.5 shrink-0 rounded-full bg-(--azul-titulo)'></span>
          <span className='flex-1'>Nova moradia</span>
          <span className='whitespace-nowrap font-bold'>R$ 900,00</span>
          <span className='w-9 text-right font-bold text-[#627D98]'>
            64%
          </span>
        </li>

        <li className='flex items-center gap-2'>
          <span className='h-2.5 w-2.5 shrink-0 rounded-full bg-(--laranja-principal)'></span>
          <span className='flex-1'>Itens da casa</span>
          <span className='whitespace-nowrap font-bold'>R$ 350,00</span>
          <span className='w-9 text-right font-bold text-[#627D98]'>
            25%
          </span>
        </li>

        <li className='flex items-center gap-2'>
          <span className='h-2.5 w-2.5 shrink-0 rounded-full bg-[#3F8395]'></span>
          <span className='flex-1'>Transporte</span>
          <span className='whitespace-nowrap font-bold'>R$ 150,00</span>
          <span className='w-9 text-right font-bold text-[#627D98]'>
            11%
          </span>
        </li>

        <li className='flex items-center gap-2'>
          <span className='h-2.5 w-2.5 shrink-0 rounded-full bg-[#9FB0BF]'></span>
          <span className='flex-1'>Outros</span>
          <span className='whitespace-nowrap font-bold'>R$ 0,00</span>
          <span className='w-9 text-right font-bold text-[#627D98]'>
            0%
          </span>
        </li>
      </ul>
    </div>
  </div>

  <div className='rounded-xl border border-[#D9E2EC] bg-white p-6'>
    <Title
      as='h3'
      className='text-xl font-bold text-(--azul-titulo)'
    >
      Últimos lançamentos
    </Title>

    <ul className='mt-4 divide-y divide-[#E8EEF3]'>
      <li className='flex items-center gap-3 py-4'>
        <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E3F3E9] font-bold text-[#15803D]'>
          +
        </span>

        <div className='grid flex-1 grid-cols-1 items-center gap-1 text-sm sm:grid-cols-[1fr_60px_120px] sm:gap-3'>
          <p className='font-bold text-(--azul-titulo)'>
            Reserva da mudança
          </p>
          <span className='text-xs text-[#627D98]'>01 abr</span>
          <p className='whitespace-nowrap font-semibold text-[#15803D] sm:text-right'>
            + R$ 2.000,00
          </p>
        </div>
      </li>

      <li className='flex items-center gap-3 py-4'>
        <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FDE8E8] font-bold text-[#B91C1C]'>
          −
        </span>

        <div className='grid flex-1 grid-cols-1 items-center gap-1 text-sm sm:grid-cols-[1fr_60px_120px] sm:gap-3'>
          <p className='font-bold text-(--azul-titulo)'>
            Primeiro aluguel
          </p>
          <span className='text-xs text-[#627D98]'>03 abr</span>
          <p className='whitespace-nowrap font-semibold text-[#B91C1C] sm:text-right'>
            − R$ 900,00
          </p>
        </div>
      </li>

      <li className='flex items-center gap-3 py-4'>
        <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FDE8E8] font-bold text-[#B91C1C]'>
          −
        </span>

        <div className='grid flex-1 grid-cols-1 items-center gap-1 text-sm sm:grid-cols-[1fr_60px_120px] sm:gap-3'>
          <p className='font-bold text-(--azul-titulo)'>
            Kit da casa
          </p>
          <span className='text-xs text-[#627D98]'>05 abr</span>
          <p className='whitespace-nowrap font-semibold text-[#B91C1C] sm:text-right'>
            − R$ 350,00
          </p>
        </div>
      </li>

      <li className='flex items-center gap-3 py-4'>
        <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FDE8E8] font-bold text-[#B91C1C]'>
          −
        </span>

        <div className='grid flex-1 grid-cols-1 items-center gap-1 text-sm sm:grid-cols-[1fr_60px_120px] sm:gap-3'>
          <p className='font-bold text-(--azul-titulo)'>
            Transporte
          </p>
          <span className='text-xs text-[#627D98]'>06 abr</span>
          <p className='whitespace-nowrap font-semibold text-[#B91C1C] sm:text-right'>
            − R$ 150,00
          </p>
        </div>
      </li>
    </ul>
  </div>
</section>
<section className='mx-auto max-w-7xl px-6 pb-12 lg:px-10'>
  <div className='grid grid-cols-1 items-center gap-8 bg-[#EAF1F5] px-6 py-8 lg:grid-cols-[2fr_3fr] lg:px-8'>

    <div className='flex items-center gap-6'>
      <BookOpen
        size={64}
        strokeWidth={1.5}
        aria-hidden='true'
        className='shrink-0 text-(--azul-titulo)'
      />

      <div>
        <Title
          as='p'
          variant='pequenoLj'
          className='mb-2'
        >
          IA · CONCEITO
        </Title>

        <Title
          as='h2'
          className='text-3xl font-bold text-(--azul-titulo)'
        >
          Precisa de uma mão?
        </Title>

        <p className='mt-3 text-sm text-(--azul-titulo)'>
          Tire dúvidas sobre orçamento e categorias.
        </p>
      </div>
    </div>

    <div className='min-w-0'>
      <div className='flex flex-col gap-2'>
        <button
          type='button'
          className='rounded-full border border-[#D9E2EC] bg-white px-4 py-3 text-left text-sm text-(--azul-titulo)'
        >
          Como organizar meus gastos?
        </button>

        <button
          type='button'
          className='rounded-full border border-[#D9E2EC] bg-white px-4 py-3 text-left text-sm text-(--azul-titulo)'
        >
          O que é uma reserva?
        </button>

        <div className='flex items-center gap-2 rounded-full border border-[#D9E2EC] bg-white p-1'>
          <input
            type='text'
            aria-label='Sua dúvida sobre finanças'
            placeholder='Escreva sua dúvida...'
            className='min-w-0 flex-1 rounded-full bg-transparent px-3 py-2 text-sm text-(--azul-titulo) placeholder:text-[#627D98] focus:outline-2 focus:outline-(--azul-principal)'
          />

          <Button
            type='button'
            color='laranja'
            aria-label='Enviar dúvida'
            className='h-9 w-9 shrink-0 p-0!'
          >
            <ArrowRight size={18} aria-hidden='true' />
          </Button>
        </div>
      </div>

      <p className='mt-3 text-xs leading-relaxed text-[#627D98]'>
        Orientações educativas. Sem recomendações de investimento
        ou acesso a dados bancários.
      </p>
    </div>

  </div>
</section>
</>
  )
}

 
  

