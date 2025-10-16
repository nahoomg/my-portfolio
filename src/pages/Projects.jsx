import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCalendar, FaCheckCircle, FaClock } from 'react-icons/fa';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'AI YouTube Automation Platform',
      status: 'In Progress',
      statusColor: 'bg-yellow-500',
      date: 'December 2025 - Present',
      description: 'A cutting-edge, full-stack web application designed to automate the entire YouTube video creation pipeline using advanced AI models. From topic research to final video assembly.',
      longDescription: 'This platform empowers content creators to generate high-quality, engaging videos with minimal manual effort. It features multi-channel project management, AI-powered content generation using Google\'s Gemini models for topic research, scriptwriting, and production planning. Integrates Stability AI for visual asset creation including thumbnails and scene-by-scene images. Utilizes Gemini\'s Text-to-Speech for natural voiceovers and FFmpeg for automated video assembly. Built with Next.js (TypeScript, Tailwind CSS, shadcn/ui) and Firestore for robust backend storage.',
      image: '/images/ai-youtube-automation.jpg',
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
      github: '#',
      demo: '#',
    },
    {
      id: 2,
      title: 'AI Study Assistant for Ethiopian Students',
      status: 'In Progress',
      statusColor: 'bg-yellow-500',
      date: 'November 2025 - Present',
      description: 'A Flutter-based mobile app concept integrating AI to support Ethiopian students academically. Features include personalized learning aids, instant explanations, and accessible digital resources tailored to the Ethiopian curriculum and learning environment.',
      longDescription: 'This project aims to bridge the educational technology gap in Ethiopia by providing students with an AI-powered mobile assistant. The app will offer features like instant homework help, subject-specific tutoring, exam preparation tools, and curated learning resources. Built with Flutter for cross-platform compatibility and integrating modern AI capabilities to provide intelligent, context-aware educational support.',
      image: '/images/ai-studyapp.png',
      tags: ['Flutter', 'AI', 'EdTech', 'Mobile App', 'UI/UX', 'In-Progress'],
      features: [
        'Personalized learning recommendations',
        'AI-powered instant explanations',
        'Interactive study materials',
        'Progress tracking and analytics',
        'Offline functionality for accessibility',
      ],
      github: '#',
      demo: '#',
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-600/5 to-emerald-400/5 dark:from-emerald-600/3 dark:to-emerald-400/3">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-display font-bold mb-6"
          >
            My <span className="text-gradient">Projects</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            A showcase of my work in AI automation, mobile development, and innovative solutions
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-16"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-8 items-center`}
              >
                <div className="w-full lg:w-1/2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative rounded-2xl overflow-hidden shadow-2xl group"
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

                <div className="w-full lg:w-1/2 space-y-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 text-gray-900 dark:text-white">
                      {project.title}
                    </h2>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-4">
                      <FaCalendar />
                      <span>{project.date}</span>
                    </div>
                  </div>

                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {project.longDescription}
                  </p>

                  <div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
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
                        className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold hover:shadow-lg transition-all"
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
                      className="flex items-center space-x-2 px-6 py-3 border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400 rounded-lg font-semibold hover:bg-emerald-600 hover:text-white transition-all"
                    >
                      <FaExternalLinkAlt />
                      <span>Live Demo</span>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600/5 to-emerald-400/5 dark:from-emerald-600/3 dark:to-emerald-400/3">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Interested in <span className="text-gradient">Collaborating?</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
            <motion.button
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  const offset = 80;
                  const elementPosition = element.offsetTop - offset;
                  window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth',
                  });
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 bg-gradient-accent text-white rounded-lg font-semibold shadow-lg hover:shadow-2xl transition-all"
            >
              Get In Touch
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Projects;

