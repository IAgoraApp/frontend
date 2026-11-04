export function Container({
  as: Tag = 'div',
  className = '',
  children,
  ...props
}) {
  return (
    <Tag
      className={`mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-[4.5rem] ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
