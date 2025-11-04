"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface FadeInScrollProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  className?: string;
}

export default function FadeInScroll({ 
  children, 
  threshold = 0.1, 
  rootMargin = '0px', 
  delay = 0,
  className = '' 
}: FadeInScrollProps) {
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

  return (
    <div ref={elementRef} className={`fade-in-scroll ${isVisible ? 'fade-in-visible' : ''} ${className}`}>
      {children}
    </div>
  );
}
