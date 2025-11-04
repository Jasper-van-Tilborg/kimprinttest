import { useEffect, useRef, useState } from 'react';

interface UseFadeInScrollOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}

export function useFadeInScroll(options: UseFadeInScrollOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px', delay = 0 } = options;
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, delay]);

  return {
    ref: elementRef,
    className: `fade-in-scroll ${isVisible ? 'fade-in-visible' : ''}`,
  };
}
