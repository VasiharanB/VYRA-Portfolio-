import { useState, type ReactNode } from 'react'
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BrainCircuit, Building2, Check, Code2,
  ExternalLink, Github, Layers3, Linkedin, Mail, MapPin, Menu, MessageSquareText,
  Radio, Sparkles, Trophy, Workflow, X,
} from 'lucide-react'
import HeroGyroscope from './components/hero/HeroGyroscope'

const projects = [
  { number: '01', category: 'AI · SUPPORT ENGINEERING', title: 'Smart Issue Tracker', description: 'A support-ticket workflow that finds likely duplicates with semantic embeddings, then uses AI verification for uncertain matches.', stack: ['React', 'TypeScript', 'Django', 'PostgreSQL', 'FAISS'], href: 'https://github.com/VasiharanB/Smart-Issue-Tracker', icon: BrainCircuit, tone: 'violet', featured: 'HYBRID AI PIPELINE' },
  { number: '02', category: 'REAL-TIME SYSTEMS', title: 'Cricket Conquest', description: 'An IPL auction platform with live bidding updates, organizer tools, participant flows, and role-based access control.', stack: ['React', 'TypeScript', 'Node.js', 'WebSockets', 'MySQL'], href: 'https://github.com/VasiharanB/cricket-conquest-ipl-auction', icon: Trophy, tone: 'lime', featured: 'LIVE AUCTION WORKFLOW' },
  { number: '03', category: 'BUSINESS SOFTWARE', title: 'JGC Construction ERP', description: 'A construction operations system bringing project sites, leads, materials, vendors, and inventory workflows into one place.', stack: ['PHP', 'MySQL', 'JavaScript', 'SQL'], href: 'https://github.com/VasiharanB/jgc_constructions', icon: Building2, tone: 'orange', featured: 'OPERATIONS & CRM' },
  { number: '04', category: 'MACHINE LEARNING', title: 'SMS Spam Detection', description: 'A Django app that classifies messages as spam or ham and keeps prediction history with reporting and admin tools.', stack: ['Python', 'Django', 'ML / NLP', 'SQLite'], href: 'https://github.com/VasiharanB/sms_spam_detection', icon: MessageSquareText, tone: 'blue', featured: 'CLASSIFICATION APP' },
  { number: '05', category: 'DESKTOP ENGINEERING', title: 'FitTrack Desktop', description: 'A Python desktop application focused on biometric-style tracking, persistent records, and analytical visualisation.', stack: ['Python', 'Tkinter', 'SQLite', 'Matplotlib'], href: 'https://github.com/VasiharanB/FitTrack-Desktop', icon: Radio, tone: 'pink', featured: 'DATA & VISUALISATION' },
  { number: '06', category: 'COLLABORATIVE BUILD', title: 'Aethon AI', description: 'A placement-preparation and assessment platform with student and admin workflows, practice tools, and AI-assisted learning.', stack: ['React', 'TypeScript', 'Node.js', 'Express', 'MySQL'], href: 'https://github.com/VasiharanB/aethon-ai', icon: Workflow, tone: 'mint', featured: 'PLACEMENT PLATFORM' },
]
const skillGroups = [
  { label: '01 / INTERFACES', title: 'Frontend engineering', icon: Code2, items: ['React', 'TypeScript', 'JavaScript', 'HTML & CSS', 'Vite', 'Tailwind CSS', 'Bootstrap'] },
  { label: '02 / APPLICATIONS', title: 'Backend & APIs', icon: Layers3, items: ['Node.js', 'Express', 'Django', 'Django REST Framework', 'PHP', 'REST APIs'] },
  { label: '03 / DATA & INTELLIGENCE', title: 'Data and applied AI', icon: BrainCircuit, items: ['MySQL', 'PostgreSQL', 'SQLite', 'FAISS', 'Embeddings', 'Machine Learning'] },
]
const principles = [
  { number: '01', title: 'Understand the why', text: 'Start with the real problem, the people using the system, and the outcome that matters.' },
  { number: '02', title: 'Build with structure', text: 'Keep the interface clear, the data model intentional, and the code easier to change.' },
  { number: '03', title: 'Make it usable', text: 'A feature is not finished until the important paths make sense on the screen and on mobile.' },
]
function SectionHeading({ index, eyebrow, title, note }: { index: string; eyebrow: string; title: ReactNode; note?: string }) {
  return <div className="section-heading"><div className="section-heading-main"><span className="section-index">{index}</span><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div></div>{note ? <p className="section-note">{note}</p> : null}</div>
}
function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a><div className="ambient ambient-a" aria-hidden="true" /><div className="ambient ambient-b" aria-hidden="true" />
      <header className="site-header"><div className="nav-wrap">
        <a className="brand" href="#home" aria-label="VYRA home" onClick={closeMenu}><span className="brand-mark"><span>V</span></span><span className="brand-type"><strong>VYRA<span>.</span></strong><small>BY VASIHARAN</small></span></a>
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#work">Work <span>02</span></a><a href="#about">About <span>03</span></a><a href="#stack">Stack <span>04</span></a></nav>
        <a className="nav-cta" href="#contact">Let’s talk <ArrowUpRight size={15} strokeWidth={1.8} /></a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
      {menuOpen ? <nav className="mobile-nav" aria-label="Mobile navigation"><a href="#work" onClick={closeMenu}>Selected work <ArrowUpRight size={16} /></a><a href="#about" onClick={closeMenu}>About me <ArrowUpRight size={16} /></a><a href="#stack" onClick={closeMenu}>Tech stack <ArrowUpRight size={16} /></a><a href="#contact" onClick={closeMenu}>Contact <ArrowUpRight size={16} /></a></nav> : null}
      </header>
      <main id="main">
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="hero-kicker"><span className="status-dot" /><span>FULL-STACK DEVELOPER</span><span className="kicker-divider">/</span><span className="kicker-muted">PRODUCT THINKER</span></div>
            <h1>Practical<br />software<span className="headline-period">.</span><br /><span className="headline-outline">Thoughtful</span><br />systems<span className="headline-period">.</span></h1>
            <p className="hero-description">I’m <strong>Vasiharan B</strong> — an ECE student and developer from Chennai. I build useful web applications, AI-assisted products, and digital experiences where the details matter.</p>
            <div className="hero-actions"><a className="button button-primary" href="#work">Explore selected work <ArrowDownRight size={17} /></a><a className="button button-quiet" href="mailto:vasiharan030@gmail.com?subject=Let%27s%20connect">Get in touch <ArrowUpRight size={16} /></a></div>
            <div className="hero-meta"><span><MapPin size={14} /> Chennai, India</span><span className="meta-separator" /><span>Curious by default. Systems-minded by design.</span></div>
          </div>
          <div className="hero-art" aria-label="Abstract VYRA orbital visual">
            <div className="art-topline"><span>FIG. 01 — BUILDING IN MOTION</span><span className="art-live"><i /> VYRA / 001</span></div>
            <HeroGyroscope />
            <div className="art-bottomline"><div><span className="mini-label">CURRENT MODE</span><strong>Learn / Build / Iterate</strong></div><div className="art-index">13° 00' N<br />80° 14' E</div></div>
            <div className="float-chip chip-code"><Code2 size={14} /> Clean code, clear intent</div><div className="float-chip chip-ai"><Sparkles size={14} /> Applied AI</div>
          </div>
          <div className="hero-bottom"><span className="scroll-cue"><span /> SCROLL TO EXPLORE</span><span className="hero-bottom-note">A PORTFOLIO OF THINGS MADE TO BE USEFUL.</span><a href="#work" aria-label="Scroll to selected work"><ArrowDownRight size={18} /></a></div>
        </section>
        <div className="ticker" aria-label="Areas of work"><div className="ticker-track">{['FULL-STACK DEVELOPMENT', 'AI-ASSISTED SYSTEMS', 'THOUGHTFUL INTERFACES', 'BACKEND WORKFLOWS', 'FULL-STACK DEVELOPMENT', 'AI-ASSISTED SYSTEMS', 'THOUGHTFUL INTERFACES', 'BACKEND WORKFLOWS'].map((item, index) => <span className="ticker-item" key={item + index}>{item}<i>✳</i></span>)}</div></div>
        <section className="work-section section-wrap section-pad" id="work">
          <SectionHeading index="02" eyebrow="A FEW THINGS I’VE BUILT" title={<>Selected work<span className="headline-period">.</span></>} note="Different problems, different stacks — one goal: make the system do something useful." />
          <div className="project-grid">{projects.map((project) => { const ProjectIcon = project.icon; return <article className={'project-card tone-' + project.tone} key={project.number}>
            <div className="project-card-top"><span className="project-number">/{project.number}</span><a className="project-open" href={project.href} target="_blank" rel="noreferrer" aria-label={'Open ' + project.title + ' repository on GitHub'}><ArrowUpRight size={18} /></a></div>
            <div className="project-visual"><div className="visual-grid" /><div className="visual-orbit visual-orbit-a" /><div className="visual-orbit visual-orbit-b" /><div className="visual-icon"><ProjectIcon size={29} strokeWidth={1.5} /></div><span className="visual-code">{project.featured}</span><span className="visual-index">{project.number} / 06</span></div>
            <div className="project-body"><p className="project-category">{project.category}</p><h3>{project.title}</h3><p className="project-description">{project.description}</p><div className="project-tags">{project.stack.map((technology) => <span key={technology}>{technology}</span>)}</div><a className="text-link" href={project.href} target="_blank" rel="noreferrer">View repository <ExternalLink size={14} /></a></div>
          </article> })}</div>
          <div className="more-work"><div className="more-work-copy"><span className="eyebrow">ALWAYS MORE IN THE WORKSHOP</span><p>Want to see more experiments and builds?</p></div><div className="more-work-links"><a href="https://github.com/VasiharanB/Big-Bull" target="_blank" rel="noreferrer">The Big Bull <ArrowUpRight size={14} /></a><a href="https://github.com/VasiharanB" target="_blank" rel="noreferrer">All repositories <ArrowUpRight size={14} /></a></div></div>
        </section>
        <section className="about-section section-pad" id="about"><div className="section-wrap">
          <SectionHeading index="03" eyebrow="A LITTLE ABOUT MY APPROACH" title={<>The why behind<br />the work<span className="headline-period">.</span></>} note="I enjoy the space where engineering, design, and real-world problems meet." />
          <div className="about-layout"><div className="about-intro"><div className="about-monogram" aria-hidden="true"><span>V</span><i>✳</i></div><p className="about-lead">I like turning messy requirements into software that feels clear, useful, and considered.</p><p className="about-copy">My background in Electronics and Communication Engineering keeps me curious about how systems work. Building across web apps, business tools, and AI-assisted workflows has taught me to think beyond the screen — about data, reliability, and the people who depend on a product.</p><a className="text-link about-github" href="https://github.com/VasiharanB" target="_blank" rel="noreferrer">A little more on GitHub <ArrowUpRight size={15} /></a></div>
          <div className="principles">{principles.map((principle) => <article className="principle-row" key={principle.number}><span className="principle-number">{principle.number}</span><div><h3>{principle.title}</h3><p>{principle.text}</p></div><ArrowUpRight className="principle-arrow" size={18} /></article>)}<div className="principle-foot"><Check size={15} /> PRACTICAL OVER FLASHY. ALWAYS LEARNING.</div></div></div>
        </div></section>
        <section className="stack-section section-wrap section-pad" id="stack">
          <SectionHeading index="04" eyebrow="TOOLS I REACH FOR" title={<>My working stack<span className="headline-period">.</span></>} note="A practical toolkit that keeps growing with each project and problem." />
          <div className="skill-grid">{skillGroups.map((group) => { const GroupIcon = group.icon; return <article className="skill-card" key={group.label}><div className="skill-card-top"><span className="skill-icon"><GroupIcon size={20} strokeWidth={1.6} /></span><span className="skill-label">{group.label}</span></div><h3>{group.title}</h3><div className="skill-chips">{group.items.map((item) => <span key={item}>{item}</span>)}</div></article> })}</div>
          <div className="toolbelt"><span className="toolbelt-label">ALSO IN MY TOOLBELT</span><div className="toolbelt-list"><span>Python</span><span>Java</span><span>C / C++</span><span>Git & GitHub</span><span>Postman</span><span>Figma</span><span>Linux</span></div></div>
        </section>
        <section className="contact-section section-pad" id="contact"><div className="contact-wrap section-wrap">
          <div className="contact-stamp"><Sparkles size={16} /> THE NEXT GOOD THING STARTS WITH A CONVERSATION</div>
          <div className="contact-content"><div><p className="eyebrow">05 / YOUR TURN</p><h2>Have a problem<br />worth solving<span className="headline-period">?</span></h2><p className="contact-description">Have an idea, an interesting challenge, or a project where thoughtful engineering could help? I’d be glad to hear about it.</p></div><div className="contact-actions"><a className="button button-primary contact-email" href="mailto:vasiharan030@gmail.com?subject=Let%27s%20build%20something"><Mail size={17} /> Say hello <ArrowUpRight size={17} /></a><a className="social-link" href="https://www.linkedin.com/in/vasiharan-b-ba0772322/" target="_blank" rel="noreferrer"><Linkedin size={17} /> Connect on LinkedIn <ArrowUpRight size={15} /></a><a className="social-link" href="https://github.com/VasiharanB" target="_blank" rel="noreferrer"><Github size={17} /> Follow my builds <ArrowUpRight size={15} /></a></div></div>
          <div className="contact-bottom"><span><span className="status-dot" /> OPEN TO INTERESTING CONVERSATIONS</span><span>CHENNAI, INDIA · IST (UTC+5:30)</span></div>
        </div></section>
      </main>
      <footer className="site-footer section-wrap"><a className="brand footer-brand" href="#home" aria-label="Back to top"><span className="brand-mark"><span>V</span></span><span className="brand-type"><strong>VYRA<span>.</span></strong><small>BY VASIHARAN</small></span></a><p>Made with intent, curiosity, and a little too much coffee.</p><div className="footer-right"><span>© {new Date().getFullYear()} VASIHARAN B</span><a href="#home" aria-label="Back to top"><ArrowRight size={17} /></a></div></footer>
    </div>
  )
}
export default App