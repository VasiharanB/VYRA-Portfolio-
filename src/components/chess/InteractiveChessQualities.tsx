import React, { useState, useRef, useCallback } from 'react'
import {
  ArrowUpRight, Layers, ShieldCheck, Zap,
  Compass, RefreshCw, ExternalLink, ChevronRight
} from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface DemonstratedProject {
  id: string
  name: string
  category: string
  impact: string
  repoUrl: string
}

interface ChessPieceQuality {
  id: string
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

const CHESS_PIECES: ChessPieceQuality[] = [
  {
    id: 'king',
    number: '01',
    name: 'King',
    symbol: '♚',
    tag: 'PIECE 01 · OWNERSHIP',
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
    tag: 'PIECE 02 · VERSATILITY',
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
    tag: 'PIECE 03 · STRUCTURE',
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
    tag: 'PIECE 04 · ARCHITECTURE',
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
    tag: 'PIECE 05 · ADAPTABILITY',
    quality: 'Creative Problem-Solving & Adaptability',
    headline: 'Navigating non-linear paths: resolving race conditions, legacy constraints, and bespoke client demands.',
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
    tag: 'PIECE 06 · EXECUTION',
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
  const [selectedPieceId, setSelectedPieceId] = useState<string>('king')
  const tabsListRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const currentPiece = CHESS_PIECES.find((p) => p.id === selectedPieceId) || CHESS_PIECES[0]

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    let nextIndex = index

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      nextIndex = (index + 1) % CHESS_PIECES.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      nextIndex = (index - 1 + CHESS_PIECES.length) % CHESS_PIECES.length
    } else if (e.key === 'Home') {
      e.preventDefault()
      nextIndex = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      nextIndex = CHESS_PIECES.length - 1
    }

    if (nextIndex !== index) {
      setSelectedPieceId(CHESS_PIECES[nextIndex].id)
      const buttons = tabsListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      buttons?.[nextIndex]?.focus()
    }
  }, [])

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
          Every chess piece has a distinct discipline on the board. Here is how those six qualities translate into real, verified engineering practices across my projects.
        </p>
      </div>

      {/* Interactive Chess Board / Rack Selector */}
      <div
        ref={tabsListRef}
        className="chess-selector-rack"
        role="tablist"
        aria-label="Chess piece engineering qualities"
      >
        {CHESS_PIECES.map((piece, index) => {
          const isSelected = piece.id === selectedPieceId
          return (
            <button
              key={piece.id}
              role="tab"
              id={`chess-tab-${piece.id}`}
              aria-selected={isSelected}
              aria-controls={`chess-panel-${piece.id}`}
              tabIndex={isSelected ? 0 : -1}
              className={`chess-piece-tile ${isSelected ? 'piece-active' : ''}`}
              style={{ '--piece-accent': piece.accentTone } as React.CSSProperties}
              onClick={() => setSelectedPieceId(piece.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              <div className="tile-symbol" aria-hidden="true">
                {piece.symbol}
              </div>
              <div className="tile-text">
                <span className="tile-number">{piece.number}</span>
                <strong className="tile-name">{piece.name}</strong>
              </div>
              <span className="tile-indicator" aria-hidden="true" />
            </button>
          )
        })}
      </div>

      {/* Selected Piece Details Inspector Panel */}
      <div
        id={`chess-panel-${currentPiece.id}`}
        role="tabpanel"
        aria-labelledby={`chess-tab-${currentPiece.id}`}
        className="chess-inspector-panel"
        style={{ '--active-accent': currentPiece.accentTone } as React.CSSProperties}
      >
        <div className="inspector-grid">
          {/* Left Column: Quality & Narrative */}
          <div className="inspector-narrative">
            <div className="inspector-badge-row">
              <span className="inspector-badge">{currentPiece.tag}</span>
              <span className="inspector-symbol-watermark" aria-hidden="true">
                {currentPiece.symbol}
              </span>
            </div>

            <h3 className="inspector-title">{currentPiece.quality}</h3>
            <p className="inspector-headline">{currentPiece.headline}</p>
            <p className="inspector-explanation">{currentPiece.explanation}</p>

            <div className="inspector-skills-wrap">
              <span className="skills-heading">VERIFIED TECHNICAL CAPABILITIES</span>
              <div className="skills-pill-row">
                {currentPiece.skills.map((skill) => (
                  <span key={skill} className="skill-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Demonstrated Projects Evidence */}
          <div className="inspector-evidence">
            <div className="evidence-header">
              <span className="evidence-label">VERIFIED PROJECT EVIDENCE</span>
              <span className="evidence-count">{currentPiece.projects.length} CASE STUDIES</span>
            </div>

            <div className="evidence-cards-list">
              {currentPiece.projects.map((proj) => (
                <div key={proj.id} className="evidence-card">
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
        </div>
      </div>
    </section>
  )
}

export default InteractiveChessQualities
