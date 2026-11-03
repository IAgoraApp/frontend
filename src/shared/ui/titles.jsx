const variants = {
  normal: 'font-heading text-4xl font-bold text-(--azul-titulo)',
  pequenoLj: 'text-1xl font-bold uppercase text-(--laranja-principal)',
  pequenoBc: 'text-1xl font-bold uppercase text-white',
};

export function Title({
  variant = '',
  className = '',
  children,
  as: Tag = 'h2',
  ...props
}) {
  return (
    <Tag
      className={`font-heading ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
