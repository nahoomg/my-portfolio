import { FiArrowUp, FiArrowUpRight } from 'react-icons/fi';
import { getSocialLinks } from '../config/socialLinks';
import { LocalTime, Roll } from './fx';
import { scrollToId } from '../lib/scroll';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socialLinks = getSocialLinks();

  return (
    <footer className="overflow-hidden border-t border-ink/10 px-4 pt-14 sm:px-6 lg:px-10">
      <div className="grid gap-10 text-sm md:grid-cols-12">
        <p className="max-w-xs text-muted md:col-span-4">
          Information Science Student passionate about AI-driven automation and practical software development.
        </p>
        <div className="md:col-span-3">
          <p className="eyebrow">Local time</p>
          <p className="mt-2">
            Addis Ababa — <LocalTime className="font-mono" />
          </p>
        </div>
        <ul className="space-y-2 md:col-span-3">
          {socialLinks.map((social) => (
            <li key={social.name}>
              <a href={social.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5">
                <Roll>{social.name}</Roll>
                <FiArrowUpRight className="h-3.5 w-3.5 text-muted" />
              </a>
            </li>
          ))}
        </ul>
        <div className="md:col-span-2 md:text-right">
          <button
            type="button"
            onClick={() => scrollToId('home')}
            className="group inline-flex items-center gap-2 font-medium"
          >
            <Roll>Back to top</Roll>
            <FiArrowUp className="h-4 w-4 text-accent transition-transform duration-500 ease-out-expo group-hover:-translate-y-1" />
          </button>
        </div>
      </div>

      <div className="eyebrow mt-14 flex justify-between border-t border-ink/10 py-5">
        <span>© {currentYear} All rights reserved.</span>
        <span>Addis Ababa, Ethiopia</span>
      </div>

      {/* Oversized wordmark, cropped by the page edge. */}
      <p
        aria-hidden="true"
        className="-mb-[0.18em] select-none whitespace-nowrap text-center text-[10vw] font-bold uppercase leading-none tracking-[-0.045em] text-ink/[0.07]"
      >
        Nahom Getachew
      </p>
    </footer>
  );
};

export default Footer;
