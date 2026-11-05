// Shared Tailwind utilities for the feature's fields, dialogs and page views.
// Full class names stay literal so Tailwind can discover every responsive state.
const classes = {
  scope:
    'group/routine [--routine-orange:#e03b00] [--routine-muted:#5d6f7f] [--routine-soft:#fff2e8] [--routine-neutral:#f6f8f9] [--routine-border:#dae3ea] [--laranja-principal:var(--routine-orange)] font-body text-(--azul-titulo) leading-[1.4] wrap-anywhere [font-optical-sizing:none] [font-variation-settings:"opsz"_14] [&_:is(button,summary)]:cursor-pointer [&_button:disabled]:cursor-default [&_button:disabled]:opacity-50 [&_input[type=checkbox]]:accent-(--routine-orange) [&_:is(input,select)[aria-invalid=true]]:border-[#ba2828] [&_:is(button,a,input,select,textarea,summary):focus-visible]:outline-2 [&_:is(button,a,input,select,textarea,summary):focus-visible]:outline-offset-4 [&_:is(button,a,input,select,textarea,summary):focus-visible]:outline-(--azul-principal) motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:transition-none',
  page: 'min-w-0 flex-1 bg-white',
  fitPage:
    'h-(--routine-available-height) min-h-0 flex-none [container:routine-viewport/size]',
  container:
    'pt-[clamp(1rem,2.223vw,2rem)] pb-10 group-data-[fit=true]/routine:h-full group-data-[fit=true]/routine:min-h-0 group-data-[fit=true]/routine:py-[clamp(0.5rem,2cqh,1.5rem)]',
  viewPanel: 'min-h-0 group-data-[fit=true]/routine:h-full [&[hidden]]:hidden',
  modalPanel: '[&[hidden]]:hidden',
  srOnly: 'sr-only',
  headingCopy:
    'flex min-w-0 flex-1 flex-col items-start gap-3 group-data-[fit=true]/routine:gap-2 group-data-[view=workspace]/routine:gap-1.5 group-data-[view=modal]/routine:gap-2',
  headingRow:
    'flex min-w-0 items-center justify-between gap-8 max-md:flex-wrap group-data-[view=workspace]/routine:gap-4 group-data-[view=modal]/routine:gap-4',
  ribbon:
    'inline-block max-w-full rotate-[1.4deg] bg-(--routine-orange) px-3 py-1.5 text-xs leading-normal font-bold text-white [@container_routine-viewport_(height<400px)]:group-data-[view=overview]/routine:hidden group-data-[view=modal]/routine:px-2 group-data-[view=modal]/routine:py-1 group-data-[view=modal]/routine:text-[0.625rem]',
  editorialRibbon: 'mb-1.5 px-4.5 py-2.25 tracking-[0.045rem]',
  icon: 'inline-flex size-8 shrink-0 items-center justify-center [&_img]:block [&_img]:max-h-full [&_img]:max-w-full [&_img]:shrink-0',
  button:
    'group-data-[view=modal]/routine:px-3 group-data-[view=modal]/routine:text-[0.8125rem] min-h-11 max-w-full gap-2 rounded-4xl border border-transparent px-4 py-2.5 text-sm leading-[1.35] font-bold text-center hover:enabled:opacity-85 group-data-[view=overview]/routine:py-2',
  primary: 'bg-(--routine-orange) text-white',
  secondary: 'border-[#dbe5ed] bg-(--azul-fundo) text-(--azul-titulo)',
  ghost: 'bg-white text-(--azul-titulo)',
  outline: 'border-(--routine-orange) bg-white text-(--routine-orange)',
  smallButton: 'min-h-11 py-2.5 text-sm',
  textAction:
    'inline-flex min-h-11 items-center gap-1 text-[0.8125rem] font-bold text-(--routine-orange) hover:underline',
  muted:
    'text-base text-(--routine-muted) group-data-[view=modal]/routine:text-sm [@container_routine-viewport_(width<768px)]:group-data-[view=workspace]/routine:hidden [@container_routine-viewport_(height<650px)]:group-data-[view=workspace]/routine:hidden',
  smallNote: 'text-[0.8125rem] leading-normal text-(--routine-muted)',

  // The overview shares the viewport, leaving a measured slot for task previews.
  overview:
    'grid h-full min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] gap-[clamp(0.75rem,2.5cqh,1.5rem)] [@container_routine-viewport_(height<650px)]:gap-3',
  intro:
    'flex min-h-0 items-center gap-5 [@container_routine-viewport_(width<768px)]:gap-2',
  welcomeTitle:
    'text-[clamp(1.5rem,4.5cqh,3.5rem)] leading-tight font-extrabold tracking-[-0.035em] [@container_routine-viewport_(width<768px)]:text-[clamp(1.375rem,5.5cqw,2rem)]',
  introDescription:
    'text-base text-(--routine-muted) [@container_routine-viewport_(width<768px)]:text-sm [@container_routine-viewport_(height<650px)]:hidden',
  checklist:
    'h-auto w-[clamp(4rem,18cqh,12rem)] shrink-0 [@container_routine-viewport_(width<768px)]:w-16 [@container_routine-viewport_(height<400px)]:hidden',
  quickActions:
    'grid grid-cols-5 gap-3 [@container_routine-viewport_(width<768px)_and_(height>=400px)]:grid-cols-3 [@container_routine-viewport_(width<768px)]:gap-2',
  quickAction:
    'flex min-h-11 min-w-0 items-center gap-2.5 rounded-xl bg-(--routine-soft) p-[clamp(0.5rem,1.75cqh,1rem)] text-left text-[clamp(0.875rem,2cqh,1.125rem)] font-bold transition-colors hover:bg-(--laranja-fundo) [@container_routine-viewport_(width<768px)]:justify-center [@container_routine-viewport_(width<768px)]:gap-1 [@container_routine-viewport_(width<768px)]:px-1 [@container_routine-viewport_(width<768px)]:py-2 [@container_routine-viewport_(width<768px)]:text-xs [@container_routine-viewport_(width<768px)_and_(height>=650px)]:flex-col [@container_routine-viewport_(width<768px)_and_(height>=400px)]:nth-4:col-start-2 [@container_routine-viewport_(width<768px)]:[&_span[aria-hidden]]:size-5 [@container_routine-viewport_(width<768px)]:[&_span[aria-hidden]]:basis-5 [@container_routine-viewport_(height<400px)]:text-xs [@container_routine-viewport_(height<400px)]:[&_span[aria-hidden]]:hidden',
  overviewCards:
    'grid min-h-0 grid-cols-2 gap-5 [@container_routine-viewport_(width<768px)_and_(height>=400px)]:grid-cols-1 [@container_routine-viewport_(width<768px)_and_(height>=400px)]:grid-rows-[minmax(0,1fr)_auto] [@container_routine-viewport_(width<768px)]:gap-3',
  upcoming:
    'flex min-h-0 min-w-0 flex-col rounded-2xl bg-[#f5f7fa] p-[clamp(0.75rem,2cqh,1.125rem)]',
  cardHeading:
    'mb-2 flex min-h-8 shrink-0 flex-wrap items-center justify-between gap-x-4 [@container_routine-viewport_(width<768px)_and_(height<650px)]:mb-0',
  cardTitle:
    'text-[1.375rem] leading-[1.4] font-extrabold [@container_routine-viewport_(width<768px)]:text-lg [@container_routine-viewport_(height<400px)]:text-base',
  upcomingRows: 'flex min-h-0 flex-1 flex-col gap-2',
  upcomingEmpty: 'flex min-h-0 flex-col justify-center gap-1',
  aiCard:
    'grid min-h-0 min-w-0 grid-cols-[minmax(0,1fr)_clamp(4rem,13cqh,10rem)] items-center gap-2 rounded-2xl bg-(--routine-soft) p-[clamp(0.75rem,2.5cqh,1.5rem)] [@container_routine-viewport_(width<768px)_and_(height>=650px)]:grid-cols-[minmax(0,1fr)_4rem] [@container_routine-viewport_(width<768px)_and_(height<650px)]:grid-cols-1 [@container_routine-viewport_(height<400px)]:grid-cols-1',
  aiCardCopy:
    'flex min-w-0 flex-col items-start gap-[clamp(0.5rem,1.5cqh,1rem)] [&>p]:text-[clamp(0.875rem,2.5cqh,1.25rem)] [&>p]:text-(--routine-muted) [&>span]:text-xs [@container_routine-viewport_(width<768px)]:[&>p]:hidden [@container_routine-viewport_(width<768px)]:[&>span]:hidden [@container_routine-viewport_(height<650px)]:[&>p]:hidden [@container_routine-viewport_(height<400px)]:[&>span]:hidden',
  aiCardTitle:
    'text-[clamp(1.375rem,4cqh,2.625rem)] leading-tight font-extrabold tracking-[-0.02em] [@container_routine-viewport_(width<768px)_and_(height>=650px)]:text-xl [@container_routine-viewport_(width<768px)_and_(height<650px)]:text-lg [@container_routine-viewport_(height<400px)]:text-lg [@container_routine-viewport_(width<768px)]:[&_br]:hidden',
  robot:
    'h-auto w-full [@container_routine-viewport_(width<768px)_and_(height<650px)]:hidden [@container_routine-viewport_(height<400px)]:hidden',

  taskRow:
    'relative flex min-w-0 items-center gap-3.5 border-b border-[#dee5ed] bg-white px-3 py-6 max-md:flex-wrap max-md:gap-2.5',
  taskRow_upcoming:
    'group/preview h-12 min-h-12 shrink-0 flex-nowrap! gap-2.5! rounded-xl border-0! px-2.5 py-1! [&_[title]>strong]:truncate [&_[title]>strong]:text-sm [&_[title]>strong]:leading-5 [&_[title]>strong]:font-bold [&_button>span]:text-xs [&_button>span]:leading-4 [&_button[title]]:gap-0.5 [&_span[data-category]]:m-0 [&_span[data-category]]:min-h-5 [&_span[data-category]]:min-w-0 [&_span[data-category]]:text-xs [@container_routine-viewport_(width<1024px)]:[&_span[data-category]]:hidden [@container_routine-viewport_(height<650px)]:[&_span[data-task-icon]]:hidden',
  taskRow_history:
    'max-md:[&_button[title]]:basis-[calc(100%-5rem)] max-md:[&_span[data-category]]:ml-18.5',
  taskRow_day:
    'px-0 [&_strong]:text-lg [&_button>span]:text-base [&_span[data-category]]:min-w-19 [&_span[data-category]]:text-sm',
  taskCheckbox:
    'relative grid size-5.5 shrink-0 place-items-center rounded-full border border-[#96a9b9] bg-white before:absolute before:size-11',
  taskChecked: 'border-[#2a9157]! bg-[#2a9157]! text-white',
  taskIcon: 'shrink-0',
  taskCopy:
    'flex min-w-0 flex-1 flex-col items-start gap-1 text-left [&>strong]:max-w-full [&>strong]:text-[1.375rem] [&>strong]:leading-[1.35] [&>strong]:font-bold [&>span]:text-xl [&>span]:text-(--routine-muted) hover:[&>strong]:underline hover:[&>strong]:underline-offset-[0.2em] max-md:[&>strong]:text-lg max-md:[&>span]:text-base',
  taskTime:
    'min-w-22 text-lg text-(--routine-muted) max-md:ml-18.5 max-md:min-w-0 max-md:text-base',
  categoryPill:
    'inline-flex min-h-10 min-w-25 shrink-0 items-center justify-center rounded-[0.9375rem] px-3.5 py-1.5 text-lg font-bold max-md:min-w-0 max-md:text-sm',
  casa: 'bg-[#e6f1f7] text-[#2381c1]',
  cozinha: 'bg-(--routine-soft) text-(--routine-orange)',
  pessoal: 'bg-[#dbf2e7] text-[#2381c1]',
  financas: 'bg-[#f0e7fa] text-[#8426d2]',
  neutralPill: 'bg-(--routine-soft) text-(--routine-orange)',
  taskMenu:
    'relative shrink-0 [&_summary]:grid [&_summary]:size-11 [&_summary]:list-none [&_summary]:place-items-center [&_summary]:rounded-full [&_summary]:text-[#96a9b9] [&_summary::-webkit-details-marker]:hidden [&_summary:hover]:bg-(--azul-fundo)',
  menuItems:
    'absolute end-0 top-[calc(100%+0.25rem)] z-5 flex w-50 flex-col rounded-xl border border-(--routine-border) bg-white p-1.5 shadow-[0_0.5rem_2rem_#102a431a] [&_button]:min-h-11 [&_button]:rounded-md [&_button]:px-3 [&_button]:py-2 [&_button]:text-left [&_button]:text-[0.9375rem] [&_button:hover]:bg-(--azul-fundo) [&_button:last-child]:text-[#b32c16]',

  pageHeading: 'mb-11 flex flex-col gap-8 max-md:mb-6 max-md:gap-5',
  backButton:
    'inline-flex min-h-11 items-center gap-2 self-start text-base hover:text-(--routine-orange) group-data-[view=workspace]/routine:min-h-8 group-data-[view=workspace]/routine:shrink-0',
  pageTitle:
    'text-[clamp(2rem,4.167vw,3.75rem)] leading-[1.15] font-extrabold tracking-[-0.035em]',
  pageDescription:
    'text-[clamp(1rem,1.806vw,1.625rem)] leading-[1.4] text-(--routine-muted)',
  categoryFilters:
    'mb-10 grid grid-cols-5 gap-1.5 [&>button]:min-h-19.5 [&>button]:min-w-0 [&>button]:rounded-[1.25rem] [&>button]:border [&>button]:border-[#d9e5f0] [&>button]:px-2 [&>button]:py-3 [&>button]:text-xl [&>button]:font-bold [&>button:hover]:bg-(--routine-soft) max-md:[&>button]:min-h-13 max-md:[&>button]:text-base max-[480px]:grid-cols-3 max-[480px]:[&>button]:min-h-11 max-[480px]:[&>button]:text-sm',
  activeFilter:
    'border-(--routine-orange)! bg-(--routine-soft) text-(--routine-orange)',
  taskGroups: 'grid gap-14 max-md:gap-8',
  dateGroupHeading:
    'mb-2.5 rounded-[0.625rem] bg-(--routine-neutral) px-2.5 py-3 text-[0.8125rem] font-bold',
  loadMore: 'mx-auto mt-8 flex',
  periodSelect:
    'min-h-11 min-w-40 max-w-full rounded-xl border border-[#d9e5f0] bg-white px-4 py-2',
  statistics:
    'mt-8 mb-18 grid grid-cols-3 gap-4 max-md:mt-6 max-md:mb-10 max-md:gap-2.5 max-[480px]:grid-cols-1',
  statistic:
    'flex min-h-33 min-w-0 items-center gap-3.5 rounded-[0.875rem] bg-(--routine-neutral) p-4.5 [&>div]:min-w-0 [&_dt]:text-[clamp(0.9375rem,1.528vw,1.375rem)] [&_dt]:text-(--routine-muted) [&_dd]:font-heading [&_dd]:text-[2.625rem] [&_dd]:leading-tight [&_dd]:font-extrabold max-md:flex-col max-md:items-start max-md:p-4 max-md:[&_dd]:text-[2rem] max-[480px]:min-h-24 max-[480px]:flex-row max-[480px]:items-center',
  statisticIcon:
    'grid size-11 shrink-0 place-items-center rounded-full bg-white',
  completedSection: '[&>h2]:mb-9 max-md:[&>h2]:mb-4',
  completedTasks:
    'rounded-[0.875rem] border border-(--routine-border) [&>article:first-child]:rounded-t-[0.875rem] [&>article:last-child]:rounded-b-[0.875rem] [&>article:last-child]:border-b-0',

  // Month cells remain keyboard accessible while their tracks absorb height changes.
  calendarView:
    'flex h-full min-w-0 flex-col [@media(width>=600px)_and_(height<500px)]:grid [@media(width>=600px)_and_(height<500px)]:grid-cols-[minmax(0,1fr)_auto] [@media(width>=600px)_and_(height<500px)]:grid-rows-[2.5rem_minmax(0,1fr)_1.75rem] [@media(width>=600px)_and_(height<500px)]:gap-x-4 [@media(width>=600px)_and_(height<500px)]:gap-y-1.5',
  compactHeading:
    'relative mb-3 shrink-0 gap-2 [&_h1]:text-[clamp(2rem,3.889vw,3.5rem)] max-md:[&_h1]:text-[1.75rem] [@media(height<760px)]:mb-2 [@media(height<760px)]:[&>button]:absolute [@media(height<760px)]:[&>button]:right-0 [@media(height<760px)]:[&>button]:top-0 [@media(height<760px)]:[&>button]:min-h-9 [@media(height<760px)]:[&>button]:text-xs [@media(height<760px)]:[&>div>div]:pr-26 [@media(height<760px)]:[&_p]:hidden [@media(width>=600px)_and_(height<500px)]:m-0 [@media(width>=600px)_and_(height<500px)]:flex-row [@media(width>=600px)_and_(height<500px)]:items-center [@media(width>=600px)_and_(height<500px)]:[&>button]:static [@media(width>=600px)_and_(height<500px)]:[&>button]:min-h-8 [@media(width>=600px)_and_(height<500px)]:[&>button>span]:hidden [@media(width>=600px)_and_(height<500px)]:[&>div>div]:p-0 [@media(width>=600px)_and_(height<500px)]:[&_h1]:text-2xl',
  calendarToolbar:
    'mb-3 flex shrink-0 flex-wrap items-center justify-end gap-2 max-[480px]:[&>button:first-child]:mr-auto [@media(height<760px)]:mb-2 [@media(height<760px)]:flex-nowrap [@media(height<760px)]:gap-1 [@media(height<760px)]:[&>button:first-child]:mr-0 [@media(width>=600px)_and_(height<500px)]:m-0',
  calendarControl:
    'inline-flex min-h-11 min-w-11 items-center justify-center gap-3 rounded-xl border border-[#d9e5f0] bg-white px-3 py-1.5 text-base hover:bg-(--azul-fundo) [@media(height<760px)]:min-h-10 [@media(height<760px)]:min-w-9 [@media(height<760px)]:gap-1 [@media(height<760px)]:px-2 [@media(height<760px)]:text-xs [@media(width>=600px)_and_(height<500px)]:min-h-9',
  monthControl:
    'min-w-48 justify-between max-[480px]:order-first max-[480px]:basis-full max-[480px]:min-w-0 [@media(height<760px)]:order-none [@media(height<760px)]:min-w-0 [@media(height<760px)]:flex-1 [@media(height<760px)]:basis-auto [@media(width>=600px)_and_(height<500px)]:min-w-40',
  monthGrid:
    'grid min-h-44 flex-1 grid-rows-[1.5rem_repeat(var(--calendar-weeks),minmax(0,1fr))] [@media(width>=600px)_and_(height<500px)]:col-span-full [@media(width>=600px)_and_(height<500px)]:min-h-0 [@media(width>=600px)_and_(height<500px)]:grid-rows-[1.25rem_repeat(var(--calendar-weeks),minmax(0,1fr))]',
  weekdayRow:
    'grid min-h-0 grid-cols-7 items-start text-center text-sm max-md:text-xs [@media(width>=600px)_and_(height<500px)]:text-[0.625rem]',
  calendarWeek: 'grid min-h-0 grid-cols-7',
  calendarDay:
    'flex min-h-0 min-w-0 flex-col items-center gap-1 rounded-[0.625rem] border border-[#f0f5f7] px-1 py-1.5 hover:bg-[#f7f9fb] [@media(height<760px)]:gap-0.25 [@media(height<760px)]:py-0 [@media(width>=600px)_and_(height<500px)]:gap-0.25',
  outsideDay: 'text-[#b2bfcc]',
  today:
    'border-(--routine-orange) [&>span:first-child]:bg-(--routine-orange) [&>span:first-child]:text-white',
  dayNumber:
    'grid size-10 shrink-0 place-items-center rounded-full text-2xl leading-none max-md:size-8 max-md:text-lg [@media(height<760px)]:size-5 [@media(height<760px)]:text-sm [@media(width>=600px)_and_(height<500px)]:size-4.5 [@media(width>=600px)_and_(height<500px)]:text-xs',
  dayMarkers:
    'flex min-h-3.5 flex-wrap justify-center gap-1.5 max-md:[&_img]:size-2 [@media(height<760px)]:min-h-1 [@media(height<760px)]:gap-0.75 [@media(height<760px)]:[&_img]:size-1',
  categoryDot: 'block size-3.5 shrink-0',
  calendarFooter:
    'mt-3 flex min-w-0 shrink-0 items-center justify-between gap-4 max-md:flex-col max-md:items-start max-md:gap-1 max-md:[&>button]:min-h-8 max-md:[&>button]:self-end [@media(height<760px)]:mt-2 [@media(width>=600px)_and_(height<500px)]:col-span-full [@media(width>=600px)_and_(height<500px)]:m-0 [@media(width>=600px)_and_(height<500px)]:flex-row [@media(width>=600px)_and_(height<500px)]:items-center [@media(width>=600px)_and_(height<500px)]:[&>button]:min-h-7 [@media(width>=600px)_and_(height<500px)]:[&>button]:text-[0.6875rem]',
  calendarLegend:
    'flex max-w-208 flex-1 flex-wrap justify-between gap-3 [&>span]:inline-flex [&>span]:items-center [&>span]:gap-2 max-md:w-full max-md:gap-2 max-md:text-[0.8125rem] max-md:[&_img]:size-2.5 max-[480px]:grid max-[480px]:grid-cols-4 max-[480px]:[&>span]:gap-0.75 max-[480px]:[&>span]:text-[0.6875rem] [@media(width>=600px)_and_(height<500px)]:max-w-[70%] [@media(width>=600px)_and_(height<500px)]:text-[0.6875rem] [@media(width>=600px)_and_(height<500px)]:[&_img]:size-2',

  // Dialog content and workspace pages reuse the same primitives and focus rules.
  modal:
    'fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-180 max-h-[calc(100dvh-1rem)] overflow-hidden overscroll-contain rounded-xl border border-[#dbe5ed] bg-white p-0 shadow-[0_1.5rem_5rem_#102a4333] backdrop:bg-[#102a4373] backdrop:backdrop-blur-[3px] open:flex open:flex-col max-[480px]:w-[calc(100%-1.5rem)]',
  wideModal: 'max-w-260',
  modalChrome:
    'relative flex min-w-0 shrink-0 basis-11 items-center bg-white px-4',
  modalScroll:
    'min-h-0 overflow-y-auto overscroll-contain px-4 pb-4 min-[1024px]:px-8 min-[1024px]:pb-8',
  modalBack:
    'inline-flex min-h-11 items-center text-sm font-bold hover:text-(--routine-orange)',
  closeButton:
    'absolute top-0 right-2 z-2 grid size-11 place-items-center rounded-full text-(--azul-titulo) hover:bg-(--azul-fundo)',
  modalContent:
    'group-data-[view=modal]/routine:gap-2.5 flex min-w-0 flex-col items-stretch gap-3 [&>button]:self-start group-data-[view=workspace]/routine:min-h-0 group-data-[view=workspace]/routine:flex-1 group-data-[view=workspace]/routine:gap-[clamp(0.5rem,1.5cqh,1rem)] [@container_routine-viewport_(height<400px)]:group-data-[view=workspace]/routine:gap-1.5',
  modalTitle:
    'max-[1024px]:group-data-[view=modal]/routine:text-[1.375rem] [@media(height<750px)]:group-data-[view=modal]/routine:text-[1.375rem] text-[clamp(1.375rem,3vw,2.5rem)] leading-[1.15] font-extrabold tracking-[-0.025em] outline-none group-data-[view=workspace]/routine:text-[clamp(1.5rem,4cqh,2.75rem)] [@container_routine-viewport_(height<400px)]:group-data-[view=workspace]/routine:text-xl',
  notice:
    'flex min-w-0 flex-col gap-1 rounded-xl bg-(--azul-fundo) p-3 [&>strong]:text-base [&>p]:text-sm [&>p]:text-(--routine-muted) group-data-[view=workspace]/routine:px-3.5 group-data-[view=workspace]/routine:py-2.5 group-data-[view=workspace]/routine:[&>p]:text-[0.8125rem] [@container_routine-viewport_(height<400px)]:group-data-[view=workspace]/routine:py-1.5',
  errorNotice:
    'border border-[#efc5bf] bg-[#fff5f3] [&_strong]:text-[#a72c1d] [&_p]:text-[#a72c1d]',
  actions: 'flex flex-wrap items-center gap-2 [&>button]:flex-auto',
  detailActions:
    'grid grid-cols-2 [@media(width>=600px)_and_(height<500px)]:flex [@media(width>=600px)_and_(height<500px)]:flex-nowrap [@media(width>=600px)_and_(height<500px)]:[&>button]:flex-1',
  emptyState: 'flex min-w-0 flex-col gap-6 py-4',
  signature:
    'relative h-45 w-52 shrink-0 basis-52 max-md:[zoom:0.65] max-[480px]:hidden group-data-[fit=true]/routine:hidden group-data-[view=modal]/routine:max-[1024px]:hidden [@media(height<750px)]:group-data-[view=modal]/routine:hidden',
  signaturePaper:
    'absolute top-3 left-10.5 h-29 w-35 -rotate-7 rounded-xl bg-(--laranja-fundo)',
  signatureChecklist: 'absolute top-2 left-7 rotate-5',
  signatureNote:
    'absolute top-35.5 left-[2.03rem] rotate-3 bg-(--azul-titulo) px-3.5 py-2 text-[0.625rem] font-bold whitespace-nowrap text-white',
  signatureRays: 'absolute top-3 left-40',
  workspace:
    'relative flex h-full min-h-0 min-w-0 flex-col gap-3 [@container_routine-viewport_(height<400px)]:gap-1.5',

  creationModes:
    'grid shrink-0 grid-cols-2 gap-2 [&>button]:min-h-11 [&>button]:rounded-[0.625rem] [&>button]:bg-(--routine-neutral) [&>button]:p-2 [&>button]:text-base [&>button]:font-bold [&>button[aria-pressed=true]]:border [&>button[aria-pressed=true]]:border-(--routine-orange) [&>button[aria-pressed=true]]:bg-(--routine-soft) [&>button[aria-pressed=true]]:text-(--routine-orange) [@container_routine-viewport_(height<400px)]:absolute [@container_routine-viewport_(height<400px)]:top-0 [@container_routine-viewport_(height<400px)]:right-0 [@container_routine-viewport_(height<400px)]:w-48 [@container_routine-viewport_(height<400px)]:[&>button]:min-h-8 [@container_routine-viewport_(height<400px)]:[&>button]:py-1 [@container_routine-viewport_(height<400px)]:[&>button]:text-sm [&[hidden]]:hidden',
  taskForm: 'flex min-h-0 flex-1 flex-col justify-between gap-3',
  formPanel:
    'data-[stepped=true]:flex data-[stepped=true]:flex-col grid min-w-0 grid-cols-2 gap-x-5 gap-y-3 rounded-2xl border border-(--routine-border) bg-(--routine-neutral) p-[clamp(0.75rem,2cqh,1.25rem)] group-data-[view=modal]/routine:flex group-data-[view=modal]/routine:flex-col group-data-[view=modal]/routine:border-0 group-data-[view=modal]/routine:p-3 [@container_routine-viewport_(height<400px)]:group-data-[view=workspace]/routine:p-2',
  formField: 'flex min-w-0 flex-col gap-1!',
  fieldWrap: 'flex min-w-0 flex-col gap-1',
  fieldLabel:
    'text-[0.9375rem] leading-[1.4] font-bold text-(--azul-titulo) group-data-[view=modal]/routine:text-sm',
  input:
    'h-11! min-h-11 min-w-0 w-full max-w-full rounded-lg border border-(--routine-border) bg-white px-3! py-2 text-base leading-6 text-(--azul-titulo) placeholder:text-(--routine-muted) group-data-[view=modal]/routine:text-sm [&::-webkit-calendar-picker-indicator]:cursor-pointer',
  textarea:
    'h-15 min-h-15 w-full min-w-0 resize-none rounded-lg border border-(--routine-border) bg-white px-3 py-2 text-base leading-6 text-(--azul-titulo) placeholder:text-(--routine-muted) [@container_routine-viewport_(height<400px)]:h-11 [@container_routine-viewport_(height<400px)]:min-h-11',
  fieldError: 'text-[0.8125rem] text-[#b32c16]',
  relatedFields:
    'grid min-w-0 grid-cols-2 gap-3 group-data-[view=modal]/routine:gap-2',
  formActions:
    'flex shrink-0 flex-nowrap justify-between gap-2 [&>button]:flex-[0_1_auto] [&>button]:whitespace-nowrap',
  formNotes: 'col-span-full',
  formStep:
    'contents data-[stepped=true]:grid data-[stepped=true]:grid-cols-1 data-[stepped=true]:gap-3 [@container_routine-viewport_(height<400px)]:data-[stepped=true]:grid-cols-2 [@container_routine-viewport_(height<400px)]:data-[stepped=true]:gap-2 [@container_routine-viewport_(height<400px)]:data-[stepped=true]:data-[step=2]:grid-cols-3 [@container_routine-viewport_(height<400px)]:[&>div[data-notes]]:col-auto [&[hidden]]:hidden',
  formSteps:
    'flex shrink-0 gap-1.5 [&>button]:flex [&>button]:min-h-11 [&>button]:min-w-0 [&>button]:flex-1 [&>button]:items-center [&>button]:justify-center [&>button]:gap-1.5 [&>button]:border-b-2 [&>button]:border-(--routine-border) [&>button]:text-xs [&>button]:font-bold [&>button[aria-current=step]]:border-(--routine-orange) [&>button[aria-current=step]]:text-(--routine-orange) [&_span]:grid [&_span]:size-5 [&_span]:shrink-0 [&_span]:place-items-center [&_span]:rounded-full [&_span]:bg-(--routine-soft) [@container_routine-viewport_(height<400px)]:[&>button]:min-h-8',
  weekdayField:
    'm-0 flex min-w-0 flex-col gap-1 border-0 p-0 [&_legend]:mb-1 [&_legend]:p-0',
  weekdayChoices:
    'grid grid-cols-7 gap-1 [&_label]:relative [&_label]:flex [&_label]:cursor-pointer [&_label]:items-center [&_label]:justify-center [&_input]:absolute [&_input]:size-full [&_input]:cursor-pointer [&_input]:opacity-0 [&_span]:grid [&_span]:min-h-11 [&_span]:w-full [&_span]:place-items-center [&_span]:rounded-lg [&_span]:border [&_span]:border-(--routine-border) [&_span]:bg-white [&_span]:text-[0.6875rem] [&_input:checked+span]:border-(--routine-orange) [&_input:checked+span]:bg-(--routine-soft) [&_input:checked+span]:font-bold [&_input:checked+span]:text-(--routine-orange) [&_input:focus-visible+span]:outline-2 [&_input:focus-visible+span]:outline-offset-2 [&_input:focus-visible+span]:outline-(--azul-principal)',
  settingsWorkspace:
    'grid grid-cols-1 items-start gap-6 [@media(width>=1024px)_and_(height>=750px)]:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] [@media(width>=600px)_and_(height<500px)]:[&_form]:grid! [@media(width>=600px)_and_(height<500px)]:[&_form]:grid-cols-3 [@media(width>=600px)_and_(height<500px)]:[&_form>div[data-related]]:col-span-2 [@media(width>=600px)_and_(height<500px)]:[&_form>div[data-actions]]:col-span-full [@media(width>=600px)_and_(height<500px)]:[&_form>p]:col-span-full',
  contextPanel:
    'flex min-w-0 flex-col gap-5 rounded-lg bg-(--laranja-fundo) p-6 text-base max-[1024px]:hidden [@media(height<750px)]:hidden [&_h3]:font-heading [&_h3]:text-3xl [&_h3]:leading-tight [&_h3]:font-extrabold [&_hr]:w-full [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-[#102a431f] [&_button]:w-full',
  eyebrow: 'text-xs font-bold',

  assistantPrompt:
    'flex min-h-0 flex-1 flex-col items-center justify-center gap-[clamp(0.5rem,2cqh,1.25rem)] rounded-[1.25rem] bg-(--routine-soft) p-[clamp(0.75rem,2cqh,1.5rem)] text-center [&_h3]:text-[clamp(1.25rem,3.5cqh,2.25rem)] [&_h3]:leading-tight [&_h3]:font-extrabold [&>p]:max-w-180 [&>p]:text-base [&>p]:text-(--routine-muted) [@container_routine-viewport_(height<650px)]:[&>p]:hidden [@container_routine-viewport_(width<768px)_and_(height<650px)]:flex-none [@container_routine-viewport_(height<400px)]:gap-1.5 [@container_routine-viewport_(height<400px)]:p-2',
  assistantRobot:
    'h-auto w-[clamp(2.5rem,10cqh,6rem)] [@container_routine-viewport_(width<768px)_and_(height<650px)]:hidden [@container_routine-viewport_(height<400px)]:hidden',
  promptForm:
    'flex w-full min-w-0 items-center gap-2.5 rounded-4xl border border-(--routine-border) bg-white p-1.75 pl-4.5 [&_input]:min-h-11 [&_input]:min-w-0 [&_input]:flex-1 [&_input]:border-0 [&_input]:text-[0.9375rem] [&_button]:grid [&_button]:size-11 [&_button]:shrink-0 [&_button]:place-items-center [&_button]:rounded-full [&_button]:bg-(--routine-orange) [&_button]:text-2xl [&_button]:font-bold [&_button]:text-white',
  exampleLabel: 'text-center text-sm font-bold',
  suggestionExamples:
    'grid grid-cols-3 gap-2.5 [&>button]:flex [&>button]:min-h-11 [&>button]:min-w-0 [&>button]:items-center [&>button]:justify-center [&>button]:gap-2 [&>button]:rounded-[0.875rem] [&>button]:bg-(--routine-soft) [&>button]:p-3 [&>button]:text-center [&>button]:text-sm [&>button:hover]:bg-(--laranja-fundo) [@container_routine-viewport_(width<768px)_and_(height>=400px)]:grid-cols-1 [@container_routine-viewport_(width<768px)_and_(height>=400px)]:[&>button]:justify-start [@container_routine-viewport_(width<768px)_and_(height>=400px)]:[&>button]:px-3 [@container_routine-viewport_(width<768px)_and_(height>=400px)]:[&>button]:py-1.5 [@container_routine-viewport_(width<768px)_and_(height<650px)]:[&_span[aria-hidden]]:hidden [@container_routine-viewport_(height<400px)]:[&_span[aria-hidden]]:hidden',
  suggestionList:
    'flex min-h-0 flex-col gap-3 rounded-md bg-(--azul-fundo) p-3 [@container_routine-viewport_(height<650px)]:gap-2',
  suggestionItem:
    'flex min-h-11 min-w-0 cursor-pointer items-center gap-3 rounded-[0.625rem] bg-white p-3 [&_input]:size-6 [&_input]:shrink-0 [&>span]:flex [&>span]:min-w-0 [&>span]:flex-col [&>span]:gap-1.5 [&_strong]:text-base [&>span>span]:text-[0.8125rem] [&>span>span]:text-(--routine-muted) [@container_routine-viewport_(width<768px)]:[&>span>span]:hidden [@container_routine-viewport_(height<650px)]:[&>span>span]:hidden',
  skeletonList:
    'flex min-h-0 flex-1 flex-col gap-3 rounded-md bg-(--azul-fundo) p-3 [&>div]:min-h-0 [&>div]:flex-1 [&>div]:animate-pulse [&>div]:rounded-xl [&>div]:bg-white motion-reduce:[&>div]:animate-none',
  agendaPreferences:
    'flex flex-col gap-2 [&_label]:flex [&_label]:min-h-11 [&_label]:cursor-pointer [&_label]:items-center [&_label]:gap-3 [&_label]:p-2 [&_input]:size-6 [&_input]:shrink-0 [&_label>span]:flex [&_label>span]:min-w-0 [&_label>span]:flex-col [&_label>span>span]:hidden [@media(width>=600px)_and_(height<500px)]:grid [@media(width>=600px)_and_(height<500px)]:grid-cols-2',
  yearPicker: 'flex items-center justify-center gap-8 text-xl font-bold',
  monthChoices:
    'grid grid-cols-3 gap-2 [&_button]:px-3 [&_button]:text-[0.9375rem] [@media(width>=600px)_and_(height<500px)]:grid-cols-4',
  dayTaskList: 'flex flex-col',
  toast:
    'fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-30 flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-4 rounded-[0.875rem] bg-(--azul-titulo) py-4 pr-14 pl-5 text-white shadow-[0_0.5rem_2rem_#102a4333] [&>button:not([aria-label])]:font-bold [&>button:not([aria-label])]:text-[#ffc59a] [&>button[aria-label]]:top-1 [&>button[aria-label]]:right-1 [&>button[aria-label]]:text-white',
};

export default classes;
