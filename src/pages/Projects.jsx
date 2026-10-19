import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUpRight, FiGithub, FiPlay, FiX } from 'react-icons/fi';
import { EASE_OUT, Reveal, Roll, SectionLabel } from '../components/fx';
import { projects } from '../data/projects';

const hasLink = (url) => url && url !== '#';

// Screenshot in a frame: monochrome until hovered.
const Shot = ({ src, alt }) => (
  <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-surface ring-1 ring-ink/10">
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="h-full w-full object-cover object-top grayscale transition duration-700 ease-out-expo group-hover:scale-[1.03] group-hover:grayscale-0"
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
  </div>
);

const Projects = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const openVideoModal = (videoUrl) => {
    if (videoUrl) {
      setSelectedVideo(videoUrl);
    }
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setSelectedVideo(null);
      }
    };

    if (selectedVideo) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedVideo]);

  return (
    <div className="px-4 py-24 sm:px-6 md:py-36 lg:px-10">
      <SectionLabel index="04">Case studies</SectionLabel>
      <Reveal as="h2" className="mt-14 text-5xl font-bold tracking-[-0.05em] md:text-8xl">
        The <span className="font-serif font-normal italic">details</span>
      </Reveal>

      <div className="mt-20 space-y-32 md:space-y-44">
        {projects.map((project, index) => (
          <article
            key={project.id}
            id={project.anchor}
            tabIndex={-1}
            aria-labelledby={`${project.anchor}-title`}
            className="grid gap-10 outline-none lg:grid-cols-12 lg:gap-16"
          >
            <Reveal className={`lg:col-span-7 ${index % 2 ? 'lg:order-2' : ''}`}>
              <Shot src={project.image} alt={project.title} />
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-5">
              <div className="eyebrow flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="text-ink">{String(index + 1).padStart(2, '0')}</span>
                <span className="flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${project.status === 'Completed' ? 'bg-ink/40' : 'bg-accent'}`}
                    aria-hidden="true"
                  />
                  {project.status}
                </span>
                <span>{project.date}</span>
              </div>

              <h3 id={`${project.anchor}-title`} className="mt-5 text-3xl font-bold leading-[1.05] tracking-[-0.04em] md:text-5xl">
                {project.title}
              </h3>

              <p className="mt-6 leading-relaxed text-muted">{project.longDescription}</p>

              <h4 className="eyebrow mt-10">Key features</h4>
              <ul className="mt-3 border-t border-ink/10 text-sm">
                {project.features.map((feature) => (
                  <li key={feature} className="flex gap-3 border-b border-ink/10 py-2.5">
                    <span className="text-accent" aria-hidden="true">
                      ✳
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
                {project.tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-ink/15 px-3 py-1 font-mono text-[11px] text-muted">
                    {tag}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                {hasLink(project.demo) && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black"
                  >
                    <Roll>Live demo</Roll>
                    <FiArrowUpRight className="h-4 w-4" />
                  </a>
                )}
                {hasLink(project.github) && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold transition-colors duration-300 hover:border-ink"
                  >
                    <FiGithub className="h-4 w-4" />
                    <Roll>Source</Roll>
                  </a>
                )}
                {project.youtubeVideo ? (
                  <button
                    type="button"
                    onClick={() => openVideoModal(project.youtubeVideo)}
                    className="group inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold transition-colors duration-300 hover:border-ink"
                  >
                    <FiPlay className="h-4 w-4" />
                    <Roll>Watch demo</Roll>
                  </button>
                ) : (
                  <span className="eyebrow px-2">Demo video soon</span>
                )}
              </div>
            </Reveal>
          </article>
        ))}
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeVideoModal}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Project demo video"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-black"
            >
              <button
                onClick={closeVideoModal}
                className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                aria-label="Close video"
              >
                <FiX className="h-5 w-5" />
              </button>
              <div className="aspect-video">
                {getYouTubeEmbedUrl(selectedVideo) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(selectedVideo)}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white">
                    <p>Invalid YouTube URL</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
