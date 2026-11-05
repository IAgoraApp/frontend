import { ArrowLeft, X } from 'lucide-react';
import { Button, FormField, Title } from '../../../shared/ui';
import Edit from '../assets/edit.svg';
import Spark from '../assets/spark.svg';
import Calendar from '../assets/calendar.svg';
import List from '../assets/list.svg';
import Clock from '../assets/clock.svg';
import Trash from '../assets/trash.svg';
import Study from '../assets/study.svg';
import Spray from '../assets/spray.svg';
import Shirt from '../assets/shirt.svg';
import Checklist from '../assets/checklist.svg';
import SignatureChecklist from '../assets/signature-checklist.svg';
import SignatureRays from '../assets/signature-rays.svg';
import CasaDot from '../assets/dot-casa.svg';
import CozinhaDot from '../assets/dot-cozinha.svg';
import PessoalDot from '../assets/dot-pessoal.svg';
import FinancasDot from '../assets/dot-financas.svg';
import { categories } from '../content';
import classes from '../routineClasses';

const icons = {
  edit: Edit,
  spark: Spark,
  calendar: Calendar,
  list: List,
  clock: Clock,
  trash: Trash,
  study: Study,
  spray: Spray,
  shirt: Shirt,
};
const dots = {
  casa: CasaDot,
  cozinha: CozinhaDot,
  pessoal: PessoalDot,
  financas: FinancasDot,
};

export function RoutineIcon({ name, className = '', ...props }) {
  return (
    <span
      className={`${classes.icon} ${className}`}
      aria-hidden='true'
      {...props}
    >
      <img src={icons[name] ?? icons.list} alt='' />
    </span>
  );
}

export function RoutineButton({
  tone = 'primary',
  className = '',
  children,
  ...props
}) {
  return (
    <Button
      type='button'
      unstyled
      color='laranja'
      className={`${classes.button} ${classes[tone]} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
}

export function Ribbon({ children = 'MINHA ROTINA', editorial = false }) {
  return (
    <span
      className={`${classes.ribbon} ${editorial ? classes.editorialRibbon : ''}`}
    >
      {children}
    </span>
  );
}

export function RoutineHeading({
  title,
  description,
  onBack,
  ribbon = false,
  children,
  compact = false,
}) {
  return (
    <div
      className={`${classes.pageHeading} ${compact ? classes.compactHeading : ''}`}
    >
      {onBack && (
        <button type='button' className={classes.backButton} onClick={onBack}>
          <ArrowLeft size={18} aria-hidden='true' /> <span>Minha rotina</span>
        </button>
      )}
      <div className={classes.headingRow}>
        <div className={classes.headingCopy}>
          {ribbon && <Ribbon />}
          <Title as='h1' className={classes.pageTitle}>
            {title}
          </Title>
          {description && (
            <p className={classes.pageDescription}>{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

export function ChecklistArtwork({ signature = false }) {
  if (!signature)
    return (
      <img
        className={classes.checklist}
        src={Checklist}
        width='220'
        height='150'
        alt=''
        aria-hidden='true'
      />
    );
  return (
    <div className={classes.signature} aria-hidden='true'>
      <span className={classes.signaturePaper} />
      <img
        className={classes.signatureChecklist}
        src={SignatureChecklist}
        width='136'
        height='92.7273'
        alt=''
      />
      <span className={classes.signatureNote}>DO SEU JEITO ↗</span>
      <img
        className={classes.signatureRays}
        src={SignatureRays}
        width='46'
        height='42'
        alt=''
      />
    </div>
  );
}

export function CategoryPill({ category, neutral = false }) {
  return (
    <span
      data-category
      className={`${classes.categoryPill} ${neutral ? classes.neutralPill : classes[category]}`}
    >
      {categories.find(item => item.id === category)?.label ?? 'Pessoal'}
    </span>
  );
}

export function CategoryDot({ category }) {
  return (
    <img
      className={classes.categoryDot}
      src={dots[category]}
      width='14'
      height='14'
      alt=''
      aria-hidden='true'
    />
  );
}

export function Notice({ title, children, error = false }) {
  return (
    <div
      className={`${classes.notice} ${error ? classes.errorNotice : ''}`}
      role={error ? 'alert' : undefined}
    >
      {title && <strong>{title}</strong>}
      <p>{children}</p>
    </div>
  );
}

export function EmptyState({
  title = 'Seu dia está livre por aqui.',
  description = 'Crie sua primeira tarefa ou peça uma sugestão.',
  onCreate,
  onAssistant,
  children,
}) {
  return (
    <div className={classes.emptyState}>
      <div className={classes.headingRow}>
        <div className={classes.headingCopy}>
          <Ribbon />
          <Title as='h2' className={classes.modalTitle}>
            {title}
          </Title>
          <p className={classes.muted}>{description}</p>
        </div>
        <ChecklistArtwork signature />
      </div>
      <div className={classes.actions} data-actions>
        {onCreate && (
          <RoutineButton onClick={onCreate}>Criar tarefa</RoutineButton>
        )}
        {onAssistant && (
          <RoutineButton tone='secondary' onClick={onAssistant}>
            Pedir sugestão
          </RoutineButton>
        )}
        {children}
      </div>
    </div>
  );
}

export function CloseButton({ onClick, label = 'Fechar' }) {
  return (
    <button
      type='button'
      className={classes.closeButton}
      aria-label={label}
      onClick={onClick}
    >
      <X size={22} aria-hidden='true' />
    </button>
  );
}

export function ModalHeading({
  id,
  title,
  description,
  editorial = false,
  artwork = false,
  as = 'h2',
  ribbon = true,
}) {
  return (
    <div className={classes.headingRow}>
      <div className={classes.headingCopy}>
        {ribbon && (
          <Ribbon editorial={editorial}>
            {editorial ? 'IAGORA · UM PASSO DE CADA VEZ' : 'MINHA ROTINA'}
          </Ribbon>
        )}
        <Title as={as} id={id} tabIndex={-1} className={classes.modalTitle}>
          {title}
        </Title>
        {description && <p className={classes.muted}>{description}</p>}
      </div>
      {artwork && <ChecklistArtwork signature />}
    </div>
  );
}

export function RoutineField({ error, className = '', ...props }) {
  const hasPicker = props.type === 'date' || props.type === 'time';
  return (
    <div className={`${classes.fieldWrap} ${className}`}>
      <FormField
        {...props}
        className={classes.formField}
        inputClassName={classes.input}
        labelClassName={classes.fieldLabel}
        onClick={
          props.onClick ??
          (hasPicker
            ? event => {
                try {
                  event.currentTarget.showPicker?.();
                } catch {
                  // A edição pelo teclado continua disponível sem o seletor nativo.
                }
              }
            : undefined)
        }
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${props.id}-error` : props['aria-describedby']
        }
      />
      {error && (
        <p className={classes.fieldError} id={`${props.id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export function RoutineSelect({ id, label, error, children, ...props }) {
  return (
    <div className={classes.formField}>
      <label className={classes.fieldLabel} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={classes.input}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className={classes.fieldError} id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
