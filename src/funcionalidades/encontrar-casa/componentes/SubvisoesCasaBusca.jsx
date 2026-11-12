import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Botao,
  CabecalhoSubpagina,
  CampoFormulario,
  EstadoVazio,
  Titulo,
} from '../../../compartilhado/interface/indice';
import { formatarMoeda } from '../../calculadoras/conteudo';
import { imoveisExemplo } from '../conteudo';

function CartaoResultadoImovel({
  imovel,
  favorito,
  comparado,
  aoAlternarFavorito,
  aoAlternarComparar,
  aoAbrirDetalhe,
}) {
  return (
    <article className='flex flex-col gap-5 rounded-xl bg-(--azul-fundo) p-4 sm:flex-row sm:items-center sm:p-5'>
      <img
        src={imovel.imagem}
        alt={imovel.alt}
        className='aspect-16/10 w-full shrink-0 rounded-lg object-cover sm:w-64'
      />
      <div className='min-w-0 flex-1 space-y-2'>
        <h2 className='font-titulo text-xl font-extrabold text-(--azul-titulo) sm:text-2xl'>
          {imovel.titulo}
        </h2>
        <p className='text-base font-bold text-(--azul-titulo)'>
          {formatarMoeda(imovel.total, 0)} / mês · aluguel
          {imovel.condominio ? ' + condomínio' : ''}
        </p>
        <p className='text-sm text-(--texto-apoio)'>
          {imovel.quartos} {imovel.quartos === 1 ? 'quarto' : 'quartos'} ·{' '}
          {imovel.area} m² · Transporte nas proximidades
        </p>
        <div className='flex flex-wrap gap-3 pt-2'>
          <Botao
            type='button'
            cor='laranja'
            classe='rounded-full px-6'
            onClick={() => aoAbrirDetalhe(imovel.id)}
          >
            Ver imóvel
          </Botao>
          <Botao
            type='button'
            variante='secundario'
            classe='rounded-full border border-[#dbe5ed] bg-white px-5'
            onClick={() => aoAlternarFavorito(imovel.id)}
          >
            {favorito ? '♥ Salvo' : '♡ Salvar'}
          </Botao>
          {aoAlternarComparar && (
            <Botao
              type='button'
              variante='secundario'
              classe='rounded-full border border-[#dbe5ed] bg-white px-5'
              onClick={() => aoAlternarComparar(imovel.id)}
            >
              {comparado ? '✓ Na comparação' : 'Comparar'}
            </Botao>
          )}
        </div>
      </div>
    </article>
  );
}

export function VisaoBuscar({ filtros, aoAlterarFiltro, aoAbrirVisao }) {
  return (
    <div className='space-y-6'>
      <CabecalhoSubpagina
        aoVoltar={() => aoAbrirVisao('hub')}
        rotuloVoltar='← Voltar'
        selo='SEU PRÓXIMO ENDEREÇO'
        titulo='Um lugar que cabe nos seus planos.'
        subtitulo='Pesquise cidade, bairro e custo total. Dados ilustrativos.'
        assinatura='chave'
        etiquetaAssinatura='DO SEU JEITO ↗'
      />

      <form
        onSubmit={e => {
          e.preventDefault();
          aoAbrirVisao('resultados');
        }}
        className='space-y-5'
      >
        <CampoFormulario
          id='casa-busca-local'
          rotulo='Cidade ou bairro'
          placeholder='São Paulo · Vila Mariana'
          value={filtros.local}
          onChange={e => aoAlterarFiltro('local', e.target.value)}
        />
        <div className='flex flex-wrap gap-3'>
          <Botao type='submit' cor='laranja' classe='rounded-full px-7'>
            Buscar imóveis
          </Botao>
          <Botao
            type='button'
            variante='secundario'
            classe='rounded-full px-7'
            onClick={() => aoAbrirVisao('preferencias')}
          >
            Refinar preferências
          </Botao>
          <Botao
            type='button'
            variante='secundario'
            classe='rounded-full px-7'
            onClick={() => aoAbrirVisao('favoritos')}
          >
            Meus favoritos
          </Botao>
        </div>
      </form>
    </div>
  );
}

export function VisaoResultados({
  imoveis,
  favoritos,
  comparados,
  aoAlternarFavorito,
  aoAlternarComparar,
  aoLimparFiltros,
  aoAbrirVisao,
}) {
  return (
    <div className='space-y-6'>
      <CabecalhoSubpagina
        aoVoltar={() => aoAbrirVisao('buscar')}
        rotuloVoltar='← Voltar'
        selo='SEU PRÓXIMO ENDEREÇO'
        titulo='Opções para o seu próximo canto.'
        subtitulo='Imóveis de exemplo · Valores e disponibilidade ilustrativos.'
        assinatura='chave'
        etiquetaAssinatura='DO SEU JEITO ↗'
      />

      <div className='flex flex-wrap gap-3'>
        <Botao
          type='button'
          cor='laranja'
          classe='rounded-full px-7'
          onClick={() => aoAbrirVisao('preferencias')}
        >
          Filtros
        </Botao>
        <Botao
          type='button'
          variante='secundario'
          classe='rounded-full px-7'
          onClick={() => aoAbrirVisao('comparar')}
        >
          Comparar selecionados ({comparados.length})
        </Botao>
      </div>

      {imoveis.length ? (
        <div className='space-y-4'>
          {imoveis.map(imovel => (
            <CartaoResultadoImovel
              key={imovel.id}
              imovel={imovel}
              favorito={favoritos.includes(imovel.id)}
              comparado={comparados.includes(imovel.id)}
              aoAlternarFavorito={aoAlternarFavorito}
              aoAlternarComparar={aoAlternarComparar}
              aoAbrirDetalhe={id => aoAbrirVisao('detalhe', id)}
            />
          ))}
        </div>
      ) : (
        <EstadoVazio
          titulo='Nenhum imóvel com esses filtros'
          descricao='Tente aumentar o valor máximo ou limpar algum critério de busca.'
          textoAcao='Limpar filtros'
          aoClicar={aoLimparFiltros}
        />
      )}
    </div>
  );
}

export function VisaoFavoritos({
  favoritos,
  aoAlternarFavorito,
  aoAbrirVisao,
}) {
  const salvos = imoveisExemplo.filter(item => favoritos.includes(item.id));

  return (
    <div className='space-y-6'>
      <CabecalhoSubpagina
        aoVoltar={() => aoAbrirVisao('hub')}
        rotuloVoltar='← Voltar'
        selo='SEU PRÓXIMO ENDEREÇO'
        titulo='Seus cantos favoritos.'
        subtitulo='Imóveis de exemplo · Valores e disponibilidade ilustrativos.'
        assinatura='chave'
        etiquetaAssinatura='DO SEU JEITO ↗'
      />

      {salvos.length ? (
        <div className='space-y-4'>
          {salvos.map(imovel => (
            <CartaoResultadoImovel
              key={imovel.id}
              imovel={imovel}
              favorito
              aoAlternarFavorito={aoAlternarFavorito}
              aoAbrirDetalhe={id => aoAbrirVisao('detalhe', id)}
            />
          ))}
        </div>
      ) : (
        <EstadoVazio
          titulo='Você ainda não salvou nenhum imóvel'
          descricao='Explore as opções disponíveis e salve seus favoritos para comparar com calma.'
          textoAcao='Explorar imóveis'
          aoClicar={() => aoAbrirVisao('resultados')}
        />
      )}
    </div>
  );
}

export function VisaoPreferencias({
  filtros,
  aoAlterarFiltro,
  aoLimparFiltros,
  aoAbrirVisao,
}) {
  return (
    <div className='space-y-6'>
      <CabecalhoSubpagina
        aoVoltar={() => aoAbrirVisao('resultados')}
        rotuloVoltar='← Voltar'
        selo='SEU PRÓXIMO ENDEREÇO'
        titulo='O que seu novo canto precisa ter?'
        subtitulo='Ajuste os critérios para comparar opções.'
        assinatura=''
      />

      <div className='grid items-start gap-6 lg:grid-cols-[1fr_320px]'>
        <form
          onSubmit={e => {
            e.preventDefault();
            aoAbrirVisao('resultados');
          }}
          className='space-y-4 rounded-xl bg-(--azul-fundo) p-5 sm:p-7'
        >
          <CampoFormulario
            id='pref-local'
            rotulo='Cidade ou bairro'
            placeholder='São Paulo · Vila Mariana'
            value={filtros.local}
            onChange={e => aoAlterarFiltro('local', e.target.value)}
            classeEntrada='bg-white'
          />
          <CampoFormulario
            id='pref-teto'
            rotulo='Custo máximo total'
            placeholder='1.600,00'
            value={filtros.teto}
            onChange={e => aoAlterarFiltro('teto', e.target.value)}
            classeEntrada='bg-white'
          />
          <CampoFormulario
            id='pref-tipo'
            rotulo='Tipo de imóvel'
            placeholder='Apartamento ou studio'
            value={filtros.tipo}
            onChange={e => aoAlterarFiltro('tipo', e.target.value)}
            classeEntrada='bg-white'
          />
          <div className='grid gap-4 sm:grid-cols-2'>
            <CampoFormulario
              id='pref-quartos'
              rotulo='Quartos'
              placeholder='1 ou mais'
              value={filtros.quartos}
              onChange={e => aoAlterarFiltro('quartos', e.target.value)}
              classeEntrada='bg-white'
            />
            <CampoFormulario
              id='pref-distancia'
              rotulo='Distância desejada'
              placeholder='Até 30 minutos do trabalho'
              value={filtros.distancia}
              onChange={e => aoAlterarFiltro('distancia', e.target.value)}
              classeEntrada='bg-white'
            />
          </div>

          <div className='space-y-2.5 pt-2'>
            {[
              ['aceitaPet', 'Aceita pet'],
              ['proximoTransporte', 'Próximo de transporte'],
              ['mobiliado', 'Mobiliado'],
            ].map(([chave, rotulo]) => (
              <label
                key={chave}
                className='flex cursor-pointer items-center gap-3.5 rounded-xl bg-white p-4'
              >
                <input
                  type='checkbox'
                  checked={Boolean(filtros[chave])}
                  onChange={e => aoAlterarFiltro(chave, e.target.checked)}
                  className='size-5 shrink-0 accent-(--laranja-principal)'
                />
                <span>
                  <strong className='block text-sm font-bold text-(--azul-titulo)'>
                    {rotulo}
                  </strong>
                  <span className='text-xs text-(--texto-apoio)'>
                    Preferência opcional
                  </span>
                </span>
              </label>
            ))}
          </div>

          <div className='flex flex-wrap gap-3 pt-2'>
            <Botao type='submit' cor='laranja' classe='rounded-full px-7'>
              Aplicar filtros
            </Botao>
            <Botao
              type='button'
              variante='secundario'
              classe='rounded-full border border-[#dbe5ed] bg-white px-7'
              onClick={aoLimparFiltros}
            >
              Limpar filtros
            </Botao>
          </div>
        </form>

        <aside className='space-y-4 rounded-xl bg-(--laranja-fundo) p-6'>
          <p className='text-[11px] font-bold tracking-wider text-(--azul-titulo) uppercase'>
            ANTES DE ESCOLHER
          </p>
          <Titulo classe='text-2xl font-extrabold'>
            Um filtro para a sua rotina.
          </Titulo>
          <div>
            <strong className='block text-sm font-bold text-(--azul-titulo)'>
              Olhe o gasto total
            </strong>
            <p className='text-sm text-(--texto-apoio)'>
              Aluguel, condomínio, contas e deslocamento.
            </p>
          </div>
          <div>
            <strong className='block text-sm font-bold text-(--azul-titulo)'>
              Defina o que vem primeiro
            </strong>
            <p className='text-sm text-(--texto-apoio)'>
              Preço, região, espaço ou tempo de transporte.
            </p>
          </div>
          <Botao
            type='button'
            variante='secundario'
            classe='w-full rounded-full bg-white'
            onClick={() => aoAbrirVisao('resultados')}
          >
            Ver opções do exemplo
          </Botao>
        </aside>
      </div>
    </div>
  );
}

export function VisaoDetalhe({
  imovel,
  favorito,
  comparado,
  aoAlternarFavorito,
  aoAlternarComparar,
  aoAbrirVisao,
}) {
  if (!imovel) {
    return (
      <EstadoVazio
        varianteAlerta='erro'
        titulo='Imóvel não encontrado'
        descricao='Escolha outro imóvel de exemplo para visualizar os detalhes.'
        textoAcao='Ver opções disponíveis'
        aoClicar={() => aoAbrirVisao('resultados')}
      />
    );
  }

  return (
    <div className='space-y-6'>
      <CabecalhoSubpagina
        aoVoltar={() => aoAbrirVisao('resultados')}
        rotuloVoltar='← Voltar'
        selo='SEU PRÓXIMO ENDEREÇO'
        titulo={`${imovel.titulo}.`}
        subtitulo={`${imovel.cidade} · ${imovel.area} m² · ${imovel.quartos} ${imovel.quartos === 1 ? 'quarto' : 'quartos'}.`}
        assinatura=''
      />

      <div className='grid items-start gap-6 lg:grid-cols-[1.45fr_0.95fr]'>
        <div className='space-y-5'>
          <img
            src={imovel.imagem}
            alt={imovel.alt}
            className='aspect-16/10 w-full rounded-xl object-cover'
          />

          <div className='flex flex-wrap gap-3'>
            <Botao
              type='button'
              cor='laranja'
              classe='rounded-full px-7'
              onClick={() => aoAbrirVisao('galeria', imovel.id)}
            >
              Ver fotos
            </Botao>
            <Botao
              type='button'
              variante='secundario'
              classe='rounded-full border border-[#dbe5ed] bg-white px-7'
              onClick={() => aoAlternarFavorito(imovel.id)}
            >
              {favorito ? '♥ Salvo' : '♡ Salvar'}
            </Botao>
            <Botao
              type='button'
              variante='secundario'
              classe='rounded-full border border-[#dbe5ed] bg-white px-7'
              onClick={() => {
                aoAlternarComparar(imovel.id);
                aoAbrirVisao('comparar');
              }}
            >
              {comparado ? '✓ Comparar' : 'Comparar'}
            </Botao>
          </div>

          <div className='grid gap-3 sm:grid-cols-3'>
            {[
              `${imovel.area} m²`,
              `${imovel.quartos} ${imovel.quartos === 1 ? 'quarto' : 'quartos'}`,
              imovel.cidade,
            ].map(info => (
              <div
                key={info}
                className='rounded-lg bg-(--azul-fundo) p-4 text-sm font-bold text-(--azul-titulo)'
              >
                {info}
              </div>
            ))}
          </div>

          <div className='space-y-2 pt-2'>
            <Titulo classe='text-2xl font-extrabold'>Sobre este imóvel</Titulo>
            <p className='text-sm leading-relaxed text-(--texto-apoio)'>
              {imovel.descricao}
            </p>
            <p className='text-sm leading-relaxed text-(--texto-apoio)'>
              Confira diretamente com o anunciante os itens incluídos, condições
              de garantia, disponibilidade e valores completos.
            </p>
          </div>
        </div>

        <aside className='space-y-3'>
          <div className='rounded-xl border border-[#dbe5ed] bg-white p-5'>
            <p className='text-xs text-(--texto-apoio)'>Aluguel</p>
            <p className='font-titulo mt-1 text-2xl font-extrabold text-(--azul-titulo)'>
              {formatarMoeda(imovel.aluguel, 0)}
            </p>
          </div>
          <div className='rounded-xl border border-[#dbe5ed] bg-white p-5'>
            <p className='text-xs text-(--texto-apoio)'>Condomínio</p>
            <p className='font-titulo mt-1 text-2xl font-extrabold text-(--azul-titulo)'>
              {imovel.condominio
                ? formatarMoeda(imovel.condominio, 0)
                : 'Incluso / R$ 0'}
            </p>
          </div>
          <div className='rounded-xl bg-(--azul-titulo) p-5 text-white'>
            <p className='text-xs text-white/80'>Total informado</p>
            <p className='font-titulo mt-1 text-3xl font-extrabold text-white'>
              {formatarMoeda(imovel.total, 0)}
            </p>
          </div>

          <Botao
            type='button'
            cor='laranja'
            classe='w-full rounded-full'
            onClick={() => aoAbrirVisao('contato', imovel.id)}
          >
            Falar com o anunciante
          </Botao>
          <Botao
            type='button'
            variante='secundario'
            classe='w-full rounded-full'
            onClick={() => aoAbrirVisao('impacto', imovel.id)}
          >
            Ver impacto no orçamento
          </Botao>

          <div className='rounded-xl bg-(--laranja-fundo) p-5'>
            <p className='text-[11px] font-bold tracking-wider text-(--azul-titulo) uppercase'>
              ANTES DE COMBINAR A VISITA
            </p>
            <p className='mt-2 text-sm text-(--azul-titulo)'>
              Confirme disponibilidade, valores completos e condições
              diretamente com o anunciante.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function VisaoGaleria({ imovel, aoAbrirVisao }) {
  const alvo = imovel || imoveisExemplo[0];
  const fotos = alvo.galeria?.length ? alvo.galeria : [alvo.imagem];
  const [indiceAtivo, setIndiceAtivo] = useState(0);

  return (
    <div className='space-y-6'>
      <CabecalhoSubpagina
        aoVoltar={() => aoAbrirVisao('detalhe', alvo.id)}
        rotuloVoltar='← Voltar'
        selo='SEU PRÓXIMO ENDEREÇO'
        titulo='Um olhar por dentro.'
        subtitulo='Fotos ilustrativas para explorar a composição.'
        assinatura='chave'
        etiquetaAssinatura='DO SEU JEITO ↗'
      />

      <img
        src={fotos[indiceAtivo] || fotos[0]}
        alt={alvo.alt}
        className='aspect-16/9 max-h-[540px] w-full rounded-xl object-cover'
      />

      <div className='grid gap-4 sm:grid-cols-3'>
        {fotos.map((src, indice) => (
          <button
            key={src + indice}
            type='button'
            onClick={() => setIndiceAtivo(indice)}
            className={
              'overflow-hidden rounded-lg border-2 transition-transform ' +
              (indiceAtivo === indice
                ? 'border-(--laranja-principal)'
                : 'border-transparent opacity-80 hover:opacity-100')
            }
          >
            <img
              src={src}
              alt={`${alvo.titulo} — foto ${indice + 1}`}
              className='aspect-16/10 w-full object-cover'
            />
          </button>
        ))}
      </div>

      <Botao
        type='button'
        cor='laranja'
        classe='rounded-full px-7'
        onClick={() => aoAbrirVisao('detalhe', alvo.id)}
      >
        Voltar ao imóvel
      </Botao>
    </div>
  );
}

export function VisaoComparar({ comparados, aoAbrirVisao }) {
  const selecionados = imoveisExemplo.filter(item =>
    comparados.includes(item.id)
  );
  const lista =
    selecionados.length >= 2 ? selecionados.slice(0, 2) : imoveisExemplo.slice(0, 2);

  return (
    <div className='space-y-6'>
      <CabecalhoSubpagina
        aoVoltar={() => aoAbrirVisao('resultados')}
        rotuloVoltar='← Voltar'
        selo='SEU PRÓXIMO ENDEREÇO'
        titulo='Compare antes de decidir.'
        subtitulo='Os valores são demonstrativos e precisam ser confirmados.'
        assinatura='chave'
        etiquetaAssinatura='DO SEU JEITO ↗'
      />

      <div className='grid gap-6 md:grid-cols-2'>
        {lista.map(imovel => (
          <article
            key={imovel.id}
            className='space-y-3 rounded-xl bg-(--azul-fundo) p-5'
          >
            <img
              src={imovel.imagem}
              alt={imovel.alt}
              className='aspect-16/10 w-full rounded-lg object-cover'
            />
            <h2 className='font-titulo text-2xl font-extrabold text-(--azul-titulo)'>
              {imovel.bairro}
            </h2>
            <p className='text-lg font-bold text-(--azul-titulo)'>
              {formatarMoeda(imovel.total, 0)} / mês
            </p>
            <p className='text-sm text-(--texto-apoio)'>
              {imovel.area} m² · {imovel.quartos}{' '}
              {imovel.quartos === 1 ? 'quarto' : 'quartos'}
            </p>
            <p className='text-xs text-(--texto-apoio)'>
              Transporte próximo · Informação ilustrativa
            </p>
            <Botao
              type='button'
              cor='laranja'
              classe='rounded-full px-7'
              onClick={() => aoAbrirVisao('detalhe', imovel.id)}
            >
              Ver detalhes
            </Botao>
          </article>
        ))}
      </div>

      <Botao
        como={Link}
        to='/planejamento?visao=realidade'
        cor='laranja'
        classe='rounded-full px-7'
      >
        Ajustar meu orçamento
      </Botao>
    </div>
  );
}

export function VisaoImpacto({ imovel, rendaMensal, aoAbrirVisao }) {
  const alvo = imovel || imoveisExemplo[0];
  const renda = Number(rendaMensal) || 3200;
  const outrosGastos = 1200;
  const margem = renda - alvo.total - outrosGastos;

  return (
    <div className='space-y-6'>
      <CabecalhoSubpagina
        aoVoltar={() => aoAbrirVisao('detalhe', alvo.id)}
        rotuloVoltar='← Voltar'
        selo='SEU PRÓXIMO ENDEREÇO'
        titulo='Como esse canto entra no seu mês?'
        subtitulo='Simulação a partir dos valores de exemplo.'
        assinatura='chave'
        etiquetaAssinatura='DO SEU JEITO ↗'
      />

      <div className='grid gap-4 md:grid-cols-3'>
        {[
          ['Renda', renda],
          ['Moradia informada', alvo.total],
          ['Outros gastos estimados', outrosGastos],
        ].map(([rotulo, valor]) => (
          <div
            key={rotulo}
            className='rounded-xl border border-[#dbe5ed] bg-white p-5'
          >
            <p className='text-xs text-(--texto-apoio)'>{rotulo}</p>
            <p className='font-titulo mt-1 text-3xl font-extrabold text-(--azul-titulo)'>
              {formatarMoeda(valor, 0)}
            </p>
            <span className='mt-2 inline-block h-[3px] w-14 -rotate-2 rounded-full bg-(--laranja-principal)' />
          </div>
        ))}
      </div>

      <div className='rounded-xl bg-(--azul-fundo) p-5'>
        <strong className='block text-base font-bold text-(--azul-titulo)'>
          Margem estimada: {formatarMoeda(margem, 2)}
        </strong>
        <p className='mt-1 text-sm text-(--texto-apoio)'>
          Renda menos moradia e outros custos. Ainda considere garantia,
          mudança, reajustes e imprevistos.
        </p>
      </div>

      <div className='flex flex-wrap gap-3'>
        <Botao
          como={Link}
          to='/planejamento?visao=realidade'
          cor='laranja'
          classe='rounded-full px-7'
        >
          Ajustar meu cenário
        </Botao>
        <Botao
          type='button'
          variante='secundario'
          classe='rounded-full px-7'
          onClick={() => aoAbrirVisao('detalhe', alvo.id)}
        >
          Voltar ao imóvel
        </Botao>
      </div>
    </div>
  );
}

export function VisaoContato({ imovel, nomeUsuario, aoAbrirVisao }) {
  const alvo = imovel || imoveisExemplo[0];
  const [nome, setNome] = useState(nomeUsuario || 'Ana Silva');
  const [mensagem, setMensagem] = useState(
    'Olá! Gostaria de confirmar a disponibilidade e agendar uma visita.'
  );
  const [enviado, setEnviado] = useState(false);

  return (
    <div className='space-y-6'>
      <CabecalhoSubpagina
        aoVoltar={() => aoAbrirVisao('detalhe', alvo.id)}
        rotuloVoltar='← Voltar'
        selo='SEU PRÓXIMO ENDEREÇO'
        titulo='Uma conversa antes da decisão.'
        subtitulo='Confira os dados com o anunciante.'
        assinatura=''
      />

      <div className='grid items-start gap-6 lg:grid-cols-[1fr_320px]'>
        {enviado ? (
          <EstadoVazio
            varianteAlerta='sucesso'
            titulo='Solicitação registrada neste protótipo'
            descricao='Você simulou o envio da mensagem para confirmar visita e valores.'
            textoAcao='Voltar ao imóvel'
            aoClicar={() => aoAbrirVisao('detalhe', alvo.id)}
          />
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault();
              setEnviado(true);
            }}
            className='space-y-4 rounded-xl bg-(--azul-fundo) p-5 sm:p-7'
          >
            <CampoFormulario
              id='contato-imovel-nome'
              rotulo='Nome'
              value={nome}
              onChange={e => setNome(e.target.value)}
              classeEntrada='bg-white'
              required
            />
            <div className='flex flex-col gap-1.5'>
              <label
                htmlFor='contato-imovel-msg'
                className='text-sm font-bold text-(--azul-titulo)'
              >
                Mensagem
              </label>
              <textarea
                id='contato-imovel-msg'
                rows={3}
                value={mensagem}
                onChange={e => setMensagem(e.target.value)}
                className='w-full rounded-lg border border-[#dbe5ed] bg-white px-4 py-3 text-base text-(--azul-titulo) focus:outline-2 focus:outline-(--laranja-principal)'
                required
              />
            </div>
            <div>
              <strong className='block text-sm font-bold text-(--azul-titulo)'>
                Contato demonstrativo
              </strong>
              <p className='text-xs text-(--texto-apoio)'>
                Nenhuma mensagem será enviada neste protótipo.
              </p>
            </div>
            <div className='flex flex-wrap gap-3'>
              <Botao type='submit' cor='laranja' classe='rounded-full px-7'>
                Entrar em contato
              </Botao>
              <Botao
                type='button'
                variante='secundario'
                classe='rounded-full border border-[#dbe5ed] bg-white px-7'
                onClick={() => aoAbrirVisao('detalhe', alvo.id)}
              >
                Cancelar
              </Botao>
            </div>
          </form>
        )}

        <aside className='space-y-3 rounded-xl bg-(--laranja-fundo) p-6'>
          <p className='text-[11px] font-bold tracking-wider text-(--azul-titulo) uppercase'>
            SUA PRÓXIMA VISITA
          </p>
          <Titulo classe='text-xl font-extrabold'>{alvo.titulo}</Titulo>
          <p className='text-sm font-bold text-(--azul-titulo)'>
            {formatarMoeda(alvo.total, 0)} por mês
          </p>
          <p className='text-xs text-(--texto-apoio)'>
            Aluguel + condomínio no exemplo.
          </p>
          <div className='pt-2'>
            <strong className='block text-sm font-bold text-(--azul-titulo)'>
              Vale confirmar
            </strong>
            <p className='text-xs text-(--texto-apoio)'>
              Disponibilidade, valores completos e condições para visitar.
            </p>
          </div>
          <Botao
            type='button'
            variante='secundario'
            classe='w-full rounded-full bg-white'
            onClick={() => aoAbrirVisao('detalhe', alvo.id)}
          >
            Rever o imóvel
          </Botao>
        </aside>
      </div>
    </div>
  );
}
