export function CampoFormulario({
  id,
  rotulo,
  erro = '',
  dica = '',
  classe = '',
  classeEntrada = '',
  classeRotulo = '',
  ...propriedadesEntrada
}) {
  const temErro = Boolean(erro);
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${classe}`}>
      <label
        htmlFor={id}
        className={`text-sm leading-5 font-bold text-(--azul-titulo) ${classeRotulo}`}
      >
        {rotulo}
      </label>
      <input
        id={id}
        aria-invalid={temErro || undefined}
        className={`h-[52px] w-full min-w-0 rounded-lg border bg-white px-4 text-base leading-6 text-(--azul-titulo) placeholder:text-(--texto-apoio) focus-visible:outline-2 focus-visible:outline-offset-2 ${
          temErro
            ? 'border-[#b42318] focus-visible:outline-[#b42318]'
            : 'border-[#dbe5ed] focus-visible:outline-(--laranja-principal)'
        } ${classeEntrada}`}
        {...propriedadesEntrada}
      />
      {temErro && (
        <p className='text-sm font-semibold text-[#b42318]'>{erro}</p>
      )}
      {!temErro && dica && (
        <p className='text-xs text-(--texto-apoio)'>{dica}</p>
      )}
    </div>
  );
}
