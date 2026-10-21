import Action from './action';
import styles from '../../styles/household.module.css';

export default function NextStep({ title, description, action }) {
  return (
    <section className={styles.nextStep} aria-label={title}>
      <div className='flex min-w-0 flex-1 flex-col gap-2'>
        <h2 className='font-heading text-[clamp(1.75rem,2.92vw,2.625rem)] font-extrabold leading-[1.1]'>
          {title}
        </h2>
        <p className='text-[17px] leading-[25px]'>{description}</p>
      </div>
      <Action {...action}>{action.label}</Action>
    </section>
  );
}
