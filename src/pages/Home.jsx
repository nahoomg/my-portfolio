import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const offset = 80;
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth',
    });
  }
};

const Home = () => {
  const featuredProjects = [
    {
      id: 1,
      title: 'AI YouTube Automation Platform',
      description: 'Full-stack web application automating YouTube video creation using AI - from topic research to final video assembly with Gemini AI and Stability AI.',
      image: '/images/ai-youtube-automation.png',
      tags: ['Next.js', 'AI', 'Gemini', 'Stability AI', 'Automation'],
      status: 'In Progress',
    },
    {
      id: 2,
      title: 'CineReview - Movie Review Platform',
      description: 'A full-stack movie review platform where users can discover movies, read reviews, and share their thoughts. Built with Django REST Framework and React.',
      image: '/images/movie-review.png',
      tags: ['Django', 'DRF', 'React', 'Vite', 'Tailwind CSS'],
      status: 'Completed',
    },
    {
      id: 3,
      title: 'E-Commerce Telegram Bot',
      description: 'Fully functional e-commerce bot built for Arifpay hackathon with product browsing and payment integration.',
      image: '/images/Suq-et-ecommerce.png',
      tags: ['Telegram Bot', 'API', 'E-Commerce', 'Hackathon'],
      status: 'Completed',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-emerald-400/5 dark:from-emerald-600/3 dark:to-emerald-400/3"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-5xl font-display font-bold mb-3"
            >
              <span className="text-gradient">Nahom Getachew</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-4 font-medium"
            >
              Information Science Student | AI Automation Enthusiast | Full-Stack Developer
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mb-6 leading-relaxed"
            >
              A third-year Information Science student passionate about building practical, AI-integrated solutions. 
              I focus on creating automated workflows and developing apps that solve real-world problems — from 
              e-commerce bots to educational AI tools for Ethiopian students.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                onClick={() => scrollToSection('projects')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                  className="group px-6 py-3 bg-gradient-accent text-white rounded-lg font-semibold shadow-lg hover:shadow-2xl transition-all flex items-center justify-center space-x-2 text-sm"
              >
                <span>View My Projects</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('contact')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-transparent border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400 rounded-lg font-semibold hover:bg-emerald-600 hover:text-white transition-all text-sm"
              >
                Contact Me
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Explore some of my recent work in AI automation, mobile development, and full-stack solutions.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {featuredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group bg-white dark:bg-dark-card rounded-xl overflow-hidden border border-gray-200 dark:border-dark-border hover:border-emerald-600 dark:hover:border-emerald-400 transition-all shadow-lg hover:shadow-2xl"
              >
                <div className="relative h-48 bg-gradient-to-br from-emerald-600/20 to-emerald-400/20 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === 'Completed'
                        ? 'bg-green-500 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <motion.button
                    onClick={() => scrollToSection('projects')}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-semibold"
                  >
                    <span>Learn More</span>
                    <FaArrowRight />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-6"
          >
            <motion.button
              onClick={() => scrollToSection('projects')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400 rounded-lg font-semibold hover:bg-emerald-600 hover:text-white transition-all"
            >
              View All Projects
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

