export const NAV_OFFSET = 80;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll to an element by id. offsetTop ignores transforms, so the target is
// stable even while a section is mid reveal-animation.
export const scrollToId = (id, { focus = false } = {}) => {
  const el = document.getElementById(id);
  if (!el) return;
  let top = id === 'home' ? 0 : -NAV_OFFSET;
  if (id !== 'home') {
    for (let node = el; node; node = node.offsetParent) top += node.offsetTop;
  }
  window.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  if (focus) el.focus({ preventScroll: true });
};
