import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Titulo } from '../../../compartilhado/interface/indice';
import Rodape from '../../../compartilhado/Rodape';
import { BotaoCasa, CartaoCasa, DialogoCasa } from '../../casa/componentes/indice';
import {
  abasLimpeza,
  cabecalhosLimpeza,
  cadenciaLimpeza,
  CHAVE_LIMPEZA,
  chaveHojeLimpeza,
  guiasLimpeza,
  lerEstadoLimpeza,
  materiaisLimpeza,
} from '../conteudo';
import HeroiLimpeza from './HeroiLimpeza';
import {
  FormularioChecklistLimpeza,
  FormularioRotinaLimpeza,
} from './FormulariosLimpeza';
import fotoEssenciais from '../../../ativos/imagens/fotografias/editorial-essenciais.png';
import fotoServicos from '../../../ativos/imagens/fotografias/editorial-servicos.png';
import fotoKitLimpeza from '../../../ativos/imagens/fotografias/kit-limpeza.png';
import fotoGuiaBanheiro from '../../../ativos/imagens/fotografias/guia-banheiro.png';
import fotoGuiaCozinha from '../../../ativos/imagens/fotografias/guia-cozinha.png';
import fotoGuiaSala from '../../../ativos/imagens/fotografias/guia-sala.png';
import fotoGuiaQuarto from '../../../ativos/imagens/fotografias/guia-quarto.png';

const mapaFotosGuias = {
  'guia-banheiro': fotoGuiaBanheiro,
  'guia-cozinha': fotoGuiaCozinha,
  'guia-sala': fotoGuiaSala,
  'guia-quarto': fotoGuiaQuarto,
};

const classeEscopo =
  'min-w-0 flex-1 bg-white font-corpo leading-normal text-(--azul-titulo) wrap-anywhere [&_:is(button,a,input,select):focus-visible]:outline-2 [&_:is(button,a,input,select):focus-visible]:outline-offset-3 [&_:is(button,a,input,select):focus-visible]:outline-(--laranja-principal)';

export default function SecaoLimpeza() {
  const [carregado] = useState(lerEstadoLimpeza);
  const [dados, setDados] = useState(carregado.dados);
  const [erro, setErro] = useState(
    carregado.erro
      ? 'Não foi possível ler o checklist salvo. Os dados anteriores foram preservados.'
      : ''
  );
  const [parametros, definirParametros] = useSearchParams();
  const solicitada = parametros.get('visao');
  const guia = guiasLimpeza.find(item => item.id === paramsGuia(parametros));
  const visao = guia
    ? 'guia'
    : abasLimpeza.some(([chave]) => chave === solicitada)
      ? solicitada
      : 'inicio';

  const [periodo, setPeriodo] = useState('diaria');
  const [comodo, setComodo] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [dialogo, setDialogo] = useState(null);
  const [aviso, setAviso] = useState('');

  const dia = chaveHojeLimpeza();
  const concluidas = dados.tasks.filter(
    item => dados.checks[dia + ':' + item.id]
  ).length;
  const guiasVisiveis = guiasLimpeza.filter(
    item =>
      (comodo === 'Todos' || comodo === item.room) &&
      (item.title + ' ' + item.description)
        .toLocaleLowerCase('pt-BR')
        .includes(busca.toLocaleLowerCase('pt-BR'))
  );

  useEffect(() => {
    if (carregado.erro) return;
    try {
      localStorage.setItem(CHAVE_LIMPEZA, JSON.stringify(dados));
    } catch {
      const temporizador = setTimeout(
        () =>
          setErro(
            'Não foi possível salvar. As alterações ficam nesta sessão.'
          ),
        0
      );
      return () => clearTimeout(temporizador);
    }
  }, [dados, carregado.erro]);

  useEffect(() => {
    if (!aviso) return;
    const temporizador = setTimeout(() => setAviso(''), 5000);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  function paramsGuia(searchParams) {
    return searchParams.get('guia');
  }

  function navegar(proxima, guiaId) {
    definirParametros(
      anterior => {
        const atualizado = new URLSearchParams(anterior);
        if (proxima === 'inicio') atualizado.delete('visao');
        else atualizado.set('visao', proxima);
        if (guiaId) atualizado.set('guia', guiaId);
        else atualizado.delete('guia');
        return atualizado;
      },
      { preventScrollReset: true }
    );
  }

  function marcar(chave, valor) {
    setDados(anterior => ({
      ...anterior,
      checks: { ...anterior.checks, [chave]: valor },
    }));
  }

  function salvarGuia() {
    if (dados.tasks.some(item => item.guideId === guia.id)) {
      setAviso('Este guia já está no checklist.');
      return;
    }
    setDados(anterior => ({
      ...anterior,
      tasks: [
        ...anterior.tasks,
        {
          id: crypto.randomUUID(),
          title: guia.title,
          room: guia.room,
          frequency: 'Semanal',
          materials: '',
          guideId: guia.id,
        },
      ],
    }));
    setAviso('Guia salvo no checklist.');
  }

  const linhaChecklist = (titulo, chave, descricao) => {
    const marcado = Boolean(dados.checks[chave]);
    return (
      <label
        key={chave}
        className='flex min-h-18 cursor-pointer items-start gap-4 rounded-lg p-4 hover:bg-(--azul-fundo)'
      >
        <input
          type='checkbox'
          checked={marcado}
          onChange={evento => marcar(chave, evento.target.checked)}
          className='peer sr-only'
        />
        <span
          aria-hidden='true'
          className={
            'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-(--laranja-principal) ' +
            (marcado
              ? 'border-(--laranja-principal) bg-(--laranja-principal) text-white'
              : 'border-(--azul-titulo) bg-transparent text-transparent')
          }
        >
          ✓
        </span>
        <span>
          <strong className='block font-bold text-(--azul-titulo)'>
            {titulo}
          </strong>
          {descricao && (
            <span className='mt-1 block text-sm text-(--texto-apoio)'>
              {descricao}
            </span>
          )}
        </span>
      </label>
    );
  };

  return (
    <div lang='pt-BR' className={classeEscopo}>
      <main>
        <Container classe='pt-4'>
          {erro && (
            <p role='alert' className='mt-4 rounded-lg bg-amber-50 p-4 text-sm'>
              {erro}
            </p>
          )}
        </Container>
        <Container classe='pb-10'>
          {visao === 'inicio' ? (
            <>
              <HeroiLimpeza
                aoRotina={() =>
                  setDialogo({ tipo: 'rotina', guia: guiasLimpeza[1] })
                }
              />
              <section>
                <p className='text-xs font-bold text-(--laranja-principal)'>
                  UM POUCO A CADA DIA
                </p>
                <Titulo classe='mt-3 text-3xl font-extrabold sm:text-4xl'>
                  O combinado da semana.
                </Titulo>
                <p className='mt-3 text-(--texto-apoio)'>
                  Comece pelo que faz mais diferença no seu dia a dia.
                </p>
                <div
                  className='my-6 flex flex-wrap gap-3'
                  role='group'
                  aria-label='Frequência dos cuidados'
                >
                  {[
                    ['diaria', 'No dia a dia'],
                    ['semanal', 'Na semana'],
                    ['mensal', 'No mês'],
                  ].map(([chave, rotulo]) => (
                    <BotaoCasa
                      key={chave}
                      secundario={periodo !== chave}
                      aria-pressed={periodo === chave}
                      onClick={() => setPeriodo(chave)}
                    >
                      {rotulo}
                    </BotaoCasa>
                  ))}
                </div>
                <div className='rounded-lg bg-(--azul-fundo) p-3 sm:p-5'>
                  {cadenciaLimpeza[periodo].map(([titulo, descricao], indice) =>
                    linhaChecklist(
                      titulo,
                      dia + ':cadencia:' + periodo + indice,
                      descricao
                    )
                  )}
                </div>
                <div className='mt-5 flex flex-wrap gap-3'>
                  <BotaoCasa
                    secundario
                    onClick={() => navegar('biblioteca')}
                  >
                    Explorar guias
                  </BotaoCasa>
                  <BotaoCasa secundario onClick={() => navegar('checklist')}>
                    Abrir meu checklist
                  </BotaoCasa>
                </div>
              </section>
              <div className='mt-10 grid gap-6 md:grid-cols-2'>
                {[
                  {
                    foto: fotoEssenciais,
                    eyebrow: '01 / COMECE PELO ESSENCIAL',
                    titulo: 'Seu primeiro kit de limpeza.',
                    descricao:
                      'Poucos itens bem escolhidos resolvem boa parte do básico.',
                    acao: 'Ver o que vale ter ↗',
                    visao: 'materiais',
                  },
                  {
                    foto: fotoServicos,
                    eyebrow: '02 / AJUDA ESPECIALIZADA',
                    titulo: 'Precisou de uma limpeza maior?',
                    descricao:
                      'Conheça empresas e converse sobre a necessidade da sua casa.',
                    acao: 'Encontrar uma prestadora ↗',
                    rota: '/casa?visao=servicos&categoria=limpeza',
                  },
                ].map((item, indice) => (
                  <section
                    key={item.titulo}
                    className={
                      'overflow-hidden rounded-lg ' +
                      (indice === 0 ? 'bg-(--laranja-fundo)' : 'bg-white')
                    }
                  >
                    <img
                      src={item.foto}
                      alt={
                        indice
                          ? 'Equipe de limpeza'
                          : 'Itens essenciais para a casa'
                      }
                      className='aspect-[1.5] w-full object-cover'
                    />
                    <div className='space-y-3 p-6'>
                      <p className='text-xs font-bold tracking-[0.06em] text-(--laranja-principal)'>
                        {item.eyebrow}
                      </p>
                      <Titulo classe='text-3xl font-extrabold'>
                        {item.titulo}
                      </Titulo>
                      <p className='text-sm text-(--texto-apoio)'>
                        {item.descricao}
                      </p>
                      {item.rota ? (
                        <BotaoCasa
                          como={Link}
                          to={item.rota}
                          classe='w-full whitespace-nowrap'
                        >
                          {item.acao}
                        </BotaoCasa>
                      ) : (
                        <BotaoCasa
                          classe='w-full whitespace-nowrap'
                          onClick={() => navegar(item.visao)}
                        >
                          {item.acao}
                        </BotaoCasa>
                      )}
                    </div>
                  </section>
                ))}
              </div>
            </>
          ) : (
            <>
              <header className='py-8'>
                <button
                  type='button'
                  onClick={() =>
                    navegar(visao === 'guia' ? 'biblioteca' : 'inicio')
                  }
                  className='mb-4 min-h-11 text-sm font-bold text-(--texto-apoio)'
                >
                  ← Voltar
                </button>
                <p className='text-xs font-bold text-(--laranja-principal)'>
                  CUIDADOS COM A CASA
                </p>
                <Titulo
                  como='h1'
                  classe='mt-3 text-3xl leading-tight font-extrabold sm:text-4xl'
                >
                  {guia?.title ?? cabecalhosLimpeza[visao][0]}
                </Titulo>
                <p className='mt-3 text-(--texto-apoio)'>
                  {guia?.description ?? cabecalhosLimpeza[visao][1]}
                </p>
              </header>
              {visao === 'biblioteca' && (
                <>
                  <input
                    aria-label='Buscar guia de limpeza'
                    type='search'
                    value={busca}
                    onChange={evento => setBusca(evento.target.value)}
                    placeholder='Buscar um cuidado...'
                    className='mb-5 min-h-13 w-full rounded-lg border border-[#dbe5ed] px-4'
                  />
                  <div
                    className='mb-6 flex flex-wrap gap-3'
                    role='group'
                    aria-label='Filtrar por cômodo'
                  >
                    {['Todos', ...guiasLimpeza.map(item => item.room)].map(
                      valor => (
                        <BotaoCasa
                          key={valor}
                          secundario={comodo !== valor}
                          aria-pressed={comodo === valor}
                          onClick={() => setComodo(valor)}
                        >
                          {valor}
                        </BotaoCasa>
                      )
                    )}
                  </div>
                  <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                    {guiasVisiveis.map(item => (
                      <button
                        type='button'
                        key={item.id}
                        onClick={() => navegar('guia', item.id)}
                        className='overflow-hidden rounded-xl border border-[#dbe5ed] text-left hover:shadow-md'
                      >
                        <img
                          src={mapaFotosGuias[item.image]}
                          alt={item.room}
                          className='aspect-[1.6] w-full object-cover'
                        />
                        <div className='space-y-3 p-5'>
                          <p className='text-xs font-bold text-(--laranja-principal)'>
                            {item.room.toUpperCase()}
                          </p>
                          <Titulo classe='text-2xl font-extrabold'>
                            {item.title}
                          </Titulo>
                          <p className='text-sm text-(--texto-apoio)'>
                            {item.description}
                          </p>
                          <span className='inline-block text-sm font-bold text-(--laranja-principal)'>
                            Ver guia →
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {!guiasVisiveis.length && (
                    <p
                      role='status'
                      className='py-12 text-center text-(--texto-apoio)'
                    >
                      Nenhum guia encontrado. Tente outro cômodo ou termo.
                    </p>
                  )}
                </>
              )}
              {visao === 'guia' && guia && (
                <div className='space-y-6'>
                  <div className='grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]'>
                    <img
                      src={mapaFotosGuias[guia.image]}
                      alt={guia.room}
                      className='aspect-[1.6] w-full rounded-xl object-cover'
                    />
                    <CartaoCasa titulo='Você vai precisar de:'>
                      <ul className='space-y-3 text-sm'>
                        <li>
                          ✓ Produto adequado para a superfície, conforme o
                          rótulo
                        </li>
                        <li>✓ Panos separados para cada área</li>
                        <li>
                          ✓ Utensílios e proteção indicados pelo fabricante
                        </li>
                      </ul>
                      <p className='mt-6 rounded-lg bg-(--laranja-fundo) p-4 text-sm'>
                        Nunca misture produtos de limpeza. Leia o rótulo e siga
                        as orientações do fabricante.
                      </p>
                    </CartaoCasa>
                  </div>
                  <CartaoCasa titulo='Passo a passo'>
                    {guia.steps.map((passo, indice) =>
                      linhaChecklist(
                        indice + 1 + '. ' + passo,
                        dia + ':guia:' + guia.id + indice,
                        'Marque cada etapa quando terminar.'
                      )
                    )}
                  </CartaoCasa>
                  <div className='flex flex-wrap gap-3'>
                    <BotaoCasa
                      onClick={() => setDialogo({ tipo: 'rotina', guia })}
                    >
                      Adicionar à minha rotina
                    </BotaoCasa>
                    <BotaoCasa secundario onClick={salvarGuia}>
                      Salvar no checklist
                    </BotaoCasa>
                  </div>
                </div>
              )}
              {visao === 'checklist' && (
                <div className='space-y-6'>
                  <div className='grid gap-4 sm:grid-cols-3'>
                    {[
                      [
                        'Tarefas concluídas',
                        concluidas + ' de ' + dados.tasks.length,
                      ],
                      [
                        'Progresso',
                        (dados.tasks.length
                          ? Math.round((concluidas / dados.tasks.length) * 100)
                          : 0) + '%',
                      ],
                      [
                        'Seu próximo cuidado',
                        dados.tasks.find(
                          item => !dados.checks[dia + ':' + item.id]
                        )?.room ?? 'Tudo em dia',
                      ],
                    ].map(([rotulo, valor]) => (
                      <CartaoCasa key={rotulo}>
                        <p className='text-sm text-(--texto-apoio)'>{rotulo}</p>
                        <strong className='mt-3 block text-2xl'>{valor}</strong>
                      </CartaoCasa>
                    ))}
                  </div>
                  <CartaoCasa>
                    {dados.tasks.map(item => (
                      <div
                        key={item.id}
                        className='flex items-center justify-between gap-2 border-b border-[#e6edf2]'
                      >
                        {linhaChecklist(
                          item.title,
                          dia + ':' + item.id,
                          item.room +
                            ' · ' +
                            item.frequency +
                            (item.materials ? ' · ' + item.materials : '')
                        )}
                        <button
                          type='button'
                          aria-label={'Remover ' + item.title}
                          onClick={() =>
                            setDialogo({ tipo: 'remover', tarefa: item })
                          }
                          className='min-h-11 shrink-0 px-3 text-xs font-bold text-[#b42318]'
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </CartaoCasa>
                  <div className='flex flex-wrap gap-3'>
                    <BotaoCasa
                      onClick={() =>
                        setAviso('Checklist salvo neste navegador.')
                      }
                    >
                      Salvar checklist
                    </BotaoCasa>
                    <BotaoCasa
                      secundario
                      onClick={() => setDialogo({ tipo: 'personalizar' })}
                    >
                      + Personalizar
                    </BotaoCasa>
                    <BotaoCasa
                      secundario
                      como={Link}
                      to='/rotina?visao=lista'
                    >
                      Ver Minha rotina
                    </BotaoCasa>
                  </div>
                  <p className='text-xs text-(--texto-apoio)'>
                    As marcações acompanham o dia atual. Os cuidados voltam a
                    ficar disponíveis no dia seguinte.
                  </p>
                </div>
              )}
              {visao === 'materiais' && (
                <div className='space-y-6'>
                  <div className='grid items-start gap-6 lg:grid-cols-2'>
                    <img
                      src={fotoKitLimpeza}
                      alt='Kit de materiais de limpeza'
                      className='aspect-[1.4] w-full rounded-xl object-cover'
                    />
                    <CartaoCasa>
                      {materiaisLimpeza.map((material, indice) =>
                        linhaChecklist(
                          material,
                          'material:' + indice,
                          'Confira o que você já tem.'
                        )
                      )}
                    </CartaoCasa>
                  </div>
                  <p className='rounded-xl bg-(--laranja-fundo) p-5 text-sm'>
                    Leia os rótulos, guarde os produtos na embalagem original e
                    longe de crianças e animais. Não misture produtos.
                  </p>
                  <BotaoCasa onClick={() => navegar('checklist')}>
                    Ver meu checklist
                  </BotaoCasa>
                </div>
              )}
            </>
          )}
        </Container>
      </main>
      <Rodape />
      {aviso && (
        <div
          role='status'
          className='fixed right-4 bottom-4 left-4 z-40 flex items-center justify-between gap-4 rounded-xl bg-(--azul-titulo) p-4 text-sm text-white sm:left-auto sm:max-w-md'
        >
          {aviso}
          <button
            type='button'
            onClick={() => setAviso('')}
            aria-label='Fechar aviso'
            className='size-11 shrink-0 text-xl'
          >
            ×
          </button>
        </div>
      )}
      {dialogo && (
        <DialogoCasa
          titulo={
            dialogo.tipo === 'rotina'
              ? 'Levar este cuidado para a rotina?'
              : dialogo.tipo === 'remover'
                ? 'Remover tarefa?'
                : 'Seu checklist, do seu jeito.'
          }
          aoFechar={() => setDialogo(null)}
        >
          {dialogo.tipo === 'rotina' ? (
            <FormularioRotinaLimpeza
              guia={dialogo.guia}
              aoCancelar={() => setDialogo(null)}
              aoConcluir={texto => {
                setDialogo(null);
                setAviso(texto);
              }}
            />
          ) : dialogo.tipo === 'personalizar' ? (
            <FormularioChecklistLimpeza
              aoCancelar={() => setDialogo(null)}
              aoSalvar={tarefa => {
                setDados(anterior => ({
                  ...anterior,
                  tasks: [...anterior.tasks, tarefa],
                }));
                setDialogo(null);
                setAviso('Tarefa adicionada ao checklist.');
              }}
            />
          ) : (
            <>
              <p className='mb-5'>
                Remover “{dialogo.tarefa.title}” do checklist?
              </p>
              <div className='flex flex-wrap gap-3'>
                <BotaoCasa
                  onClick={() => {
                    setDados(anterior => ({
                      ...anterior,
                      tasks: anterior.tasks.filter(
                        item => item.id !== dialogo.tarefa.id
                      ),
                    }));
                    setDialogo(null);
                  }}
                >
                  Remover
                </BotaoCasa>
                <BotaoCasa secundario onClick={() => setDialogo(null)}>
                  Cancelar
                </BotaoCasa>
              </div>
            </>
          )}
        </DialogoCasa>
      )}
    </div>
  );
}
