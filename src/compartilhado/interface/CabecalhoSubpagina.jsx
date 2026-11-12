import { Link, useNavigate } from 'react-router-dom';
import { Botao } from './Botoes';
import { SeloEditorial } from './SeloEditorial';
import { AssinaturaEditorial } from './AssinaturaEditorial';

export function CabecalhoSubpagina({
  voltarPara = '',
  aoVoltar = null,
  rotuloVoltar = '← Voltar',
  selo = '',
  titulo,
  subtitulo = '',
  assinatura = 'chave',
  etiquetaAssinatura = 'DO SEU JEITO ↗',
  acoes = null,
}) {
  const navegar = useNavigate();

  return (
    <header className='flex flex-col justify-between gap-6 border-b border-[#e6edf2] pb-8 md:flex-row md:items-center'>
      <div className='flex min-w-0 flex-1 flex-col items-start gap-3.5'>
        {voltarPara ? (
          <Botao
            como={Link}
            to={voltarPara}
            variante='fantasma'
            classe='px-4! min-h-[44px]! border border-[#dbe5ed] text-sm!'
          >
            {rotuloVoltar}
          </Botao>
        ) : (
          <Botao
            type='button'
            onClick={aoVoltar || (() => navegar(-1))}
            variante='fantasma'
            classe='px-4! min-h-[44px]! border border-[#dbe5ed] text-sm!'
          >
            {rotuloVoltar}
          </Botao>
        )}

        {selo && <SeloEditorial texto={selo} />}

        <h1 className='font-titulo text-[clamp(2rem,3.6vw,3rem)] leading-[1.1] font-extrabold text-(--azul-titulo)'>
          {titulo}
        </h1>

        {subtitulo && (
          <p className='max-w-[720px] text-base leading-relaxed text-(--texto-apoio) sm:text-lg'>
            {subtitulo}
          </p>
        )}

        {acoes && <div className='flex flex-wrap gap-3 pt-1'>{acoes}</div>}
      </div>

      {assinatura && (
        <div className='hidden sm:block'>
          <AssinaturaEditorial
            tipo={assinatura}
            etiqueta={etiquetaAssinatura}
          />
        </div>
      )}
    </header>
  );
}
