import { useLayoutEffect, useRef } from 'react';

export function useAvailableHeight() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const element = ref.current;
    const header = element.closest('[data-app-layout]')?.querySelector(':scope > header')
      ?? element.previousElementSibling;
    const update = () => {
      const height = window.visualViewport?.height ?? window.innerHeight;
      const top = element.getBoundingClientRect().top + window.scrollY;
      element.style.setProperty(
        '--routine-available-height',
        `${Math.floor(height - top)}px`
      );
    };
    const observer = new ResizeObserver(update);
    if (header) observer.observe(header);
    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);
    document.fonts.ready.then(update);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, []);

  return ref;
}
