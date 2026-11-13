import { useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  Acordeao,
  Botao,
  CabecalhoSubpagina,
  CampoFormulario,
  Container,
  EstadoVazio,
  Rodape,
  SeloEditorial,
  Titulo,
} from '../../compartilhado/indice';
import {
  lerEstadoPlataforma,
  salvarEstadoPlataforma,
} from '../../aplicacao/estado/estadoPlataforma';
import {
  catalogoEstadosValidacoes,
  catalogoIndicePlataforma,
  notificacoesIniciais,
  orientacoesSeguranca,
  passosComoFunciona,
  perguntasFrequentes,
  topicosAjuda,
} from './conteudo';

function VisaoCentralAjuda() {
  return (
    <Container como='main' classe='space-y-10 py-8 pb-16 sm:py-10'>
      <CabecalhoSubpagina
        voltarPara='/'
        rotuloVoltar=" Voltar ao início"
        selo='CENTRAL DE AJUDA'
        titulo='Conte com um próximo passo'
        subtitulo='Encontre uma orientação ou envie sua dúvida no exemplo.'
        assinatura='livro'
        etiquetaAssinatura="ORIENTAÇÕES PRÁTICAS"
        acoes={
          <>
            <Botao como={Link} to='/ajuda/faq' cor='laranja'>
              Perguntas frequentes
            </Botao>
            <Botao como={Link} to='/ajuda/contato' variante='secundario'>
              Falar com suporte
            </Botao>
            <Botao
              como={Link}
              to='/como-funciona'
              variante='fantasma'
              classe='border border-[#dbe5ed]'
            >
              Como funciona
            </Botao>
          </>
        }
      />

      <section className='space-y-4'>
        <Titulo
          como='h2'
          classe='text-2xl font-extrabold text-(--azul-titulo)'
        >
          Escolha um assunto para começar
        </Titulo>
        <div className='grid gap-5 md:grid-cols-2'>
          {topicosAjuda.map(topico => (
            <Link
              key={topico.id}
              to={topico.rota}
              className='group flex flex-col justify-between gap-4 rounded-2xl border border-[#dbe5ed] bg-white p-6 transition-all hover:border-(--laranja-principal) hover:bg-[#fffaf7]'
            >
              <div className='space-y-2'>
                <span className='inline-block rounded-full bg-[#fce8dc] px-3 py-1 text-xs font-bold text-(--laranja-principal)'>
                  {topico.categoria}
                </span>
                <h3 className='font-titulo text-xl font-extrabold text-(--azul-titulo) group-hover:text-(--laranja-principal)'>
                  {topico.titulo}
                </h3>
                <p className='text-sm leading-relaxed text-(--texto-apoio)'>
                  {topico.descricao}
                </p>
              </div>
              <span className='text-sm font-bold text-(--laranja-principal)'>
                Ver orientação
              </span>
            </Link>
          ))}
        </div>
      </section>
    </Container>
  );
}

function VisaoPerguntasFrequentes() {
  const [parametros, setParametros] = useSearchParams();
  const temaSelecionado = parametros.get('tema') || 'todos';

  const filtradas = perguntasFrequentes.filter(
    item => temaSelecionado === 'todos' || item.tema === temaSelecionado
  );

  return (
    <Container como='main' classe='space-y-10 py-8 pb-16 sm:py-10'>
      <CabecalhoSubpagina
        voltarPara='/ajuda'
        rotuloVoltar=" Central de ajuda"
        selo='PERGUNTAS FREQUENTES'
        titulo='Antes de começar'
        subtitulo='Respostas para explorar a plataforma.'
        assinatura='livro'
        etiquetaAssinatura="RESPOSTAS CLARAS"
      />

      <div className='flex flex-wrap gap-2'>
        {[
          { id: 'todos', rotulo: 'Todos os temas' },
          { id: 'conta', rotulo: 'Conta' },
          { id: 'rotina', rotulo: 'Rotina e momento' },
          { id: 'financas', rotulo: 'Finanças' },
          { id: 'empresa', rotulo: 'Empresas' },
        ].map(filtro => (
          <button
            key={filtro.id}
            type='button'
            aria-pressed={temaSelecionado === filtro.id}
            onClick={() =>
              setParametros(filtro.id === 'todos' ? {} : { tema: filtro.id })
            }
            className={`min-h-10 cursor-pointer rounded-full px-4 text-sm font-bold transition-colors ${
              temaSelecionado === filtro.id
                ? 'bg-(--azul-titulo) text-white'
                : 'border border-[#dbe5ed] bg-[#f4f7fa] text-(--azul-titulo) hover:border-(--laranja-principal)'
            }`}
          >
            {filtro.rotulo}
          </button>
        ))}
      </div>

      <Acordeao itens={filtradas} />

      <section className='space-y-4 rounded-2xl border border-[#dbe5ed] bg-[#f4f7fa] p-6'>
        <Titulo
          como='h2'
          classe='text-xl font-extrabold text-(--azul-titulo)'
        >
          Abrir resposta em página dedicada
        </Titulo>
        <div className='grid gap-3 sm:grid-cols-2'>
          {perguntasFrequentes.map(item => (
            <Link
              key={item.id}
              to={`/ajuda/faq/${item.id}`}
              className='flex items-center justify-between gap-3 rounded-xl border border-[#dbe5ed] bg-white px-4 py-3 text-sm font-bold text-(--azul-titulo) hover:border-(--laranja-principal) hover:text-(--laranja-principal)'
            >
              <span>{item.pergunta}</span>

            </Link>
          ))}
        </div>
      </section>
    </Container>
  );
}

function VisaoRespostaFaq() {
  const { id } = useParams();
  const item =
    perguntasFrequentes.find(entrada => entrada.id === id) ||
    perguntasFrequentes[0];

  return (
    <Container como='main' classe='space-y-8 py-8 pb-16 sm:py-10'>
      <CabecalhoSubpagina
        voltarPara='/ajuda/faq'
        rotuloVoltar=" Perguntas frequentes"
        selo='ORIENTAÇÃO DETALHADA'
        titulo={item.pergunta}
        subtitulo='Explicação passo a passo para aproveitar melhor este recurso.'
        assinatura='livro'
        etiquetaAssinatura="AJUDA IAGORA"
      />

      <article className='space-y-6 rounded-2xl border border-[#dbe5ed] bg-white p-6 sm:p-8'>
        <p className='text-base leading-relaxed text-(--azul-titulo)'>
          {item.resposta}
        </p>

        <div className='space-y-3 rounded-2xl bg-[#f4f7fa] p-5'>
          <h2 className='font-titulo text-lg font-extrabold text-(--azul-titulo)'>
            Resumo em passos
          </h2>
          <ol className='list-inside list-decimal space-y-2 text-sm text-(--texto-apoio)'>
            {item.passos.map(passo => (
              <li key={passo}>{passo}</li>
            ))}
          </ol>
        </div>

        <div className='flex flex-wrap gap-3'>
          <Botao como={Link} to='/ajuda/contato' cor='laranja'>
            Ainda tenho dúvida
          </Botao>
          <Botao como={Link} to='/ajuda/faq' variante='secundario'>
            Ver outras perguntas
          </Botao>
        </div>
      </article>
    </Container>
  );
}

function VisaoContatoAjuda() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [enviado, setEnviado] = useState(false);

  function enviarDuvida(evento) {
    evento.preventDefault();
    if (!nome.trim() || !email.trim() || !assunto.trim() || !mensagem.trim()) {
      setErro('Preencha nome, e-mail, assunto e sua dúvida para registrar.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErro('Informe um endereço de e-mail válido.');
      return;
    }
    setErro('');
    setEnviado(true);
  }

  return (
    <Container como='main' classe='space-y-10 py-8 pb-16 sm:py-10'>
      <CabecalhoSubpagina
        voltarPara='/ajuda'
        rotuloVoltar=" Central de ajuda"
        selo='FALAR COM SUPORTE'
        titulo='Vamos entender sua dúvida'
        subtitulo='Formulário demonstrativo. Nenhuma mensagem será enviada.'
        assinatura='livro'
        etiquetaAssinatura="SUPORTE IAGORA"
      />

      <div className='grid items-start gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]'>
        <section className='rounded-2xl border border-[#dbe5ed] bg-white p-6 sm:p-8'>
          {enviado ? (
            <div
              role='status'
              className='space-y-4 rounded-2xl border border-[#abefc6] bg-[#ecfdf3] p-6 text-[#18794e]'
            >
              <Titulo
                como='h2'
                classe='text-2xl font-extrabold text-(--azul-titulo)'
              >
                Registro demonstrativo concluído
              </Titulo>
              <p className='text-sm leading-relaxed text-(--azul-titulo)'>
                Nenhuma mensagem externa foi disparada. Em produção, nossa
                equipe responderia para <strong>{email}</strong> sobre “
                {assunto}”.
              </p>
              <Botao
                type='button'
                cor='laranja'
                onClick={() => {
                  setNome('');
                  setEmail('');
                  setAssunto('');
                  setMensagem('');
                  setEnviado(false);
                }}
              >
                Enviar outra dúvida de exemplo
              </Botao>
            </div>
          ) : (
            <form noValidate onSubmit={enviarDuvida} className='space-y-5'>
              <div className='grid gap-5 sm:grid-cols-2'>
                <CampoFormulario
                  id='suporte-nome'
                  rotulo='Nome'
                  value={nome}
                  onChange={evento => {
                    setNome(evento.target.value);
                    if (erro) setErro('');
                  }}
                  placeholder='Seu nome'
                  required
                />
                <CampoFormulario
                  id='suporte-email'
                  rotulo='E-mail'
                  type='email'
                  value={email}
                  onChange={evento => {
                    setEmail(evento.target.value);
                    if (erro) setErro('');
                  }}
                  placeholder='voce@exemplo.com'
                  required
                />
              </div>

              <CampoFormulario
                id='suporte-assunto'
                rotulo='Assunto'
                value={assunto}
                onChange={evento => {
                  setAssunto(evento.target.value);
                  if (erro) setErro('');
                }}
                placeholder='Ex: dúvida sobre rotina, orçamento ou empresa'
                required
              />

              <label
                htmlFor='suporte-mensagem'
                className='flex flex-col gap-2 text-sm font-bold text-(--azul-titulo)'
              >
                Mensagem
                <textarea
                  id='suporte-mensagem'
                  rows={5}
                  value={mensagem}
                  onChange={evento => {
                    setMensagem(evento.target.value);
                    if (erro) setErro('');
                  }}
                  placeholder='Explique o que estava tentando fazer na plataforma...'
                  className='rounded-xl border border-[#dbe5ed] bg-white p-4 font-normal text-(--azul-titulo)'
                  required
                />
              </label>

              {erro && (
                <p role='alert' className='text-sm font-semibold text-[#b42318]'>
                  {erro}
                </p>
              )}

              <Botao type='submit' cor='laranja' classe='px-7!'>
                Registrar solicitação
              </Botao>
            </form>
          )}
        </section>

        <aside className='space-y-4 rounded-2xl border border-[#f8ccb4] bg-[#fce8dc] p-6 sm:p-7'>
          <p className='text-xs font-bold tracking-[0.8px] text-(--laranja-principal) uppercase'>
            UMA CONVERSA MAIS CLARA
          </p>
          <Titulo
            como='h2'
            classe='text-2xl font-extrabold text-(--azul-titulo)'
          >
            Conte o que aconteceu
          </Titulo>
          <div className='space-y-3 text-sm leading-relaxed text-(--azul-titulo)'>
            <div className='rounded-xl bg-white/80 p-4'>
              <p className='font-bold'>Descreva sua dúvida</p>
              <p className='mt-1 text-(--texto-apoio)'>
                Informe qual área você estava usando (Casa, Finanças, Marketplace
                ou Empresa).
              </p>
            </div>
            <div className='rounded-xl bg-white/80 p-4'>
              <p className='font-bold'>Proteja seus dados</p>
              <p className='mt-1 text-(--texto-apoio)'>
                Não inclua senhas, números de cartão ou documentos pessoais em
                mensagens demonstrativas.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}

function VisaoComoFunciona() {
  return (
    <Container como='main' classe='space-y-12 py-8 pb-16 sm:py-10'>
      <CabecalhoSubpagina
        voltarPara='/'
        rotuloVoltar=" Voltar ao início"
        selo='COMO FUNCIONA'
        titulo='Da primeira chave ao seu dia a dia'
        subtitulo='Escolha seu momento e use as ferramentas que fazem sentido.'
        assinatura='chave'
        etiquetaAssinatura="DO SEU JEITO"
        acoes={
          <Botao como={Link} to='/onboarding' cor='laranja' classe='px-7!'>
            Escolher meu momento
          </Botao>
        }
      />

      <div className='grid gap-6 lg:grid-cols-3'>
        {passosComoFunciona.map(passo => (
          <article
            key={passo.numero}
            className='flex flex-col justify-between rounded-2xl border border-[#dbe5ed] bg-white p-6 sm:p-7'
          >
            <div className='space-y-3'>
              <p className='text-xs font-bold tracking-[0.8px] text-(--laranja-principal) uppercase'>
                {passo.numero}
              </p>
              <Titulo
                como='h2'
                classe='text-2xl leading-snug font-extrabold text-(--azul-titulo)'
              >
                {passo.titulo}
              </Titulo>
              <p className='text-sm leading-relaxed text-(--texto-apoio)'>
                {passo.descricao}
              </p>
            </div>
          </article>
        ))}
      </div>

      <section className='flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#102a43] p-8 text-white md:flex-row md:items-center'>
        <div className='space-y-2'>
          <Titulo
            como='h2'
            classe='text-2xl font-extrabold text-white! sm:text-3xl'
          >
            Pronto para organizar seu próximo capítulo?
          </Titulo>
          <p className='max-w-[560px] text-sm leading-relaxed text-white/85 sm:text-base'>
            Selecione se já mora sozinho ou se está planejando a mudança para
            abrir a experiência certa.
          </p>
        </div>
        <Botao como={Link} to='/onboarding' cor='laranja' classe='shrink-0 px-7!'>
          Escolher meu momento
        </Botao>
      </section>
    </Container>
  );
}

function VisaoNotificacoes() {
  const [lista, setLista] = useState(notificacoesIniciais);

  function alternarLida(id) {
    setLista(anterior =>
      anterior.map(item =>
        item.id === id ? { ...item, lida: !item.lida } : item
      )
    );
  }

  function marcarTodasLidas() {
    setLista(anterior => anterior.map(item => ({ ...item, lida: true })));
  }

  return (
    <Container como='main' classe='space-y-8 py-8 pb-16 sm:py-10'>
      <CabecalhoSubpagina
        voltarPara='/home'
        rotuloVoltar=" Voltar ao início"
        selo='NOTIFICAÇÕES'
        titulo='O que pede sua atenção'
        subtitulo='Lembretes e novidades da sua experiência.'
        assinatura='raios'
        etiquetaAssinatura="TUDO SOB CONTROLE"
        acoes={
          <>
            <Botao
              type='button'
              variante='secundario'
              onClick={marcarTodasLidas}
            >
              Marcar tudo como lido
            </Botao>
            <Botao
              como={Link}
              to='/perfil?visao=notificacoes'
              cor='laranja'
            >
              Ajustar notificações
            </Botao>
          </>
        }
      />

      <div className='space-y-4'>
        {lista.map(item => (
          <article
            key={item.id}
            className={`flex flex-col justify-between gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center ${
              item.lida
                ? 'border-[#dbe5ed] bg-white'
                : 'border-[#f8ccb4] bg-[#fce8dc]/45'
            }`}
          >
            <div className='space-y-1.5'>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='rounded-full bg-[#102a43] px-3 py-0.5 text-xs font-bold text-white'>
                  {item.categoria}
                </span>
                <span className='text-xs font-semibold text-(--texto-apoio)'>
                  {item.tempo}
                </span>
                {!item.lida && (
                  <span className='rounded-full bg-(--laranja-principal) px-2.5 py-0.5 text-[11px] font-bold text-white'>
                    Nova
                  </span>
                )}
              </div>
              <Titulo
                como='h2'
                classe='text-xl font-extrabold text-(--azul-titulo)'
              >
                {item.titulo}
              </Titulo>
              <p className='text-sm text-(--texto-apoio)'>{item.descricao}</p>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Botao
                como={Link}
                to={item.rota}
                cor='laranja'
                classe='min-h-[42px]! px-4! text-sm!'
              >
                {item.textoAcao}
              </Botao>
              <button
                type='button'
                onClick={() => alternarLida(item.id)}
                className='min-h-[42px] cursor-pointer rounded-xl border border-[#dbe5ed] bg-white px-4 text-xs font-bold text-(--azul-titulo) hover:border-(--laranja-principal)'
              >
                {item.lida ? 'Marcar como nova' : 'Marcar como lida'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </Container>
  );
}

function VisaoSeguranca() {
  return (
    <Container como='main' classe='space-y-8 py-8 pb-16 sm:py-10'>
      <CabecalhoSubpagina
        voltarPara='/casa'
        rotuloVoltar=" Voltar para Casa"
        selo='GUIAS DE SEGURANÇA'
        titulo='Cuidado também é saber pedir ajuda'
        subtitulo='Orientações gerais para prevenir problemas em casa.'
        assinatura='planta'
        etiquetaAssinatura="CASA SEGURA"
        acoes={
          <>
            <Botao como={Link} to='/buscar' cor='laranja'>
              Encontrar profissionais
            </Botao>
            <Botao como={Link} to='/casa' variante='secundario'>
              Ver guias da casa
            </Botao>
          </>
        }
      />

      <section className='space-y-5 rounded-2xl border border-[#dbe5ed] bg-white p-6 sm:p-8'>
        <SeloEditorial texto='PREVENÇÃO NO DIA A DIA' />
        <Titulo
          como='h2'
          classe='text-2xl font-extrabold text-(--azul-titulo)'
        >
          Antes de realizar um reparo
        </Titulo>
        <div className='space-y-4'>
          {orientacoesSeguranca.map((paragrafo, indice) => (
            <div
              key={paragrafo}
              className='flex items-start gap-4 rounded-2xl bg-[#f4f7fa] p-5'
            >
              <span className='font-titulo flex size-8 shrink-0 items-center justify-center rounded-full bg-(--laranja-principal) text-sm font-extrabold text-white'>
                {indice + 1}
              </span>
              <p className='text-sm leading-relaxed text-(--azul-titulo) sm:text-base'>
                {paragrafo}
              </p>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}

function VisaoChecklists() {
  const [estado, setEstado] = useState(lerEstadoPlataforma);
  const [listaAtiva, setListaAtiva] = useState('diaADia');
  const [novoItem, setNovoItem] = useState('');

  const listas = [
    { id: 'diaADia', titulo: 'Checklist de limpeza', selo: 'DIA A DIA' },
    { id: 'mudanca', titulo: 'Documentos da mudança', selo: 'MUDANÇA' },
    { id: 'mercado', titulo: 'Lista de compras', selo: 'ESSENCIAIS' },
  ];

  const checklists = estado.checklists || {
    diaADia: [],
    mudanca: [],
    mercado: [],
  };
  const itensAtuais = checklists[listaAtiva] || [];

  function atualizarChecklists(proximosChecklists) {
    const proximoEstado = { ...estado, checklists: proximosChecklists };
    salvarEstadoPlataforma(proximoEstado);
    setEstado(proximoEstado);
  }

  function alternarItem(itemId) {
    atualizarChecklists({
      ...checklists,
      [listaAtiva]: itensAtuais.map(item =>
        item.id === itemId ? { ...item, concluido: !item.concluido } : item
      ),
    });
  }

  function adicionarItem(evento) {
    evento.preventDefault();
    if (!novoItem.trim()) return;
    atualizarChecklists({
      ...checklists,
      [listaAtiva]: [
        ...itensAtuais,
        {
          id: crypto.randomUUID(),
          texto: novoItem.trim(),
          concluido: false,
        },
      ],
    });
    setNovoItem('');
  }

  function removerItem(itemId) {
    atualizarChecklists({
      ...checklists,
      [listaAtiva]: itensAtuais.filter(item => item.id !== itemId),
    });
  }

  return (
    <Container como='main' classe='space-y-8 py-8 pb-16 sm:py-10'>
      <CabecalhoSubpagina
        voltarPara='/home'
        rotuloVoltar=" Voltar ao início"
        selo='MEUS CHECKLISTS'
        titulo='Um passo marcado, um cuidado a menos'
        subtitulo='Organize limpeza, mudança e rotina.'
        assinatura='checklist'
        etiquetaAssinatura="PASSO A PASSO"
      />

      <div className='grid gap-4 md:grid-cols-3'>
        {listas.map(lista => {
          const itens = checklists[lista.id] || [];
          const feitos = itens.filter(i => i.concluido).length;
          const ativo = listaAtiva === lista.id;
          return (
            <button
              key={lista.id}
              type='button'
              aria-pressed={ativo}
              onClick={() => setListaAtiva(lista.id)}
              className={`cursor-pointer rounded-2xl border p-5 text-left transition-all ${
                ativo
                  ? 'border-(--laranja-principal) bg-[#fce8dc]'
                  : 'border-[#dbe5ed] bg-white hover:border-(--laranja-principal)'
              }`}
            >
              <p className='text-xs font-bold tracking-[0.7px] text-(--laranja-principal) uppercase'>
                {lista.selo}
              </p>
              <h2 className='font-titulo mt-1 text-xl font-extrabold text-(--azul-titulo)'>
                {lista.titulo}
              </h2>
              <p className='mt-2 text-xs font-bold text-(--texto-apoio)'>
                {feitos} de {itens.length} concluídos
              </p>
            </button>
          );
        })}
      </div>

      <section className='space-y-6 rounded-2xl border border-[#dbe5ed] bg-white p-6 sm:p-8'>
        <form onSubmit={adicionarItem} className='flex flex-wrap gap-3'>
          <input
            type='text'
            aria-label='Adicionar item ao checklist'
            value={novoItem}
            onChange={evento => setNovoItem(evento.target.value)}
            placeholder='Adicionar novo item nesta lista...'
            className='h-12 min-w-[220px] flex-1 rounded-xl border border-[#dbe5ed] bg-[#f4f7fa] px-4 text-sm text-(--azul-titulo)'
          />
          <Botao type='submit' cor='laranja' classe='min-h-12!'>
            + Adicionar item
          </Botao>
        </form>

        {itensAtuais.length ? (
          <ul className='space-y-3'>
            {itensAtuais.map(item => (
              <li
                key={item.id}
                className='flex items-center justify-between gap-4 rounded-xl border border-[#dbe5ed] bg-[#f4f7fa]/60 p-4'
              >
                <label className='flex flex-1 cursor-pointer items-center gap-3 text-sm font-semibold text-(--azul-titulo)'>
                  <input
                    type='checkbox'
                    checked={Boolean(item.concluido)}
                    onChange={() => alternarItem(item.id)}
                    className='size-5 accent-(--laranja-principal)'
                  />
                  <span
                    className={
                      item.concluido
                        ? 'text-(--texto-apoio) line-through'
                        : ''
                    }
                  >
                    {item.texto}
                  </span>
                </label>
                <button
                  type='button'
                  onClick={() => removerItem(item.id)}
                  className='cursor-pointer text-xs font-bold text-(--texto-apoio) hover:text-[#b42318]'
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EstadoVazio
            titulo='Lista vazia no momento'
            descricao='Adicione o primeiro item acima para começar a acompanhar esta etapa.'
          />
        )}
      </section>
    </Container>
  );
}

function VisaoLegal({ tipo }) {
  const navegar = useNavigate();
  const voltar = () => window.history.state?.idx > 0
    ? navegar(-1)
    : navegar('/login?modo=cadastro', { replace: true });
  const ehPrivacidade = tipo === 'privacidade';
  return (
    <Container como='main' classe='space-y-8 py-8 pb-16 sm:py-10'>
      <CabecalhoSubpagina
        aoVoltar={voltar}
        rotuloVoltar=" Voltar"
        selo='DOCUMENTAÇÃO LEGAL'
        titulo={ehPrivacidade ? 'Política de Privacidade' : 'Termos de Uso'}
        subtitulo='Documento de produto pendente de revisão jurídica.'
        assinatura='livro'
        etiquetaAssinatura="TRANSPARÊNCIA IAGORA"
      />

      <article className='space-y-5 rounded-2xl border border-[#f8ccb4] bg-[#fce8dc]/60 p-6 sm:p-8'>
        <span className='inline-block rounded-full bg-(--laranja-principal) px-3 py-1 text-xs font-bold text-white uppercase'>
          Texto definitivo ainda não fornecido
        </span>
        <p className='text-base leading-relaxed text-(--azul-titulo)'>
          {ehPrivacidade
            ? 'Esta demonstração do Iagora armazena preferências de rotina, finanças, checklists e cadastros de exemplo apenas localmente no seu navegador (localStorage), sem envio para servidores externos.'
            : 'O conteúdo definitivo dos Termos de Uso do Iagora aguarda revisão jurídica final antes do lançamento público. Todas as ferramentas disponíveis nesta entrega funcionam exclusivamente em modo demonstrativo.'}
        </p>
        <div className='pt-2'>
          <Botao type='button' onClick={voltar} cor='laranja'>
            Voltar
          </Botao>
        </div>
      </article>
    </Container>
  );
}

function VisaoSistema({ tipo }) {
  const navegar = useNavigate();
  const ehOffline = tipo === 'offline';
  const ehManutencao = tipo === 'manutencao';

  const titulo = ehOffline
    ? 'Não foi possível conectar'
    : ehManutencao
      ? 'Plataforma em manutenção'
      : 'Esse caminho não está disponível';

  const descricao = ehOffline
    ? 'Confira sua conexão e tente novamente.'
    : ehManutencao
      ? 'Estamos atualizando esta experiência. Tente novamente dentro de instantes.'
      : 'Retome o início ou volte para a tela anterior.';

  return (
    <Container como='main' classe='py-14 pb-20'>
      <div className='mx-auto max-w-2xl space-y-6 rounded-3xl border border-[#dbe5ed] bg-[#f4f7fa] p-8 text-center sm:p-12'>
        <SeloEditorial
          texto={
            ehOffline
              ? 'SEM CONEXÃO'
              : ehManutencao
                ? 'MANUTENÇÃO'
                : 'CAMINHO INDISPONÍVEL'
          }
        />
        <Titulo
          como='h1'
          classe='text-[clamp(2rem,4vw,3rem)] leading-[1.1] font-extrabold'
        >
          {titulo}
        </Titulo>
        <p className='text-base leading-relaxed text-(--texto-apoio)'>
          {descricao}
        </p>
        <div className='flex flex-wrap justify-center gap-3 pt-2'>
          <Botao como={Link} to='/' cor='laranja' classe='px-7!'>
            Voltar ao início
          </Botao>
          <Botao
            type='button'
            variante='secundario'
            onClick={() =>
              window.history.state?.idx > 0
                ? navegar(-1)
                : navegar('/', { replace: true })
            }
          >
            Voltar
          </Botao>
        </div>
      </div>
    </Container>
  );
}

function VisaoIndicePlataforma() {
  return (
    <Container como='main' classe='space-y-8 py-8 pb-16 sm:py-10'>
      <CabecalhoSubpagina
        voltarPara='/'
        rotuloVoltar=" Voltar ao início"
        selo='00 / ÍNDICE DA PLATAFORMA'
        titulo='Todas as rotas e experiências do Iagora'
        subtitulo='Acesso direto às telas públicas, jornadas do consumidor, Marketplace e painel da empresa.'
        assinatura='chave'
        etiquetaAssinatura="MAPA COMPLETO"
      />

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {catalogoIndicePlataforma.map(grupo => (
          <section
            key={grupo.grupo}
            className='space-y-3 rounded-2xl border border-[#dbe5ed] bg-white p-6'
          >
            <Titulo
              como='h2'
              classe='text-lg font-extrabold text-(--azul-titulo)'
            >
              {grupo.grupo}
            </Titulo>
            <ul className='space-y-2'>
              {grupo.itens.map(item => (
                <li key={item.rota}>
                  <Link
                    to={item.rota}
                    className='flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-semibold text-(--azul-titulo) transition-colors hover:bg-[#fce8dc] hover:text-(--laranja-principal)'
                  >
                    <span>{item.nome}</span>

                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Container>
  );
}

function VisaoEstadosValidacoes() {
  return (
    <Container como='main' classe='space-y-8 py-8 pb-16 sm:py-10'>
      <CabecalhoSubpagina
        voltarPara='/indice'
        rotuloVoltar=" Índice da plataforma"
        selo='00 / ESTADOS E VALIDAÇÕES'
        titulo='Estados de carregamento, vazios e falhas'
        subtitulo='Atalhos para inspecionar os comportamentos de sistema previstos no projeto.'
        assinatura='checklist'
        etiquetaAssinatura="TESTES VISUAIS"
      />

      <div className='grid gap-5 md:grid-cols-2'>
        {catalogoEstadosValidacoes.map(item => (
          <Link
            key={item.rota}
            to={item.rota}
            className='flex flex-col justify-between gap-3 rounded-2xl border border-[#dbe5ed] bg-white p-6 transition-all hover:border-(--laranja-principal) hover:bg-[#fffaf7]'
          >
            <div className='space-y-1.5'>
              <Titulo
                como='h2'
                classe='text-xl font-extrabold text-(--azul-titulo)'
              >
                {item.titulo}
              </Titulo>
              <p className='text-sm text-(--texto-apoio)'>{item.descricao}</p>
            </div>
            <span className='text-sm font-bold text-(--laranja-principal)'>
              Abrir estado
            </span>
          </Link>
        ))}
      </div>
    </Container>
  );
}

export default function AjudaSuporte({ visao = 'central' }) {
  return (
    <div lang='pt-BR' className='flex min-w-0 flex-1 flex-col bg-white font-corpo'>
      <div className='flex-1'>
        {visao === 'central' && <VisaoCentralAjuda />}
        {visao === 'faq' && <VisaoPerguntasFrequentes />}
        {visao === 'respostaFaq' && <VisaoRespostaFaq />}
        {visao === 'contato' && <VisaoContatoAjuda />}
        {visao === 'comoFunciona' && <VisaoComoFunciona />}
        {visao === 'notificacoes' && <VisaoNotificacoes />}
        {visao === 'seguranca' && <VisaoSeguranca />}
        {visao === 'checklists' && <VisaoChecklists />}
        {visao === 'termos' && <VisaoLegal tipo='termos' />}
        {visao === 'privacidade' && <VisaoLegal tipo='privacidade' />}
        {visao === 'offline' && <VisaoSistema tipo='offline' />}
        {visao === 'manutencao' && <VisaoSistema tipo='manutencao' />}
        {visao === 'indisponivel' && <VisaoSistema tipo='indisponivel' />}
        {visao === 'indice' && <VisaoIndicePlataforma />}
        {visao === 'estados' && <VisaoEstadosValidacoes />}
      </div>
      <Rodape variante='inicial' />
    </div>
  );
}
