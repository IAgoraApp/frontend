import { useState, useEffect } from 'react';
import styles from '../../styles/household.module.css';

// Checklists are local until the API exposes a consumer routine endpoint.
export default function Checklist({
  items,
  storageKey,
  label,
  initialChecked = [],
}) {
  const [checked, setChecked] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey));
      return Array.isArray(stored)
        ? stored.filter(id => typeof id === 'string')
        : initialChecked;
    } catch {
      return initialChecked;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {
      /* The checklist remains usable when browser storage is unavailable. */
    }
  }, [storageKey, checked]);

  return (
    <ul aria-label={label} className={styles.checklist}>
      {items.map(({ id, title, description }) => (
        <li key={id}>
          <label className={styles.checklistItem}>
            <input
              type='checkbox'
              checked={checked.includes(id)}
              onChange={() =>
                setChecked(current =>
                  current.includes(id)
                    ? current.filter(value => value !== id)
                    : [...current, id]
                )
              }
            />
            <span className={styles.checkIndicator} aria-hidden='true' />
            <span className='flex min-w-0 flex-col gap-1'>
              <span className='text-[20px] leading-7 font-bold'>{title}</span>
              <span className='text-[15px] leading-[22px] text-(--texto-apoio)'>
                {description}
              </span>
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}
