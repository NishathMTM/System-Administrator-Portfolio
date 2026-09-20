import { useEffect, useRef } from 'react';

export default function Reveal({ children, className = '', delay = 0 }) {
  const element = useRef(null);
  useEffect(() => {
    const target = element.current;
    if (!target || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          target.classList.remove('reveal-pending');
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.08 });
    target.classList.add('reveal-pending');
    observer.observe(target);
    return () => { observer.disconnect(); target.classList.remove('reveal-pending'); };
  }, []);
  return <div ref={element} className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` }}>{children}</div>;
}
