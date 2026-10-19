import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { FaSearch, FaPenNib, FaImage, FaMicrophone, FaFilm, FaPlay } from 'react-icons/fa';

const STEPS = [
  { name: 'Research', tool: 'Gemini', icon: FaSearch },
  { name: 'Script', tool: 'Gemini', icon: FaPenNib },
  { name: 'Visuals', tool: 'Stability AI', icon: FaImage },
  { name: 'Voice', tool: 'Gemini TTS', icon: FaMicrophone },
  { name: 'Video', tool: 'FFmpeg', icon: FaFilm },
];

const PROJECT_ANCHOR = 'project-lightube';

// Rest pose of the stage and pointer parallax limits.
const REST_X = 14;
const REST_Z = -6;
const MAX_TILT = 10;
const SHEAR = 0.16; // extra x/y shift per px of depth, so near layers travel further
const LIFT = 28;
const BASE_SPEED = 120; // px/s along the connector
const HOVER_BOOST = 3.5;
const DOTS = 3;

// --- Geometry -------------------------------------------------------------
// Cards sit on a diagonal and depth is an affine function of y. That keeps
// every card centre on one tilted plane, so the SVG connector can live on
// that plane and pass exactly through the cards at any parallax angle.
const STEP_CARD = { w: 140, h: 56 };
const VIDEO_CARD = { w: 188, h: 116 };
const RAW_CENTERS = [
  [0, 0],
  [108, 68],
  [216, 136],
  [324, 204],
  [450, 306],
];
const DEPTH_PER_Y = 30 / 68; // 30px of translateZ per card step
const SLAB = 7; // visible card thickness
const PLANE_BEHIND = 34; // keeps the connector behind every card face and slab

const CARDS = (() => {
  const sizes = RAW_CENTERS.map((_, i) => (i === RAW_CENTERS.length - 1 ? VIDEO_CARD : STEP_CARD));
  const minX = Math.min(...RAW_CENTERS.map(([x], i) => x - sizes[i].w / 2));
  const maxX = Math.max(...RAW_CENTERS.map(([x], i) => x + sizes[i].w / 2));
  const minY = Math.min(...RAW_CENTERS.map(([, y], i) => y - sizes[i].h / 2));
  const maxY = Math.max(...RAW_CENTERS.map(([, y], i) => y + sizes[i].h / 2));
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const zMid = (RAW_CENTERS[0][1] + RAW_CENTERS[RAW_CENTERS.length - 1][1]) / 2;
  return RAW_CENTERS.map(([x, y], i) => ({
    ...STEPS[i],
    ...sizes[i],
    x: x - cx,
    y: y - cy,
    z: (y - zMid) * DEPTH_PER_Y,
  }));
})();

const SCENE_W = Math.ceil(Math.max(...CARDS.map((c) => Math.abs(c.x) + c.w / 2)) * 2 + 40);
const SCENE_H = Math.ceil(Math.max(...CARDS.map((c) => Math.abs(c.y) + c.h / 2)) * 2 + 80);

// The tilt and perspective push the projected stack down and right; nudge it
// back so it reads as centred in its column.
const OPTICAL_OFFSET = { marginLeft: -30, marginTop: -16 };

const PLANE_ANGLE = Math.atan(DEPTH_PER_Y);
const COS = Math.cos(PLANE_ANGLE);
const PLANE_Z = CARDS[0].z - CARDS[0].y * DEPTH_PER_Y; // plane depth at y = 0

const cubic = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};

// Connector in plane-local coordinates (u = x, v = y / cos). Each hop leaves a
// card sideways and drops into the next one from above, through the gaps.
const PATH = (() => {
  const pts = CARDS.map((c) => [c.x, c.y / COS]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  const samples = [pts[0]];
  for (let i = 0; i < pts.length - 1; i += 1) {
    const a = pts[i];
    const b = pts[i + 1];
    const c1 = [a[0] + (b[0] - a[0]) * 0.9, a[1]];
    const c2 = [b[0], b[1] - (b[1] - a[1]) * 0.9];
    d += ` C ${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${b[0]} ${b[1]}`;
    for (let s = 1; s <= 48; s += 1) samples.push(cubic(a, c1, c2, b, s / 48));
  }

  const lengths = [0];
  for (let i = 1; i < samples.length; i += 1) {
    const [x0, y0] = samples[i - 1];
    const [x1, y1] = samples[i];
    lengths.push(lengths[i - 1] + Math.hypot(x1 - x0, y1 - y0));
  }

  // Arc-length range where the connector runs underneath each card.
  const ranges = CARDS.map((card) => {
    let start = Infinity;
    let end = -Infinity;
    samples.forEach(([u, v], i) => {
      if (Math.abs(u - card.x) <= card.w / 2 && Math.abs(v * COS - card.y) <= card.h / 2) {
        start = Math.min(start, lengths[i]);
        end = Math.max(end, lengths[i]);
      }
    });
    return [start, end];
  });

  const us = samples.map(([u]) => u);
  const vs = samples.map(([, v]) => v);
  const pad = 12;
  return {
    d,
    samples,
    lengths,
    ranges,
    total: lengths[lengths.length - 1],
    box: {
      x: Math.min(...us) - pad,
      y: Math.min(...vs) - pad,
      w: Math.max(...us) - Math.min(...us) + pad * 2,
      h: Math.max(...vs) - Math.min(...vs) + pad * 2,
    },
  };
})();

const pointAt = (length) => {
  const { lengths, samples } = PATH;
  let lo = 0;
  let hi = lengths.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (lengths[mid] < length) lo = mid;
    else hi = mid;
  }
  const span = lengths[hi] - lengths[lo] || 1;
  const t = (length - lengths[lo]) / span;
  return [
    samples[lo][0] + (samples[hi][0] - samples[lo][0]) * t,
    samples[lo][1] + (samples[hi][1] - samples[lo][1]) * t,
  ];
};

// Dots run as compositor-driven (WAAPI) transform animations. Keyframes evenly
// spaced by arc length give a constant speed along the connector.
const DOT_KEYFRAMES = Array.from({ length: 121 }, (_, i) => {
  const [u, v] = pointAt((PATH.total * i) / 120);
  return { transform: `translate3d(${u.toFixed(1)}px, ${v.toFixed(1)}px, 0)` };
});
const CYCLE_MS = (PATH.total / BASE_SPEED) * 1000;

const clamp = (v, min = -1, max = 1) => Math.min(max, Math.max(min, v));

// Shadows grow with depth: nearer cards cast longer, softer shadows.
const depthShadow = (z) => {
  const d = z - CARDS[0].z;
  return `0 ${2 + d * 0.04}px ${4 + d * 0.06}px rgba(2, 6, 23, ${0.12 + d * 0.0005}), 0 ${6 + d * 0.1}px ${14 + d * 0.18}px rgba(2, 6, 23, ${0.1 + d * 0.0008})`;
};

const scrollToProject = (reduceMotion) => {
  const el = document.getElementById(PROJECT_ANCHOR);
  if (!el) return;
  // offsetTop ignores transforms, so the target is stable while the project
  // card is still mid reveal-animation.
  let top = -80;
  for (let node = el; node; node = node.offsetParent) top += node.offsetTop;
  window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  el.focus({ preventScroll: true });
};

const PipelineCard = ({ card, index, spread, active, reduceMotion, onActivate, onDeactivate, barRef, pulseRef, glowRef }) => {
  const x = useTransform(spread, (s) => card.x * s);
  const y = useTransform(spread, (s) => card.y * s);
  const z = useTransform(spread, (s) => card.z * s);
  const isVideo = index === CARDS.length - 1;
  const isBack = index === 0;
  const Icon = card.icon;
  const label = `Step ${index + 1} of ${CARDS.length}: ${card.name}, ${card.tool}`;

  const handlePointerEnter = (e) => {
    if (e.pointerType !== 'touch') onActivate(index);
  };
  const handlePointerLeave = (e) => {
    if (e.pointerType !== 'touch') onDeactivate(index);
  };

  return (
    <motion.div
      className="absolute left-0 top-0"
      style={{
        x,
        y,
        z,
        width: card.w,
        height: card.h,
        marginLeft: -card.w / 2,
        marginTop: -card.h / 2,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Card thickness: a darker slab just behind the face. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 rounded-xl ${
          isVideo ? 'bg-[#7a2408]' : 'bg-neutral-300 dark:bg-black'
        }`}
        style={{ transform: `translate3d(0, 2px, ${-SLAB}px)`, boxShadow: depthShadow(card.z) }}
      />
      <motion.div
        className="relative h-full w-full transition-opacity duration-300"
        initial={false}
        animate={{ z: active && !reduceMotion ? LIFT : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={
          isBack && !active
            ? { opacity: 0.78, filter: 'blur(0.6px)' }
            : undefined
        }
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute z-10 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 font-mono text-[10.5px] text-paper shadow-lg transition duration-200 ${
            isVideo ? 'bottom-full right-1 mb-2' : 'left-full top-1/2 ml-3 -translate-y-1/2'
          } ${active ? 'opacity-100' : `opacity-0 ${isVideo ? 'translate-y-1' : '-translate-x-1'}`}`}
        >
          <span className="opacity-60">Step {index + 1}</span> · {card.name} · {card.tool}
        </div>

        <button
          type="button"
          aria-label={isVideo ? `${label}. View the LighTube project` : label}
          aria-describedby="lightube-pipeline-desc"
          onClick={isVideo ? () => scrollToProject(reduceMotion) : undefined}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onFocus={() => onActivate(index)}
          onBlur={() => onDeactivate(index)}
          className={`relative block h-full w-full rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
            isVideo ? 'cursor-pointer' : 'cursor-default'
          }`}
        >
          {/* Extra shadow for the lifted state, faded with opacity only. */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 rounded-xl shadow-[0_22px_40px_-8px_rgba(2,6,23,0.45)] transition-opacity duration-300 ${
              active ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {isVideo ? (
            <>
              <span
                ref={glowRef}
                aria-hidden="true"
                className="pointer-events-none absolute -inset-2 rounded-2xl opacity-0 ring-4 ring-accent/60 shadow-[0_0_32px_8px_rgb(240_74_20/0.45)]"
              />
              <span
                ref={pulseRef}
                aria-hidden="true"
                className="flex h-full w-full flex-col gap-1.5 overflow-hidden rounded-xl bg-accent p-2 text-black"
              >
                <span className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Icon className="h-3 w-3" />
                    Video
                  </span>
                  <span className="font-mono text-[10px] text-black/70">{card.tool}</span>
                </span>
                <span className="relative flex flex-1 items-center justify-center rounded-md bg-gradient-to-br from-neutral-800 to-black">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-black">
                    <FaPlay className="ml-0.5 h-2.5 w-2.5" />
                  </span>
                  <span className="absolute left-1.5 top-1 text-[9px] font-semibold uppercase tracking-wider text-white/50">
                    LighTube
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-black/20">
                    <span
                      ref={barRef}
                      className="absolute inset-0 origin-left rounded-full bg-black"
                      style={{ transform: `scaleX(${reduceMotion ? 0.62 : 0})` }}
                    />
                  </span>
                  <span className="font-mono text-[9px] tabular-nums text-black/70">8:42</span>
                </span>
              </span>
            </>
          ) : (
            <span
              aria-hidden="true"
              className="relative flex h-full w-full items-center gap-2.5 overflow-hidden rounded-xl border border-ink/10 bg-surface px-3"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink/[0.06] text-ink">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold leading-tight text-ink">
                  {card.name}
                </span>
                <span className="block truncate font-mono text-[10px] leading-tight text-muted">
                  {card.tool}
                </span>
              </span>
              <span className="absolute inset-x-0 bottom-0 h-[3px] bg-ink/10">
                <span
                  ref={barRef}
                  className="absolute inset-0 origin-left bg-accent opacity-0"
                  style={{ transform: 'scaleX(0)' }}
                />
              </span>
            </span>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
};

const LighTubePipeline = () => {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const dotRefs = useRef([]);
  const barRefs = useRef([]);
  const pulseRef = useRef(null);
  const glowRef = useRef(null);
  const idleRef = useRef(null);
  const activeRef = useRef(-1);
  const rescheduleRef = useRef(null);
  const [active, setActive] = useState(-1);

  // Pointer / orientation input, normalised to -1..1, smoothed by springs.
  const inputX = useMotionValue(0);
  const inputY = useMotionValue(0);
  const spring = { stiffness: 90, damping: 18, mass: 0.7 };
  const tiltX = useSpring(inputX, spring);
  const tiltY = useSpring(inputY, spring);

  // One scroll-linked effect: the stack flattens and spreads as it scrolls away.
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['center center', 'end start'] });
  const leave = useTransform(scrollYProgress, [0, 0.8], [0, 1], { clamp: true });
  const flatten = useTransform(leave, (p) => (reduceMotion ? 0 : p));
  const spread = useTransform(flatten, [0, 1], [1, 1.3]);

  // Stage tilt plus a depth shear (x/y shift proportional to translateZ), as a
  // single transform so each frame writes one style on one element.
  const stageTransform = useTransform(
    [tiltX, tiltY, flatten],
    ([tx, ty, p]) =>
      `rotateX(${REST_X * (1 - p) - ty * MAX_TILT}deg) rotateY(${tx * MAX_TILT}deg) rotateZ(${REST_Z * (1 - p)}deg) ` +
      `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, ${tx * SHEAR}, ${ty * SHEAR}, 1, 0, 0, 0, 0, 1)`,
  );
  const planeZ = useTransform(spread, (s) => PLANE_Z * s - PLANE_BEHIND);
  const planeTransform = useMotionTemplate`translateZ(${planeZ}px) rotateX(${(PLANE_ANGLE * 180) / Math.PI}deg) scale(${spread})`;

  const activate = (i) => {
    activeRef.current = i;
    setActive(i);
    rescheduleRef.current?.();
  };
  const deactivate = (i) => {
    if (activeRef.current !== i) return;
    activeRef.current = -1;
    setActive(-1);
    rescheduleRef.current?.();
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) {
      inputX.set(0);
      inputY.set(0);
      return undefined;
    }

    const input = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0, fresh: false };
    let rect = root.getBoundingClientRect();
    let running = false;
    let inputFrame = 0;

    // Input is coalesced to at most one spring update per frame.
    const applyInput = () => {
      inputFrame = 0;
      if (pointer.fresh) {
        pointer.fresh = false;
        input.x = clamp((pointer.x - (rect.left + rect.width / 2)) / (window.innerWidth / 2));
        input.y = clamp((pointer.y - (rect.top + rect.height / 2)) / (window.innerHeight / 2));
      }
      inputX.set(input.x);
      inputY.set(input.y);
    };
    const requestInput = () => {
      if (running && !inputFrame) inputFrame = requestAnimationFrame(applyInput);
    };
    const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const cleanups = [];
    const loops = []; // long-running animations paused with the hero
    let idle = null;

    if (coarse) {
      // Phones: a slow compositor-driven float by default; switch to device
      // orientation only where it needs no permission prompt (iOS exposes
      // requestPermission, so it keeps the float).
      idle = idleRef.current?.animate(
        [
          { transform: 'rotateX(0deg) rotateY(-4deg) translateY(0px)' },
          { transform: 'rotateX(3deg) rotateY(0deg) translateY(-5px)' },
          { transform: 'rotateX(0deg) rotateY(4deg) translateY(0px)' },
          { transform: 'rotateX(-3deg) rotateY(0deg) translateY(5px)' },
          { transform: 'rotateX(0deg) rotateY(-4deg) translateY(0px)' },
        ],
        { duration: 14000, iterations: Infinity, easing: 'ease-in-out' },
      );
      if (idle) loops.push(idle);

      const needsPermission =
        typeof window.DeviceOrientationEvent !== 'undefined' &&
        typeof window.DeviceOrientationEvent.requestPermission === 'function';
      if (!needsPermission && 'DeviceOrientationEvent' in window) {
        let base = null;
        const onOrient = (e) => {
          if (e.beta == null || e.gamma == null) return;
          if (!base) {
            base = { beta: e.beta, gamma: e.gamma };
            if (idle) {
              idle.cancel();
              loops.splice(loops.indexOf(idle), 1);
              idle = null;
            }
          }
          // Let the neutral pose drift toward how the phone is being held.
          base.beta += (e.beta - base.beta) * 0.01;
          base.gamma += (e.gamma - base.gamma) * 0.01;
          input.x = clamp((e.gamma - base.gamma) / 20);
          input.y = clamp((e.beta - base.beta) / 20);
          requestInput();
        };
        window.addEventListener('deviceorientation', onOrient);
        cleanups.push(() => window.removeEventListener('deviceorientation', onOrient));
      }
    } else {
      const onMove = (e) => {
        if (e.pointerType === 'touch') return;
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.fresh = true;
        requestInput();
      };
      const onLeave = () => {
        input.x = 0;
        input.y = 0;
        pointer.fresh = false;
        requestInput();
      };
      // Measure on scroll/resize so the rAF callback never reads layout.
      const measure = () => {
        rect = root.getBoundingClientRect();
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('scroll', measure, { passive: true });
      window.addEventListener('resize', measure);
      document.documentElement.addEventListener('pointerleave', onLeave);
      cleanups.push(() => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('scroll', measure);
        window.removeEventListener('resize', measure);
        document.documentElement.removeEventListener('pointerleave', onLeave);
      });
    }

    const dots = dotRefs.current.filter(Boolean).map((el, i) => {
      const anim = el.animate(DOT_KEYFRAMES, { duration: CYCLE_MS, iterations: Infinity });
      anim.currentTime = (CYCLE_MS / DOTS) * i;
      loops.push(anim);
      return { anim, prev: 0, rate: 1, bar: null };
    });
    const bars = CARDS.map(() => null);
    const videoIndex = CARDS.length - 1;
    let pulse = null;

    const firePulse = () => {
      if (pulse && pulse.playState === 'running') return;
      pulse = pulseRef.current?.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.045)', offset: 0.3 }, { transform: 'scale(1)' }],
        { duration: 750, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
      glowRef.current?.animate([{ opacity: 0 }, { opacity: 1, offset: 0.25 }, { opacity: 0 }], {
        duration: 900,
        easing: 'ease-out',
      });
    };

    // A dot reached card c: fill that card's bar over the time it spends underneath.
    const enterCard = (c, dot) => {
      const el = barRefs.current[c];
      if (!el) return;
      const [start, end] = PATH.ranges[c];
      const pass = ((end - start) / BASE_SPEED) * 1000;
      bars[c]?.cancel();
      bars[c] =
        c === videoIndex
          ? el.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: pass, fill: 'forwards' })
          : el.animate(
              [
                { transform: 'scaleX(0)', opacity: 1 },
                { transform: 'scaleX(1)', opacity: 1, offset: pass / (pass + 500) },
                { transform: 'scaleX(1)', opacity: 0 },
              ],
              { duration: pass + 500, fill: 'forwards' },
            );
      bars[c].playbackRate = dot.rate;
      dot.bar = bars[c];
      if (c === videoIndex) firePulse();
    };

    const crossed = (from, to, mark) => (from <= to ? from < mark && mark <= to : mark > from || mark <= to);
    const positionOf = (dot) => (((dot.anim.currentTime ?? 0) % CYCLE_MS) / CYCLE_MS) * PATH.total;

    // No per-frame loop: the dots move on the compositor, and the main thread
    // only wakes (via a timer) when some dot reaches the next card boundary.
    let timer = 0;
    const step = () => {
      clearTimeout(timer);
      if (!running) return;
      const hot = activeRef.current >= 0 ? PATH.ranges[activeRef.current] : null;
      const marks = PATH.ranges.map(([start]) => start).concat(hot ?? []);
      let wait = Infinity;
      dots.forEach((dot) => {
        const pos = positionOf(dot);
        PATH.ranges.forEach(([start], c) => {
          if (pos !== dot.prev && crossed(dot.prev, pos, start)) enterCard(c, dot);
        });
        dot.prev = pos;

        const rate = hot && pos >= hot[0] && pos < hot[1] ? HOVER_BOOST : 1;
        if (rate !== dot.rate) {
          dot.rate = rate;
          dot.anim.updatePlaybackRate(rate);
          if (dot.bar?.playState === 'running') dot.bar.updatePlaybackRate(rate);
        }

        const ahead = Math.min(...marks.map((m) => (m - pos > 0 ? m - pos : m - pos + PATH.total)));
        wait = Math.min(wait, (ahead / (BASE_SPEED * rate)) * 1000);
      });
      timer = setTimeout(step, Math.max(4, wait + 2));
    };
    rescheduleRef.current = step;

    let visible = false;
    const sync = () => {
      const run = visible && document.visibilityState === 'visible';
      if (run === running) return;
      running = run;
      if (run) {
        loops.forEach((a) => a.play());
        bars.forEach((a) => a?.playState === 'paused' && a.play());
        dots.forEach((dot) => {
          dot.prev = positionOf(dot);
        });
        step();
        requestInput();
      } else {
        clearTimeout(timer);
        cancelAnimationFrame(inputFrame);
        inputFrame = 0;
        loops.forEach((a) => a.pause());
        bars.forEach((a) => a?.playState === 'running' && a.pause());
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) rect = entry.boundingClientRect;
      sync();
    });
    io.observe(root);
    document.addEventListener('visibilitychange', sync);
    // Start paused; the observer resumes everything once the hero is on screen.
    loops.forEach((a) => a.pause());

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      clearTimeout(timer);
      cancelAnimationFrame(inputFrame);
      rescheduleRef.current = null;
      cleanups.forEach((fn) => fn());
      loops.forEach((a) => a.cancel());
      bars.forEach((a) => a?.cancel());
      pulse?.cancel();
    };
  }, [reduceMotion, inputX, inputY]);

  const groundZ = CARDS[0].z - 60;

  return (
    <div ref={rootRef} className="relative h-[290px] w-full select-none sm:h-[380px] lg:h-[460px] xl:h-[500px]">
      <p id="lightube-pipeline-desc" className="sr-only">
        LighTube pipeline: research, script, visuals, voiceover and video assembly, run automatically.
      </p>

      <div
        className="absolute left-1/2 top-1/2 scale-[0.48] sm:scale-75 lg:scale-[0.78] xl:scale-[0.92]"
        style={{ width: SCENE_W, height: SCENE_H, marginLeft: -SCENE_W / 2, marginTop: -SCENE_H / 2 }}
      >
        <div className="absolute inset-0" style={{ perspective: '1200px' }}>
          <div ref={idleRef} className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
            <motion.div
              className="absolute left-1/2 top-1/2 h-0 w-0"
              style={{ ...OPTICAL_OFFSET, transform: stageTransform, transformStyle: 'preserve-3d' }}
            >
              {/* Ground shadow under the stack. */}
              <div
                aria-hidden="true"
                className="absolute left-0 top-0 rounded-[50%] opacity-60 dark:opacity-90"
                style={{
                  width: 560,
                  height: 380,
                  marginLeft: -280,
                  marginTop: -190,
                  transform: `translate3d(24px, 40px, ${groundZ}px)`,
                  background:
                    'radial-gradient(closest-side, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.12) 55%, rgba(0, 0, 0, 0) 100%)',
                }}
              />

              {/* Connector plane: tilted to pass through every card centre. */}
              <motion.div
                aria-hidden="true"
                className="absolute left-0 top-0"
                style={{ transform: planeTransform, transformOrigin: '0 0' }}
              >
                <svg
                  className="absolute overflow-visible"
                  style={{ left: PATH.box.x, top: PATH.box.y, width: PATH.box.w, height: PATH.box.h }}
                  viewBox={`${PATH.box.x} ${PATH.box.y} ${PATH.box.w} ${PATH.box.h}`}
                  fill="none"
                >
                  <defs>
                    <linearGradient id="lightube-path" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" style={{ stopColor: 'rgb(var(--ink))', stopOpacity: 0.2 }} />
                      <stop offset="100%" style={{ stopColor: 'rgb(var(--accent))', stopOpacity: 0.9 }} />
                    </linearGradient>
                  </defs>
                  <path d={PATH.d} stroke="url(#lightube-path)" strokeWidth="2.5" strokeLinecap="round" />
                  <path
                    d={PATH.d}
                    style={{ stroke: 'rgb(var(--ink))' }}
                    strokeOpacity="0.25"
                    strokeWidth="1"
                    strokeDasharray="2 6"
                    transform="translate(0 4)"
                  />
                </svg>
                {!reduceMotion &&
                  Array.from({ length: DOTS }, (_, i) => (
                    <span
                      key={i}
                      ref={(el) => {
                        dotRefs.current[i] = el;
                      }}
                      className="absolute -left-[5px] -top-[5px] h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_10px_3px_rgb(240_74_20/0.6)]"
                      style={{ transform: DOT_KEYFRAMES[0].transform }}
                    />
                  ))}
              </motion.div>

              {CARDS.map((card, i) => (
                <PipelineCard
                  key={card.name}
                  card={card}
                  index={i}
                  spread={spread}
                  active={active === i}
                  reduceMotion={reduceMotion}
                  onActivate={activate}
                  onDeactivate={deactivate}
                  barRef={(el) => {
                    barRefs.current[i] = el;
                  }}
                  pulseRef={i === CARDS.length - 1 ? pulseRef : undefined}
                  glowRef={i === CARDS.length - 1 ? glowRef : undefined}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LighTubePipeline;
