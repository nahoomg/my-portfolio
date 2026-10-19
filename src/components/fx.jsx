import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

export const EASE_OUT = [0.16, 1, 0.3, 1];

const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// "(01) ——— Label" eyebrow at the top of each section.
export const SectionLabel = ({ index, children }) => (
  <div className="eyebrow flex items-center gap-3">
    <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
    <span className="text-ink">({index})</span>
    <span>{children}</span>
    <span className="h-px flex-1 bg-ink/10" aria-hidden="true" />
  </div>
);

// Fade-and-rise once when scrolled into view.
export const Reveal = ({ as = 'div', delay = 0, className, children }) => {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
    >
      {children}
    </Tag>
  );
};

// Two stacked copies of a label that roll up on hover/focus of a `.group` parent.
export const Roll = ({ children }) => (
  <span className="roll">
    <span>{children}</span>
    <span aria-hidden="true">{children}</span>
  </span>
);

// Pulls its child toward the cursor while hovered (mouse only).
export const Magnetic = ({ strength = 0.3, className = '', children }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const spring = { stiffness: 220, damping: 16, mass: 0.4 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  const onMove = (e) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x, y }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=/<>';

// Cycles through words, decoding each one from random glyphs. Screen readers
// get the full list once instead of a constantly changing region.
export const ScrambleText = ({ words, interval = 2600, className }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return undefined;
    let index = 0;
    let raf = 0;
    let visible = true;

    const scrambleTo = (target) => {
      const length = Math.max(el.textContent.length, target.length);
      const start = performance.now();
      let last = 0;
      const frame = (now) => {
        const p = Math.min(1, (now - start) / 750);
        if (now - last > 45 || p === 1) {
          last = now;
          let out = '';
          for (let k = 0; k < length; k += 1) {
            const settle = 0.2 + (k / length) * 0.8;
            if (p >= settle) out += target[k] ?? '';
            else out += target[k] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }
          el.textContent = out;
        }
        if (p < 1) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };

    const timer = setInterval(() => {
      if (!visible || document.hidden) return;
      index = (index + 1) % words.length;
      scrambleTo(words[index]);
    }, interval);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);

    return () => {
      clearInterval(timer);
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [words, interval, reduce]);

  return (
    <>
      <span className="sr-only">{words.join(', ')}</span>
      <span ref={ref} aria-hidden="true" className={className}>
        {words[0]}
      </span>
    </>
  );
};

// Infinite ticker. The loop runs on the compositor (Web Animations); scrolling
// only nudges its playback rate, so speed and direction follow the scroll.
export const Marquee = ({ duration = 45, children }) => {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduce) return undefined;
    const anim = track.animate(
      [{ transform: 'translate3d(0, 0, 0)' }, { transform: 'translate3d(-50%, 0, 0)' }],
      { duration: duration * 1000, iterations: Infinity },
    );
    let direction = 1;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let settle = 0;

    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - lastY;
      const dt = Math.max(16, now - lastT);
      lastY = window.scrollY;
      lastT = now;
      if (dy) direction = dy > 0 ? 1 : -1;
      const boost = Math.min((Math.abs(dy) / dt) * 3, 5);
      anim.updatePlaybackRate(direction * (1 + boost));
      clearTimeout(settle);
      settle = setTimeout(() => anim.updatePlaybackRate(direction), 160);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        anim.play();
        lastY = window.scrollY;
        window.addEventListener('scroll', onScroll, { passive: true });
      } else {
        anim.pause();
        window.removeEventListener('scroll', onScroll);
      }
    });
    io.observe(wrapRef.current);

    return () => {
      io.disconnect();
      clearTimeout(settle);
      window.removeEventListener('scroll', onScroll);
      anim.cancel();
    };
  }, [duration, reduce]);

  return (
    <div ref={wrapRef} className="overflow-hidden">
      <div ref={trackRef} className="flex w-max">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

const ScrollWord = ({ progress, range, accent, children }) => {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <>
      <motion.span style={{ opacity }} className={accent ? 'font-serif italic text-accent' : undefined}>
        {children}
      </motion.span>{' '}
    </>
  );
};

// Paragraph whose words light up as it scrolls through the viewport.
// Words wrapped in *asterisks* render in the accent serif.
export const ScrollRevealText = ({ text, className }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.4'] });
  const words = text.split(' ').map((w) => ({ accent: /^\*.*\*[.,]?$/.test(w), word: w.replace(/\*/g, '') }));

  return (
    <p ref={ref} className={className}>
      {words.map(({ word, accent }, i) =>
        reduce ? (
          <span key={i} className={accent ? 'font-serif italic text-accent' : undefined}>
            {word}{' '}
          </span>
        ) : (
          <ScrollWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} accent={accent}>
            {word}
          </ScrollWord>
        ),
      )}
    </p>
  );
};

export const useFinePointer = () => {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return fine;
};

export { finePointer };

const timeFormat = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Africa/Addis_Ababa',
});

// Current time in Addis Ababa, refreshed every 15s.
export const LocalTime = ({ className }) => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={className}>
      <time dateTime={now.toISOString()}>{timeFormat.format(now)}</time> EAT
    </span>
  );
};
