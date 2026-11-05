import { useLayoutEffect, useRef, useState } from 'react';

export function useUpcomingCapacity(total) {
  const ref = useRef(null);
  const [capacity, setCapacity] = useState(1);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || !total) return;
    const update = () => {
      const row = element.firstElementChild;
      if (!row) return;
      const gap = parseFloat(getComputedStyle(element).rowGap) || 0;
      const rowHeight = row.getBoundingClientRect().height;
      if (!rowHeight) return;
      setCapacity(
        Math.max(
          1,
          Math.min(
            total,
            Math.floor((element.clientHeight + gap) / (rowHeight + gap))
          )
        )
      );
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    observer.observe(element.firstElementChild);
    update();
    return () => observer.disconnect();
  }, [total]);

  return { ref, capacity };
}
