import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

export function useHasScrollTop(ref: RefObject<HTMLElement> | null) {
  const [hasScrollTop, setHasScrollTop] = useState(false);

  useEffect(() => {
    if (!ref?.current) {
      return;
    }

    const container = ref.current;

    function updateScrollTop() {
      if (container) {
        setTimeout(() => {
          const hasScrollTop = container.scrollTop > 0;
          setHasScrollTop(hasScrollTop);
        });
      }
    }

    container.addEventListener('scroll', updateScrollTop);
    updateScrollTop();
    return () => {
      container.removeEventListener('scroll', updateScrollTop);
    };
  }); // avoid using ref.current as a dependency to prevent it from being set too late.

  return hasScrollTop;
}
