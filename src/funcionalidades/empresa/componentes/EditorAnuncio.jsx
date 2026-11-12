import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Botao,
  CampoFormulario,
  Titulo,
} from '../../../compartilhado/interface/indice';
import {
  categoriasEmpresa,
  criarAnuncioVazio,
  validarAnuncio,
} from '../../../aplicacao/estado/estadoEmpresa';
import { opcoesAtendimentoEmpresa } from '../conteudo';
import {
  CartaoEmpresa,
  ImagemServicoEmpresa,
  SelecaoEmpresa,
} from './InterfaceEmpresa';
import EditorFotos from './EditorFotos';

export default function EditorAnuncio({ anuncio, empresa, aoSalvar }) {
  const [parametros] = useSearchParams();
  const destacarCampos = parametros.get('estado') === 'campos';
  const [valores, setValores] = useState(
    () => anuncio ?? criarAnuncioVazio(empresa)
  );
  const [erro, setErro] = useState(() =>
    destacarCampos
      ? 'Revise os campos obrigatórios antes de publicar seu serviço.'
      : ''
  );

  const alterarCampo = evento => {
    const { name, value } = evento.target;
    setValores(anterior => ({ ...anterior, [name]: value }));
  };

  function submeterAnuncio(modo) {
    const proximo = {
      ...valores,
      titulo: valores.titulo.trim(),
      descricao: valores.descricao.trim(),
      atualizadoEm: new Date().toISOString(),
    };
    const mensagemErro = modo === 'rascunho' ? '' : validarAnuncio(proximo);
    if (mensagemErro) {
      setErro(mensagemErro);
      return;
    }
    setErro('');
    aoSalvar(proximo, modo);
  }

  const erroCampo = chave => {
    if (!destacarCampos && !erro) return '';
    if (chave === 'titulo' && !valores.titulo.trim()) {
      return 'Informe o título do anúncio.';
    }
    if (chave === 'regiao' && !valores.regiao.trim()) {
      return 'Informe a região de atendimento.';
    }
    if (chave === 'preco' && !valores.preco.trim()) {
      return 'Informe o valor ou faixa de orçamento.';
    }
    if (chave === 'descricao' && !valores.descricao.trim()) {
      return 'Descreva o que está incluído no serviço.';
    }
    return '';
  };

  return (
    <div className='grid items-start gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]'>
      <CartaoEmpresa>
        <form
          noValidate
          className='space-y-6'
          onSubmit={evento => {
            evento.preventDefault();
            submeterAnuncio(anuncio ? 'atualizar' : 'previa');
          }}
        >
          <div className='space-y-1 border-b border-[#e6edf2] pb-4'>
            <p className='text-xs font-bold tracking-[0.8px] text-(--laranja-principal) uppercase'>
              01 / SOBRE O SERVIÇO
            </p>
            <Titulo como='h2' classe='text-xl font-extrabold'>
              O que você está oferecendo
            </Titulo>
          </div>

          <CampoFormulario
            id='anuncio-titulo'
            name='titulo'
            rotulo='Título do anúncio'
            placeholder='Ex.: Limpeza residencial completa'
            value={valores.titulo}
            onChange={alterarCampo}
            erro={erroCampo('titulo')}
            maxLength={140}
            required
          />

          <SelecaoEmpresa
            id='anuncio-categoria'
            name='categoria'
            rotulo='Categoria'
            value={valores.categoria}
            onChange={alterarCampo}
          >
            {categoriasEmpresa.map(categoria => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </SelecaoEmpresa>

          <div className='flex flex-col gap-2'>
            <label
              htmlFor='anuncio-descricao'
              className='text-sm leading-5 font-bold text-(--azul-titulo)'
            >
              Descrição detalhada
            </label>
            <textarea
              id='anuncio-descricao'
              name='descricao'
              rows={5}
              required
              maxLength={2000}
              value={valores.descricao}
              onChange={alterarCampo}
              placeholder='Explique o que está incluído, tempo médio de duração e diferenciais do atendimento.'
              className={`w-full rounded-lg border bg-white p-4 text-base text-(--azul-titulo) placeholder:text-(--texto-apoio) focus-visible:outline-2 focus-visible:outline-offset-2 ${
                erroCampo('descricao')
                  ? 'border-[#b42318] focus-visible:outline-[#b42318]'
                  : 'border-[#dbe5ed] focus-visible:outline-(--laranja-principal)'
              }`}
            />
            {erroCampo('descricao') && (
              <p className='text-sm font-semibold text-[#b42318]'>
                {erroCampo('descricao')}
              </p>
            )}
          </div>

          <div className='space-y-1 border-b border-[#e6edf2] pt-2 pb-4'>
            <p className='text-xs font-bold tracking-[0.8px] text-(--laranja-principal) uppercase'>
              02 / ATENDIMENTO E VALORES
            </p>
            <Titulo como='h2' classe='text-xl font-extrabold'>
              Onde atende e quanto custa
            </Titulo>
          </div>

          <div className='grid gap-5 sm:grid-cols-2'>
            <CampoFormulario
              id='anuncio-regiao'
              name='regiao'
              rotulo='Região atendida'
              value={valores.regiao}
              onChange={alterarCampo}
              erro={erroCampo('regiao')}
              maxLength={140}
              required
            />
            <CampoFormulario
              id='anuncio-preco'
              name='preco'
              rotulo='Preço ou orçamento'
              value={valores.preco}
              onChange={alterarCampo}
              erro={erroCampo('preco')}
              maxLength={100}
              required
            />
            <CampoFormulario
              id='anuncio-telefone'
              name='telefone'
              rotulo='Telefone'
              type='tel'
              value={valores.telefone}
              onChange={alterarCampo}
              maxLength={60}
            />
            <CampoFormulario
              id='anuncio-email'
              name='email'
              rotulo='E-mail'
              type='email'
              value={valores.email}
              onChange={alterarCampo}
              maxLength={120}
            />
          </div>

          <div className='grid gap-5 sm:grid-cols-2'>
            <SelecaoEmpresa
              id='anuncio-atendimento'
              name='atendimento'
              rotulo='Tipo de atendimento'
              value={valores.atendimento}
              onChange={alterarCampo}
            >
              {opcoesAtendimentoEmpresa.map(opcao => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              ))}
            </SelecaoEmpresa>

            <CampoFormulario
              id='anuncio-disponibilidade'
              name='disponibilidade'
              rotulo='Disponibilidade e horários'
              value={valores.disponibilidade}
              onChange={alterarCampo}
              maxLength={140}
            />
          </div>

          <div className='space-y-1 border-b border-[#e6edf2] pt-2 pb-4'>
            <p className='text-xs font-bold tracking-[0.8px] text-(--laranja-principal) uppercase'>
              03 / MOSTRE SEU TRABALHO
            </p>
            <Titulo como='h2' classe='text-xl font-extrabold'>
              Imagens do serviço
            </Titulo>
          </div>

          <EditorFotos
            fotos={valores.fotos}
            aoAlterar={fotos =>
              setValores(anterior => ({ ...anterior, fotos }))
            }
          />

          {erro && (
            <p
              role='alert'
              className='rounded-xl border border-[#f4c7c3] bg-[#fef3f2] p-4 text-sm font-semibold text-[#b42318]'
            >
              {erro}
            </p>
          )}

          <div className='flex flex-wrap gap-3 pt-2'>
            <Botao type='submit' cor='laranja' classe='px-7!'>
              {anuncio ? 'Salvar alterações' : 'Publicar serviço ↗'}
            </Botao>
            <Botao
              type='button'
              variante='secundario'
              onClick={() => submeterAnuncio('previa')}
            >
              Ver prévia
            </Botao>
            {!anuncio && (
              <Botao
                type='button'
                variante='secundario'
                onClick={() => submeterAnuncio('rascunho')}
              >
                Salvar rascunho
              </Botao>
            )}
            <Botao como={Link} to='/empresa/anuncios' variante='fantasma'>
              Cancelar
            </Botao>
          </div>
        </form>
      </CartaoEmpresa>

      <aside className='space-y-5 lg:sticky lg:top-6'>
        <CartaoEmpresa
          titulo='Como seu anúncio aparece'
          subtitulo='Visualização ao vivo do cartão exibido aos moradores.'
          classe='bg-[#f4f7fa]!'
        >
          <div className='overflow-hidden rounded-xl border border-[#dbe5ed] bg-white p-4'>
            <ImagemServicoEmpresa
              anuncio={valores}
              classe='mb-4 aspect-[16/10] rounded-lg'
            />
            <p className='text-xs font-bold tracking-[0.6px] text-(--laranja-principal) uppercase'>
              {empresa.nome}
            </p>
            <h3 className='font-titulo mt-2 text-2xl font-extrabold text-(--azul-titulo)'>
              {valores.titulo || 'Título do seu serviço'}
            </h3>
            <p className='mt-2 text-sm font-semibold text-(--azul-titulo)'>
              {valores.preco || 'Sob orçamento'} ·{' '}
              {valores.regiao || 'Região de atendimento'}
            </p>
            <p className='mt-3 text-sm leading-relaxed whitespace-pre-wrap text-(--texto-apoio)'>
              {valores.descricao ||
                'Uma descrição objetiva ajuda quem mora sozinho a entender o serviço e pedir contato rapidamente.'}
            </p>
          </div>

          <div className='mt-5'>
            <Botao
              como={Link}
              to={`/empresas/${empresa.id}`}
              variante='secundario'
              classe='w-full'
            >
              Ver perfil público ↗
            </Botao>
          </div>
        </CartaoEmpresa>
      </aside>
    </div>
  );
}
