import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCalendar, FaCheckCircle, FaClock, FaPlay, FaTimes } from 'react-icons/fa';

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

  const projects = [
    {
      id: 1,
      title: 'AI YouTube Automation Platform',
      status: 'In Progress',
      statusColor: 'bg-yellow-500',
      date: 'December 2025 - Present',
      description: 'A cutting-edge, full-stack web application designed to automate the entire YouTube video creation pipeline using advanced AI models. From topic research to final video assembly.',
      longDescription: 'This platform empowers content creators to generate high-quality, engaging videos with minimal manual effort. It features multi-channel project management, AI-powered content generation using Google\'s Gemini models for topic research, scriptwriting, and production planning. Integrates Stability AI for visual asset creation including thumbnails and scene-by-scene images. Utilizes Gemini\'s Text-to-Speech for natural voiceovers and FFmpeg for automated video assembly. Built with Next.js (TypeScript, Tailwind CSS, shadcn/ui) and Firestore for robust backend storage.',
      image: '/images/ai-youtube-automation.png',
      tags: ['Next.js', 'TypeScript', 'Gemini AI', 'Stability AI', 'FFmpeg', 'Firestore', 'Automation'],
      features: [
        'Multi-channel project management with customizable settings',
        'AI-powered scriptwriting with multiple persona options',
        'Automated thumbnail and scene image generation',
        'Professional Text-to-Speech voiceovers with Gemini TTS',
        'Complete video assembly with subtitles using FFmpeg',
        'SEO-optimized titles, descriptions, and tags generation',
        'Real-time job tracking with downloadable assets',
        'Modern Next.js dashboard with shadcn/ui components',
      ],
      github: 'https://github.com/nahoomg/youtube-automation-script.git',
      demo: 'https://lightube.vercel.app',
      youtubeVideo: '',
    },
    {
      id: 2,
      title: 'CineReview - Movie Review Platform',
      status: 'Completed',
      statusColor: 'bg-green-500',
      date: '2024',
      description: 'A full-stack movie review platform where users can discover movies, read reviews, and share their thoughts. Built with Django REST Framework and React, featuring authentication, image uploads, and a responsive UI.',
      longDescription: 'CineReview is a full-stack web application that enables movie enthusiasts to explore films, write reviews, and manage their review history. The platform features token-based authentication, movie browsing with search and genre filters, a comprehensive review system with ratings and comments, user profiles with avatar uploads, and a responsive design with modern UI/UX.',
      image: '/images/movie-review.png',
      tags: ['Django', 'Django REST Framework', 'React', 'Vite', 'Tailwind CSS', 'SQLite', 'Full-Stack'],
      features: [
        'RESTful API with Django REST Framework',
        'React frontend with Context API for state management',
        'Token-based authentication system',
        'Movie browsing with search and genre filters',
        'Review system with ratings and comments',
        'User profiles with avatar uploads',
        'Image upload and management',
        'Protected routes and secure authentication',
        'Responsive design for all devices',
      ],
      github: 'https://github.com/nahoomg/movie-review-api.git',
      demo: 'https://movie-review-api-omega.vercel.app/',
      youtubeVideo: '',
    },
    {
      id: 3,
      title: 'Arifpay Hackathon — Telegram E-Commerce Bot',
      status: 'Completed',
      statusColor: 'bg-green-500',
      date: 'October 2025',
      description: 'A fully functional e-commerce Telegram bot built for the Arifpay hackathon. It supports product browsing, order placement, and payment integration within the Telegram ecosystem.',
      longDescription: 'Developed during the Arifpay hackathon, this Telegram bot provides a complete e-commerce experience within the messaging platform. Users can browse products, view details, add items to cart, and complete purchases using integrated payment solutions. The bot features an intuitive conversation flow, persistent cart management, and real-time order tracking.',
      image: '/images/Suq-et-ecommerce.png',
      tags: ['Telegram Bot', 'API Integration', 'E-Commerce', 'Hackathon', 'Python', 'Rapid Prototyping'],
      features: [
        'Product catalog browsing',
        'Shopping cart management',
        'Payment gateway integration',
        'Order tracking system',
        'Admin dashboard for product management',
      ],
      github: '#',
      demo: '#',
      youtubeVideo: '',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen">
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-600/5 to-emerald-400/5 dark:from-emerald-600/3 dark:to-emerald-400/3">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-display font-bold mb-3"
          >
            My <span className="text-gradient">Projects</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-gray-600 dark:text-gray-400 max-w-xl mx-auto"
          >
            A showcase of my work in AI automation, mobile development, and innovative solutions
          </motion.p>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-10"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-6 items-center`}
              >
                <div className="w-full lg:w-1/2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`relative rounded-2xl overflow-hidden shadow-2xl group ${project.id === 1 ? '-mt-8' : ''}`}
                  >
                    <div className="aspect-video bg-gradient-to-br from-emerald-600/20 to-emerald-400/20 relative">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>

                    <div className="absolute top-4 left-4">
                      <span className={`${project.statusColor} text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 shadow-lg`}>
                        {project.status === 'Completed' ? (
                          <FaCheckCircle />
                        ) : (
                          <FaClock />
                        )}
                        <span>{project.status}</span>
                      </span>
                    </div>
                  </motion.div>
                </div>

                <div className="w-full lg:w-1/2 space-y-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-display font-bold mb-2 text-gray-900 dark:text-white">
                      {project.title}
                    </h2>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2 text-sm">
                      <FaCalendar />
                      <span>{project.date}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {project.longDescription}
                  </p>

                  <div>
                    <h3 className="text-base font-bold mb-2 text-gray-900 dark:text-white">
                      Key Features
                    </h3>
                    <ul className="space-y-2">
                      {project.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start space-x-2 text-gray-700 dark:text-gray-300"
                        >
                          <span className="text-emerald-600 mt-1">▹</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-3">
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-5 py-2.5 bg-gray-800 dark:bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-700 dark:hover:bg-gray-600 hover:shadow-lg transition-all text-sm"
                    >
                      <FaGithub />
                      <span>View Code</span>
                    </motion.a>
                    <motion.a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-5 py-2.5 border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400 rounded-lg font-semibold hover:bg-emerald-600 hover:text-white transition-all text-sm"
                    >
                      <FaExternalLinkAlt />
                      <span>Live Demo</span>
                    </motion.a>
                    <motion.button
                      onClick={() => project.youtubeVideo ? openVideoModal(project.youtubeVideo) : null}
                      disabled={!project.youtubeVideo}
                      whileHover={project.youtubeVideo ? { scale: 1.05 } : {}}
                      whileTap={project.youtubeVideo ? { scale: 0.95 } : {}}
                      className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-semibold transition-all shadow-lg text-sm ${
                        project.youtubeVideo
                          ? 'bg-red-600 text-white hover:bg-red-700 hover:shadow-xl cursor-pointer'
                          : 'bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed opacity-75'
                      }`}
                    >
                      <FaPlay />
                      <span>{project.youtubeVideo ? 'Watch Demo' : 'Demo video will be added soon'}</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeVideoModal}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-2xl"
              >
                <button
                  onClick={closeVideoModal}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                  aria-label="Close video"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
                <div className="aspect-video">
                  {getYouTubeEmbedUrl(selectedVideo) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(selectedVideo)}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
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

