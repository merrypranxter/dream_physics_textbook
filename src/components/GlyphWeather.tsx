import { useEffect, useRef } from 'react';
import type { Chapter } from '../content/manifest';

type GlyphWeatherProps = {
  chapter: Chapter;
  quiet: boolean;
};

export function GlyphWeather({ chapter, quiet }: GlyphWeatherProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const glyphs = Array.from(chapter.glyphs);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let last = 0;

    const draw = (now: number) => {
      if (now - last < 90 && !quiet && !reduced) {
        frame = requestAnimationFrame(draw);
        return;
      }
      last = now;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.4);
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      context.clearRect(0, 0, width, height);
      const cell = Math.max(24, Math.floor(width / 46));
      context.font = `${Math.floor(cell * .58)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      for (let y = cell; y < height; y += cell) {
        for (let x = cell; x < width; x += cell) {
          const wave = Math.sin(x * .017 + y * .011 + now * .00016 + chapter.number) * .5 + .5;
          if (wave < .72) continue;
          const glyph = glyphs[(Math.floor(x / cell) + Math.floor(y / cell) * 3 + chapter.number) % glyphs.length];
          context.fillStyle = `${chapter.palette[(x + y) % 3 > 1 ? 1 : 0]}${Math.floor(22 + wave * 30).toString(16).padStart(2, '0')}`;
          context.fillText(glyph, x, y + (quiet || reduced ? 0 : Math.sin(now * .0003 + x) * 3));
        }
      }
      if (!quiet && !reduced && !document.hidden) frame = requestAnimationFrame(draw);
    };

    draw(quiet || reduced ? 3600 : performance.now());
    const onVisibility = () => {
      if (!document.hidden && !frame && !quiet && !reduced) frame = requestAnimationFrame(draw);
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [chapter, quiet]);

  return <canvas ref={canvasRef} className="glyph-weather" aria-hidden="true" />;
}
