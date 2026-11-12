export function SeloEditorial({
  texto,
  cor = 'laranja',
  classe = '',
  inclinacao = 'rotate-[1.6deg]',
}) {
  const corFundo =
    cor === 'marinho' ? 'bg-[#102a43]' : 'bg-(--laranja-principal)';
  return (
    <div className={`inline-flex items-start py-1 ${classe}`}>
      <span
        className={`inline-block ${inclinacao} ${corFundo} px-4 py-2 text-[11px] font-bold tracking-[0.72px] text-white uppercase`}
      >
        {texto}
      </span>
    </div>
  );
}
