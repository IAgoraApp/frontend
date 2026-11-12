const classesRotina = {
  escopo:
    'group/rotina [--rotina-laranja:#e03b00] [--rotina-apoio:#5d6f7f] [--rotina-suave:#fff2e8] [--rotina-neutra:#f6f8f9] [--rotina-borda:#dae3ea] [--laranja-principal:var(--rotina-laranja)] font-corpo text-(--azul-titulo) leading-[1.4] wrap-anywhere [font-optical-sizing:none] [&_:is(button,summary)]:cursor-pointer [&_button:disabled]:cursor-default [&_button:disabled]:opacity-50 [&_input[type=checkbox]]:accent-(--rotina-laranja) [&_:is(input,select)[aria-invalid=true]]:border-[#ba2828] [&_:is(button,a,input,select,textarea,summary):focus-visible]:outline-2 [&_:is(button,a,input,select,textarea,summary):focus-visible]:outline-offset-4 [&_:is(button,a,input,select,textarea,summary):focus-visible]:outline-(--azul-principal) motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:transition-none',
  pagina: 'min-w-0 flex-1 bg-white',
  paginaAjustada:
    'min-h-(--altura-rotina) flex-none [container:rotina-viewport/inline-size]',
  container:
    'pt-[clamp(1rem,2.223vw,2rem)] pb-12 group-data-[ajuste=true]/rotina:min-h-(--altura-rotina) group-data-[ajuste=true]/rotina:py-[clamp(0.75rem,2vw,1.5rem)]',
  painelVisao: 'min-h-0 group-data-[ajuste=true]/rotina:h-full [&[hidden]]:hidden',
  painelModal: '[&[hidden]]:hidden',
  somenteLeitor: 'sr-only',
  copiaTitulo:
    'flex min-w-0 flex-1 flex-col items-start gap-3 group-data-[ajuste=true]/rotina:gap-2 group-data-[visao=espaco]/rotina:gap-1.5 group-data-[visao=modal]/rotina:gap-2',
  linhaTitulo:
    'flex min-w-0 items-center justify-between gap-8 max-md:flex-wrap group-data-[visao=espaco]/rotina:gap-4 group-data-[visao=modal]/rotina:gap-4',
  fita:
    'inline-block max-w-full rotate-[1.4deg] bg-(--rotina-laranja) px-3 py-1.5 text-xs leading-normal font-bold text-white group-data-[visao=modal]/rotina:px-2 group-data-[visao=modal]/rotina:py-1 group-data-[visao=modal]/rotina:text-[0.625rem]',
  fitaEditorial: 'mb-1.5 px-4.5 py-2.25 tracking-[0.045rem]',
  icone:
    'inline-flex size-8 shrink-0 items-center justify-center [&_img]:block [&_img]:max-h-full [&_img]:max-w-full [&_img]:shrink-0',
  botao:
    'group-data-[visao=modal]/rotina:px-3 group-data-[visao=modal]/rotina:text-[0.8125rem] min-h-11 max-w-full gap-2 rounded-4xl border border-transparent px-4 py-2.5 text-sm leading-[1.35] font-bold text-center hover:enabled:opacity-85 group-data-[visao=visaoGeral]/rotina:py-2',
  primario: 'bg-(--rotina-laranja) text-white',
  secundario: 'border-[#dbe5ed] bg-(--azul-fundo) text-(--azul-titulo)',
  fantasma: 'bg-white text-(--azul-titulo)',
  contorno: 'border-(--rotina-laranja) bg-white text-(--rotina-laranja)',
  botaoPequeno: 'min-h-11 py-2.5 text-sm',
  acaoTexto:
    'inline-flex min-h-11 items-center gap-1 text-[0.8125rem] font-bold text-(--rotina-laranja) hover:underline',
  apoio:
    'text-base text-(--rotina-apoio) group-data-[visao=modal]/rotina:text-sm',
  notaPequena: 'text-[0.8125rem] leading-normal text-(--rotina-apoio)',
  visaoGeral:
    'grid min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] gap-[clamp(1rem,2.2vw,1.75rem)]',
  introducao: 'flex min-h-0 items-center gap-5 max-md:gap-3',
  tituloBoasVindas:
    'text-[clamp(1.75rem,3.6vw,3.25rem)] leading-tight font-extrabold tracking-[-0.035em]',
  descricaoIntroducao: 'text-base text-(--rotina-apoio) max-md:text-sm',
  listaIlustracao: 'h-auto w-[clamp(4.5rem,14vw,11rem)] shrink-0 max-sm:hidden',
  acoesRapidas:
    'grid grid-cols-5 gap-3 max-md:grid-cols-3 max-md:gap-2 max-[480px]:grid-cols-2',
  acaoRapida:
    'flex min-h-13 min-w-0 items-center gap-2.5 rounded-xl bg-(--rotina-suave) px-4 py-3 text-left text-sm font-bold transition-colors hover:bg-(--laranja-fundo) sm:text-base',
  cartoesVisaoGeral: 'grid min-h-0 grid-cols-2 gap-5 max-lg:grid-cols-1',
  proximas:
    'flex min-h-[260px] min-w-0 flex-col rounded-2xl bg-[#f5f7fa] p-5',
  cabecalhoCartao:
    'mb-3 flex min-h-8 shrink-0 flex-wrap items-center justify-between gap-x-4',
  tituloCartao: 'text-[1.375rem] leading-[1.4] font-extrabold max-md:text-lg',
  linhasProximas: 'flex min-h-0 flex-1 flex-col gap-2',
  proximasVazio: 'flex min-h-0 flex-col justify-center gap-1 py-4',
  cartaoIa:
    'grid min-h-[260px] min-w-0 grid-cols-[minmax(0,1fr)_clamp(5rem,12vw,9.5rem)] items-center gap-4 rounded-2xl bg-(--rotina-suave) p-6 max-sm:grid-cols-1',
  copiaCartaoIa:
    'flex min-w-0 flex-col items-start gap-3 [&>p]:text-base [&>p]:text-(--rotina-apoio)',
  tituloCartaoIa:
    'text-[clamp(1.5rem,3vw,2.5rem)] leading-tight font-extrabold tracking-[-0.02em] max-md:[&_br]:hidden',
  robo: 'h-auto w-full max-sm:hidden',
  linhaTarefa:
    'relative flex min-w-0 items-center gap-3.5 border-b border-[#dee5ed] bg-white px-3 py-5 max-md:flex-wrap max-md:gap-2.5',
  linhaTarefa_proximas:
    'group/previa h-14 min-h-14 shrink-0 flex-nowrap! gap-2.5! rounded-xl border-0! px-3 py-1.5! [&_[title]>strong]:truncate [&_[title]>strong]:text-sm [&_[title]>strong]:leading-5 [&_[title]>strong]:font-bold [&_button>span]:text-xs [&_button>span]:leading-4 [&_button[title]]:gap-0.5 [&_span[data-categoria]]:m-0 [&_span[data-categoria]]:min-h-6 [&_span[data-categoria]]:min-w-0 [&_span[data-categoria]]:px-2.5 [&_span[data-categoria]]:text-xs',
  linhaTarefa_historico:
    'max-md:[&_button[title]]:basis-[calc(100%-5rem)] max-md:[&_span[data-categoria]]:ml-18.5',
  linhaTarefa_dia:
    'px-0 [&_strong]:text-lg [&_button>span]:text-base [&_span[data-categoria]]:min-w-19 [&_span[data-categoria]]:text-sm',
  caixaTarefa:
    'relative grid size-5.5 shrink-0 place-items-center rounded-full border border-[#96a9b9] bg-white before:absolute before:size-11',
  tarefaConcluida: 'border-[#2a9157]! bg-[#2a9157]! text-white',
  iconeTarefa: 'shrink-0',
  copiaTarefa:
    'flex min-w-0 flex-1 flex-col items-start gap-1 text-left [&>strong]:max-w-full [&>strong]:text-[1.25rem] [&>strong]:leading-[1.35] [&>strong]:font-bold [&>span]:text-base [&>span]:text-(--rotina-apoio) hover:[&>strong]:underline hover:[&>strong]:underline-offset-[0.2em] max-md:[&>strong]:text-lg max-md:[&>span]:text-sm',
  horarioTarefa:
    'min-w-22 text-base text-(--rotina-apoio) max-md:ml-18.5 max-md:min-w-0 max-md:text-sm',
  seloCategoria:
    'inline-flex min-h-9 min-w-22 shrink-0 items-center justify-center rounded-2xl px-3 py-1 text-sm font-bold',
  casa: 'bg-[#e6f1f7] text-[#2381c1]',
  cozinha: 'bg-(--rotina-suave) text-(--rotina-laranja)',
  pessoal: 'bg-[#dbf2e7] text-[#2381c1]',
  financas: 'bg-[#f0e7fa] text-[#8426d2]',
  seloNeutro: 'bg-(--rotina-suave) text-(--rotina-laranja)',
  menuTarefa:
    'relative shrink-0 [&_summary]:grid [&_summary]:size-11 [&_summary]:list-none [&_summary]:place-items-center [&_summary]:rounded-full [&_summary]:text-[#96a9b9] [&_summary::-webkit-details-marker]:hidden [&_summary:hover]:bg-(--azul-fundo)',
  itensMenu:
    'absolute end-0 top-[calc(100%+0.25rem)] z-5 flex w-50 flex-col rounded-xl border border-(--rotina-borda) bg-white p-1.5 shadow-[0_0.5rem_2rem_#102a431a] [&_button]:min-h-11 [&_button]:rounded-md [&_button]:px-3 [&_button]:py-2 [&_button]:text-left [&_button]:text-[0.9375rem] [&_button:hover]:bg-(--azul-fundo) [&_button:last-child]:text-[#b32c16]',
  cabecalhoPagina: 'mb-11 flex flex-col gap-8 max-md:mb-6 max-md:gap-5',
  botaoVoltar:
    'inline-flex min-h-11 items-center gap-2 self-start text-base font-bold text-(--texto-apoio) hover:text-(--rotina-laranja) group-data-[visao=espaco]/rotina:min-h-8 group-data-[visao=espaco]/rotina:shrink-0',
  tituloPagina:
    'text-[clamp(2rem,4.167vw,3.75rem)] leading-[1.15] font-extrabold tracking-[-0.035em]',
  descricaoPagina:
    'text-[clamp(1rem,1.806vw,1.5rem)] leading-[1.4] text-(--rotina-apoio)',
  filtrosCategoria:
    'mb-10 grid grid-cols-5 gap-1.5 [&>button]:min-h-16 [&>button]:min-w-0 [&>button]:rounded-2xl [&>button]:border [&>button]:border-[#d9e5f0] [&>button]:px-2 [&>button]:py-3 [&>button]:text-lg [&>button]:font-bold [&>button:hover]:bg-(--rotina-suave) max-md:[&>button]:min-h-12 max-md:[&>button]:text-base max-[480px]:grid-cols-3 max-[480px]:[&>button]:min-h-11 max-[480px]:[&>button]:text-sm',
  filtroAtivo:
    'border-(--rotina-laranja)! bg-(--rotina-suave) text-(--rotina-laranja)',
  gruposTarefas: 'grid gap-10 max-md:gap-6',
  cabecalhoGrupoData:
    'mb-2.5 rounded-lg bg-(--rotina-neutra) px-3 py-2.5 text-sm font-bold',
  carregarMais: 'mx-auto mt-8 flex',
  seletorPeriodo:
    'min-h-11 min-w-40 max-w-full rounded-xl border border-[#d9e5f0] bg-white px-4 py-2 font-semibold',
  estatisticas:
    'mt-8 mb-12 grid grid-cols-3 gap-4 max-md:mt-6 max-md:mb-8 max-md:gap-2.5 max-[480px]:grid-cols-1',
  estatistica:
    'flex min-h-30 min-w-0 items-center gap-3.5 rounded-2xl bg-(--rotina-neutra) p-5 [&>div]:min-w-0 [&_dt]:text-base [&_dt]:text-(--rotina-apoio) [&_dd]:font-titulo [&_dd]:text-[2.25rem] [&_dd]:leading-tight [&_dd]:font-extrabold max-md:flex-col max-md:items-start max-md:p-4 max-[480px]:min-h-24 max-[480px]:flex-row max-[480px]:items-center',
  iconeEstatistica:
    'grid size-11 shrink-0 place-items-center rounded-full bg-white',
  secaoConcluidas: '[&>h2]:mb-6 max-md:[&>h2]:mb-4',
  tarefasConcluidas:
    'rounded-2xl border border-(--rotina-borda) [&>article:first-child]:rounded-t-2xl [&>article:last-child]:rounded-b-2xl [&>article:last-child]:border-b-0',
  visaoCalendario: 'flex min-h-[560px] min-w-0 flex-col',
  cabecalhoCompacto: 'relative mb-4 shrink-0 gap-2 [&_h1]:text-[clamp(2rem,3.6vw,3.25rem)]',
  barraCalendario:
    'mb-4 flex shrink-0 flex-wrap items-center justify-end gap-2 max-[480px]:[&>button:first-child]:mr-auto',
  controleCalendario:
    'inline-flex min-h-11 min-w-11 items-center justify-center gap-3 rounded-xl border border-[#d9e5f0] bg-white px-3 py-1.5 text-base hover:bg-(--azul-fundo)',
  controleMes:
    'min-w-48 justify-between max-[480px]:order-first max-[480px]:basis-full max-[480px]:min-w-0',
  gradeMes:
    'grid min-h-96 flex-1 grid-rows-[2rem_repeat(var(--semanas-calendario),minmax(76px,1fr))]',
  linhaDiasSemana:
    'grid min-h-0 grid-cols-7 items-center text-center text-sm font-bold text-(--texto-apoio) max-md:text-xs',
  semanaCalendario: 'grid min-h-0 grid-cols-7',
  diaCalendario:
    'flex min-h-0 min-w-0 flex-col items-center gap-1 rounded-xl border border-[#f0f5f7] px-1 py-2 hover:bg-[#f7f9fb]',
  diaForaMes: 'text-[#b2bfcc]',
  hoje:
    'border-(--rotina-laranja) [&>span:first-child]:bg-(--rotina-laranja) [&>span:first-child]:text-white',
  numeroDia:
    'grid size-9 shrink-0 place-items-center rounded-full text-lg font-bold leading-none max-md:size-7 max-md:text-sm',
  marcadoresDia:
    'flex min-h-3.5 flex-wrap justify-center gap-1.5 max-md:[&_img]:size-2',
  pontoCategoria: 'block size-3.5 shrink-0',
  rodapeCalendario:
    'mt-4 flex min-w-0 shrink-0 items-center justify-between gap-4 max-md:flex-col max-md:items-start',
  legendaCalendario:
    'flex max-w-208 flex-1 flex-wrap justify-between gap-3 [&>span]:inline-flex [&>span]:items-center [&>span]:gap-2 text-sm',
  modal:
    'fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-180 max-h-[calc(100dvh-1rem)] overflow-hidden overscroll-contain rounded-xl border border-[#dbe5ed] bg-white p-0 shadow-[0_1.5rem_5rem_#102a4333] backdrop:bg-[#102a4373] backdrop:backdrop-blur-[3px] open:flex open:flex-col max-[480px]:w-[calc(100%-1.5rem)]',
  modalLargo: 'max-w-260',
  barraModal: 'relative flex min-w-0 shrink-0 basis-11 items-center bg-white px-4',
  rolagemModal:
    'min-h-0 overflow-y-auto overscroll-contain px-4 pb-4 min-[1024px]:px-8 min-[1024px]:pb-8',
  voltarModal:
    'inline-flex min-h-11 items-center text-sm font-bold hover:text-(--rotina-laranja)',
  botaoFechar:
    'absolute top-0 right-2 z-2 grid size-11 place-items-center rounded-full text-(--azul-titulo) hover:bg-(--azul-fundo)',
  conteudoModal:
    'group-data-[visao=modal]/rotina:gap-2.5 flex min-w-0 flex-col items-stretch gap-4 [&>button]:self-start',
  tituloModal:
    'max-[1024px]:group-data-[visao=modal]/rotina:text-[1.375rem] text-[clamp(1.375rem,3vw,2.25rem)] leading-[1.15] font-extrabold tracking-[-0.025em] outline-none',
  aviso:
    'flex min-w-0 flex-col gap-1 rounded-xl bg-(--azul-fundo) p-4 [&>strong]:text-base [&>p]:text-sm [&>p]:text-(--rotina-apoio)',
  avisoErro: 'border border-[#efc5bf] bg-[#fff5f3] [&_strong]:text-[#a72c1d] [&_p]:text-[#a72c1d]',
  acoes: 'flex flex-wrap items-center gap-2 [&>button]:flex-auto',
  acoesDetalhe: 'grid grid-cols-2 max-sm:grid-cols-1',
  estadoVazio: 'flex min-w-0 flex-col gap-6 py-4',
  assinatura:
    'relative h-45 w-52 shrink-0 basis-52 max-md:[zoom:0.65] max-[480px]:hidden group-data-[ajuste=true]/rotina:hidden group-data-[visao=modal]/rotina:max-[1024px]:hidden',
  papelAssinatura:
    'absolute top-3 left-10.5 h-29 w-35 -rotate-7 rounded-xl bg-(--laranja-fundo)',
  checklistAssinatura: 'absolute top-2 left-7 rotate-5',
  notaAssinatura:
    'absolute top-35.5 left-[2.03rem] rotate-3 bg-(--azul-titulo) px-3.5 py-2 text-[0.625rem] font-bold whitespace-nowrap text-white',
  raiosAssinatura: 'absolute top-3 left-40',
  espacoTrabalho: 'relative flex min-h-0 min-w-0 flex-col gap-4',
  modosCriacao:
    'grid shrink-0 grid-cols-2 gap-2 [&>button]:min-h-11 [&>button]:rounded-xl [&>button]:bg-(--rotina-neutra) [&>button]:p-2 [&>button]:text-base [&>button]:font-bold [&>button[aria-pressed=true]]:border [&>button[aria-pressed=true]]:border-(--rotina-laranja) [&>button[aria-pressed=true]]:bg-(--rotina-suave) [&>button[aria-pressed=true]]:text-(--rotina-laranja) [&[hidden]]:hidden',
  formularioTarefa: 'flex min-h-0 flex-1 flex-col justify-between gap-4',
  painelFormulario:
    'data-[etapado=true]:flex data-[etapado=true]:flex-col grid min-w-0 grid-cols-2 gap-x-5 gap-y-4 rounded-2xl border border-(--rotina-borda) bg-(--rotina-neutra) p-5 group-data-[visao=modal]/rotina:flex group-data-[visao=modal]/rotina:flex-col group-data-[visao=modal]/rotina:border-0 group-data-[visao=modal]/rotina:p-3 max-md:grid-cols-1',
  campoFormulario: 'flex min-w-0 flex-col gap-1!',
  envoltorioCampo: 'flex min-w-0 flex-col gap-1',
  rotuloCampo: 'text-sm leading-[1.4] font-bold text-(--azul-titulo)',
  entrada:
    'h-11! min-h-11 min-w-0 w-full max-w-full rounded-lg border border-(--rotina-borda) bg-white px-3! py-2 text-base leading-6 text-(--azul-titulo) placeholder:text-(--rotina-apoio)',
  areaTexto:
    'h-20 min-h-20 w-full min-w-0 resize-none rounded-lg border border-(--rotina-borda) bg-white px-3 py-2 text-base leading-6 text-(--azul-titulo) placeholder:text-(--rotina-apoio)',
  erroCampo: 'text-[0.8125rem] text-[#b32c16]',
  camposRelacionados: 'grid min-w-0 grid-cols-2 gap-3',
  acoesFormulario: 'flex shrink-0 flex-wrap justify-between gap-3',
  observacoesFormulario: 'col-span-full',
  etapaFormulario:
    'contents data-[etapado=true]:grid data-[etapado=true]:grid-cols-1 data-[etapado=true]:gap-3 [&[hidden]]:hidden',
  etapasFormulario:
    'flex shrink-0 gap-1.5 [&>button]:flex [&>button]:min-h-11 [&>button]:min-w-0 [&>button]:flex-1 [&>button]:items-center [&>button]:justify-center [&>button]:gap-1.5 [&>button]:border-b-2 [&>button]:border-(--rotina-borda) [&>button]:text-xs [&>button]:font-bold [&>button[aria-current=step]]:border-(--rotina-laranja) [&>button[aria-current=step]]:text-(--rotina-laranja) [&_span]:grid [&_span]:size-5 [&_span]:shrink-0 [&_span]:place-items-center [&_span]:rounded-full [&_span]:bg-(--rotina-suave)',
  campoDiasSemana: 'm-0 flex min-w-0 flex-col gap-1 border-0 p-0 [&_legend]:mb-1 [&_legend]:p-0',
  opcoesDiasSemana:
    'grid grid-cols-7 gap-1 [&_label]:relative [&_label]:flex [&_label]:cursor-pointer [&_label]:items-center [&_label]:justify-center [&_input]:absolute [&_input]:size-full [&_input]:cursor-pointer [&_input]:opacity-0 [&_span]:grid [&_span]:min-h-11 [&_span]:w-full [&_span]:place-items-center [&_span]:rounded-lg [&_span]:border [&_span]:border-(--rotina-borda) [&_span]:bg-white [&_span]:text-[0.6875rem] [&_input:checked+span]:border-(--rotina-laranja) [&_input:checked+span]:bg-(--rotina-suave) [&_input:checked+span]:font-bold [&_input:checked+span]:text-(--rotina-laranja)',
  espacoAjustes: 'grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]',
  painelContexto:
    'flex min-w-0 flex-col gap-5 rounded-lg bg-(--laranja-fundo) p-6 text-base [&_h3]:font-titulo [&_h3]:text-2xl [&_h3]:leading-tight [&_h3]:font-extrabold [&_hr]:w-full [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-[#102a431f] [&_button]:w-full',
  sobrescrito: 'text-xs font-bold',
  comandoAssistente:
    'flex min-h-0 flex-1 flex-col items-center justify-center gap-4 rounded-2xl bg-(--rotina-suave) p-6 text-center [&_h3]:text-2xl [&_h3]:leading-tight [&_h3]:font-extrabold [&>p]:max-w-180 [&>p]:text-base [&>p]:text-(--rotina-apoio)',
  roboAssistente: 'h-auto w-28',
  formularioComando:
    'flex w-full min-w-0 items-center gap-2.5 rounded-4xl border border-(--rotina-borda) bg-white p-1.5 pl-4.5 [&_input]:min-h-11 [&_input]:min-w-0 [&_input]:flex-1 [&_input]:border-0 [&_input]:text-[0.9375rem] [&_button]:grid [&_button]:size-11 [&_button]:shrink-0 [&_button]:place-items-center [&_button]:rounded-full [&_button]:bg-(--rotina-laranja) [&_button]:text-2xl [&_button]:font-bold [&_button]:text-white',
  rotuloExemplos: 'text-center text-sm font-bold',
  exemplosSugestao:
    'grid grid-cols-3 gap-2.5 max-sm:grid-cols-1 [&>button]:flex [&>button]:min-h-11 [&>button]:min-w-0 [&>button]:items-center [&>button]:justify-center [&>button]:gap-2 [&>button]:rounded-xl [&>button]:bg-(--rotina-suave) [&>button]:p-3 [&>button]:text-center [&>button]:text-sm [&>button:hover]:bg-(--laranja-fundo)',
  listaSugestoes: 'flex min-h-0 flex-col gap-3 rounded-md bg-(--azul-fundo) p-3',
  itemSugestao:
    'flex min-h-11 min-w-0 cursor-pointer items-center gap-3 rounded-xl bg-white p-3 [&_input]:size-6 [&_input]:shrink-0 [&>span]:flex [&>span]:min-w-0 [&>span]:flex-col [&>span]:gap-1 [&_strong]:text-base [&>span>span]:text-xs [&>span>span]:text-(--rotina-apoio)',
  listaEsqueleto:
    'flex min-h-48 flex-col gap-3 rounded-md bg-(--azul-fundo) p-3 [&>div]:min-h-12 [&>div]:flex-1 [&>div]:animate-pulse [&>div]:rounded-xl [&>div]:bg-white',
  preferenciasAgenda:
    'flex flex-col gap-2 [&_label]:flex [&_label]:min-h-11 [&_label]:cursor-pointer [&_label]:items-center [&_label]:gap-3 [&_label]:p-2 [&_input]:size-6 [&_input]:shrink-0 [&_label>span]:flex [&_label>span]:min-w-0 [&_label>span]:flex-col [&_label>span>span]:hidden',
  seletorAno: 'flex items-center justify-center gap-8 text-xl font-bold',
  opcoesMes: 'grid grid-cols-3 gap-2 [&_button]:px-3 [&_button]:text-[0.9375rem]',
  listaTarefasDia: 'flex flex-col',
  notificacaoToast:
    'fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-30 flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-4 rounded-2xl bg-(--azul-titulo) py-4 pr-14 pl-5 text-white shadow-[0_0.5rem_2rem_#102a4333] [&>button:not([aria-label])]:font-bold [&>button:not([aria-label])]:text-[#ffc59a] [&>button[aria-label]]:top-1 [&>button[aria-label]]:right-1 [&>button[aria-label]]:text-white',
};

export default classesRotina;
