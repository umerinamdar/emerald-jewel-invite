import { useEffect, useRef, useState } from "react";

const THRESHOLD = 0.38;

export function ScratchCard({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [gone, setGone] = useState(false);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const css = getComputedStyle(document.documentElement);
    const v = (n: string) => css.getPropertyValue(n).trim();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = c.getBoundingClientRect();
    c.width = r.width * dpr;
    c.height = r.height * dpr;
    const ctx = c.getContext("2d")!;
    ctx.scale(dpr, dpr);
    const g = ctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, v("--scratch-foil"));
    g.addColorStop(0.3, v("--accent"));
    g.addColorStop(0.5, v("--highlight"));
    g.addColorStop(0.7, v("--accent"));
    g.addColorStop(1, v("--scratch-foil"));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, r.width, r.height);
    // brushed foil grain
    for (let i = 0; i < 1400; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? v("--highlight") : v("--scratch-foil");
      ctx.globalAlpha = Math.random() * 0.25;
      ctx.fillRect(Math.random() * r.width, Math.random() * r.height, Math.random() * 18, 0.6);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = v("--scratch-ink");
    ctx.globalAlpha = 0.35;
    ctx.strokeRect(8, 8, r.width - 16, r.height - 16);
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = v("--scratch-ink");
    ctx.textAlign = "center";
    ctx.font = `500 11px Jost, sans-serif`;
    ctx.fillText("R U B   T O   R E V E A L", r.width / 2, r.height / 2 + 4);
    ctx.globalAlpha = 1;
  }, []);

  const reveal = () => {
    if (revealed) return;
    setRevealed(true);
    window.setTimeout(() => setGone(true), 900);
  };

  const check = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    let clear = 0, total = 0;
    for (let i = 3; i < data.length; i += 64) { total++; if ((data[i] ?? 255) < 40) clear++; }
    if (clear / total >= THRESHOLD) reveal();
  };

  const scratch = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    const p = { x: e.clientX - r.left, y: e.clientY - r.top };
    const ctx = c.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 38;
    ctx.lineCap = "round";
    ctx.beginPath();
    const from = last.current ?? p;
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };

  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-sm panel">
      <div className="px-6 py-8 text-center">{children}</div>
      {!gone && (
        <canvas
          ref={canvasRef}
          role="button"
          tabIndex={0}
          aria-label="Gold foil covering the wedding date. Rub to reveal, or press Enter."
          className="absolute inset-0 h-full w-full cursor-grab touch-none transition-opacity duration-700"
          style={{ opacity: revealed ? 0 : 1 }}
          onPointerDown={(e) => { drawing.current = true; last.current = null; (e.target as HTMLElement).setPointerCapture(e.pointerId); scratch(e); }}
          onPointerMove={scratch}
          onPointerUp={() => { drawing.current = false; last.current = null; check(); }}
          onPointerCancel={() => { drawing.current = false; check(); }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); reveal(); } }}
        />
      )}
    </div>
  );
}
