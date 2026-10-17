import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ExternalLink, Github, ArrowRight, ShieldCheck,
  CheckCircle2, AlertTriangle, Cpu, Workflow as WorkflowIcon,
  Layers, Code2
} from 'lucide-react'
import { CASE_STUDIES, type CaseStudyData } from '../../data/caseStudies'
import CaseStudyArchitectureDiagram from './CaseStudyArchitectureDiagram'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface CaseStudyDrawerProps {
  isOpen: boolean
  studyId: string | null
  onClose: () => void
}

export function CaseStudyDrawer({ isOpen, studyId, onClose }: CaseStudyDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [cachedStudy, setCachedStudy] = useState<CaseStudyData | null>(null)

  useEffect(() => {
    if (studyId && CASE_STUDIES[studyId]) {
      setCachedStudy(CASE_STUDIES[studyId])
    }
  }, [studyId])

  const study = (studyId && CASE_STUDIES[studyId]) || cachedStudy

  // Prevent background scrolling while drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  // Focus trapping and Escape key management
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
      return
    }

    if (e.key === 'Tab' && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      // Focus the close button when opened
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus()
      }, 50)
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        clearTimeout(timer)
      }
    }
  }, [isOpen, handleKeyDown])

  if (typeof document === 'undefined') return null
  if (!study && !isOpen) return null

  // Motion variants with reduced motion support
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const drawerVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        hidden: { x: '100%' },
        visible: {
          x: 0,
          transition: { type: 'spring', damping: 28, stiffness: 260 }
        },
        exit: {
          x: '100%',
          transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] }
        },
      }

  return createPortal(
    <AnimatePresence>
      {isOpen && study && (
        <div className="case-study-portal-root" role="none">
          {/* Backdrop Scrim */}
          <motion.div
            className="case-study-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-over Drawer Panel */}
          <motion.aside
            ref={drawerRef}
            className={`case-study-drawer tone-${study.tone}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-dialog-title"
            aria-describedby="case-study-dialog-desc"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Top Navigation Bar */}
            <div className="drawer-top-bar">
              <div className="drawer-eyebrow-wrap">
                <span className="drawer-project-number">/{study.number}</span>
                <span className="drawer-breadcrumb-sep">/</span>
                <span className="drawer-category-label">{study.category}</span>
              </div>

              <div className="drawer-top-actions">
                <a
                  href={study.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="drawer-repo-btn"
                  aria-label={`Open ${study.title} repository on GitHub in a new tab`}
                >
                  <Github size={14} />
                  <span>GitHub</span>
                  <ExternalLink size={12} />
                </a>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  className="drawer-close-btn"
                  aria-label="Close case study inspection dialog"
                  title="Close dialog (Escape)"
                >
                  <span>Close</span>
                  <span className="kbd-badge">ESC</span>
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Scrollable Case Study Body */}
            <div className="drawer-content-scroll">
              {/* Header Hero Section */}
              <header className="drawer-header-hero">
                <div className="drawer-kicker">
                  <span className="kicker-badge">ENGINEERING CASE STUDY</span>
                  <span className="kicker-verified">
                    <ShieldCheck size={13} /> SOURCE AUDITED
                  </span>
                </div>

                <h2 id="case-study-dialog-title" className="drawer-main-title">
                  {study.title}<span className="title-period">.</span>
                </h2>

                <p id="case-study-dialog-desc" className="drawer-subtitle">
                  {study.subtitle}
                </p>

                <div className="drawer-tagline-callout">
                  <p>{study.tagline}</p>
                </div>

                {/* Verified Tech Stack Pills */}
                <div className="drawer-stack-pills" aria-label="Verified technologies used">
                  <span className="stack-label">
                    <Code2 size={13} /> CONFIRMED STACK:
                  </span>
                  <div className="pills-row">
                    {study.stack.map((tech) => (
                      <span key={tech} className="tech-pill">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </header>

              {/* Section 1: Problem & Motivation */}
              <section className="drawer-section" aria-labelledby="problem-heading">
                <div className="section-title-bar">
                  <div className="section-icon-pill">
                    <AlertTriangle size={15} />
                  </div>
                  <h3 id="problem-heading" className="section-title">
                    Problem Context & Operational Friction
                  </h3>
                </div>

                <div className="problem-summary-card">
                  <p className="problem-summary-text">{study.problem.summary}</p>
                  <ul className="problem-points-list">
                    {study.problem.points.map((point, idx) => (
                      <li key={idx} className="problem-point-item">
                        <span className="point-bullet">›</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Section 2: Main Operational Workflow */}
              <section className="drawer-section" aria-labelledby="workflow-heading">
                <div className="section-title-bar">
                  <div className="section-icon-pill">
                    <WorkflowIcon size={15} />
                  </div>
                  <h3 id="workflow-heading" className="section-title">
                    {study.workflow.title}
                  </h3>
                </div>

                <div className="workflow-timeline" role="list">
                  {study.workflow.steps.map((step, idx) => (
                    <div key={idx} className="workflow-step-card" role="listitem">
                      <div className="step-badge-col">
                        <span className="step-num-badge">{step.number}</span>
                        {idx < study.workflow.steps.length - 1 && <span className="step-pipe" />}
                      </div>
                      <div className="step-content-col">
                        <h4 className="step-card-title">{step.title}</h4>
                        <p className="step-card-detail">{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 3: Architecture Diagram & System Flow */}
              <section className="drawer-section" aria-labelledby="architecture-heading">
                <div className="section-title-bar">
                  <div className="section-icon-pill">
                    <Layers size={15} />
                  </div>
                  <h3 id="architecture-heading" className="section-title">
                    System Architecture & Data Flow
                  </h3>
                </div>

                <CaseStudyArchitectureDiagram
                  overview={study.architecture.overview}
                  nodes={study.architecture.nodes}
                  flowLabels={study.architecture.flowLabels}
                  tone={study.tone}
                />
              </section>

              {/* Section 4: Key Engineering Decisions & Trade-offs */}
              <section className="drawer-section" aria-labelledby="decisions-heading">
                <div className="section-title-bar">
                  <div className="section-icon-pill">
                    <Cpu size={15} />
                  </div>
                  <h3 id="decisions-heading" className="section-title">
                    Key Engineering Decisions & Trade-offs
                  </h3>
                </div>

                <div className="decisions-grid">
                  {study.decisions.map((decision, idx) => (
                    <article key={idx} className="decision-card">
                      <div className="decision-card-top">
                        <span className="decision-index">DECISION 0{idx + 1}</span>
                        <CheckCircle2 size={15} className="decision-check-icon" />
                      </div>
                      <h4 className="decision-title">{decision.title}</h4>
                      <p className="decision-rationale">{decision.rationale}</p>
                    </article>
                  ))}
                </div>
              </section>

              {/* Section 5: Confirmed Implementation Challenges & Solutions */}
              <section className="drawer-section" aria-labelledby="challenges-heading">
                <div className="section-title-bar">
                  <div className="section-icon-pill">
                    <ShieldCheck size={15} />
                  </div>
                  <h3 id="challenges-heading" className="section-title">
                    Confirmed Implementation Challenges
                  </h3>
                </div>

                <div className="challenges-stack">
                  {study.challenges.map((item, idx) => (
                    <div key={idx} className="challenge-resolution-row">
                      <div className="challenge-block">
                        <span className="block-label challenge-label">CHALLENGE</span>
                        <p className="block-text">{item.challenge}</p>
                      </div>
                      <div className="resolution-block">
                        <span className="block-label resolution-label">RESOLUTION IN CODE</span>
                        <p className="block-text">{item.resolution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Bottom Direct Links & Actions */}
              <div className="drawer-bottom-actions">
                <a
                  href={study.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-primary drawer-primary-cta"
                >
                  <Github size={16} />
                  <span>Inspect Source Code on GitHub</span>
                  <ArrowRight size={15} />
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="button button-quiet drawer-secondary-close"
                >
                  Close Case Study
                </button>
              </div>

              <div className="drawer-source-verification-notice">
                <span>
                  Technical descriptions, workflows, and system architectures documented directly from confirmed public repository source code.
                </span>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default CaseStudyDrawer
