import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMoon, FiSun } from 'react-icons/fi';
import { EASE_OUT, Roll } from './fx';
import { scrollToId } from '../lib/scroll';

const LINKS = [
  ['about', 'About'],
  ['work', 'Work'],
  ['projects', 'Case studies'],
  ['contact', 'Contact'],
];
const TRACKED = ['home', 'work', 'about', 'projects', 'contact'];

const ThemeToggle = ({ darkMode, toggleDarkMode }) => (
  <button
    type="button"
    onClick={toggleDarkMode}
    className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 transition-colors hover:border-ink"
    aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
  >
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={darkMode ? 'sun' : 'moon'}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {darkMode ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
      </motion.span>
    </AnimatePresence>
  </button>
);

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuRef = useRef(null);

  // Highlight the section crossing the middle of the viewport.
  useEffect(() => {
    // "work" is nested inside "home", so keep every visible id and pick the
    // most specific (latest in TRACKED).
    const visible = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        setActive(TRACKED.filter((id) => visible.has(id)).pop() ?? 'home');
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    TRACKED.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Tuck the bar away while scrolling down; bring it back on the way up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 400 && y > lastY);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    document.body.style.overflow = 'hidden';
    menuRef.current?.querySelector('a')?.focus();
    const onKey = (e) => e.key === 'Escape' && setIsOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const go = (id) => (e) => {
    e.preventDefault();
    setIsOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <motion.header
        animate={{ y: hidden && !isOpen ? '-100%' : '0%' }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${
          scrolled && !isOpen ? 'border-b border-ink/10 bg-paper/80 backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <nav aria-label="Primary" className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-10">
          <a href="#home" onClick={go('home')} className="group flex items-center gap-2 text-sm font-semibold tracking-tight">
            <span className="h-2 w-2 rounded-full bg-accent transition-transform duration-500 ease-out-expo group-hover:scale-150" aria-hidden="true" />
            <Roll>Nahom Getachew</Roll>
          </a>

          <ul className="hidden items-center gap-8 text-sm md:flex">
            {LINKS.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={go(id)}
                  aria-current={active === id ? 'true' : undefined}
                  className={`group flex items-center gap-2 transition-colors ${active === id ? 'text-ink' : 'text-muted hover:text-ink'}`}
                >
                  <span
                    className={`h-1 w-1 rounded-full bg-accent transition-transform duration-300 ${active === id ? 'scale-100' : 'scale-0'}`}
                    aria-hidden="true"
                  />
                  <Roll>{label}</Roll>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <a
              href="#contact"
              onClick={go('contact')}
              className="group hidden items-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors duration-300 hover:bg-accent hover:text-black md:inline-flex"
            >
              <Roll>Let&apos;s talk</Roll>
            </a>
            <button
              type="button"
              onClick={() => setIsOpen((o) => !o)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="h-10 rounded-full border border-ink/15 px-4 font-mono text-[11px] uppercase tracking-[0.18em] md:hidden"
            >
              {isOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="fixed inset-0 z-40 flex flex-col justify-end bg-paper px-4 pb-10 pt-24 sm:px-6 md:hidden"
          >
            <ul>
              {[['home', 'Home'], ...LINKS].map(([id, label], i) => (
                <li key={id} className="overflow-hidden border-b border-ink/10">
                  <motion.a
                    href={`#${id}`}
                    onClick={go(id)}
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.15 + i * 0.05 }}
                    className="flex items-baseline justify-between py-3 text-5xl font-semibold tracking-[-0.04em]"
                  >
                    {label}
                    <span className="eyebrow">{String(i).padStart(2, '0')}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <p className="eyebrow mt-8">Addis Ababa, Ethiopia</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
