import { LinkNavegacao as Link } from './LinkNavegacao';
import { Botao } from './Botoes';

export function EstadoVazio({
  titulo,
  descricao,
  textoAcao = 'Voltar',
  aoClicar = null,
  rotaAcao = '',
  varianteAlerta = 'neutro',
}) {
  const corBorda =
    varianteAlerta === 'erro'
      ? 'border-[#f4c7c3] bg-[#fef3f2]'
      : varianteAlerta === 'sucesso'
        ? 'border-[#abefc6] bg-[#ecfdf3]'
        : 'border-[#dbe5ed] bg-[#f4f7fa]';

  const corTag =
    varianteAlerta === 'erro'
      ? 'bg-[#b42318] text-white'
      : varianteAlerta === 'sucesso'
        ? 'bg-[#18794e] text-white'
        : 'bg-[#102a43] text-white';

  const rotuloTag =
    varianteAlerta === 'erro'
      ? 'ATENÇÃO'
      : varianteAlerta === 'sucesso'
        ? 'CONCLUÍDO'
        : 'SEM REGISTROS';

  return (
    <div
      className={`flex flex-col items-start gap-4 rounded-2xl border p-8 ${corBorda}`}
    >
      <span
        className={`rounded-full px-3 py-1 text-xs font-bold tracking-[0.7px] ${corTag}`}
      >
        {rotuloTag}
      </span>
      <div className='space-y-2'>
        <h2 className='font-titulo text-2xl font-extrabold text-(--azul-titulo)'>
          {titulo}
        </h2>
        <p className='max-w-xl text-base leading-relaxed text-(--texto-apoio)'>
          {descricao}
        </p>
      </div>
      {rotaAcao ? (
        <Botao como={Link} to={rotaAcao} cor='laranja'>
          {textoAcao}
        </Botao>
      ) : (
        aoClicar && (
          <Botao type='button' onClick={aoClicar} cor='laranja'>
            {textoAcao}
          </Botao>
        )
      )}
    </div>
  );
}
