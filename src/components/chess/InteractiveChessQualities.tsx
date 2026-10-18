import React, { useState, useCallback, Suspense, lazy } from 'react'
import {
  ArrowUpRight, ChevronRight, ExternalLink,
  RotateCw, Play, Pause, Eye
} from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { ChessPieceType } from './StauntonPieceModels'

// Code-split the 3D showcase canvas
const ChessShowcaseCanvas = lazy(() => import('./ChessShowcaseCanvas'))

interface DemonstratedProject {
  id: string
  name: string
  category: string
  impact: string
  repoUrl: string
}

interface ChessDiscipline {
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
  squareCoordinate: string
}

export const CHESS_DISCIPLINES: ChessDiscipline[] = [
  {
    id: 'king',
    number: '01',
    name: 'King',
    symbol: '♚',
    tag: 'OWNERSHIP & JUDGMENT',
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
    squareCoordinate: 'D4',
  },
  {
    id: 'queen',
    number: '02',
    name: 'Queen',
    symbol: '♛',
    tag: 'FULL-STACK VERSATILITY',
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
    squareCoordinate: 'D5',
  },
  {
    id: 'rook',
    number: '03',
    name: 'Rook',
    symbol: '♜',
    tag: 'STRUCTURE & RELIABILITY',
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
    squareCoordinate: 'A1',
  },
  {
    id: 'bishop',
    number: '04',
    name: 'Bishop',
    symbol: '♝',
    tag: 'STRATEGY & ARCHITECTURE',
    quality: 'Strategic Thinking & System Architecture',
    headline: 'Diagnosing complex system dynamics and connecting disparate technical layers intentionally.',
    explanation:
      'The bishop controls long diagonals, connecting distinct sectors of the board. In system development, this represents architectural vision: seeing how data flows between user interfaces, message queues, and AI models, and structuring systems to minimize latency and architectural technical debt.',
    skills: ['Vector Search & FAISS', 'Semantic Similarity', 'Prompt Architecture', 'Event-Driven Separation'],
    projects: [
      {
        id: 'smart-issue-tracker',
        name: 'Smart Issue Tracker',
        category: 'AI · TRIAGE WORKFLOWS',
        impact: 'Designed semantic similarity pipeline using sentence-transformers and FAISS to detect duplicate support tickets instantly.',
        repoUrl: 'https://github.com/VasiharanB/Smart-Issue-Tracker',
      },
      {
        id: 'aethon-ai',
        name: 'Aethon AI',
        category: 'COLLABORATIVE PLATFORMS',
        impact: 'Structured modular service boundaries separating client state from real-time evaluation services.',
        repoUrl: 'https://github.com/VasiharanB/aethon-ai',
      },
    ],
    accentTone: '#78d9ff',
    squareCoordinate: 'C1',
  },
  {
    id: 'knight',
    number: '05',
    name: 'Knight',
    symbol: '♞',
    tag: 'ADAPTABILITY & CREATIVITY',
    quality: 'Creative Problem-Solving & Adaptability',
    headline: 'Overcoming technical roadblocks through inventive routing, real-time sync, and rapid adaptation.',
    explanation:
      'The knight is the only piece that leaps over obstacles. When facing tricky technical constraints—whether syncing real-time auction bids across high-latency clients or training NLP models on constrained compute—I engineer pragmatic workarounds that deliver seamless user experiences without compromise.',
    skills: ['Real-Time WebSockets', 'Auction Bidding Logic', 'ML Inference Pipelines', 'Asynchronous UI State'],
    projects: [
      {
        id: 'cricket-conquest',
        name: 'Cricket Conquest',
        category: 'REAL-TIME SYSTEMS',
        impact: 'Implemented resilient WebSocket synchronization with transactional bid resolution and optimistic UI updates.',
        repoUrl: 'https://github.com/VasiharanB/cricket-conquest-ipl-auction',
      },
      {
        id: 'sms-spam-detection',
        name: 'SMS Spam Detection',
        category: 'APPLIED ML & NLP',
        impact: 'Engineered an efficient TF-IDF and Multinomial Naive Bayes classification pipeline delivering sub-second predictions.',
        repoUrl: 'https://github.com/VasiharanB/sms-spam-detection',
      },
    ],
    accentTone: '#b9f36a',
    squareCoordinate: 'B1',
  },
  {
    id: 'pawn',
    number: '06',
    name: 'Pawn',
    symbol: '♟',
    tag: 'EXECUTION & CONSISTENCY',
    quality: 'Fundamentals, Consistency & Iterative Execution',
    headline: 'Building momentum through disciplined fundamentals, rigorous testing, and relentless refinement.',
    explanation:
      'Pawns determine the structure of every chess game. Great engineering is rarely about flashiness; it is built on disciplined habits: semantic markup, clean variable naming, thorough component isolation, reliable test coverage, and continuous incremental delivery that transforms simple ideas into production software.',
    skills: ['Component Architecture', 'Clean Python OOP', 'Testable Logic', 'Resilient UI Boundaries'],
    projects: [
      {
        id: 'fittrack-desktop',
        name: 'FitTrack Desktop',
        category: 'DESKTOP ENGINEERING',
        impact: 'Engineered clean Tkinter modular UI layers and robust schema migrations for persistent local data safety.',
        repoUrl: 'https://github.com/VasiharanB/FitTrack-Desktop',
      },
      {
        id: 'sms-spam-detection',
        name: 'SMS Spam Detection',
        category: 'APPLIED ML & NLP',
        impact: 'Established disciplined dataset preprocessing, tokenization pipelines, and model evaluation metrics.',
        repoUrl: 'https://github.com/VasiharanB/sms-spam-detection',
      },
    ],
    accentTone: '#ffd478',
    squareCoordinate: 'E2',
  },
]

// Preset angles for static viewpoint inspection
const ANGLE_PRESETS = [
  { label: 'Front', rad: 0.35 },
  { label: 'Flank', rad: Math.PI / 2 + 0.35 },
  { label: 'Rear', rad: Math.PI + 0.35 },
  { label: 'Profile', rad: (Math.PI * 3) / 2 + 0.35 },
]

interface InteractiveChessQualitiesProps {
  onInspectCaseStudy: (projectId: string) => void
}

export function InteractiveChessQualities({ onInspectCaseStudy }: InteractiveChessQualitiesProps) {
  const [selectedPieceId, setSelectedPieceId] = useState<ChessPieceType>('king')
  const prefersReducedMotion = useReducedMotion()
  const [isRotating, setIsRotating] = useState(!prefersReducedMotion)
  const [selectedAngle, setSelectedAngle] = useState<number | undefined>(undefined)

  const currentDiscipline = CHESS_DISCIPLINES.find((d) => d.id === selectedPieceId) || CHESS_DISCIPLINES[0]

  const handleSelectPiece = useCallback((id: ChessPieceType) => {
    setSelectedPieceId(id)
    setSelectedAngle(undefined)
    if (!prefersReducedMotion) {
      setIsRotating(true)
    }
  }, [prefersReducedMotion])

  const handleToggleRotation = useCallback(() => {
    setIsRotating((prev) => !prev)
  }, [])

  const handleSelectAnglePreset = useCallback((rad: number) => {
    setSelectedAngle(rad)
    setIsRotating(false)
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
          Six Staunton pieces anchor the core engineering disciplines I bring to production systems and client builds. Select any piece below to inspect its 3D form, verified technical skills, and project case studies.
        </p>
      </div>

      {/* Interactive Chess-Piece Selector */}
      <div className="chess-piece-selector" role="tablist" aria-label="Select chess piece discipline">
        {CHESS_DISCIPLINES.map((item) => {
          const isSelected = item.id === selectedPieceId
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`discipline-panel-${item.id}`}
              className={`piece-selector-chip ${isSelected ? 'chip-active' : ''}`}
              style={{ '--chip-accent': item.accentTone } as React.CSSProperties}
              onClick={() => handleSelectPiece(item.id)}
            >
              <span className="chip-symbol" aria-hidden="true">{item.symbol}</span>
              <div className="chip-text">
                <span className="chip-name">{item.name}</span>
                <span className="chip-tag">/{item.number} · {item.tag.split('&')[0].trim()}</span>
              </div>
              <span className="chip-indicator" aria-hidden="true" />
            </button>
          )
        })}
      </div>

      {/* Main 3D Stage and Skills Showcase Layout */}
      <div className="chess-showcase-grid">
        {/* Left Column: Realistic 3D Stage on Chessboard */}
        <div className="showcase-stage-card">
          <div
            className="stage-card-inner"
            style={{ '--current-accent': currentDiscipline.accentTone } as React.CSSProperties}
          >
            {/* Top Telemetry Header */}
            <div className="stage-telemetry-header">
              <div className="stage-telemetry-meta">
                <span className="stage-fig-label">FIG. 04 — STAUNTON {currentDiscipline.name.toUpperCase()}</span>
                <span className="stage-square-badge">SQUARE: {currentDiscipline.squareCoordinate}</span>
              </div>

              {/* Turntable Control Button */}
              <button
                type="button"
                className={`stage-turntable-toggle ${isRotating ? 'turntable-active' : ''}`}
                onClick={handleToggleRotation}
                title={isRotating ? 'Pause 360° turntable' : 'Resume 360° turntable'}
                aria-label={isRotating ? 'Pause 360° turntable rotation' : 'Resume 360° turntable rotation'}
              >
                {isRotating ? <Pause size={10} /> : <Play size={10} />}
                <span>{isRotating ? 'TURNTABLE ON' : 'PAUSED'}</span>
              </button>
            </div>

            {/* 3D Canvas Viewport */}
            <div className="stage-canvas-box">
              <Suspense
                fallback={
                  <div className="stage-canvas-fallback">
                    <span className="fallback-symbol">{currentDiscipline.symbol}</span>
                    <span className="fallback-loading-label">INITIALIZING 3D PIECE & BOARD...</span>
                  </div>
                }
              >
                <ChessShowcaseCanvas
                  activePieceId={selectedPieceId}
                  accentColor={currentDiscipline.accentTone}
                  reducedMotion={prefersReducedMotion}
                  isRotating={isRotating}
                  selectedAngle={selectedAngle}
                />
              </Suspense>
            </div>

            {/* Bottom Telemetry Footer & Viewpoint Angle Controls */}
            <div className="stage-telemetry-footer">
              <div className="stage-footer-piece">
                <span className="footer-glyph">{currentDiscipline.symbol}</span>
                <strong>{currentDiscipline.name}</strong>
              </div>

              {/* Viewpoint Angle Selector for Static Inspection */}
              <div className="stage-angle-presets" role="group" aria-label="Inspect piece angle">
                <span className="angle-label"><Eye size={10} /> VIEW:</span>
                {ANGLE_PRESETS.map((preset) => {
                  const isCurrent = selectedAngle === preset.rad && !isRotating
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      className={`angle-preset-btn ${isCurrent ? 'angle-btn-active' : ''}`}
                      onClick={() => handleSelectAnglePreset(preset.rad)}
                      title={`Inspect ${preset.label} view of ${currentDiscipline.name}`}
                    >
                      {preset.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Skills & Evidence Panel (Like Tech Toolbelt) */}
        <div
          className="showcase-content-panel"
          id={`discipline-panel-${currentDiscipline.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${currentDiscipline.id}`}
          style={{ '--panel-accent': currentDiscipline.accentTone } as React.CSSProperties}
        >
          {/* Discipline Header & Meta */}
          <div className="panel-meta-row">
            <span className="panel-chapter-tag">DISCIPLINE {currentDiscipline.number} / 06</span>
            <span className="panel-tag-badge">{currentDiscipline.tag}</span>
          </div>

          <h3 className="panel-quality-title">{currentDiscipline.quality}</h3>
          <p className="panel-headline-stmt">{currentDiscipline.headline}</p>
          <p className="panel-explanation-text">{currentDiscipline.explanation}</p>

          {/* Verified Technical Capabilities (Skill Chips) */}
          <div className="panel-skills-group">
            <div className="skills-group-header">
              <span className="group-header-label">VERIFIED TECHNICAL CAPABILITIES</span>
              <span className="group-header-count">{currentDiscipline.skills.length} SKILLS</span>
            </div>
            <div className="panel-skills-chips">
              {currentDiscipline.skills.map((skill) => (
                <div key={skill} className="panel-skill-pill">
                  <span className="skill-dot" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Demonstrated Project Evidence */}
          <div className="panel-evidence-group">
            <div className="evidence-group-header">
              <span className="group-header-label">DEMONSTRATED IN VYRA PROJECTS</span>
              <span className="group-header-count">{currentDiscipline.projects.length} CASE STUDIES</span>
            </div>

            <div className="panel-projects-list">
              {currentDiscipline.projects.map((proj) => (
                <div key={proj.id} className="panel-project-item">
                  <div className="project-item-header">
                    <span className="project-item-category">{proj.category}</span>
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-repo-icon-btn"
                      title={`View ${proj.name} on GitHub`}
                      aria-label={`View ${proj.name} repository on GitHub`}
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>

                  <h4 className="project-item-title">{proj.name}</h4>
                  <p className="project-item-impact">{proj.impact}</p>

                  <div className="project-item-actions">
                    <button
                      type="button"
                      className="project-inspect-btn"
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
                      className="project-source-link"
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
