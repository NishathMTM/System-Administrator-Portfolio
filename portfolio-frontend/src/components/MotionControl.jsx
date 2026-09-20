import { useEffect, useState } from 'react';

export default function MotionControl() {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = event => setReduced(event.matches);
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = paused || reduced ? 'paused' : 'playing';
    return () => { delete document.documentElement.dataset.motion; };
  }, [paused, reduced]);
  return <button className="motion-control" type="button" aria-pressed={paused || reduced} onClick={() => setPaused(value => !value)} disabled={reduced}>{reduced ? 'Reduced motion on' : paused ? 'Play animation' : 'Pause animation'}<span aria-hidden="true">{paused || reduced ? '▷' : 'Ⅱ'}</span></button>;
}
