import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import sealedBg from "@/assets/sealed-backdrop.jpg";
import heroBg from "@/assets/hero-backdrop.jpg";
import waxSeal from "@/assets/wax-seal.png";
import paperTex from "@/assets/paper-texture.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import { ScratchCard } from "@/components/ScratchCard";
import { couple, fmtDate, fmtTime, programme, remaining, venue, weddingAt } from "@/lib/wedding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aarav & Anaya — 14 February 2027" },
      { name: "description", content: "You are invited to the wedding of Aarav & Anaya at The Grand Pavilion." },
      { property: "og:title", content: "Aarav & Anaya — A Wedding Invitation" },
      { property: "og:description", content: "Open your invitation to the wedding celebrations, 12–15 February 2027." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invitation,
});

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Invitation() {
  const [stage, setStage] = useState<"sealed" | "opening" | "open">("sealed");
  const music = useRef<HTMLAudioElement>(null);
  const tap = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    document.body.classList.toggle("locked", stage !== "open");
    return () => document.body.classList.remove("locked");
  }, [stage]);

  const open = () => {
    if (stage !== "sealed") return;
    // seal-tap sound and music are separate elements; prime music muted inside the gesture
    tap.current?.play().catch(() => {});
    const m = music.current;
    if (m) {
      m.muted = true;
      m.volume = 0;
      m.play().then(() => {
        m.muted = false;
        const start = performance.now();
        const step = (t: number) => {
          const k = Math.min(1, (t - start) / 8000);
          m.volume = 0.6 * k;
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }).catch(() => {});
    }
    setStage("opening");
    window.setTimeout(() => setStage("open"), reduced() ? 400 : 6000);
  };

  const revealed = stage !== "sealed";
  const paperVar = { ["--paper-img" as string]: `url(${paperTex})` } as React.CSSProperties;

  return (
    <main style={paperVar} className={revealed ? "revealed" : ""}>
      <audio ref={music} src="/audio/ambient.mp3" loop preload="auto" />
      <audio ref={tap} src="/audio/seal.mp3" preload="auto" />

      {/* Sealed opening */}
      <section
        className={`sealed ${revealed ? "opening" : ""}`}
        onClick={open}
        aria-hidden={revealed}
      >
        <div className="sealed-bg" style={{ backgroundImage: `url(${sealedBg})` }} />
        <div className="relative flex flex-col items-center gap-7 px-6">
          <button type="button" onClick={open} aria-label="Tap to open the invitation" className="envelope" style={paperVar}>
            <div className="envelope-pocket" />
            <div className="envelope-edge" />
            <div className="envelope-flap" />
            <div className="seal">
              <img src={waxSeal} alt="" width={816} height={816} className="h-full w-full" />
              <span className="seal-initials">A&thinsp;A</span>
            </div>
          </button>
          <span className="tap-plate">Tap to open</span>
          <p className="sealed-names gold-text font-display text-4xl italic sm:text-5xl">
            {couple.one} &amp; {couple.two}
          </p>
        </div>
      </section>

      {/* Hero */}
      <section className="relative grid min-h-[100dvh] place-items-center overflow-hidden px-5 py-20 text-center">
        <div className="hero-bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="relative flex w-full max-w-2xl flex-col items-center gap-5">
          <p className="eyebrow rise d1">Together with their families</p>
          <h1 className="rise d2 font-display font-light italic leading-[0.95]">
            <span className="gold-text shimmer block text-[clamp(3.2rem,15vw,8.5rem)]">{couple.one}</span>
            <span className="block font-display text-[clamp(1.6rem,6vw,3rem)] text-accent-soft">&amp;</span>
            <span className="gold-text shimmer block text-[clamp(3.2rem,15vw,8.5rem)]">{couple.two}</span>
          </h1>
          <p className="rise d3 max-w-xs font-display text-lg italic text-paper sm:text-xl">
            request the honour of your presence as they begin forever
          </p>
          <div className="rise d4 mt-4 w-full">
            <ScratchCard>
              <p className="eyebrow">Save the date</p>
              <p className="mt-3 font-display text-3xl text-paper">{fmtDate(weddingAt)}</p>
              <div className="gold-rule mx-auto my-3 w-24" />
              <p className="font-sans text-sm tracking-[0.2em] text-accent-soft">{fmtTime(weddingAt)}</p>
            </ScratchCard>
          </div>
        </div>
      </section>

      <Countdown />
      <Venue />
      <Programme />
      <Gallery />
      <Quote />
      <Closing />
    </main>
  );
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && (el.classList.add("in"), io.disconnect()), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  const ref = useInView<HTMLDivElement>();
  return (
    <section className="px-5 py-20 sm:py-28">
      <div ref={ref} className="reveal-on-scroll mx-auto max-w-4xl text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="gold-text mt-3 font-display text-4xl font-light italic sm:text-6xl">{title}</h2>
        <div className="gold-rule mx-auto my-8 w-40" />
        {children}
      </div>
    </section>
  );
}

function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const r = now === null ? null : remaining(weddingAt, now);
  const units: [string, number | undefined][] = [["Days", r?.days], ["Hours", r?.hours], ["Minutes", r?.minutes], ["Seconds", r?.seconds]];
  return (
    <Section eyebrow="Counting the moments" title="Until we wed">
      <div className="grid grid-cols-4 gap-2 sm:gap-5" aria-live="off">
        {units.map(([l, v]) => (
          <div key={l} className="panel rounded-sm px-1 py-5 sm:py-8">
            <div className="font-sans text-3xl font-light tabular-nums text-paper sm:text-5xl">{v === undefined ? "–" : String(v).padStart(2, "0")}</div>
            <div className="eyebrow mt-2 !text-[0.55rem] sm:!text-[0.68rem]">{l}</div>
          </div>
        ))}
      </div>
      <p className="mt-6 font-sans text-xs tracking-widest text-muted">{fmtDate(weddingAt)} · {fmtTime(weddingAt)}</p>
    </Section>
  );
}

function Venue() {
  return (
    <Section eyebrow="The venue" title={venue.name}>
      <div className="panel mx-auto max-w-lg rounded-sm px-6 py-10">
        <p className="font-display text-2xl text-paper">{venue.city}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">Marble courts, a still reflecting pool and a thousand lanterns await you.</p>
        <a href={venue.mapsUrl} target="_blank" rel="noreferrer" className="mt-7 inline-block border border-accent px-6 py-3 font-sans text-xs uppercase tracking-[0.3em] text-accent-soft transition-colors hover:bg-accent hover:text-ink">
          Open in Google Maps
        </a>
      </div>
    </Section>
  );
}

function Programme() {
  return (
    <Section eyebrow="The celebrations" title="Programme">
      <ol className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
        {programme.map((p, i) => (
          <li key={p.name} className="panel rounded-sm px-6 py-8 text-left">
            <span className="font-sans text-xs tracking-[0.3em] text-accent">0{i + 1}</span>
            <h3 className="mt-1 font-display text-3xl italic text-paper">{p.name}</h3>
            <p className="mt-2 font-sans text-xs uppercase tracking-[0.18em] text-accent-soft">{fmtDate(p.at)}</p>
            <p className="font-sans text-xs tracking-[0.18em] text-accent-soft">{fmtTime(p.at)}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{p.note}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Gallery() {
  return (
    <Section eyebrow="Moments" title="Gallery">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <img src={g1} alt="Henna cones and brass diyas among marigold petals" loading="lazy" width={768} height={1024} className="h-full w-full rounded-sm border border-border object-cover" />
        <img src={g2} alt="Emerald bridal lehenga with gold embroidery" loading="lazy" width={768} height={1024} className="h-full w-full rounded-sm border border-border object-cover" />
        <img src={g3} alt="Marble mandap and floating candles at night" loading="lazy" width={1024} height={768} className="col-span-2 w-full rounded-sm border border-border object-cover" />
      </div>
    </Section>
  );
}

function Quote() {
  const ref = useInView<HTMLDivElement>();
  return (
    <section className="px-6 py-24">
      <div ref={ref} className="reveal-on-scroll mx-auto max-w-2xl text-center">
        <p className="font-display text-3xl font-light italic leading-snug text-paper sm:text-5xl">
          “Two souls, one flame — lit at dusk, kept for a lifetime.”
        </p>
        <div className="gold-rule mx-auto mt-10 w-24" />
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="relative overflow-hidden px-6 py-28 text-center">
      <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${heroBg})` }} />
      <div className="absolute inset-0" style={{ background: "var(--veil)" }} />
      <div className="relative mx-auto max-w-xl">
        <img src={waxSeal} alt="" width={816} height={816} loading="lazy" className="mx-auto w-20" />
        <p className="eyebrow mt-6">With love & blessings</p>
        <p className="gold-text mt-3 font-display text-5xl italic sm:text-7xl">{couple.one} &amp; {couple.two}</p>
        <p className="mt-4 font-sans text-xs tracking-[0.3em] text-muted">14 · 02 · 2027</p>
      </div>
    </section>
  );
}
