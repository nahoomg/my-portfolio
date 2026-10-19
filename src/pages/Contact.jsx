import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUpRight, FiCopy, FiLoader } from 'react-icons/fi';
import { getSocialLinks } from '../config/socialLinks';
import { supabase } from '../lib/supabase';
import { EASE_OUT, LocalTime, Magnetic, Reveal, Roll, SectionLabel } from '../components/fx';

const EMAIL = 'nahomgetachewmy@gmail.com';

const Field = ({ id, label, textarea, ...props }) => {
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <div className="group relative">
      <label htmlFor={id} className="eyebrow block transition-colors group-focus-within:text-ink">
        {label}
      </label>
      <Tag
        id={id}
        name={id}
        required
        {...props}
        className="peer mt-2 w-full resize-none border-0 border-b border-ink/20 bg-transparent px-0 pb-3 pt-1 text-lg placeholder:text-ink/25 focus:border-ink/20 focus:outline-none focus:ring-0 focus-visible:ring-0"
      />
      {/* Accent underline that draws in on focus. */}
      <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out-expo peer-focus:scale-x-100" />
    </div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormStatus('');

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
        throw new Error('Supabase is not configured. Add your credentials in .env');
      }

      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        throw error;
      }

      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => {
        setFormStatus('');
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
      setToast({
        show: true,
        message: error.message || 'Failed to send message. Please try again.',
      });
      setTimeout(() => {
        setToast({ show: false, message: '' });
      }, 4000);
    } finally {
      setIsLoading(false);
    }
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

  const socialLinks = getSocialLinks();

  return (
    <div className="px-4 py-24 sm:px-6 md:py-36 lg:px-10">
      <SectionLabel index="05">Contact</SectionLabel>

      <Reveal as="h2" className="mt-14 text-[13vw] font-bold leading-[0.9] tracking-[-0.06em] lg:text-[9.5rem]">
        Let&apos;s build
        <br />
        <span className="font-serif font-normal italic text-accent">something.</span>
      </Reveal>

      <div className="mt-16 grid gap-16 lg:grid-cols-12">
        <Reveal className="space-y-12 lg:col-span-5">
          <p className="max-w-md text-lg leading-relaxed text-muted">
            Let&apos;s build something innovative together. Reach out for collaborations, academic projects, or
            creative tech ideas.
          </p>

          <div>
            <p className="eyebrow">Email</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <a href={`mailto:${EMAIL}`} className="group text-xl font-semibold tracking-tight sm:text-2xl">
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:100%_1px]">
                  {EMAIL}
                </span>
              </a>
              <button
                type="button"
                onClick={() => copyToClipboard(EMAIL)}
                className="rounded-full border border-ink/15 p-2.5 text-muted transition-colors hover:border-ink hover:text-ink"
                aria-label="Copy email address"
              >
                <FiCopy className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="eyebrow">Location</p>
              <p className="mt-2">Addis Ababa, Ethiopia</p>
            </div>
            <div>
              <p className="eyebrow">Local time</p>
              <LocalTime className="mt-2 block font-mono" />
            </div>
          </div>

          <ul className="border-t border-ink/10">
            {socialLinks.map((social) => (
              <li key={social.name} className="border-b border-ink/10">
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-4 text-lg font-medium"
                >
                  <span className="transition-transform duration-500 ease-out-expo group-hover:translate-x-2">{social.name}</span>
                  <FiArrowUpRight className="h-5 w-5 text-muted transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:text-accent" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <form onSubmit={handleSubmit} className="space-y-10 rounded-2xl border border-ink/10 bg-surface p-6 sm:p-10">
            <p className="text-2xl font-semibold tracking-tight">Send a message</p>
            <div className="grid gap-10 sm:grid-cols-2">
              <Field id="name" label="Your name" type="text" value={formData.name} onChange={handleChange} placeholder="John Doe" autoComplete="name" />
              <Field id="email" label="Email address" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" autoComplete="email" />
            </div>
            <Field id="subject" label="Subject" type="text" value={formData.subject} onChange={handleChange} placeholder="Project collaboration" />
            <Field id="message" label="Message" textarea rows={4} value={formData.message} onChange={handleChange} placeholder="Tell me about your project..." />

            <div aria-live="polite">
              {formStatus === 'success' && (
                <p className="rounded-lg border border-ink/15 px-4 py-3 text-sm">
                  <span className="mr-2 text-accent" aria-hidden="true">✳</span>
                  Message sent successfully! I&apos;ll get back to you soon.
                </p>
              )}
              {formStatus === 'error' && (
                <p className="rounded-lg border border-accent/50 px-4 py-3 text-sm">
                  Failed to send message. Please try again or contact me directly.
                </p>
              )}
            </div>

            <Magnetic strength={0.15} className="w-full sm:w-auto">
              <button
                type="submit"
                disabled={isLoading}
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-ink px-8 py-4 text-sm font-semibold text-paper transition-colors duration-300 hover:bg-accent hover:text-black disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Roll>Send message</Roll>
                    <FiArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
                  </>
                )}
              </button>
            </Magnetic>
          </form>
        </Reveal>
      </div>

      <AnimatePresence>
        {toast.show && (
          <div key="toast-notification" role="status" className="fixed bottom-8 left-1/2 z-[80] -translate-x-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="flex min-w-[200px] items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper shadow-2xl"
            >
              <span className="text-accent" aria-hidden="true">✳</span>
              {toast.message}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contact;
