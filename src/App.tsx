import { useState, useEffect, useRef, lazy, Suspense, startTransition, type ReactNode } from 'react'
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BrainCircuit, Building2, Check, Code2,
  ExternalLink, Github, Layers3, Linkedin, Mail, MapPin, Menu, MessageSquareText,
  Radio, Search, Sparkles, Trophy, Workflow, X,
} from 'lucide-react'
import HeroGyroscope from './components/hero/HeroGyroscope'
import LoadingIntro from './components/intro/LoadingIntro'
import CustomCursor from './components/cursor/CustomCursor'
import InteractiveProjectCard from './components/work/InteractiveProjectCard'
import InteractivePrinciples from './components/about/InteractivePrinciples'
import InteractiveTechToolbelt from './components/stack/InteractiveTechToolbelt'
import FreelanceServices from './components/services/FreelanceServices'
import InteractiveChessQualities from './components/chess/InteractiveChessQualities'
import ProjectInquiryForm from './components/contact/ProjectInquiryForm'
import PaletteShiftToggle from './components/theme/PaletteShiftToggle'
import { TECH_TO_PROJECTS } from './data/skillsData'
import { PROJECTS } from './data/projectsData'

// Code-split modals and drawers to keep the initial page bundle lean
const CaseStudyDrawer = lazy(() => import('./components/work/CaseStudyDrawer'))
const CommandPalette = lazy(() => import('./components/command/CommandPalette'))

const projects = PROJECTS


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
  const [hasOpenedDrawer, setHasOpenedDrawer] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [hasOpenedCommandPalette, setHasOpenedCommandPalette] = useState(false)
  const [selectedTech, setSelectedTech] = useState<string | null>(null)
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)
  const lastActiveTriggerRef = useRef<HTMLElement | null>(null)

  const activeTech = selectedTech || hoveredTech
  const matchingProjectIds = activeTech ? (TECH_TO_PROJECTS[activeTech] || []) : []
  const projectsMap = Object.fromEntries(projects.map((p) => [p.id, { href: p.href, title: p.title }]))

  // Platform-specific shortcut label (⌘K on Apple platforms, Ctrl K on Windows/Linux/Android)
  const isApplePlatform = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent)
  const shortcutBadge = isApplePlatform ? '⌘K' : 'Ctrl K'

  const closeMenu = () => setMenuOpen(false)

  const handleOpenCaseStudy = (id: string) => {
    lastActiveTriggerRef.current = document.activeElement as HTMLElement
    startTransition(() => {
      setHasOpenedDrawer(true)
      setActiveCaseStudyId(id)
    })
  }

  const handleCloseCaseStudy = () => {
    setActiveCaseStudyId(null)
    setTimeout(() => {
      lastActiveTriggerRef.current?.focus()
    }, 40)
  }

  const handleOpenCommandPalette = () => {
    lastActiveTriggerRef.current = document.activeElement as HTMLElement
    startTransition(() => {
      setHasOpenedCommandPalette(true)
      setIsCommandPaletteOpen(true)
    })
  }

  const handleCloseCommandPalette = () => {
    setIsCommandPaletteOpen(false)
    setTimeout(() => {
      lastActiveTriggerRef.current?.focus()
    }, 40)
  }

  const handleSelectProjectFromPalette = (projectId: string) => {
    handleOpenCaseStudy(projectId)
  }

  const handleSelectTechnologyFromPalette = (tech: string) => {
    setSelectedTech(tech)
    const el = document.getElementById('work')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleNavigateSectionFromPalette = (sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleReplayIntro = () => {
    try {
      sessionStorage.removeItem('vyra_intro_seen')
    } catch {}
    setShowIntro(true)
  }

  // Global keyboard shortcut listener for Ctrl+K / ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        const target = e.target as HTMLElement
        const isTyping =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable

        // If typing in another input and palette is not already open, avoid hijacking
        if (isTyping && !isCommandPaletteOpen) {
          return
        }

        e.preventDefault()
        if (isCommandPaletteOpen) {
          handleCloseCommandPalette()
        } else {
          handleOpenCommandPalette()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCommandPaletteOpen])

  const handlePrefetch = () => {
    // Preload chunk in background when user hovers or focuses on inspect button
    import('./components/work/CaseStudyDrawer')
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
            <a href="#services">Services <span>02</span></a>
            <a href="#work">Work <span>03</span></a>
            <a href="#pieces">Qualities <span>04</span></a>
            <a href="#stack">Stack <span>05</span></a>
            <a href="#about">About <span>06</span></a>
          </nav>
          <button
            type="button"
            className="nav-command-btn"
            onClick={handleOpenCommandPalette}
            onMouseEnter={() => import('./components/command/CommandPalette')}
            aria-label={`Open command palette (${shortcutBadge})`}
            title={`Open command palette (${shortcutBadge})`}
          >
            <Search size={13} strokeWidth={2} />
            <span>Search</span>
            <kbd className="nav-kbd">{shortcutBadge}</kbd>
          </button>
          <PaletteShiftToggle />
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
            <div className="mobile-nav-top-row">
              <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--muted)' }}>PALETTE</span>
              <PaletteShiftToggle id="mobile-palette-shift-toggle" compact />
            </div>
            <button
              type="button"
              className="mobile-nav-command"
              onClick={() => {
                closeMenu()
                handleOpenCommandPalette()
              }}
              aria-label={`Open search and commands (${shortcutBadge})`}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Search size={15} /> Search & commands
              </span>
              <kbd>{shortcutBadge}</kbd>
            </button>
            <a href="#services" onClick={closeMenu}>Services <ArrowUpRight size={16} /></a>
            <a href="#work" onClick={closeMenu}>Selected work <ArrowUpRight size={16} /></a>
            <a href="#pieces" onClick={closeMenu}>Chess qualities <ArrowUpRight size={16} /></a>
            <a href="#stack" onClick={closeMenu}>Tech stack <ArrowUpRight size={16} /></a>
            <a href="#about" onClick={closeMenu}>About me <ArrowUpRight size={16} /></a>
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
              <span>FULL-STACK DEVELOPER & FREELANCE BUILDER</span>
              <span className="kicker-divider">/</span>
              <span className="kicker-muted">WEB APPS · BUSINESS TOOLS · APPLIED AI</span>
            </div>
            <h1 className="hero-name-heading">
              <span className="name-line name-line-first">
                <span className="name-char-reveal">VASIHARAN</span>
              </span>
              <span className="name-line name-line-last">
                <span className="name-char-reveal">
                  B<span className="name-accent">.</span>
                </span>
              </span>
            </h1>

            {/* Supporting Brand Statement */}
            <div className="hero-supporting-statement" aria-label="Brand philosophy">
              <span className="statement-bar" aria-hidden="true" />
              <p className="statement-text">
                Practical software<span className="statement-dot">.</span> <span className="statement-outline">Thoughtful</span> systems<span className="statement-dot">.</span>
              </p>
            </div>

            <p className="hero-description">
              Full-stack engineer and software builder from Chennai. I design and engineer fast, reliable web applications, custom management software, real-time systems, and practical AI tools where architectural clarity and execution matter.
            </p>

            {/* Concise capabilities preview strip */}
            <div className="hero-services-preview" aria-label="Core freelance services preview">
              <span className="services-preview-label">WHAT I CAN BUILD FOR YOU:</span>
              <div className="services-preview-tags">
                <a href="#services" className="preview-tag">Web Applications & Dashboards</a>
                <a href="#services" className="preview-tag">Custom ERPs & Portals</a>
                <a href="#services" className="preview-tag">Real-Time Event Systems</a>
                <a href="#services" className="preview-tag">AI Vector Search & Retrieval</a>
              </div>
            </div>

            <div className="hero-actions">
              <a className="button button-primary" href="#work">
                View selected work <ArrowDownRight size={17} />
              </a>
              <a className="button button-quiet" href="#contact">
                Discuss a project <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="hero-meta">
              <span><MapPin size={14} /> Chennai, India</span>
              <span className="meta-separator" />
              <span>Available for freelance projects & custom software contracts.</span>
            </div>
          </div>

          <div className="hero-art" aria-label="VYRA Strategic Systems — 3D Chess Experience">
            <div className="art-topline">
              <span>FIG. 01 — STRATEGIC SYSTEMS</span>
            </div>
            <HeroGyroscope />
            <div className="art-bottomline">
              <div>
                <span className="mini-label">ENGINEERING DISCIPLINES</span>
                <strong>Web Apps · Business Software · Real-Time · Applied AI</strong>
              </div>
            </div>
          </div>

          <div className="hero-bottom">
            <span className="scroll-cue"><span /> SCROLL TO EXPLORE</span>
            <span className="hero-bottom-note">A PORTFOLIO OF THINGS MADE TO BE USEFUL.</span>
            <a href="#services" aria-label="Scroll to services"><ArrowDownRight size={18} /></a>
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

        {/* 02: FREELANCE SERVICES */}
        <FreelanceServices onInspectCaseStudy={handleOpenCaseStudy} />

        {/* 03: SELECTED WORK */}
        <section className="work-section section-wrap section-pad" id="work">
          <SectionHeading
            index="03"
            eyebrow="A FEW THINGS I’VE BUILT"
            title={<>Selected work<span className="headline-period">.</span></>}
            note={
              activeTech
                ? `Filtering by ${activeTech}: ${matchingProjectIds.length} verified project${matchingProjectIds.length === 1 ? '' : 's'} highlighted.`
                : "Real problems, distinct stacks — one focus: making systems dependable, usable, and performant."
            }
          />
          <div className="project-grid">
            {projects.map((project) => {
              const isMatch = Boolean(activeTech && matchingProjectIds.includes(project.id))
              const isDimmed = Boolean(activeTech && !matchingProjectIds.includes(project.id))

              return (
                <InteractiveProjectCard
                  key={project.id}
                  project={project}
                  onInspect={handleOpenCaseStudy}
                  onPrefetch={handlePrefetch}
                  isActive={activeCaseStudyId === project.id}
                  isHighlighted={isMatch}
                  isDimmed={isDimmed}
                  matchingTech={activeTech}
                />
              )
            })}
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

        {/* 04: CHESS-PIECE QUALITIES */}
        <InteractiveChessQualities onInspectCaseStudy={handleOpenCaseStudy} />

        {/* 05: STACK & TOOLBELT SECTION */}
        <section className="stack-section section-wrap section-pad" id="stack">
          <SectionHeading
            index="05"
            eyebrow="TOOLS I REACH FOR"
            title={<>My working stack<span className="headline-period">.</span></>}
            note={
              activeTech
                ? `Technology inspected: ${activeTech}. Click to toggle persistent filter mode.`
                : "A practical toolkit developed across web applications, real-time services, and applied AI projects."
            }
          />
          <InteractiveTechToolbelt
            selectedTech={selectedTech}
            hoveredTech={hoveredTech}
            onSelectTech={setSelectedTech}
            onHoverTech={setHoveredTech}
            onInspectCaseStudy={handleOpenCaseStudy}
            projects={projects}
          />
        </section>

        {/* 06: ABOUT & PRINCIPLES SECTION */}
        <section className="about-section section-pad" id="about">
          <div className="section-wrap">
            <SectionHeading
              index="06"
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
              <InteractivePrinciples
                onInspectCaseStudy={handleOpenCaseStudy}
                projectsMap={projectsMap}
              />
            </div>
          </div>
        </section>

        {/* 07: CONTACT SECTION */}
        <section className="contact-section section-pad" id="contact">
          <div className="contact-wrap section-wrap">
            <div className="contact-stamp">
              <Sparkles size={16} /> OPEN TO FREELANCE PROJECTS & CONTRACTS
            </div>
            
            <div className="contact-layout">
              <div className="contact-intro">
                <p className="eyebrow">07 / GET IN TOUCH</p>
                <h2>
                  Have a project<br />
                  in mind<span className="headline-period">?</span>
                </h2>
                <p className="contact-description">
                  Whether you have an early product concept, a custom business software requirement, or a full-stack platform where thoughtful engineering could help, I’d be glad to discuss the scope, architecture, and timeline.
                </p>

                <div className="contact-meta-group">
                  <div className="contact-meta-item">
                    <span className="status-dot" />
                    <span>Direct: +91 70105 71781</span>
                  </div>
                  <div className="contact-meta-item">
                    <Mail size={13} />
                    <span>vasiharan030@gmail.com</span>
                  </div>
                  <div className="contact-meta-item">
                    <MapPin size={13} />
                    <span>Chennai, India (IST / UTC+5:30)</span>
                  </div>
                </div>

                <div className="contact-social-links">
                  <a className="social-link" href="https://www.linkedin.com/in/vasiharan-b-ba0772322/" target="_blank" rel="noreferrer">
                    <Linkedin size={17} /> Connect on LinkedIn <ArrowUpRight size={15} />
                  </a>
                  <a className="social-link" href="https://github.com/VasiharanB" target="_blank" rel="noreferrer">
                    <Github size={17} /> Follow my builds <ArrowUpRight size={15} />
                  </a>
                </div>
              </div>

              <div className="contact-form-container">
                <ProjectInquiryForm />
              </div>
            </div>

            <div className="contact-bottom">
              <span><span className="status-dot" /> AVAILABLE FOR FREELANCE & PRODUCT ENGINEERING</span>
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
            onClick={handleOpenCommandPalette}
            title={`Open command palette (${shortcutBadge})`}
          >
            [COMMANDS {shortcutBadge}]
          </button>
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

      {/* INTERACTIVE CASE STUDY SLIDE-OVER DRAWER (CODE-SPLIT) */}
      {hasOpenedDrawer && (
        <Suspense fallback={null}>
          <CaseStudyDrawer
            isOpen={Boolean(activeCaseStudyId)}
            studyId={activeCaseStudyId}
            onClose={handleCloseCaseStudy}
          />
        </Suspense>
      )}

      {/* COMMAND PALETTE MODAL (CODE-SPLIT) */}
      {hasOpenedCommandPalette && (
        <Suspense fallback={null}>
          <CommandPalette
            isOpen={isCommandPaletteOpen}
            onClose={handleCloseCommandPalette}
            onSelectProject={handleSelectProjectFromPalette}
            onSelectTechnology={handleSelectTechnologyFromPalette}
            onNavigateSection={handleNavigateSectionFromPalette}
            onReplayIntro={handleReplayIntro}
          />
        </Suspense>
      )}
    </div>
  )
}

export default App