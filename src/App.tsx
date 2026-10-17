import { useState, useRef, type ReactNode } from 'react'
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BrainCircuit, Building2, Check, Code2,
  ExternalLink, Github, Layers3, Linkedin, Mail, MapPin, Menu, MessageSquareText,
  Radio, Sparkles, Trophy, Workflow, X,
} from 'lucide-react'
import HeroGyroscope from './components/hero/HeroGyroscope'
import LoadingIntro from './components/intro/LoadingIntro'
import CustomCursor from './components/cursor/CustomCursor'
import InteractiveProjectCard from './components/work/InteractiveProjectCard'
import CaseStudyDrawer from './components/work/CaseStudyDrawer'
import { CASE_STUDIES } from './data/caseStudies'

const projects = [
  {
    id: 'smart-issue-tracker',
    number: '01',
    category: 'AI · TRIAGE WORKFLOWS',
    title: 'Smart Issue Tracker',
    description: 'A support-ticket workflow with semantic duplicate-ticket detection and AI-assisted verification, preventing redundant triage.',
    stack: ['React', 'TypeScript', 'Django', 'PostgreSQL', 'FAISS'],
    href: 'https://github.com/VasiharanB/Smart-Issue-Tracker',
    icon: BrainCircuit,
    tone: 'violet',
    featured: 'SEMANTIC DUPLICATE DETECTION',
  },
  {
    id: 'cricket-conquest',
    number: '02',
    category: 'REAL-TIME SYSTEMS',
    title: 'Cricket Conquest',
    description: 'A real-time IPL auction platform with live bidding workflows, organizer management tools, and role-based access control.',
    stack: ['React', 'TypeScript', 'Node.js', 'WebSockets', 'MySQL'],
    href: 'https://github.com/VasiharanB/cricket-conquest-ipl-auction',
    icon: Trophy,
    tone: 'lime',
    featured: 'LIVE AUCTION WORKFLOWS',
  },
  {
    id: 'jgc-construction-erp',
    number: '03',
    category: 'BUSINESS SOFTWARE',
    title: 'JGC Construction ERP',
    description: 'A construction operations system coordinating project sites, client relationships (CRM), vendor workflows, and materials inventory in one platform.',
    stack: ['PHP', 'MySQL', 'JavaScript', 'SQL'],
    href: 'https://github.com/VasiharanB/jgc_constructions',
    icon: Building2,
    tone: 'orange',
    featured: 'OPERATIONS, CRM & INVENTORY',
  },
  {
    id: 'sms-spam-detection',
    number: '04',
    category: 'APPLIED ML & NLP',
    title: 'SMS Spam Detection',
    description: 'A Django-based machine learning application for spam/ham message classification with persistent prediction history and admin reporting tools.',
    stack: ['Python', 'Django', 'Scikit-learn', 'SQLite'],
    href: 'https://github.com/VasiharanB/sms_spam_detection',
    icon: MessageSquareText,
    tone: 'blue',
    featured: 'SPAM / HAM CLASSIFIER',
  },
  {
    id: 'fittrack-desktop',
    number: '05',
    category: 'DESKTOP ENGINEERING',
    title: 'FitTrack Desktop',
    description: 'A Python desktop application built with Tkinter, SQLite, and Matplotlib for biometric tracking, persistent health records, and analytical data visualisation.',
    stack: ['Python', 'Tkinter', 'SQLite', 'Matplotlib'],
    href: 'https://github.com/VasiharanB/FitTrack-Desktop',
    icon: Radio,
    tone: 'pink',
    featured: 'DATA VISUALISATION & STORAGE',
  },
  {
    id: 'aethon-ai',
    number: '06',
    category: 'COLLABORATIVE PLATFORMS',
    title: 'Aethon AI',
    description: 'A collaborative placement-preparation and assessment platform providing structured practice modules, admin evaluation, and AI-assisted learning.',
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'MySQL'],
    href: 'https://github.com/VasiharanB/aethon-ai',
    icon: Workflow,
    tone: 'mint',
    featured: 'ASSESSMENT & PREPARATION',
  },
]

const skillGroups = [
  {
    label: '01 / INTERFACES',
    title: 'Frontend engineering',
    icon: Code2,
    items: ['React', 'TypeScript', 'JavaScript', 'HTML & CSS', 'Vite', 'Tailwind CSS', 'Bootstrap'],
  },
  {
    label: '02 / APPLICATIONS',
    title: 'Backend & APIs',
    icon: Layers3,
    items: ['Node.js', 'Express', 'Django', 'Django REST Framework', 'PHP', 'REST APIs', 'WebSockets'],
  },
  {
    label: '03 / DATA & INTELLIGENCE',
    title: 'Data & applied AI',
    icon: BrainCircuit,
    items: ['MySQL', 'PostgreSQL', 'SQLite', 'FAISS', 'Embeddings', 'Machine Learning', 'Data Visualisation'],
  },
]

const principles = [
  {
    number: '01',
    title: 'Decompose the problem first',
    text: 'Analyze user workflows, data models, and edge constraints before writing code to build the right solution.',
  },
  {
    number: '02',
    title: 'Structure for long-term clarity',
    text: 'Keep state deterministic, interfaces decoupled, and code clean so systems remain dependable as requirements evolve.',
  },
  {
    number: '03',
    title: 'Focus on practical reliability',
    text: 'Software succeeds when it solves real operational friction. Clear interfaces and resilient workflows matter most.',
  },
]

function SectionHeading({ index, eyebrow, title, note }: { index: string; eyebrow: string; title: ReactNode; note?: string }) {
  return (
    <div className="section-heading">
      <div className="section-heading-main">
        <span className="section-index">{index}</span>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
      </div>
      {note ? <p className="section-note">{note}</p> : null}
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [activeCaseStudyId, setActiveCaseStudyId] = useState<string | null>(null)
  const lastActiveTriggerRef = useRef<HTMLElement | null>(null)

  const closeMenu = () => setMenuOpen(false)

  const handleOpenCaseStudy = (id: string) => {
    lastActiveTriggerRef.current = document.activeElement as HTMLElement
    setActiveCaseStudyId(id)
  }

  const handleCloseCaseStudy = () => {
    setActiveCaseStudyId(null)
    setTimeout(() => {
      lastActiveTriggerRef.current?.focus()
    }, 40)
  }

  return (
    <div className="site-shell">
      <CustomCursor />
      {showIntro && <LoadingIntro onComplete={() => setShowIntro(false)} />}
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="ambient ambient-a" aria-hidden="true" />
      <div className="ambient ambient-b" aria-hidden="true" />
      <div className="ambient ambient-gyro" aria-hidden="true" />

      <header className="site-header">
        <div className="nav-wrap">
          <a className="brand" href="#home" aria-label="VYRA home" onClick={closeMenu}>
            <span className="brand-mark"><span>V</span></span>
            <span className="brand-type">
              <strong>VYRA<span>.</span></strong>
              <small>BY VASIHARAN</small>
            </span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#work">Work <span>02</span></a>
            <a href="#about">About <span>03</span></a>
            <a href="#stack">Stack <span>04</span></a>
          </nav>
          <a className="nav-cta" href="#contact">
            Let’s talk <ArrowUpRight size={15} strokeWidth={1.8} />
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        {menuOpen ? (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <a href="#work" onClick={closeMenu}>Selected work <ArrowUpRight size={16} /></a>
            <a href="#about" onClick={closeMenu}>About me <ArrowUpRight size={16} /></a>
            <a href="#stack" onClick={closeMenu}>Tech stack <ArrowUpRight size={16} /></a>
            <a href="#contact" onClick={closeMenu}>Contact <ArrowUpRight size={16} /></a>
          </nav>
        ) : null}
      </header>

      <main id="main">
        {/* HERO SECTION */}
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="status-dot" />
              <span>FULL-STACK DEVELOPER</span>
              <span className="kicker-divider">/</span>
              <span className="kicker-muted">PRODUCT THINKER</span>
            </div>
            <h1>
              Practical<br />
              software<span className="headline-period">.</span><br />
              <span className="headline-outline">Thoughtful</span><br />
              systems<span className="headline-period">.</span>
            </h1>
            <p className="hero-description">
              I’m <strong>Vasiharan B</strong> — an ECE student and developer from Chennai. I build useful web applications, real-time systems, and applied AI tools where architectural clarity and execution matter.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">
                Explore selected work <ArrowDownRight size={17} />
              </a>
              <a className="button button-quiet" href="mailto:vasiharan030@gmail.com?subject=Let%27s%20connect">
                Get in touch <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="hero-meta">
              <span><MapPin size={14} /> Chennai, India</span>
              <span className="meta-separator" />
              <span>Curious by default. Systems-minded by design.</span>
            </div>
          </div>

          <div className="hero-art" aria-label="VYRA Strategic Systems — 3D Chess Experience">
            <div className="art-topline">
              <span>FIG. 01 — STRATEGIC SYSTEMS</span>
            </div>
            <HeroGyroscope />
            <div className="art-bottomline">
              <div>
                <span className="mini-label">ENGINEERING DOMAINS</span>
                <strong>Applied AI · Real-time systems · Business software</strong>
              </div>
            </div>
          </div>

          <div className="hero-bottom">
            <span className="scroll-cue"><span /> SCROLL TO EXPLORE</span>
            <span className="hero-bottom-note">A PORTFOLIO OF THINGS MADE TO BE USEFUL.</span>
            <a href="#work" aria-label="Scroll to selected work"><ArrowDownRight size={18} /></a>
          </div>
        </section>

        {/* TICKER */}
        <div className="ticker" aria-label="Areas of work">
          <div className="ticker-track">
            {['FULL-STACK DEVELOPMENT', 'REAL-TIME WORKFLOWS', 'AI-ASSISTED SYSTEMS', 'THOUGHTFUL INTERFACES', 'FULL-STACK DEVELOPMENT', 'REAL-TIME WORKFLOWS', 'AI-ASSISTED SYSTEMS', 'THOUGHTFUL INTERFACES'].map((item, index) => (
              <span className="ticker-item" key={item + index}>{item}<i>✳</i></span>
            ))}
          </div>
        </div>

        {/* SELECTED WORK */}
        <section className="work-section section-wrap section-pad" id="work">
          <SectionHeading
            index="02"
            eyebrow="A FEW THINGS I’VE BUILT"
            title={<>Selected work<span className="headline-period">.</span></>}
            note="Real problems, distinct stacks — one focus: making systems dependable, usable, and performant."
          />
          <div className="project-grid">
            {projects.map((project) => (
              <InteractiveProjectCard
                key={project.id}
                project={project}
                onInspect={handleOpenCaseStudy}
                isActive={activeCaseStudyId === project.id}
              />
            ))}
          </div>
          <div className="more-work">
            <div className="more-work-copy">
              <span className="eyebrow">ALWAYS MORE IN THE WORKSHOP</span>
              <p>Looking for more code, utilities, or experimental builds?</p>
            </div>
            <div className="more-work-links">
              <a href="https://github.com/VasiharanB/Big-Bull" target="_blank" rel="noreferrer">
                The Big Bull <ArrowUpRight size={14} />
              </a>
              <a href="https://github.com/VasiharanB" target="_blank" rel="noreferrer">
                All repositories on GitHub <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="about-section section-pad" id="about">
          <div className="section-wrap">
            <SectionHeading
              index="03"
              eyebrow="ENGINEERING BACKGROUND & PERSPECTIVE"
              title={<>The why behind<br />the work<span className="headline-period">.</span></>}
              note="Bridging foundational hardware principles with robust, practical software engineering."
            />
            <div className="about-layout">
              <div className="about-intro">
                <div className="about-monogram" aria-hidden="true">
                  <span>V</span>
                  <i>✳</i>
                </div>
                <p className="about-lead">
                  I enjoy solving real operational challenges with software that is structured, reliable, and straightforward to use.
                </p>
                <p className="about-copy">
                  My academic foundation in Electronics and Communication Engineering (ECE) shapes how I approach software systems. Working with signals, digital logic, and embedded constraints taught me to respect deterministic state, efficient data paths, and failure modes from the ground up.
                </p>
                <p className="about-copy" style={{ marginTop: '14px' }}>
                  When architecting web applications, ERPs, or machine learning pipelines, I carry that hardware-grounded perspective into modular API design, resilient database modeling, and performant user interfaces. Outside of code, I’m an avid chess enthusiast — a game that constantly sharpens my appreciation for foresight, spatial tactics, and strategic execution.
                </p>
                <a className="text-link about-github" href="https://github.com/VasiharanB" target="_blank" rel="noreferrer">
                  Explore my repositories on GitHub <ArrowUpRight size={15} />
                </a>
              </div>
              <div className="principles">
                {principles.map((principle) => (
                  <article className="principle-row" key={principle.number}>
                    <span className="principle-number">{principle.number}</span>
                    <div>
                      <h3>{principle.title}</h3>
                      <p>{principle.text}</p>
                    </div>
                    <ArrowUpRight className="principle-arrow" size={18} />
                  </article>
                ))}
                <div className="principle-foot">
                  <Check size={15} /> PRACTICAL ENGINEERING. CONTINUOUS DISCIPLINE.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STACK SECTION */}
        <section className="stack-section section-wrap section-pad" id="stack">
          <SectionHeading
            index="04"
            eyebrow="TOOLS I REACH FOR"
            title={<>My working stack<span className="headline-period">.</span></>}
            note="A practical toolkit developed across web applications, real-time services, and applied AI projects."
          />
          <div className="skill-grid">
            {skillGroups.map((group) => {
              const GroupIcon = group.icon
              return (
                <article className="skill-card" key={group.label}>
                  <div className="skill-card-top">
                    <span className="skill-icon"><GroupIcon size={20} strokeWidth={1.6} /></span>
                    <span className="skill-label">{group.label}</span>
                  </div>
                  <h3>{group.title}</h3>
                  <div className="skill-chips">
                    {group.items.map((item) => <span key={item}>{item}</span>)}
                  </div>
                </article>
              )
            })}
          </div>
          <div className="toolbelt">
            <span className="toolbelt-label">ADDITIONAL TECHNOLOGIES</span>
            <div className="toolbelt-list">
              <span>Python</span>
              <span>Java</span>
              <span>C / C++</span>
              <span>Git & GitHub</span>
              <span>Postman</span>
              <span>Figma</span>
              <span>Linux</span>
              <span>SQLite</span>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="contact-section section-pad" id="contact">
          <div className="contact-wrap section-wrap">
            <div className="contact-stamp">
              <Sparkles size={16} /> OPEN TO CHALLENGING ENGINEERING OPPORTUNITIES
            </div>
            <div className="contact-content">
              <div>
                <p className="eyebrow">05 / GET IN TOUCH</p>
                <h2>
                  Have a problem<br />
                  worth solving<span className="headline-period">?</span>
                </h2>
                <p className="contact-description">
                  Whether you have an interesting product idea, an engineering challenge, or an opportunity where thoughtful full-stack development could help, I’d be glad to connect.
                </p>
              </div>
              <div className="contact-actions">
                <a className="button button-primary contact-email" href="mailto:vasiharan030@gmail.com?subject=Let%27s%20build%20something">
                  <Mail size={17} /> Say hello <ArrowUpRight size={17} />
                </a>
                <a className="social-link" href="https://www.linkedin.com/in/vasiharan-b-ba0772322/" target="_blank" rel="noreferrer">
                  <Linkedin size={17} /> Connect on LinkedIn <ArrowUpRight size={15} />
                </a>
                <a className="social-link" href="https://github.com/VasiharanB" target="_blank" rel="noreferrer">
                  <Github size={17} /> Follow my builds <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
            <div className="contact-bottom">
              <span><span className="status-dot" /> AVAILABLE FOR FULL-STACK & PRODUCT ENGINEERING</span>
              <span>CHENNAI, INDIA · IST (UTC+5:30)</span>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer section-wrap">
        <a className="brand footer-brand" href="#home" aria-label="Back to top">
          <span className="brand-mark"><span>V</span></span>
          <span className="brand-type">
            <strong>VYRA<span>.</span></strong>
            <small>BY VASIHARAN</small>
          </span>
        </a>
        <p>Built with intent, practical engineering, and a focus on details.</p>
        <div className="footer-right">
          <span>© {new Date().getFullYear()} VASIHARAN B</span>
          <button
            type="button"
            className="replay-intro-btn"
            onClick={() => {
              try { sessionStorage.removeItem('vyra_intro_seen') } catch {}
              setShowIntro(true)
            }}
            title="Replay initialization intro"
          >
            [REPLAY INTRO]
          </button>
          <a href="#home" aria-label="Back to top"><ArrowRight size={17} /></a>
        </div>
      </footer>

      {/* INTERACTIVE CASE STUDY SLIDE-OVER DRAWER */}
      <CaseStudyDrawer
        isOpen={Boolean(activeCaseStudyId)}
        study={activeCaseStudyId ? CASE_STUDIES[activeCaseStudyId] || null : null}
        onClose={handleCloseCaseStudy}
      />
    </div>
  )
}

export default App