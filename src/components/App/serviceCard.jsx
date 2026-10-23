import { Heart, MapPin } from 'lucide-react';
import { Button } from '../ui';
import { Badge } from './ui';
import { money } from '../../utils/format';
import styles from '../../styles/app.module.css';

export default function ServiceCard({ service, favorite, onFavorite, onOpen }) {
  return (
    <article className={styles.card}>
      <img
        src={service.image}
        alt={`Imagem ilustrativa de ${service.title}`}
        loading='lazy'
      />
      <div className={styles.cardBody}>
        <div className={styles.row}>
          <Badge>
            {service.category} · {service.attendance}
          </Badge>
          {onFavorite && (
            <button
              className={styles.iconButton}
              aria-label={`Favoritar ${service.title}`}
              aria-pressed={favorite}
              onClick={onFavorite}
            >
              <Heart size={20} fill={favorite ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
        <p className={styles.eyebrow}>{service.company}</p>
        <h3>{service.title}</h3>
        <p className={styles.muted}>
          <MapPin size={15} className='inline' /> {service.region}
        </p>
        <strong>
          {service.priceMode === 'Sob orçamento'
            ? 'Sob orçamento'
            : `${service.priceMode === 'A partir de' ? 'A partir de ' : ''}${money(service.price)}${service.priceMode === 'Faixa de preço' ? ` a ${money(service.maxPrice)}` : ''}`}
        </strong>
        <p className={styles.muted}>{service.description}</p>
        <p className={styles.muted}>
          {service.rating
            ? `★ ${service.rating} · avaliações fictícias`
            : 'Sem avaliações · anúncio local'}
        </p>
        {onOpen && (
          <Button color='laranja' onClick={onOpen}>
            Conhecer serviço ↗
          </Button>
        )}
      </div>
    </article>
  );
}
