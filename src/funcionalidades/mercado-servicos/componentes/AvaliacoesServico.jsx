import { IconeEstrela, EstrelasAvaliacao } from '../../../compartilhado/interface/IndicadoresFuncionais';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { LinkNavegacao as Link } from '../../../compartilhado/interface/LinkNavegacao';

import {
  Botao,
  CampoFormulario,
  Container,
  EstadoVazio,
  SeloEditorial,
  Titulo,
} from '../../../compartilhado/interface/indice';

export default function AvaliacoesServico({
  servicos = [],
  empresas = [],
  avaliacoes = [],
  aoAdicionarAvaliacao,
}) {
  const { id } = useParams();
  const [parametros, setParametros] = useSearchParams();
  const servico = servicos.find(item => item.id === id);
  const empresa = empresas.find(item => item.id === servico?.empresaId);

  const [autor, setAutor] = useState('');
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  if (!servico) {
    return (
      <Container como='main' classe='py-10 pb-16'>
        <EstadoVazio
          varianteAlerta='erro'
          titulo='Serviço não encontrado'
          descricao='Não foi possível localizar as avaliações deste serviço.'
          textoAcao='Voltar ao Marketplace'
          rotaAcao='/buscar'
        />
      </Container>
    );
  }

  const forcarVazio = parametros.get('vazio') === '1';
  const lista = forcarVazio
    ? []
    : avaliacoes.filter(item => item.servicoId === servico.id);

  function enviarAvaliacao(evento) {
    evento.preventDefault();
    if (!autor.trim() || !comentario.trim()) {
      setErro('Informe seu nome e o comentário sobre o atendimento.');
      return;
    }
    aoAdicionarAvaliacao({
      id: crypto.randomUUID(),
      servicoId: servico.id,
      autor: autor.trim(),
      nota: Number(nota),
      data: 'Agora mesmo',
      comentario: comentario.trim(),
    });
    setAutor('');
    setNota(5);
    setComentario('');
    setErro('');
    setSucesso(true);
    if (forcarVazio) {
      setParametros({});
    }
  }

  return (
    <Container como='main' classe='space-y-8 py-8 pb-16 sm:py-10'>
      <header className='space-y-3 border-b border-[#e6edf2] pb-6'>
        <Link
          to={`/servicos/${servico.id}`}
          className='inline-flex items-center text-sm font-bold text-(--texto-apoio) hover:text-(--laranja-principal)'
        >
 Voltar para o serviço
        </Link>
        <SeloEditorial texto='AVALIAÇÕES DE QUEM JÁ CONTRATOU' />
        <Titulo
          como='h1'
          classe='text-[clamp(2rem,3.6vw,3rem)] leading-[1.1] font-extrabold'
        >
          {servico.titulo}
        </Titulo>
        <p className='text-base text-(--texto-apoio)'>
          {empresa?.nome} · Média <IconeEstrela /> {servico.nota} com base nas avaliações do
          catálogo demonstrativo.
        </p>
      </header>

      <div className='grid items-start gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]'>
        <section className='space-y-4'>
          {lista.length ? (
            lista.map(item => (
              <article
                key={item.id}
                className='rounded-2xl border border-[#dbe5ed] bg-white p-6'
              >
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <h2 className='font-titulo text-lg font-extrabold text-(--azul-titulo)'>
                    {item.autor}
                  </h2>
                  <span className='rounded-full bg-[#fce8dc] px-3 py-1 text-xs font-extrabold text-(--laranja-principal)'>
                    <EstrelasAvaliacao nota={item.nota} /> ({item.nota}.0)
                  </span>
                </div>
                <p className='mt-3 text-sm leading-relaxed text-(--texto-apoio)'>
                  {item.comentario}
                </p>
                <p className='mt-3 text-xs font-semibold text-(--texto-apoio)'>
                  {item.data}
                </p>
              </article>
            ))
          ) : (
            <EstadoVazio
              titulo='Ainda não há avaliações registradas'
              descricao='Este serviço ainda não recebeu comentários públicos. Publique a primeira impressão ao lado.'
              textoAcao='Ver avaliações de exemplo'
              aoClicar={() => setParametros({})}
            />
          )}
        </section>

        <aside className='rounded-2xl border border-[#dbe5ed] bg-[#f4f7fa] p-6'>
          <form onSubmit={enviarAvaliacao} className='space-y-4'>
            <Titulo
              como='h2'
              classe='text-xl font-extrabold text-(--azul-titulo)'
            >
              Deixar uma avaliação
            </Titulo>
            <CampoFormulario
              id='avaliacao-autor'
              rotulo='Seu nome'
              value={autor}
              onChange={evento => {
                setAutor(evento.target.value);
                if (erro) setErro('');
              }}
              placeholder='Ex: Mariana Souza'
            />
            <div className='space-y-2'>
              <label
                htmlFor='avaliacao-nota'
                className='text-sm font-bold text-(--azul-titulo)'
              >
                Nota do atendimento
              </label>
              <select
                id='avaliacao-nota'
                value={nota}
                onChange={evento => setNota(evento.target.value)}
                className='h-[52px] w-full rounded-lg border border-[#dbe5ed] bg-white px-4 text-base text-(--azul-titulo)'
              >
                <option value={5}>5 estrelas · Excelente</option>
                <option value={4}>4 estrelas · Muito bom</option>
                <option value={3}>3 estrelas · Regular</option>
                <option value={2}>2 estrelas · Abaixo do esperado</option>
                <option value={1}>1 estrela · Precisa melhorar</option>
              </select>
            </div>
            <label
              htmlFor='avaliacao-comentario'
              className='flex flex-col gap-2 text-sm font-bold text-(--azul-titulo)'
            >
              Seu comentário
              <textarea
                id='avaliacao-comentario'
                rows={4}
                value={comentario}
                onChange={evento => {
                  setComentario(evento.target.value);
                  if (erro) setErro('');
                }}
                placeholder='Conte como foi pontualidade, cuidado e clareza no valor...'
                className='rounded-xl border border-[#dbe5ed] bg-white p-4 font-normal text-(--azul-titulo)'
              />
            </label>
            {erro && (
              <p role='alert' className='text-sm font-semibold text-[#b42318]'>
                {erro}
              </p>
            )}
            {sucesso && (
              <p
                role='status'
                className='rounded-xl border border-[#abefc6] bg-[#ecfdf3] p-3 text-sm font-semibold text-[#18794e]'
              >
                Avaliação salva neste navegador. Obrigado por compartilhar!
              </p>
            )}
            <Botao type='submit' cor='laranja' classe='w-full'>
              Publicar avaliação
            </Botao>
          </form>
        </aside>
      </div>
    </Container>
  );
}
