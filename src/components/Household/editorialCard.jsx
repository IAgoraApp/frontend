import Action from './action';
import styles from '../../styles/household.module.css';

export default function EditorialCard({
  image,
  alt,
  eyebrow,
  title,
  description,
  action,
  tinted = false,
}) {
  return (
    <article className={tinted ? styles.tintedCard : styles.editorialCard}>
      <img
        src={image}
        alt={alt}
        width={636}
        height={tinted ? 350 : 430}
        loading='lazy'
        className={styles.cardPhoto}
      />
      <div className={styles.cardCopy}>
        <p className='text-xs leading-[18px] font-bold text-(--laranja-principal)'>
          {eyebrow}
        </p>
        <h2 className='font-heading text-[clamp(1.8rem,2.78vw,2.5rem)] font-extrabold leading-[1.1]'>
          {title}
        </h2>
        <p className='text-base leading-6 text-(--texto-apoio)'>
          {description}
        </p>
        <Action {...action}>{action.label}</Action>
      </div>
    </article>
  );
}
