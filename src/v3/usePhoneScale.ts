import {useLayoutEffect, useRef} from 'react';

// Keep the design viewport fixed; fit the whole phone inside the preview window.
export function usePhoneScale() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const fit = () => {
      const narrow = window.innerWidth < 800;
      const availableWidth = window.innerWidth - (narrow ? 72 : 0);
      const scale = Math.min(1, (window.innerHeight - 40) / 874, (availableWidth - 48) / 402);
      const fittedScale = Math.max(.1, scale);
      ref.current?.style.setProperty('--phone-scale', String(fittedScale));
      ref.current?.style.setProperty('--preview-margin-left', narrow
        ? `${(72 + (availableWidth - 402 * fittedScale) / 2) / fittedScale}px`
        : 'auto');
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return ref;
}
