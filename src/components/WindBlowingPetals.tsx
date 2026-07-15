/**
 * WindBlowingPetals
 *
 * Single-canvas renderer. Renders two things:
 *  1. The flower — drawn with horizontal strip-based displacement so
 *     only the outer petal region (~outer 40%) sways from a gentle breeze.
 *     The inner core (stem + centre) stays perfectly still every frame.
 *  2. Ultra-tiny glowing dust / pollen particles emerging slowly from
 *     the flower's centre. Warm gold tones, very low opacity, sub-pixel cores.
 *
 * Zero DOM shadows, glows, or halos. Background stays clean.
 * Loop stops when the section scrolls out of view (performance).
 */

import { useRef, useEffect, useCallback } from "react";
import { useInView } from "framer-motion";
import neonFlower from "@/assets/neon-flower.png";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WindBlowingPetalsProps {
  className?: string;
}

interface Dust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  coreR: number;       // radius of the bright centre dot (0.8–1.6 px)
  opacity: number;
  maxOpacity: number;
  life: number;
  maxLife: number;
  r: number;
  g: number;
  b: number;
  nt: number;          // noise time offset
  ns: number;          // noise speed
  da: number;          // drift angle (radians)
  dd: number;          // drift angle delta per frame
  pt: number;          // pulse time
  pf: number;          // pulse frequency
}

// ─── Value noise (1-D smooth) ─────────────────────────────────────────────────

function _h(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function vn(t: number): number {
  const i = Math.floor(t);
  const f = t - i;
  const u = f * f * (3.0 - 2.0 * f);          // smoothstep
  return _h(i) * (1.0 - u) + _h(i + 1) * u;
}

// ─── Dust colour palette — harmonious neon flower suite ───────────────────────

const PALETTE: [number, number, number][] = [
  [255, 40, 130],   // Neon Rose / Glowing Pink
  [255, 100, 170],  // Soft Coral Pink
  [66, 133, 244],   // Electric Periwinkle Blue
  [190, 130, 255],  // Ethereal Lavender
  [255, 190, 60],   // Warm Radiant Amber
  [255, 255, 235],  // Soft Starlight White
];

// ─── Spawn one dust particle from the petal ring ─────────────────────────────
// petalR = approximate radius of the visible petal area from flower centre

function spawnDust(cx: number, cy: number, W: number, H: number, petalR: number): Dust {
  // Spawn anywhere in the petal ring (inner 35% → outer 95% of petal radius)
  const spawnInner = petalR * 0.35;
  const spawnOuter = petalR * 0.95;
  const angle  = Math.random() * Math.PI * 2;
  const radius = spawnInner + Math.random() * (spawnOuter - spawnInner);

  const [r, g, b] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  const core = Math.random() * 0.5 + 0.6;     // 0.6 – 1.1 px (refined micro particles)

  // Gentle, soft drift away from petals
  const outDir = angle + (Math.random() - 0.5) * 0.8;
  const kick   = Math.random() * 0.18 + 0.08;            // 0.08 – 0.26 px/frame

  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
    vx: Math.cos(outDir) * kick,
    vy: Math.sin(outDir) * kick - 0.09,   // very subtle upward float
    coreR: core,
    opacity: 0,
    maxOpacity: Math.random() * 0.30 + 0.40,  // 0.40 – 0.70
    life: 0,
    maxLife: Math.random() * 520 + 340,        // 6–14 s @ 60 fps
    r, g, b,
    nt: Math.random() * 1000,
    ns: Math.random() * 0.0012 + 0.0004,      // ultra smooth noise evolution
    da: outDir,
    dd: (Math.random() - 0.5) * 0.006,
    pt: Math.random() * Math.PI * 2,
    pf: Math.random() * 0.008 + 0.003,
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const N_DUST     = 22;    // minimal, elegant particle count
// Max rotation in radians (≈ 1.3°) — barely perceptible but petal tips move visibly
const MAX_ROT    = 0.023;

// ─── Component ────────────────────────────────────────────────────────────────

const WindBlowingPetals = ({ className = "" }: WindBlowingPetalsProps) => {

  const wrapRef    = useRef<HTMLDivElement>(null);
  const cvRef      = useRef<HTMLCanvasElement>(null);
  const offRef     = useRef<HTMLCanvasElement | null>(null);
  const imgOK      = useRef(false);
  const dustRef    = useRef<Dust[]>([]);
  const petalRRef  = useRef<number>(80);
  const rafRef     = useRef<number>(0);
  const T          = useRef<number>(0);
  const running    = useRef(false);
  // Shared resize fn — called both from ResizeObserver and from image onload
  const resizeFnRef = useRef<() => void>(() => {});

  const inView = useInView(wrapRef, { margin: "-8%", once: false });

  // ── Step 1: Load flower, strip dark background, store in off-screen canvas ──

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const off = document.createElement("canvas");
      off.width  = img.naturalWidth;
      off.height = img.naturalHeight;
      const ctx  = off.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0);

      // Remove dark background
      const id = ctx.getImageData(0, 0, off.width, off.height);
      const d  = id.data;
      for (let i = 0; i < d.length; i += 4) {
        const mx = Math.max(d[i], d[i + 1], d[i + 2]);
        if (d[i] < 35 && d[i + 1] < 35 && d[i + 2] < 35) {
          d[i + 3] = 0;
        } else if (mx < 80) {
          d[i + 3] = Math.round((mx / 80) * 255);
        }
      }
      ctx.putImageData(id, 0, 0);
      offRef.current = off;
      imgOK.current  = true;
      // Now that we know the image aspect ratio, recalculate canvas height
      resizeFnRef.current();
    };
    img.src = neonFlower;
  }, []);

  // ── Step 2: Size canvas to wrapper; re-init dust on resize ───────────────────

  useEffect(() => {
    const cv = cvRef.current;
    const wr = wrapRef.current;
    if (!cv || !wr) return;

    const resize = () => {
      const containerW = wr.parentElement?.getBoundingClientRect().width
                      ?? wr.getBoundingClientRect().width;
      const W = containerW;

      // ── Determine canvas height from image aspect ratio ──────────────────
      // If image is loaded, fit the flower exactly (no dead space).
      // Otherwise use a sensible portrait fallback.
      const off = offRef.current;
      let H: number;
      if (off && off.width > 0) {
        // Height the flower will actually occupy at this width (object-contain)
        const sc  = (W / off.width) * 1.05;   // same scale used in render
        H = Math.min(off.height * sc, off.height * sc); // = off.height * sc
      } else {
        H = W * 1.15;  // portrait fallback until image loads
      }

      // ── Cap per breakpoint ───────────────────────────────────────────────
      const isMobile = window.innerWidth < 768;
      const maxH = isMobile ? Math.min(H, 340) : Math.min(H, 540);
      const finalH = Math.max(maxH, isMobile ? 240 : 320);

      // Apply height to wrapper so it perfectly hugs the flower
      wr.style.height = `${finalH}px`;

      // ── Size canvas ──────────────────────────────────────────────────────
      const dpr = window.devicePixelRatio || 1;
      cv.width  = Math.round(W      * dpr);
      cv.height = Math.round(finalH * dpr);
      cv.style.width  = `${W}px`;
      cv.style.height = `${finalH}px`;
      const ctx = cv.getContext("2d");
      if (ctx) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(dpr, dpr); }

      // ── Re-init particles ────────────────────────────────────────────────
      const cx = W      * 0.50;
      const cy = finalH * 0.44;
      const pR = Math.min(W, finalH) * 0.28;
      petalRRef.current = pR;
      dustRef.current = Array.from({ length: N_DUST }, () =>
        spawnDust(cx, cy, W, finalH, pR)
      );
      dustRef.current.forEach(p => {
        p.life = Math.floor(Math.random() * p.maxLife * 0.65);
      });
    };

    resizeFnRef.current = resize;
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wr);
    return () => ro.disconnect();
  }, []);

  // ── Step 3: Render loop ───────────────────────────────────────────────────────

  const tick = useCallback(() => {
    // Guard: stop loop if component unmounted or scrolled away
    if (!running.current) return;

    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W   = cv.width  / dpr;
    const H   = cv.height / dpr;
    const t   = T.current;

    ctx.clearRect(0, 0, W, H);

    // ── Draw flower ──────────────────────────────────────────────────────────

    const off = offRef.current;
    if (off && imgOK.current) {

      // Object-contain scaling, slight over-scale to fill better
      const sc = Math.min(W / off.width, H / off.height) * 1.05;
      const fw = off.width  * sc;
      const fh = off.height * sc;
      const fx = (W - fw) * 0.5;
      const fy = (H - fh) * 0.5;

      // Flower visual centre (roughly where petals meet stem)
      const fcx = fx + fw * 0.50;
      const fcy = fy + fh * 0.44;

      // ── Organic wind gust envelope ─────────────────────────────────────────
      // Three overlapping sines at very different periods (~17 s, ~11 s, ~6 s)
      // produce an irregular, natural breeze — flower is mostly still.
      const g1 = Math.sin(t * 0.0058);
      const g2 = Math.sin(t * 0.0093 + 1.27);
      const g3 = Math.sin(t * 0.0168 + 2.61);
      // Signed gust value — kept small so the flower barely moves
      const gustVal = g1 * 0.45 + g2 * 0.30 + g3 * 0.13;
      // gustVal ≈ −0.88 to +0.88; multiply by MAX_ROT for radians
      const rotAngle = gustVal * MAX_ROT;   // ≈ ±1.3° max

      // ── Draw flower — single seamless drawImage with canvas rotation ────────
      // Pivot point: stem base (bottom-centre of the flower image).
      // Physics: rotating around the base means the petal tips (top of image)
      // travel the most, and the stem (near pivot) barely moves — exactly like
      // a real flower swaying in a breeze.  No strips → no gap artefacts.
      const pivX = fcx;
      const pivY = fy + fh;          // bottom of the flower bouding box

      ctx.save();
      ctx.translate(pivX, pivY);     // move origin to stem base
      ctx.rotate(rotAngle);          // apply tiny rotation
      ctx.translate(-pivX, -pivY);   // restore origin
      ctx.drawImage(off, fx, fy, fw, fh);  // draw full flower in one call
      ctx.restore();

      // ── Draw dust particles ────────────────────────────────────────────────

      const pcx = fcx;
      const pcy = fcy;

      for (let i = 0; i < dustRef.current.length; i++) {
        const p = dustRef.current[i];
        p.life++;

        // Organic steering: value-noise perturbation on drift angle
        const nx = vn(p.nt) * 2.0 - 1.0;
        p.nt += p.ns;
        p.da += p.dd + nx * 0.006;

        // Nudge velocity from drift direction
        p.vx += Math.cos(p.da) * 0.003;
        p.vy += Math.sin(p.da) * 0.002 - 0.0015;   // tiny upward float
        // Gentle drag — keeps speed very slow
        // Lighter drag so particles roam wider across the section
        p.vx *= 0.990;
        p.vy *= 0.990;

        p.x += p.vx;
        p.y += p.vy;

        // Lifecycle fade
        const lt = p.life / p.maxLife;
        p.pt += p.pf;
        if (lt < 0.10) {
          p.opacity = (lt / 0.10) * p.maxOpacity;
        } else if (lt > 0.80) {
          p.opacity = ((1.0 - lt) / 0.20) * p.maxOpacity;
        } else {
          // Gentle shimmer in mid-life (±18%)
          p.opacity = p.maxOpacity * (Math.sin(p.pt) * 0.18 + 0.82);
        }

        // Respawn from petal ring when exhausted or left canvas
        if (
          p.life >= p.maxLife ||
          p.x < -40 || p.x > W + 40 ||
          p.y < -40 || p.y > H + 40
        ) {
          dustRef.current[i] = spawnDust(pcx, pcy, W, H, petalRRef.current);
          continue;
        }

        if (p.opacity < 0.004) continue;

        const op = p.opacity;

        // Soft glow halo — proportional to core, stays elegant
        const hR   = p.coreR * 6.0;   // slightly bigger halo
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, hR);
        grad.addColorStop(0.00, `rgba(${p.r},${p.g},${p.b},${(op * 0.90).toFixed(3)})`);
        grad.addColorStop(0.35, `rgba(${p.r},${p.g},${p.b},${(op * 0.35).toFixed(3)})`);
        grad.addColorStop(0.70, `rgba(${p.r},${p.g},${p.b},${(op * 0.08).toFixed(3)})`);
        grad.addColorStop(1.00, `rgba(${p.r},${p.g},${p.b},0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, hR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Warm bright centre dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.coreR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,248,200,${(op * 0.95).toFixed(3)})`;
        ctx.fill();
      }
    }

    T.current++;
    rafRef.current = requestAnimationFrame(tick);
  }, []); // no deps — all state via refs

  // ── Step 4: Start / stop loop on visibility change ───────────────────────────

  useEffect(() => {
    if (inView) {
      if (!running.current) {
        running.current = true;
        rafRef.current  = requestAnimationFrame(tick);
      }
    } else {
      running.current = false;
      cancelAnimationFrame(rafRef.current);
    }
    return () => {
      running.current = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [inView, tick]);

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div
      ref={wrapRef}
      className={`relative ${className}`}
      // Height is set dynamically in resize() based on image aspect ratio.
      // Inline style only provides a tiny initial min so layout doesn't collapse
      // before JS runs.
      style={{ minHeight: 280 }}
    >
      {/*
        Single canvas.
        mixBlendMode "screen" ensures particles only ADD light — never darken.
        No shadow, no glow div, no backdrop anywhere.
      */}
      <canvas
        ref={cvRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: "screen" }}
      />
    </div>
  );
};

export default WindBlowingPetals;
