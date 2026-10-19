import {
  FaPython,
  FaReact,
  FaGitAlt,
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
  SiTypescript,
} from 'react-icons/si';
import { Reveal, ScrollRevealText, SectionLabel } from '../components/fx';

const SKILLS = {
  'Languages & Frameworks': [
    ['Python', FaPython],
    ['JavaScript', SiJavascript],
    ['TypeScript', SiTypescript],
    ['React', FaReact],
    ['Next.js', SiNextdotjs],
    ['Node.js', FaNode],
    ['Flutter', SiFlutter],
    ['Dart', SiDart],
    ['Tailwind CSS', SiTailwindcss],
  ],
  'Databases & Backend': [
    ['MongoDB', SiMongodb],
    ['MySQL', SiMysql],
    ['PostgreSQL', SiPostgresql],
    ['Telegram Bot API', SiTelegram],
  ],
  'Tools & Concepts': [
    ['Git', FaGitAlt],
    ['AI/ML Concepts', FaBrain],
    ['AI Automation', FaRobot],
    ['Mobile Development', FaMobileAlt],
    ['UI/UX Design', FaPalette],
  ],
};

const STATEMENT =
  "I'm a third-year Information Science student fascinated by the intersection of *artificial* *intelligence* and practical software. I build automation tools that make complex tasks *accessible* to everyone.";

const About = () => (
  <div className="px-4 py-24 sm:px-6 md:py-36 lg:px-10">
    <SectionLabel index="03">About</SectionLabel>

    <h2 className="sr-only">About me</h2>
    <ScrollRevealText
      text={STATEMENT}
      className="mt-14 max-w-6xl text-[2rem] font-medium leading-[1.12] tracking-[-0.03em] sm:text-5xl lg:text-[4.25rem]"
    />

    <div className="mt-24 grid gap-14 lg:grid-cols-12">
      <Reveal className="lg:col-span-4">
        <h3 className="eyebrow">My journey</h3>
      </Reveal>
      <Reveal delay={0.1} className="space-y-5 text-lg leading-relaxed text-muted lg:col-span-8 lg:columns-2 lg:gap-12 lg:space-y-0 [&>p]:break-inside-avoid lg:[&>p]:mb-5">
        <p>
          My journey into Information Science began with a curiosity about how technology shapes the way we
          access, process, and share information. As a third-year student, I&apos;ve developed a deep fascination
          with the intersection of artificial intelligence and practical software development.
        </p>
        <p>
          What started as an interest in understanding data and information systems has evolved into a passion
          for building AI-driven automation tools. I believe that the most impactful technology is the kind that
          solves real-world problems and makes complex tasks accessible to everyone.
        </p>
        <p>
          Through hands-on projects, hackathons, and continuous learning, I&apos;ve grown from understanding
          theoretical concepts to building functional applications that serve real users. Each project teaches
          me something new about problem-solving, user experience, and the power of well-designed systems.
        </p>
      </Reveal>
    </div>

    <div className="mt-28 grid gap-14 lg:grid-cols-12">
      <Reveal className="lg:col-span-4">
        <h3 className="eyebrow">Technical skills</h3>
        <p className="mt-4 max-w-xs text-sm text-muted">A diverse toolkit for building modern, AI-integrated applications.</p>
      </Reveal>
      <div className="grid gap-12 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
        {Object.entries(SKILLS).map(([category, items], c) => (
          <Reveal key={category} delay={c * 0.08}>
            <h4 className="border-b border-ink/10 pb-3 text-sm font-semibold">{category}</h4>
            <ul>
              {items.map(([name, Icon]) => (
                <li
                  key={name}
                  className="group flex items-center justify-between border-b border-ink/10 py-3 text-sm transition-colors duration-300 hover:text-accent"
                >
                  <span className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">{name}</span>
                  <Icon className="h-4 w-4 text-muted transition-colors duration-300 group-hover:text-accent" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </div>

    <Reveal className="mt-28 grid gap-10 rounded-2xl bg-ink p-8 text-paper md:p-14 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="eyebrow !text-paper/60">Beyond the code</p>
        <h3 className="mt-4 text-4xl font-bold tracking-[-0.04em] md:text-6xl">
          Video <span className="font-serif font-normal italic text-accent">editing</span>
        </h3>
      </div>
      <div className="space-y-4 leading-relaxed text-paper/70 lg:col-span-7">
        <p>
          Beyond my technical work in software development, I&apos;m also a passionate video editor. I believe that
          compelling visual storytelling is just as important as writing clean code, and I enjoy bringing creative
          visions to life through video editing.
        </p>
        <p>
          From cutting and arranging footage to color grading and audio mixing, I love the entire post-production
          process. Video editing allows me to combine my technical skills with creative expression, whether
          it&apos;s crafting engaging content for social media, creating educational videos, or producing
          promotional materials.
        </p>
        <p>
          This creative outlet complements my development work perfectly—both require attention to detail,
          patience, and a commitment to delivering quality results. Whether I&apos;m debugging code or perfecting a
          transition, I approach each project with the same dedication and passion for excellence.
        </p>
      </div>
    </Reveal>
  </div>
);

export default About;
