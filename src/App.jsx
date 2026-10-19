import { useState, useEffect } from 'react';
import { MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.3 });
  return <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent" style={{ scaleX }} />;
};

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', darkMode ? '#0a0a0a' : '#f4f3ef');
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    // reducedMotion="user" turns framer-motion transforms off for people who ask for less motion.
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only z-[90] rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <div className="flex min-h-screen flex-col">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main id="main" className="flex-grow">
          <section id="home">
            <Home />
          </section>
          <section id="about">
            <About />
          </section>
          <section id="projects">
            <Projects />
          </section>
          <section id="contact">
            <Contact />
          </section>
        </main>
        <Footer />
      </div>
      <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-[55] opacity-[0.035] dark:opacity-[0.05]" />
    </MotionConfig>
  );
}

export default App;
