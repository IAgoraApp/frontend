export function Container({
  as: Tag = 'div',
  className = '',
  children,
  ...props
}) {
  return (
    <Tag
      className={`w-full min-w-0 px-(--page-gutter) ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
