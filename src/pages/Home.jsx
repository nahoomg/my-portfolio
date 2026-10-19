import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform, useVelocity } from 'framer-motion';
import { FiArrowDownRight, FiArrowUpRight } from 'react-icons/fi';
import LighTubePipeline from '../components/LighTubePipeline';
import { EASE_OUT, LocalTime, Magnetic, Marquee, Reveal, Roll, ScrambleText, SectionLabel, finePointer, useFinePointer } from '../components/fx';
import { projects } from '../data/projects';
import { scrollToId } from '../lib/scroll';

// Placeholder avatar; swap for a real photo (e.g. '/images/nahom.webp').
const PROFILE_IMAGE = '/images/avatar.svg';

const NAME = ['NAHOM', 'GETACHEW'];
const ROLES = ['AI automation', 'full-stack apps', 'Telegram bots', 'video pipelines'];
const STACK = ['Python', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Flutter', 'Gemini', 'Stability AI', 'FFmpeg', 'PostgreSQL', 'MongoDB', 'Telegram Bot API', 'Tailwind CSS'];

// Giant name: letters rise out of a mask on load, then stretch toward the cursor.
const KineticName = () => {
  const reduce = useReducedMotion();
  const letters = useRef([]);

  useEffect(() => {
    if (reduce || !finePointer()) return undefined;
    let centers = [];
    let frame = 0;
    const pointer = { x: -1e4, y: -1e4 };

    // Cache page-space centres so the pointer handler never reads layout.
    const measure = () => {
      centers = letters.current.map((el) => {
        const r = el.getBoundingClientRect();
        return [r.left + r.width / 2, r.top + window.scrollY + r.height / 2];
      });
    };
    const apply = () => {
      frame = 0;
      letters.current.forEach((el, i) => {
        const [cx, cy] = centers[i] ?? [0, 0];
        const d = Math.hypot(pointer.x - cx, pointer.y + window.scrollY - cy);
        const k = Math.max(0, 1 - d / 320);
        el.style.transform = k ? `scaleY(${1 + k * 0.16}) skewX(${-k * 5}deg)` : '';
      });
    };
    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      pointer.x = -1e4;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const settle = setTimeout(measure, 1600); // after the intro animation
    window.addEventListener('resize', measure);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      clearTimeout(settle);
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', measure);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [reduce]);

  let n = 0;
  const letter = (char, line) => {
    const i = n;
    n += 1;
    return (
      <span key={i} className="-mx-[0.09em] -mt-[0.25em] inline-block overflow-hidden px-[0.09em] pb-[0.04em] pt-[0.25em] align-bottom">
        <motion.span
          className="inline-block"
          initial={{ y: '105%' }}
          animate={{ y: '0%' }}
          transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.15 + line * 0.12 + i * 0.035 }}
        >
          <span
            ref={(el) => {
              letters.current[i] = el;
            }}
            className="inline-block origin-bottom transition-transform duration-500 ease-out-expo"
          >
            {char}
          </span>
        </motion.span>
      </span>
    );
  };

  return (
    <h1 className="font-display font-bold uppercase leading-[0.82] tracking-[-0.045em] text-[17.5vw] sm:text-[15.5vw] xl:text-[14.6rem]">
      <span className="sr-only">Nahom Getachew</span>
      <span aria-hidden="true" className="block">
        <span className="flex items-center gap-[0.12em]">
          {[...NAME[0]].map((c) => letter(c, 0))}
          <motion.span
            className="relative inline-block h-[0.66em] w-[1.15em] overflow-hidden rounded-full bg-surface ring-1 ring-ink/10"
            initial={{ clipPath: 'inset(0 100% 0 0 round 999px)' }}
            animate={{ clipPath: 'inset(0 0% 0 0 round 999px)' }}
            transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.6 }}
          >
            <img
              src={PROFILE_IMAGE}
              alt=""
              className="h-full w-full object-cover object-[50%_35%] grayscale transition duration-700 hover:grayscale-0"
            />
          </motion.span>
          <span className="ml-auto hidden max-w-[16rem] self-end pb-[0.12em] text-right font-sans text-sm font-normal normal-case leading-snug tracking-normal text-muted lg:block">
            Information Science student building AI-driven software in Addis Ababa.
          </span>
        </span>
        <span className="block whitespace-nowrap">{[...NAME[1]].map((c) => letter(c, 1))}</span>
      </span>
    </h1>
  );
};

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE_OUT, delay },
});

const Hero = () => (
  <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-4 pb-10 pt-24 sm:px-6 lg:px-10">
    <motion.div {...fadeUp(0.1)} className="eyebrow flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
      <span className="flex items-center gap-2 text-ink">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
        Available for work
      </span>
      <span className="hidden sm:inline">Addis Ababa, ET — <LocalTime /></span>
      <span>Portfolio ©{new Date().getFullYear()}</span>
    </motion.div>

    <div className="my-10 lg:my-6">
      <KineticName />
    </div>

    <div className="grid items-end gap-10 lg:grid-cols-12">
      <motion.p {...fadeUp(0.9)} className="text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:col-span-7 lg:text-6xl">
        I build{' '}
        <span className="block font-serif font-normal italic text-accent">
          <ScrambleText words={ROLES} />
        </span>
      </motion.p>

      <motion.div {...fadeUp(1.05)} className="space-y-8 lg:col-span-5">
        <p className="max-w-md text-base leading-relaxed text-muted">
          A third-year Information Science student passionate about building practical, AI-integrated
          solutions — automated workflows and apps that solve real-world problems, from e-commerce bots to
          educational AI tools for Ethiopian students.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Magnetic>
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('work');
              }}
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-black"
            >
              <Roll>View selected work</Roll>
              <FiArrowDownRight className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:rotate-[-45deg]" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToId('contact');
              }}
              className="group inline-flex items-center gap-3 rounded-full border border-ink/20 px-7 py-4 text-sm font-semibold transition-colors duration-300 hover:border-ink"
            >
              <Roll>Get in touch</Roll>
            </a>
          </Magnetic>
        </div>
      </motion.div>
    </div>
  </section>
);

const Ticker = () => (
  <section aria-label="Tools I work with" className="border-y border-ink/10 py-6 md:py-8">
    <Marquee duration={50}>
      {STACK.map((tool, i) => (
        <span key={tool} className="flex items-center whitespace-nowrap">
          <span
            className={`px-6 text-5xl font-semibold uppercase tracking-tight md:px-10 md:text-7xl ${
              i % 2 ? 'text-outline' : ''
            }`}
          >
            {tool}
          </span>
          <span className="text-3xl text-accent md:text-5xl" aria-hidden="true">
            ✳
          </span>
        </span>
      ))}
    </Marquee>
  </section>
);

const LIGHTUBE_FACTS = [
  ['Stack', 'Next.js · TypeScript · Firestore'],
  ['Models', 'Gemini · Stability AI · Gemini TTS'],
  ['Assembly', 'FFmpeg'],
  ['Status', 'In progress'],
];

const NowBuilding = () => (
  <section className="px-4 py-20 sm:px-6 md:py-36 lg:px-10">
    <SectionLabel index="01">Now building</SectionLabel>
    <div className="mt-14 grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
      <div>
        <Reveal as="h2" className="text-6xl font-bold tracking-[-0.05em] md:text-8xl">
          LighTube
        </Reveal>
        <Reveal as="p" delay={0.1} className="mt-6 max-w-lg text-3xl leading-tight md:text-4xl">
          From a topic to a finished YouTube video —{' '}
          <span className="font-serif italic text-accent">automatically.</span>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-md leading-relaxed text-muted">
            Research, script, visuals, voiceover and edit run as one pipeline. Hover a step to follow the
            work through it; click the final cut to read the case study.
          </p>
          <dl className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {LIGHTUBE_FACTS.map(([term, value]) => (
              <div key={term} className="flex items-baseline justify-between gap-6 py-3">
                <dt className="eyebrow">{term}</dt>
                <dd className="flex items-center gap-2 text-right text-sm">
                  {term === 'Status' && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />}
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex gap-6 text-sm font-medium">
            <a href="https://lightube.vercel.app" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5">
              <Roll>Live demo</Roll>
              <FiArrowUpRight className="h-4 w-4 text-accent" />
            </a>
            <a href="https://github.com/nahoomg/youtube-automation-script.git" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5">
              <Roll>Source code</Roll>
              <FiArrowUpRight className="h-4 w-4 text-accent" />
            </a>
          </div>
        </Reveal>
      </div>
      <LighTubePipeline />
    </div>
  </section>
);

// Index of projects. On mouse devices a preview image follows the cursor and
// tilts with its horizontal velocity.
const SelectedWork = () => {
  const listRef = useRef(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(-1);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.6 });
  const y = useSpring(my, { stiffness: 260, damping: 28, mass: 0.6 });
  const vx = useVelocity(x);
  const rotate = useTransform(vx, [-1600, 1600], [-10, 10], { clamp: true });

  const onMove = (e) => {
    const r = listRef.current.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  return (
    <section id="work" className="px-4 py-24 sm:px-6 md:py-36 lg:px-10">
      <SectionLabel index="02">Selected work</SectionLabel>
      <div className="mt-14 flex items-end justify-between gap-6">
        <Reveal as="h2" className="text-5xl font-bold tracking-[-0.05em] md:text-8xl">
          Selected <span className="font-serif font-normal italic">work</span>
        </Reveal>
        <span className="eyebrow pb-3">({String(projects.length).padStart(2, '0')})</span>
      </div>

      <ul
        ref={listRef}
        onPointerMove={fine ? onMove : undefined}
        onPointerLeave={() => setActive(-1)}
        className="relative mt-12 border-t border-ink/10"
      >
        {projects.map((project, i) => (
          <Reveal as="li" key={project.id} delay={i * 0.06} className="border-b border-ink/10">
            <a
              href={`#${project.anchor}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(project.anchor, { focus: true });
              }}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(-1)}
              className="group grid grid-cols-12 items-center gap-4 py-7 md:py-10"
            >
              <span className="eyebrow col-span-2 md:col-span-1">{String(i + 1).padStart(2, '0')}</span>
              <span className="col-span-10 text-2xl font-semibold tracking-tight transition-transform duration-700 ease-out-expo group-hover:translate-x-4 md:col-span-6 md:text-4xl xl:text-5xl">
                {project.title}
              </span>
              <span className="col-span-6 col-start-3 text-sm text-muted md:col-span-3 md:col-start-auto">{project.category}</span>
              <span className="col-span-4 flex items-center justify-end gap-3 font-mono text-sm md:col-span-2">
                {project.year}
                <FiArrowUpRight className="h-5 w-5 text-accent transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
              </span>
              {!fine && (
                <img
                  src={project.image}
                  alt=""
                  loading="lazy"
                  className="col-span-12 mt-2 aspect-video w-full rounded-lg object-cover object-top"
                />
              )}
            </a>
          </Reveal>
        ))}

        {fine && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
            style={{ x, y, rotate: reduce ? 0 : rotate }}
          >
            <AnimatePresence>
              {active >= 0 && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                  className="relative -ml-[11rem] -mt-[7rem] h-[14rem] w-[22rem] overflow-hidden rounded-xl bg-surface shadow-2xl ring-1 ring-ink/10"
                >
                  {projects.map((p, i) => (
                    <img
                      key={p.id}
                      src={p.image}
                      alt=""
                      className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-300 ${
                        i === active ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </ul>
    </section>
  );
};

const Home = () => (
  <>
    <Hero />
    <Ticker />
    <NowBuilding />
    <SelectedWork />
  </>
);

export default Home;
