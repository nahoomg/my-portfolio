import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaPaperPlane,
  FaCopy,
} from 'react-icons/fa';
import { getSocialLinks } from '../config/socialLinks';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('success');
    setTimeout(() => {
      setFormStatus('');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ show: true, message: 'Copied to clipboard!' });
      setTimeout(() => {
        setToast({ show: false, message: '' });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setToast({ show: true, message: 'Failed to copy' });
      setTimeout(() => {
        setToast({ show: false, message: '' });
      }, 2000);
    }
  };

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: 'Email',
      value: 'nahomgetachewmy@gmail.com',
      link: 'mailto:nahomgetachewmy@gmail.com',
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Location',
      value: 'Addis Ababa, Ethiopia',
      link: '#',
      color: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  const socialLinks = getSocialLinks();

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
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-600/5 to-emerald-400/5 dark:from-emerald-600/3 dark:to-emerald-400/3">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-display font-bold mb-3"
          >
            Get In <span className="text-gradient">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-gray-600 dark:text-gray-400 max-w-xl mx-auto"
          >
            Let's build something innovative together. Reach out for collaborations, academic projects, or creative tech ideas.
          </motion.p>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gray-900 dark:bg-dark-card rounded-2xl p-6 shadow-xl border border-gray-700 dark:border-dark-border">
                <h2 className="text-xl font-display font-bold mb-3 text-white">
                  Send a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-600 dark:border-dark-border bg-gray-800 dark:bg-dark-bg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all text-sm"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-600 dark:border-dark-border bg-gray-800 dark:bg-dark-bg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all text-sm"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-600 dark:border-dark-border bg-gray-800 dark:bg-dark-bg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all text-sm"
                      placeholder="Project Collaboration"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                          rows="5"
                          className="w-full px-3 py-2 rounded-lg border border-gray-600 dark:border-dark-border bg-gray-800 dark:bg-dark-bg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all resize-none text-sm"
                      placeholder="Tell me about your project or idea..."
                    ></textarea>
                  </div>

                  {formStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-center"
                    >
                      Message sent successfully! I'll get back to you soon.
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                        className="w-full px-6 py-3 bg-gradient-accent text-white rounded-lg font-semibold shadow-lg hover:shadow-2xl transition-all flex items-center justify-center space-x-2 text-sm"
                  >
                    <span>Send Message</span>
                    <FaPaperPlane />
                  </motion.button>
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-5"
            >
              <div>
                <h2 className="text-xl font-display font-bold mb-3 text-gray-900 dark:text-white">
                  Contact Information
                </h2>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:border-emerald-600 dark:hover:border-emerald-400 transition-all group"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`text-3xl ${info.color}`}>
                          {info.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {info.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {info.value}
                          </p>
                        </div>
                      </div>
                      {info.link.startsWith('mailto:') && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            copyToClipboard(info.value);
                          }}
                          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all opacity-0 group-hover:opacity-100 border border-gray-200 dark:border-gray-600"
                          title="Copy to clipboard"
                        >
                          <FaCopy />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div>
                <h2 className="text-xl font-display font-bold mb-3 text-gray-900 dark:text-white">
                  Connect on Social Media
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex flex-col items-center justify-center p-6 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border ${social.color} hover:text-white transition-all group`}
                    >
                      <div className={`text-4xl mb-2 ${social.color} group-hover:text-white transition-colors`}>
                        {social.icon && (() => {
                          const IconComponent = social.icon;
                          return <IconComponent />;
                        })()}
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white group-hover:text-white">
                        {social.name}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-600/20"
              >
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  Let's Create Something Amazing!
                </h3>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  Whether you have a project in mind, need collaboration on an academic endeavor, 
                  or just want to discuss innovative ideas in AI and software development, I'd love to hear from you. 
                  Let's connect and explore how we can work together to build meaningful solutions.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            key="toast-notification"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ transform: 'translateX(-50%)' }}
            className="fixed bottom-8 left-1/2 z-[9999] px-6 py-3 bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-2xl border border-gray-700 dark:border-gray-600 flex items-center space-x-2 min-w-[200px]"
          >
            <FaCopy className="text-emerald-400 flex-shrink-0" />
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contact;

