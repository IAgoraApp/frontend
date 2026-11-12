import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Botao } from '../../../shared/ui/index';
import {
  imagensPadraoEmpresa,
  obterIniciaisNome,
} from '../content';
import { CartaoEmpresa } from './empresaUi';
import EditorFotos from './photoEditor';

export default function MidiasEmpresa({ empresa, aoSalvar }) {
  const navegar = useNavigate();
  const [logo, setLogo] = useState(empresa.logo || '');
  const [fotoComercial, setFotoComercial] = useState(
    empresa.fotoComercial || ''
  );
  const [portfolio, setPortfolio] = useState(empresa.portfolio || []);

  const lidarSalvar = () => {
    const salvo = aoSalvar({
      ...empresa,
      logo,
      fotoComercial,
      portfolio,
    });
    if (salvo) {
      navegar('/empresa/perfil');
    }
  };

  return (
    <div className='space-y-8'>
      <div className='grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]'>
        <div className='space-y-6'>
          <CartaoEmpresa
            titulo='Logo da empresa'
            subtitulo='Use uma marca legível em fundo claro para o cartão público.'
          >
            <EditorFotos
              rotulo='Selecionar logo'
              limite={1}
              fotos={logo ? [logo] : []}
              aoAlterar={lista => setLogo(lista[0] || '')}
            />
          </CartaoEmpresa>

          <CartaoEmpresa
            titulo='Foto comercial de destaque'
            subtitulo='Imagem exibida no topo da vitrine da empresa no Marketplace.'
          >
            <EditorFotos
              rotulo='Selecionar foto comercial'
              limite={1}
              fotos={fotoComercial ? [fotoComercial] : []}
              aoAlterar={lista => setFotoComercial(lista[0] || '')}
            />
          </CartaoEmpresa>

          <CartaoEmpresa
            titulo='Portfólio de atendimentos'
            subtitulo='Adicione até 6 fotos mostrando o antes e depois ou sua equipe em ação.'
          >
            <EditorFotos
              rotulo='Adicionar fotos ao portfólio'
              limite={6}
              fotos={portfolio}
              aoAlterar={setPortfolio}
            />
          </CartaoEmpresa>
        </div>

        <aside className='space-y-5 lg:sticky lg:top-6'>
          <CartaoEmpresa
            titulo='Prévia da identidade'
            subtitulo='Veja como logo e capa ficam combinados.'
            classe='bg-[#f4f7fa]!'
          >
            <div className='overflow-hidden rounded-2xl border border-[#dbe5ed] bg-white'>
              <img
                src={fotoComercial || imagensPadraoEmpresa.equipe}
                alt='Prévia da foto comercial'
                className='aspect-[16/9] w-full object-cover'
              />
              <div className='flex items-center gap-4 p-5'>
                {logo ? (
                  <img
                    src={logo}
                    alt='Prévia da logo'
                    className='size-14 rounded-full border border-[#dbe5ed] object-contain'
                  />
                ) : (
                  <span className='font-titulo flex size-14 shrink-0 items-center justify-center rounded-full bg-[#fce8dc] text-lg font-extrabold text-(--laranja-principal)'>
                    {obterIniciaisNome(empresa.nome)}
                  </span>
                )}
                <div className='min-w-0'>
                  <p className='font-titulo truncate text-lg font-extrabold text-(--azul-titulo)'>
                    {empresa.nome}
                  </p>
                  <p className='text-xs text-(--texto-apoio)'>
                    {portfolio.length
                      ? `${portfolio.length} foto(s) no portfólio`
                      : 'Usando galeria ilustrativa até o envio'}
                  </p>
                </div>
              </div>
            </div>

            <div className='mt-6 flex flex-col gap-3'>
              <Botao type='button' cor='laranja' onClick={lidarSalvar}>
                Salvar imagens ↗
              </Botao>
              <Botao
                como={Link}
                to='/empresa/perfil'
                variante='secundario'
                classe='border border-[#dbe5ed] bg-white!'
              >
                Voltar ao perfil
              </Botao>
            </div>
          </CartaoEmpresa>
        </aside>
      </div>
    </div>
  );
}
