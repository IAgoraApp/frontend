import { Link } from 'react-router-dom';
import { Button } from '../ui';
import styles from '../../styles/household.module.css';

export default function Action({
  to,
  href,
  label,
  children,
  className = '',
  ...props
}) {
  return (
    <Button
      as={to ? Link : href ? 'a' : 'button'}
      to={to}
      href={href}
      color='acao'
      className={`${styles.action} ${className}`}
      {...props}
    >
      {children ?? label}
      <span aria-hidden='true'> ↗</span>
    </Button>
  );
}
