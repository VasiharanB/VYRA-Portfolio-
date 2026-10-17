import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react'
import {
  ArrowUpRight, ChevronRight, ExternalLink,
  Layers, ShieldCheck, Zap, Compass, RefreshCw
} from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { ChessPieceType } from './ProceduralChessPieces'

// Code-split the 3D scroll canvas to keep the initial page bundle lean
const ChessScrollCanvas = lazy(() => import('./ChessScrollCanvas'))

interface DemonstratedProject {
  id: string
  name: string
  category: string
  impact: string
  repoUrl: string
}

interface ChessChapter {
  id: ChessPieceType
  number: string
  name: string
  symbol: string
  tag: string
  quality: string
  headline: string
  explanation: string
  skills: string[]
  projects: DemonstratedProject[]
  accentTone: string
}

const CHESS_CHAPTERS: ChessChapter[] = [
  {
    id: 'king',
    number: '01',
    name: 'King',
    symbol: '♚',
    tag: 'CHAPTER 01 / 06 · OWNERSHIP',
    quality: 'Ownership, Responsibility & Engineering Judgment',
    headline: 'Taking complete accountability for system outcomes, security, and long-term viability.',
    explanation:
      'In chess as in production software, the game ultimately hinges on the king. When taking on client projects, I assume end-to-end responsibility: balancing architecture trade-offs, enforcing data security and role-based access control, and making deliberate decisions that safeguard project success through launch and beyond.',
    skills: ['Architecture Strategy', 'RBAC & Auth Security', 'Full-Stack Delivery', 'Defensive Engineering'],
    projects: [
      {
        id: 'jgc-construction-erp',
        name: 'JGC Construction ERP',
        category: 'BUSINESS SOFTWARE',
        impact: 'Owned full system architecture coordinating multiple job sites, vendor workflows, CRM, and materials inventory in one unified platform.',
        repoUrl: 'https://github.com/VasiharanB/jgc_constructions',
      },
      {
        id: 'cricket-conquest',
        name: 'Cricket Conquest',
        category: 'REAL-TIME SYSTEMS',
        impact: 'Engineered centralized state management and role separation between auctioneers and bidder rooms with transactional finalization.',
        repoUrl: 'https://github.com/VasiharanB/cricket-conquest-ipl-auction',
      },
    ],
    accentTone: '#b9f36a',
  },
  {
    id: 'queen',
    number: '02',
    name: 'Queen',
    symbol: '♛',
    tag: 'CHAPTER 02 / 06 · VERSATILITY',
    quality: 'Versatility Across the Full Stack',
    headline: 'Fluidly navigating frontends, backend APIs, relational databases, and asynchronous pipelines.',
    explanation:
      'The queen moves with complete freedom across ranks, files, and diagonals. In my engineering practice, this versatility means working without friction across the entire stack: crafting responsive, type-safe React/TypeScript interfaces, building scalable Django and Node backends, designing normalized SQL databases, and wiring up machine learning services.',
    skills: ['React & TypeScript', 'Django REST', 'Node.js & Express', 'PostgreSQL & MySQL', 'RESTful API Contracts'],
    projects: [
      {
        id: 'smart-issue-tracker',
        name: 'Smart Issue Tracker',
        category: 'AI · TRIAGE WORKFLOWS',
        impact: 'Seamless full-stack pipeline from interactive React SPA to Django REST backend and FAISS vector indexing.',
        repoUrl: 'https://github.com/VasiharanB/Smart-Issue-Tracker',
      },
      {
        id: 'aethon-ai',
        name: 'Aethon AI',
        category: 'COLLABORATIVE PLATFORMS',
        impact: 'Full-stack placement assessment platform coordinating student problem-solving, admin evaluations, and progress dashboards.',
        repoUrl: 'https://github.com/VasiharanB/aethon-ai',
      },
    ],
    accentTone: '#b5a5ff',
  },
  {
    id: 'rook',
    number: '03',
    name: 'Rook',
    symbol: '♜',
    tag: 'CHAPTER 03 / 06 · STRUCTURE',
    quality: 'Structured Systems, Maintainability & Reliability',
    headline: 'Building bedrock foundations: normalized schemas, defensive error boundaries, and zero-loss persistence.',
    explanation:
      'The rook advances along direct, uncompromising lines. I believe great software rests on clean, solid structural foundations: well-normalized relational schemas, strict schema constraints, clear separation of concerns, and robust error recovery so systems remain stable under unexpected workloads.',
    skills: ['Relational Schema Design', 'SQLite & Local Storage', 'Database Normalization', 'Zero-Loss Persistence'],
    projects: [
      {
        id: 'fittrack-desktop',
        name: 'FitTrack Desktop',
        category: 'DESKTOP ENGINEERING',
        impact: 'Built a reliable offline desktop health tracker with persistent SQLite schema constraints and zero-loss biometric logging.',
        repoUrl: 'https://github.com/VasiharanB/FitTrack-Desktop',
      },
      {
        id: 'jgc-construction-erp',
        name: 'JGC Construction ERP',
        category: 'BUSINESS SOFTWARE',
        impact: 'Structured multi-table relational MySQL schemas coordinating billing, materials requisition, and supplier audit trails.',
        repoUrl: 'https://github.com/VasiharanB/jgc_constructions',
      },
    ],
    accentTone: '#ffad78',
  },
  {
    id: 'bishop',
    number: '04',
    name: 'Bishop',
    symbol: '♝',
    tag: 'CHAPTER 04 / 06 · ARCHITECTURE',
    quality: 'Strategic Thinking & Component Architecture',
    headline: 'Seeing cross-cutting connections: unifying decoupled services, vector search, and data flows.',
    explanation:
      'The bishop exerts influence diagonally across the board, linking distant quadrants. In software design, I focus on system-wide architectural harmony: seeing how vector search integrates into ticketing, how WebSocket events synchronize with relational databases, and how reusable UI components communicate predictably.',
    skills: ['System Architecture', 'Data Flow Modeling', 'Vector Embeddings', 'Cross-Service Integration'],
    projects: [
      {
        id: 'smart-issue-tracker',
        name: 'Smart Issue Tracker',
        category: 'AI · TRIAGE WORKFLOWS',
        impact: 'Integrated Gemini text embeddings with FAISS vector indexing and cosine threshold validation to eliminate duplicate support tickets.',
        repoUrl: 'https://github.com/VasiharanB/Smart-Issue-Tracker',
      },
      {
        id: 'cricket-conquest',
        name: 'Cricket Conquest',
        category: 'REAL-TIME SYSTEMS',
        impact: 'Architected event-driven WebSocket communication models synchronizing real-time auction clocks and live room participants.',
        repoUrl: 'https://github.com/VasiharanB/cricket-conquest-ipl-auction',
      },
    ],
    accentTone: '#82c8ff',
  },
  {
    id: 'knight',
    number: '05',
    name: 'Knight',
    symbol: '♞',
    tag: 'CHAPTER 05 / 06 · ADAPTABILITY',
    quality: 'Creative Problem-Solving & Adaptability',
    headline: 'Navigating non-linear paths: resolving race conditions, desktop limits, and bespoke client demands.',
    explanation:
      'The knight maneuvers where standard pieces are blocked, jumping past barriers. When faced with complex edge cases — concurrency spikes in real-time bidding, integrating matplotlib canvas figures into Tkinter event loops, or structuring bespoke client workflows — I engineer pragmatic, creative solutions that deliver results without unnecessary complexity.',
    skills: ['Real-Time WebSockets', 'Concurrency Management', 'Tkinter GUI Architecture', 'Pragmatic Problem-Solving'],
    projects: [
      {
        id: 'cricket-conquest',
        name: 'Cricket Conquest',
        category: 'REAL-TIME SYSTEMS',
        impact: 'Engineered rapid bid-submission validation and anti-race handling during intense multiplayer live auction rounds.',
        repoUrl: 'https://github.com/VasiharanB/cricket-conquest-ipl-auction',
      },
      {
        id: 'fittrack-desktop',
        name: 'FitTrack Desktop',
        category: 'DESKTOP ENGINEERING',
        impact: 'Overcame desktop GUI event-loop limitations by embedding reactive Matplotlib charts seamlessly into custom Tkinter frames.',
        repoUrl: 'https://github.com/VasiharanB/FitTrack-Desktop',
      },
    ],
    accentTone: '#7de4c4',
  },
  {
    id: 'pawn',
    number: '06',
    name: 'Pawn',
    symbol: '♟',
    tag: 'CHAPTER 06 / 06 · EXECUTION',
    quality: 'Consistency, Fundamentals, Iteration & Growth',
    headline: 'Mastering the fundamentals: clean code hygiene, thorough preprocessing, and continuous refinement.',
    explanation:
      'Pawns form the structure of every sound position. Software excellence is built on small, disciplined habits: meticulous text preprocessing, semantic markup, comprehensive input validation, clear Git commit histories, and iterative refactoring that transforms good ideas into robust software.',
    skills: ['Clean Code Principles', 'NLP Preprocessing', 'Git Workflow Hygiene', 'Input Validation & Sanitization'],
    projects: [
      {
        id: 'sms-spam-detection',
        name: 'SMS Spam Detection',
        category: 'APPLIED ML & NLP',
        impact: 'Demonstrated rigorous data preprocessing, tokenization, TF-IDF feature extraction, and persistent audit logging in Django.',
        repoUrl: 'https://github.com/VasiharanB/sms_spam_detection',
      },
      {
        id: 'fittrack-desktop',
        name: 'FitTrack Desktop',
        category: 'DESKTOP ENGINEERING',
        impact: 'Applied disciplined modular architecture, atomic calculations, and incremental UI refinements to build an intuitive desktop utility.',
        repoUrl: 'https://github.com/VasiharanB/FitTrack-Desktop',
      },
    ],
    accentTone: '#f2a6d8',
  },
]

interface InteractiveChessQualitiesProps {
  onInspectCaseStudy: (projectId: string) => void
}

export function InteractiveChessQualities({ onInspectCaseStudy }: InteractiveChessQualitiesProps) {
  const [activePieceId, setActivePieceId] = useState<ChessPieceType>('king')
  const chapterRefs = useRef<Map<string, HTMLElement>>(new Map())
  const prefersReducedMotion = useReducedMotion()

  const currentChapter = CHESS_CHAPTERS.find((c) => c.id === activePieceId) || CHESS_CHAPTERS[0]

  // Track natural scroll progress through chapters using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pieceId = entry.target.getAttribute('data-piece-id') as ChessPieceType
            if (pieceId) {
              setActivePieceId(pieceId)
            }
          }
        })
      },
      {
        rootMargin: '-30% 0px -35% 0px',
        threshold: 0.1,
      }
    )

    chapterRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Fast jump to a specific chapter via click or keyboard
  const handleJumpToChapter = useCallback((pieceId: ChessPieceType) => {
    setActivePieceId(pieceId)
    const target = chapterRefs.current.get(pieceId)
    if (target) {
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' })
    }
  }, [prefersReducedMotion])

  return (
    <section className="chess-qualities-section section-wrap section-pad" id="pieces">
      {/* Section Header */}
      <div className="section-heading">
        <div className="section-heading-main">
          <span className="section-index">04</span>
          <div>
            <p className="eyebrow">CHESS AS AN ENGINEERING METAPHOR</p>
            <h2>
              The pieces behind my game<span className="headline-period">.</span>
            </h2>
          </div>
        </div>
        <p className="section-note">
          Scroll through the six chapters below. Each Staunton piece anchors a core engineering discipline demonstrated across my projects.
        </p>
      </div>

      {/* Chapter Progress Rail & Direct Selection Bar */}
      <div className="chess-progress-rail" role="tablist" aria-label="Chess chapter progression">
        {CHESS_CHAPTERS.map((chap, idx) => {
          const isActive = chap.id === activePieceId
          return (
            <button
              key={chap.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`chapter-panel-${chap.id}`}
              className={`chapter-notch-btn ${isActive ? 'notch-active' : ''}`}
              style={{ '--notch-accent': chap.accentTone } as React.CSSProperties}
              onClick={() => handleJumpToChapter(chap.id)}
              title={`Jump to ${chap.name}: ${chap.quality}`}
            >
              <span className="notch-symbol" aria-hidden="true">{chap.symbol}</span>
              <span className="notch-num">/{chap.number}</span>
              <span className="notch-name">{chap.name}</span>
              <span className="notch-indicator" aria-hidden="true" />
            </button>
          )
        })}
      </div>

      {/* Main 3D Scroll Narrative Layout */}
      <div className="chess-scroll-narrative">
        {/* Sticky 3D Visual Stage (Anchors the scroll on desktop) */}
        <div className="chess-stage-column">
          <div
            className="chess-sticky-viewport"
            style={{ '--current-accent': currentChapter.accentTone } as React.CSSProperties}
          >
            {/* Top Stage Telemetry Header */}
            <div className="stage-telemetry-top">
              <span className="stage-telemetry-label">FIG. 04 — DISCIPLINE ANCHOR</span>
              <span className="stage-telemetry-tag">{currentChapter.tag}</span>
            </div>

            {/* Persistent 3D Canvas */}
            <div className="stage-canvas-wrapper">
              <Suspense
                fallback={
                  <div className="stage-canvas-fallback">
                    <span className="fallback-symbol">{currentChapter.symbol}</span>
                    <span className="fallback-loading-label">INITIALIZING 3D PIECE...</span>
                  </div>
                }
              >
                <ChessScrollCanvas
                  activePieceId={activePieceId}
                  accentColor={currentChapter.accentTone}
                  reducedMotion={prefersReducedMotion}
                />
              </Suspense>
            </div>

            {/* Bottom Stage Telemetry Footer */}
            <div className="stage-telemetry-bottom">
              <div className="telemetry-piece-name">
                <span className="piece-glyph-badge">{currentChapter.symbol}</span>
                <strong>{currentChapter.name}</strong>
              </div>
              <div className="telemetry-piece-number">
                <span>{currentChapter.number} / 06</span>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Chapters Column (Natural Scroll) */}
        <div className="chess-chapters-column">
          {CHESS_CHAPTERS.map((chap) => {
            const isSelected = chap.id === activePieceId
            return (
              <article
                key={chap.id}
                id={`chapter-panel-${chap.id}`}
                data-piece-id={chap.id}
                ref={(el) => {
                  if (el) chapterRefs.current.set(chap.id, el)
                }}
                className={`chapter-card ${isSelected ? 'chapter-active' : ''}`}
                style={{ '--chapter-accent': chap.accentTone } as React.CSSProperties}
              >
                {/* Chapter Meta */}
                <div className="chapter-header-row">
                  <span className="chapter-tag">{chap.tag}</span>
                  <span className="chapter-symbol-watermark" aria-hidden="true">{chap.symbol}</span>
                </div>

                <h3 className="chapter-quality-title">{chap.quality}</h3>
                <p className="chapter-headline">{chap.headline}</p>
                <p className="chapter-explanation">{chap.explanation}</p>

                {/* Technical Skills Pills */}
                <div className="chapter-skills-block">
                  <span className="skills-block-label">VERIFIED TECHNICAL CAPABILITIES</span>
                  <div className="skills-pill-row">
                    {chap.skills.map((skill) => (
                      <span key={skill} className="skill-pill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Demonstrated Project Evidence */}
                <div className="chapter-evidence-block">
                  <div className="evidence-header-row">
                    <span className="evidence-heading-label">DEMONSTRATED IN VYRA PROJECTS</span>
                    <span className="evidence-count-label">{chap.projects.length} PROJECTS</span>
                  </div>

                  <div className="evidence-grid">
                    {chap.projects.map((proj) => (
                      <div key={proj.id} className="chapter-evidence-card">
                        <div className="evidence-card-top">
                          <span className="evidence-card-category">{proj.category}</span>
                          <a
                            href={proj.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="evidence-repo-link"
                            title={`View ${proj.name} on GitHub`}
                            aria-label={`View ${proj.name} repository on GitHub`}
                          >
                            <ExternalLink size={13} />
                          </a>
                        </div>

                        <h4 className="evidence-card-title">{proj.name}</h4>
                        <p className="evidence-card-impact">{proj.impact}</p>

                        <div className="evidence-card-actions">
                          <button
                            type="button"
                            className="evidence-inspect-btn"
                            onClick={() => onInspectCaseStudy(proj.id)}
                            aria-label={`Inspect case study for ${proj.name}`}
                          >
                            <span>Inspect case study</span>
                            <ChevronRight size={14} />
                          </button>
                          <a
                            href={proj.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="evidence-source-link"
                          >
                            Source <ArrowUpRight size={12} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default InteractiveChessQualities
