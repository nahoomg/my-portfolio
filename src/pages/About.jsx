import { motion } from 'framer-motion';
import { 
  FaPython, 
  FaReact, 
  FaGitAlt,
  FaDatabase,
  FaBrain,
  FaRobot,
  FaMobileAlt,
  FaPalette,
  FaNode,
} from 'react-icons/fa';
import { 
  SiDart, 
  SiFlutter, 
  SiJavascript, 
  SiTelegram,
  SiNextdotjs,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiTailwindcss,
} from 'react-icons/si';

const About = () => {
  const skills = {
    'Languages & Frameworks': [
      { name: 'Python', icon: <FaPython />, color: 'text-blue-500' },
      { name: 'JavaScript', icon: <SiJavascript />, color: 'text-yellow-500' },
      { name: 'React', icon: <FaReact />, color: 'text-cyan-500' },
      { name: 'Next.js', icon: <SiNextdotjs />, color: 'text-gray-800 dark:text-white' },
      { name: 'Node.js', icon: <FaNode />, color: 'text-green-600' },
      { name: 'Flutter', icon: <SiFlutter />, color: 'text-blue-400' },
      { name: 'Dart', icon: <SiDart />, color: 'text-blue-400' },
      { name: 'Tailwind CSS', icon: <SiTailwindcss />, color: 'text-cyan-400' },
    ],
    'Databases & Backend': [
      { name: 'MongoDB', icon: <SiMongodb />, color: 'text-green-500' },
      { name: 'MySQL', icon: <SiMysql />, color: 'text-blue-600' },
      { name: 'PostgreSQL', icon: <SiPostgresql />, color: 'text-blue-400' },
      { name: 'Telegram Bot API', icon: <SiTelegram />, color: 'text-blue-500' },
    ],
    'Tools & Concepts': [
      { name: 'Git', icon: <FaGitAlt />, color: 'text-orange-500' },
      { name: 'AI/ML Concepts', icon: <FaBrain />, color: 'text-purple-500' },
      { name: 'AI Automation', icon: <FaRobot />, color: 'text-emerald-600' },
      { name: 'Mobile Development', icon: <FaMobileAlt />, color: 'text-emerald-600' },
      { name: 'UI/UX Design', icon: <FaPalette />, color: 'text-emerald-600' },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
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
            About <span className="text-gradient">Me</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
          >
            Passionate about leveraging technology to create meaningful solutions
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
              My <span className="text-gradient">Journey</span>
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                My journey into Information Science began with a curiosity about how technology shapes 
                the way we access, process, and share information. As a third-year student, I've developed 
                a deep fascination with the intersection of artificial intelligence and practical software development.
              </p>
              <p>
                What started as an interest in understanding data and information systems has evolved into 
                a passion for building AI-driven automation tools. I believe that the most impactful technology 
                is the kind that solves real-world problems and makes complex tasks accessible to everyone.
              </p>
              <p>
                Through hands-on projects, hackathons, and continuous learning, I've grown from understanding 
                theoretical concepts to building functional applications that serve real users. Each project 
                teaches me something new about problem-solving, user experience, and the power of well-designed systems.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-card/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Technical <span className="text-gradient">Skills</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A diverse toolkit for building modern, AI-integrated applications
            </p>
          </motion.div>

          <div className="space-y-12">
            {Object.entries(skills).map(([category, items]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  {category}
                </h3>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
                >
                  {items.map((skill, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="flex flex-col items-center p-6 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:border-emerald-600 dark:hover:border-emerald-400 transition-all shadow-md hover:shadow-xl"
                    >
                      <div className={`text-5xl mb-3 ${skill.color}`}>
                        {skill.icon}
                      </div>
                      <span className="text-sm font-medium text-center text-gray-700 dark:text-gray-300">
                        {skill.name}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-8 md:p-12 rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-900/10 dark:via-cyan-900/10 dark:to-blue-900/10"></div>
            <div className="absolute inset-0 opacity-10 dark:opacity-5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Beyond the Code: <span className="text-gradient">Video Editing</span>
              </h2>
              <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  Beyond my technical work in software development, I'm also a passionate video editor. 
                  I believe that compelling visual storytelling is just as important as writing clean code, 
                  and I enjoy bringing creative visions to life through video editing.
                </p>
                <p>
                  From cutting and arranging footage to color grading and audio mixing, I love the entire 
                  post-production process. Video editing allows me to combine my technical skills with 
                  creative expression, whether it's crafting engaging content for social media, creating 
                  educational videos, or producing promotional materials.
                </p>
                <p>
                  This creative outlet complements my development work perfectly—both require attention to 
                  detail, patience, and a commitment to delivering quality results. Whether I'm debugging 
                  code or perfecting a transition, I approach each project with the same dedication and 
                  passion for excellence.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;

