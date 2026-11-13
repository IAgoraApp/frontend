import { IconeEstrela, EstrelasAvaliacao } from '../../../compartilhado/interface/IndicadoresFuncionais';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { LinkNavegacao as Link } from '../../../compartilhado/interface/LinkNavegacao';

import {
  Botao,
  ColagemEditorial,
  Container,
  EstadoVazio,
  SeloEditorial,
  Titulo,
} from '../../../compartilhado/interface/indice';
import { urlSegura } from '../../../aplicacao/estado/estadoEmpresa';
import { PlantaIlustradaEmpresa } from '../../empresa/componentes/InterfaceEmpresa';
import fitaFoto from '../../../ativos/vetores/assinaturas/fita-foto.svg';
import tracoCaminho from '../../../ativos/vetores/assinaturas/traco-caminho-canto.svg';
import { fotosMercado } from '../conteudo';

const abasPerfil = [
  { id: 'geral', rotulo: 'Visão geral' },
  { id: 'servicos', rotulo: 'Serviços' },
  { id: 'avaliacoes', rotulo: 'Avaliações' },
  { id: 'fotos', rotulo: 'Fotos' },
  { id: 'localizacao', rotulo: 'Localização' },
];

export default function PerfilEmpresaPublico({
  empresas = [],
  servicos = [],
  avaliacoes = [],
}) {
  const { id } = useParams();
  const [abaAtiva, setAbaAtiva] = useState('geral');

  const empresa = empresas.find(item => item.id === id);

  if (!empresa) {
    return (
      <Container como='main' classe='space-y-6 py-10 pb-16'>
        <EstadoVazio
          varianteAlerta='erro'
          titulo='Empresa não encontrada'
          descricao='Este perfil comercial não está ativo ou não faz mais parte do catálogo.'
          textoAcao='Explorar empresas e serviços'
          rotaAcao='/marketplace'
        />
      </Container>
    );
  }

  const servicosEmpresa = servicos.filter(
    item => item.empresaId === empresa.id
  );
  const servicoPrincipal = servicosEmpresa[0];
  const idsServicosEmpresa = new Set(servicosEmpresa.map(item => item.id));
  const avaliacoesEmpresa = avaliacoes.filter(item =>
    idsServicosEmpresa.has(item.servicoId)
  );
  const galeria = empresa.portfolio?.length
    ? empresa.portfolio
    : [empresa.imagem || fotosMercado.editorialServicos, fotosMercado.empresaFotoUm];
  const siteValido = urlSegura(empresa.site);

  return (
    <Container como='main' classe='space-y-10 py-8 pb-16 sm:py-10'>
      <div>
        <Link
          to='/marketplace'
          className='inline-flex min-h-11 items-center text-sm font-bold text-(--texto-apoio) hover:text-(--laranja-principal)'
        >
 Voltar para empresas e serviços
        </Link>
      </div>

      <section className='grid items-center gap-8 lg:grid-cols-2 lg:gap-12'>
        <div className='min-w-0 space-y-5'>
          {empresa.logo && (
            <img
              src={empresa.logo}
              alt={`Logo de ${empresa.nome}`}
              className='size-20 rounded-full border border-[#dbe5ed] object-cover'
            />
          )}
          <SeloEditorial
            texto={`${empresa.categoria.toUpperCase()} · PERFIL DA EMPRESA`}
          />
          <Titulo
            como='h1'
            classe='text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.08] font-extrabold'
          >
            {empresa.nome}
          </Titulo>
          <p className='text-base font-bold text-(--texto-apoio)'>
            <IconeEstrela /> {empresa.nota || 4.8} ({empresa.totalAvaliacoes || 42} avaliações)
            · {empresa.regiao}
          </p>
          <p className='text-base leading-relaxed text-(--texto-apoio)'>
            {empresa.sobre}
          </p>
          <div className='flex flex-wrap gap-3 pt-1'>
            {servicoPrincipal && (
              <Botao
                como={Link}
                to={`/servicos/${servicoPrincipal.id}/contato`}
                cor='laranja'
                classe='px-7!'
              >
                Solicitar orçamento
              </Botao>
            )}
            <Botao
              como={Link}
              to='/buscar'
              variante='secundario'
            >
              Ver outros serviços
            </Botao>
          </div>
          <div className='pt-2'>
            <span className='inline-block rotate-2 bg-(--azul-titulo) px-5 py-2.5 text-xs font-bold tracking-[0.7px] text-white uppercase'>
              INDEPENDÊNCIA NA VIDA REAL
            </span>
          </div>
        </div>

        <ColagemEditorial largura={539} altura={610}>
          <div
            data-movimento-editorial
            className='absolute top-7 left-[87px] h-[375px] w-[300px] rotate-6 border-8 border-white bg-white shadow-lg'
          >
            <img
              src={empresa.imagem || fotosMercado.editorialServicos}
              alt={empresa.nome}
              className='size-full object-cover'
            />
          </div>
          <div
            data-movimento-editorial
            className='absolute top-[378px] left-0 h-[164px] w-[230px] rotate-7 border-8 border-white bg-white shadow-lg'
          >
            <img
              src={fotosMercado.editorialApartamento}
              alt='Ambiente atendido pela empresa'
              className='size-full object-cover'
            />
          </div>
          <div className='absolute top-[205px] left-7'>
            <PlantaIlustradaEmpresa />
          </div>
          <span className='font-titulo absolute top-[478px] left-[201px] -rotate-4 bg-(--laranja-principal) px-5 py-3 text-sm font-bold text-white shadow-sm'>
            cuidado que dá confiança
          </span>
          <img
            src={tracoCaminho}
            alt=''
            className='absolute top-[532px] left-[121px]'
          />
          <img
            src={fitaFoto}
            alt=''
            className='absolute top-3 left-[216px] rotate-9'
          />
        </ColagemEditorial>
      </section>

      <nav
        aria-label='Seções do perfil da empresa'
        className='flex flex-wrap gap-2 border-b border-[#e6edf2] pb-4'
      >
        {abasPerfil.map(aba => (
          <button
            key={aba.id}
            type='button'
            aria-pressed={abaAtiva === aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            className={`min-h-11 cursor-pointer rounded-full px-5 text-sm font-bold transition-colors ${
              abaAtiva === aba.id
                ? 'bg-(--azul-titulo) text-white'
                : 'border border-[#dbe5ed] bg-[#f4f7fa] text-(--azul-titulo) hover:border-(--laranja-principal)'
            }`}
          >
            {aba.rotulo}
          </button>
        ))}
      </nav>

      {abaAtiva === 'geral' && (
        <div className='grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]'>
          <section className='space-y-6 rounded-2xl border border-[#dbe5ed] bg-white p-6 sm:p-8'>
            <Titulo
              como='h2'
              classe='text-2xl font-extrabold text-(--azul-titulo)'
            >
              Cuidado de verdade com o seu espaço
            </Titulo>
            <p className='leading-relaxed whitespace-pre-wrap text-(--texto-apoio)'>
              {empresa.sobre}
            </p>

            <dl className='grid gap-5 border-t border-[#eef2f5] pt-6 sm:grid-cols-3'>
              <div>
                <dt className='text-xs font-bold text-(--texto-apoio) uppercase'>
                  Categoria
                </dt>
                <dd className='mt-1.5 text-sm font-bold text-(--azul-titulo)'>
                  {empresa.categoria}
                </dd>
              </div>
              <div>
                <dt className='text-xs font-bold text-(--texto-apoio) uppercase'>
                  Atendimento
                </dt>
                <dd className='mt-1.5 text-sm font-bold text-(--azul-titulo)'>
                  {empresa.horario || 'Sob consulta'}
                </dd>
              </div>
              <div>
                <dt className='text-xs font-bold text-(--texto-apoio) uppercase'>
                  Região
                </dt>
                <dd className='mt-1.5 text-sm font-bold text-(--azul-titulo)'>
                  {empresa.regiao}
                </dd>
              </div>
            </dl>

            {siteValido && (
              <a
                href={siteValido}
                target='_blank'
                rel='noreferrer'
                className='inline-flex items-center text-sm font-bold text-(--laranja-principal) hover:underline'
              >
                Site ou portfólio externo
              </a>
            )}
          </section>

          <aside className='space-y-4 rounded-2xl border border-[#f8ccb4] bg-[#fce8dc] p-6'>
            <p className='text-xs font-bold tracking-[0.8px] text-(--laranja-principal) uppercase'>
              INFORMAÇÕES DE CONTATO
            </p>
            <dl className='space-y-3 text-sm'>
              <div>
                <dt className='font-bold text-(--azul-titulo)'>
                  Tempo médio de resposta
                </dt>
                <dd className='text-(--texto-apoio)'>
                  {empresa.tempoResposta || 'Responde no mesmo dia'}
                </dd>
              </div>
              {empresa.telefone && (
                <div>
                  <dt className='font-bold text-(--azul-titulo)'>Telefone</dt>
                  <dd className='text-(--texto-apoio)'>{empresa.telefone}</dd>
                </div>
              )}
              {empresa.email && (
                <div>
                  <dt className='font-bold text-(--azul-titulo)'>E-mail</dt>
                  <dd className='text-(--texto-apoio)'>{empresa.email}</dd>
                </div>
              )}
            </dl>
            {servicoPrincipal && (
              <Botao
                como={Link}
                to={`/servicos/${servicoPrincipal.id}/contato`}
                cor='laranja'
                classe='w-full'
              >
                Enviar mensagem direta
              </Botao>
            )}
          </aside>
        </div>
      )}

      {(abaAtiva === 'geral' || abaAtiva === 'servicos') && (
        <section className='space-y-6'>
          <Titulo
            como='h2'
            classe='text-2xl font-extrabold text-(--azul-titulo) sm:text-3xl'
          >
            Serviços oferecidos por {empresa.nome}
          </Titulo>
          {servicosEmpresa.length ? (
            <div className='grid gap-6 md:grid-cols-2'>
              {servicosEmpresa.map(servico => (
                <article
                  key={servico.id}
                  className='flex flex-col justify-between rounded-2xl border border-[#dbe5ed] bg-white p-5'
                >
                  <div>
                    <img
                      src={servico.imagem}
                      alt={servico.titulo}
                      className='mb-4 aspect-[16/10] w-full rounded-xl object-cover'
                    />
                    <Titulo
                      como='h3'
                      classe='text-xl font-extrabold text-(--azul-titulo)'
                    >
                      {servico.titulo}
                    </Titulo>
                    <p className='mt-2 text-sm leading-relaxed text-(--texto-apoio)'>
                      {servico.descricao}
                    </p>
                  </div>
                  <div className='mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#eef2f5] pt-4'>
                    <span className='text-sm font-extrabold text-(--azul-titulo)'>
                      {servico.preco}
                    </span>
                    <Botao
                      como={Link}
                      to={`/servicos/${servico.id}`}
                      cor='laranja'
                      classe='min-h-[42px]! px-4! text-sm!'
                    >
                      Combinar atendimento
                    </Botao>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EstadoVazio
              titulo='Sem anúncios ativos no momento'
              descricao='Esta empresa ainda não publicou anúncios específicos nesta vitrine.'
              textoAcao='Explorar outros serviços'
              rotaAcao='/buscar'
            />
          )}
        </section>
      )}

      {abaAtiva === 'avaliacoes' && (
        <section className='space-y-4'>
          {avaliacoesEmpresa.length ? (
            <div className='grid gap-4 md:grid-cols-2'>
              {avaliacoesEmpresa.map(item => (
                <article
                  key={item.id}
                  className='rounded-2xl border border-[#dbe5ed] bg-white p-5'
                >
                  <div className='flex items-center justify-between text-xs font-bold'>
                    <span className='text-(--azul-titulo)'>{item.autor}</span>
                    <span className='text-(--laranja-principal)'>
                      <EstrelasAvaliacao nota={item.nota} />
                    </span>
                  </div>
                  <p className='mt-2 text-sm leading-relaxed text-(--texto-apoio)'>
                    {item.comentario}
                  </p>
                  <p className='mt-3 text-xs text-(--texto-apoio)'>{item.data}</p>
                </article>
              ))}
            </div>
          ) : (
            <EstadoVazio
              titulo='Sem avaliações cadastradas ainda'
              descricao='Quando houver novas avaliações nos serviços desta empresa, elas aparecerão aqui.'
              textoAcao='Voltar à visão geral'
              aoClicar={() => setAbaAtiva('geral')}
            />
          )}
        </section>
      )}

      {(abaAtiva === 'fotos' || (abaAtiva === 'geral' && galeria.length > 0)) && (
        <section className='space-y-4'>
          <Titulo
            como='h2'
            classe='text-2xl font-extrabold text-(--azul-titulo)'
          >
            Portfólio em imagens
          </Titulo>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {galeria.map((foto, indice) => (
              <img
                key={`${foto}-${indice}`}
                src={foto}
                alt={`Trabalho realizado por ${empresa.nome} ${indice + 1}`}
                className='aspect-[16/10] w-full rounded-2xl border border-[#dbe5ed] object-cover'
              />
            ))}
          </div>
        </section>
      )}

      {abaAtiva === 'localizacao' && (
        <section className='grid items-center gap-6 rounded-2xl border border-[#dbe5ed] bg-[#f4f7fa] p-6 md:grid-cols-2'>
          <div className='space-y-3'>
            <Titulo
              como='h2'
              classe='text-2xl font-extrabold text-(--azul-titulo)'
            >
              Onde {empresa.nome} atende
            </Titulo>
            <p className='text-base text-(--texto-apoio)'>{empresa.regiao}</p>
            <Botao como={Link} to='/buscar/mapa' variante='secundario'>
              Ver regiões no mapa
            </Botao>
          </div>
          <img
            src={fotosMercado.mapaSaoPaulo}
            alt='Mapa ilustrativo da área de atendimento'
            className='aspect-[16/10] w-full rounded-xl border border-[#dbe5ed] object-cover'
          />
        </section>
      )}
    </Container>
  );
}
