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
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/nahom-getachew-07613030a',
  },
  {
    name: 'Twitter',
    url: 'https://x.com/nahum_habesh',
  },
  {
    name: 'Email',
    url: 'mailto:nahomgetachewmy@gmail.com',
  },
];

export const getSocialLinks = () => {
  return socialLinksData.map(link => ({
    ...link,
    icon: iconMap[link.name],
  }));
};

