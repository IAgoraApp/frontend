export function FormField({
  id,
  label,
  className = '',
  inputClassName = '',
  labelClassName = '',
  ...inputProps
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <label
        htmlFor={id}
        className={`text-sm leading-5 font-bold text-(--azul-titulo) ${labelClassName}`}
      >
        {label}
      </label>
      <input
        id={id}
        className={`h-[52px] w-full min-w-0 rounded-lg border border-[#dbe5ed] bg-white px-4 text-base leading-6 text-(--azul-titulo) placeholder:text-(--texto-apoio) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--laranja-principal) ${inputClassName}`}
        {...inputProps}
      />
    </div>
  );
}
