import { FaGithub, FaLinkedin, FaEnvelope, FaTwitter } from 'react-icons/fa';

const iconMap = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedin,
  Email: FaEnvelope,
  Twitter: FaTwitter,
};

export const socialLinksData = [
  {
    name: 'GitHub',
    url: 'https://github.com/nahoomg',
    color: 'hover:text-gray-900 dark:hover:text-white',
    bgColor: 'hover:bg-gray-900 dark:hover:bg-white',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/nahom-getachew-07613030a',
    color: 'hover:text-blue-600',
    bgColor: 'hover:bg-blue-600',
  },
  {
    name: 'Twitter',
    url: 'https://x.com/nahum_habesh',
    color: 'hover:text-blue-400',
    bgColor: 'hover:bg-blue-400',
  },
  {
    name: 'Email',
    url: 'mailto:nahomgetachewmy@gmail.com',
    color: 'hover:text-emerald-600',
    bgColor: 'hover:bg-emerald-600',
  },
];

export const getSocialLinks = () => {
  return socialLinksData.map(link => ({
    ...link,
    icon: iconMap[link.name],
  }));
};

