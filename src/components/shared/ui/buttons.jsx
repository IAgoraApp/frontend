import { ArrowUpRight } from 'lucide-react';

const variants = {
  solido: 'rounded-full px-10 py-3 font-semibold',
  link: 'gap-2 font-semibold',
};

const colors = {
  azul: {
    solido: 'bg-(--azul-principal) text-white hover:opacity-80',
    link: 'text-(--azul-principal)',
  },
  laranja: {
    solido: 'bg-(--laranja-principal) text-white hover:opacity-80',
    link: 'text-(--laranja-principal)',
  },
  preto: {
    solido: 'bg-gray-900 text-white hover:bg-gray-700',
    link: 'text-gray-900',
  },
  branco: {
    solido: 'bg-white text-black hover:bg-gray-300',
    link: 'text-white',
  },
};

export function Button({
  as: Tag = 'button',
  variant = 'solido',
  color = 'azul',
  children,
  className = '',
  ...props
}) {
  return (
    <Tag
      className={`inline-flex items-center justify-center transition-colors cursor-pointer ${variants[variant]} ${colors[color][variant]} ${className}`}
      {...props}
    >
      {children}
      {variant === 'link' && <ArrowUpRight size={18} />}
    </Tag>
  );
}
