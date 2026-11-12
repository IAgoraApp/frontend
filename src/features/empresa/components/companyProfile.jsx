import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Botao,
  CampoFormulario,
  Titulo,
} from '../../../shared/ui/index';
import {
  categoriasEmpresa,
  urlSegura,
} from '../../../app/estado/estadoEmpresa';
import {
  imagensPadraoEmpresa,
  obterIniciaisNome,
} from '../content';
import {
  CartaoEmpresa,
  PlantaIlustradaEmpresa,
  SelecaoEmpresa,
} from './empresaUi';

export default function PerfilEmpresa({ empresa, aoSalvar }) {
  const [valores, setValores] = useState(empresa);
  const [erro, setErro] = useState('');

  const alterarCampo = evento => {
    const { name, value } = evento.target;
    setValores(anterior => ({ ...anterior, [name]: value }));
  };

  const lidarEnvio = evento => {
    evento.preventDefault();
    if (
      !valores.nome.trim() ||
      !valores.regiao.trim() ||
      !valores.sobre.trim()
    ) {
      setErro(
        'Informe o nome da empresa, a região de atendimento e a apresentação.'
      );
      return;
    }
    if (valores.site && !urlSegura(valores.site)) {
      setErro('Informe um site válido começando com https:// ou http://.');
      return;
    }
    setErro('');
    aoSalvar({ ...valores, nome: valores.nome.trim() });
  };

  const galeriaExibida = valores.portfolio.length
    ? valores.portfolio
    : [
        imagensPadraoEmpresa.fotoComercialUm,
        imagensPadraoEmpresa.fotoComercialDois,
        imagensPadraoEmpresa.portfolioAmostra,
      ];

  return (
    <form noValidate onSubmit={lidarEnvio} className='space-y-10'>
      <section className='flex flex-col items-start justify-between gap-6 border-b border-[#e6edf2] pb-8 md:flex-row md:items-center'>
        <div className='max-w-[680px] space-y-3'>
          <p className='text-xs font-bold tracking-[0.8px] text-(--laranja-principal) uppercase'>
            PERFIL DA EMPRESA / PRESENÇA COM PERSONALIDADE
          </p>
          <Titulo
            como='h2'
            classe='text-[clamp(2rem,4vw,3.25rem)] leading-[1.06] font-extrabold'
          >
            Sua empresa.
            <span className='block text-(--laranja-principal)'>
              Sua assinatura.
            </span>
          </Titulo>
        </div>
        <PlantaIlustradaEmpresa className='hidden sm:block' />
      </section>

      <div className='grid items-start gap-8 lg:grid-cols-[360px_minmax(0,1fr)]'>
        <aside className='flex flex-col items-center rounded-2xl bg-[#102a43] p-7 text-center text-white'>
          <p className='self-start text-xs font-bold tracking-[0.7px] text-[#ffb591] uppercase'>
            IDENTIDADE PÚBLICA
          </p>

          <div className='my-7 flex size-32 items-center justify-center overflow-hidden rounded-full bg-white p-2 shadow-sm'>
            {valores.logo ? (
              <img
                src={valores.logo}
                alt={`Logo de ${valores.nome}`}
                className='size-full rounded-full object-contain'
              />
            ) : (
              <span className='font-titulo flex size-full items-center justify-center rounded-full bg-[#fce8dc] text-3xl font-extrabold text-(--laranja-principal)'>
                {obterIniciaisNome(valores.nome)}
              </span>
            )}
          </div>

          <h3 className='font-titulo text-2xl font-extrabold text-white'>
            {valores.nome || 'Sua empresa'}
          </h3>
          <p className='mt-2 text-sm text-white/80'>
            {valores.categoria} · {valores.regiao}
          </p>

          <div className='mt-7 flex w-full flex-col gap-3'>
            <Botao
              como={Link}
              to={`/empresas/${empresa.id}`}
              cor='laranja'
              classe='w-full'
            >
              Ver perfil público ↗
            </Botao>
            <Botao
              como={Link}
              to='/empresa/perfil/midias'
              variante='fantasma'
              classe='w-full'
            >
              Alterar logo e fotos ↗
            </Botao>
          </div>
        </aside>

        <CartaoEmpresa
          titulo='Informações da empresa'
          subtitulo='Esses dados aparecem no perfil público e nas solicitações do Marketplace.'
          classe='bg-[#f4f7fa]!'
        >
          <div className='grid gap-5 sm:grid-cols-2'>
            {[
              ['nome', 'Nome da empresa', 'text', true],
              ['email', 'E-mail de contato', 'email', true],
              ['telefone', 'Telefone comercial', 'tel', false],
              ['regiao', 'Região de atendimento', 'text', true],
              ['endereco', 'Endereço comercial (opcional)', 'text', false],
              ['site', 'Site, redes sociais ou portfólio', 'url', false],
              ['horario', 'Horário de atendimento', 'text', false],
            ].map(([nomeCampo, rotulo, tipo, obrigatorio]) => (
              <CampoFormulario
                key={nomeCampo}
                id={`empresa-${nomeCampo}`}
                name={nomeCampo}
                rotulo={rotulo}
                type={tipo}
                required={obrigatorio}
                value={valores[nomeCampo]}
                onChange={alterarCampo}
                maxLength={200}
              />
            ))}

            <SelecaoEmpresa
              id='empresa-categoria'
              name='categoria'
              rotulo='Categoria principal'
              value={valores.categoria}
              onChange={alterarCampo}
            >
              {categoriasEmpresa.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </SelecaoEmpresa>
          </div>

          <div className='mt-5 flex flex-col gap-2'>
            <label
              htmlFor='empresa-sobre'
              className='text-sm font-bold text-(--azul-titulo)'
            >
              Sobre a empresa
            </label>
            <textarea
              id='empresa-sobre'
              name='sobre'
              rows={5}
              required
              maxLength={2000}
              value={valores.sobre}
              onChange={alterarCampo}
              className='w-full rounded-lg border border-[#dbe5ed] bg-white p-4 text-base text-(--azul-titulo) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--laranja-principal)'
            />
          </div>

          {erro && (
            <p
              role='alert'
              className='mt-5 rounded-xl border border-[#f4c7c3] bg-[#fef3f2] p-4 text-sm font-semibold text-[#b42318]'
            >
              {erro}
            </p>
          )}

          <div className='mt-6 flex flex-wrap gap-3'>
            <Botao type='submit' cor='laranja' classe='px-7!'>
              Salvar perfil da empresa ↗
            </Botao>
            <Botao
              como={Link}
              to='/empresa/perfil/midias'
              variante='fantasma'
              classe='border border-[#dbe5ed]'
            >
              Gerenciar logo e portfólio
            </Botao>
          </div>
        </CartaoEmpresa>
      </div>

      <section className='space-y-5'>
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='text-xs font-bold tracking-[0.8px] text-(--laranja-principal) uppercase'>
              SEU TRABALHO EM IMAGENS
            </p>
            <Titulo
              como='h2'
              classe='mt-1.5 text-2xl font-extrabold sm:text-3xl'
            >
              Mostre quem faz acontecer.
            </Titulo>
          </div>
          <Botao
            como={Link}
            to='/empresa/perfil/midias'
            variante='secundario'
            classe='min-h-[44px]!'
          >
            Atualizar galeria ↗
          </Botao>
        </div>

        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {galeriaExibida.map((foto, indice) => (
            <div
              key={`${foto}-${indice}`}
              className='overflow-hidden rounded-2xl border border-[#dbe5ed] bg-white'
            >
              <img
                src={foto}
                alt={`Imagem de trabalho ${indice + 1} da empresa`}
                className='aspect-[16/10] w-full object-cover'
              />
            </div>
          ))}
        </div>

        {!valores.portfolio.length && (
          <p className='text-xs text-(--texto-apoio)'>
            Imagens ilustrativas exibidas como exemplo. Use o botão acima para
            enviar as fotos reais da sua equipe e serviços.
          </p>
        )}
      </section>

      <section className='flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#102a43] p-7 text-white sm:flex-row sm:items-center sm:p-9'>
        <div className='space-y-2'>
          <Titulo
            como='h2'
            classe='text-2xl font-extrabold text-white! sm:text-3xl'
          >
            Pronto para atrair novos clientes?
          </Titulo>
          <p className='text-sm text-white/85 sm:text-base'>
            Com o perfil em dia, crie novos anúncios para aparecer nas buscas.
          </p>
        </div>
        <Botao
          como={Link}
          to='/empresa/anunciar'
          cor='laranja'
          classe='shrink-0 px-7!'
        >
          Anunciar um serviço ↗
        </Botao>
      </section>
    </form>
  );
}
