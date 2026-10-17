import React, { useRef, useState, useCallback, type ElementType } from 'react'
import { ArrowUpRight, ArrowRight, ExternalLink } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export interface ProjectData {
  id: string
  number: string
  category: string
  title: string
  description: string
  stack: string[]
  href: string
  icon: ElementType
  tone: string
  featured: string
}

interface InteractiveProjectCardProps {
  project: ProjectData
  onInspect: (projectId: string) => void
  isActive?: boolean
}

export function InteractiveProjectCard({
  project,
  onInspect,
  isActive = false,
}: InteractiveProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [tilt, setTilt] = useState<{ rotateX: number; rotateY: number }>({ rotateX: 0, rotateY: 0 })
  const [spotlight, setSpotlight] = useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (!prefersReducedMotion) {
      // Calculate normalized position between -1 and 1
      const normX = (x / rect.width) * 2 - 1
      const normY = (y / rect.height) * 2 - 1

      // Subtly tilt card (max 5 degrees)
      setTilt({
        rotateX: -normY * 5,
        rotateY: normX * 5,
      })
    }

    setSpotlight({ x, y, opacity: 1 })
  }, [prefersReducedMotion])

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 })
    setSpotlight((prev) => ({ ...prev, opacity: 0 }))
  }, [])

  const ProjectIcon = project.icon

  return (
    <article
      ref={cardRef}
      className={`project-card tone-${project.tone} interactive-tilt-card ${isActive ? 'card-active' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: 'transform 0.15s ease-out, border-color 0.25s',
      }}
    >
      {/* Dynamic Cursor Spotlight Overlay */}
      <div
        className="card-spotlight-overlay"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(circle 280px at ${spotlight.x}px ${spotlight.y}px, color-mix(in srgb, var(--tone, var(--acid)) 16%, transparent), transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <div className="project-card-top">
        <span className="project-number">/{project.number}</span>
        <a
          className="project-open"
          href={project.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${project.title} repository on GitHub in a new tab`}
          data-cursor="click"
        >
          <ArrowUpRight size={17} />
        </a>
      </div>

      <div className="project-visual">
        <div className="visual-grid" />
        <div className="visual-orbit visual-orbit-a" />
        <div className="visual-orbit visual-orbit-b" />
        <div className="visual-icon">
          <ProjectIcon size={29} strokeWidth={1.5} />
        </div>
        <span className="visual-code">{project.featured}</span>
        <span className="visual-index">{project.number} / 06</span>
      </div>

      <div className="project-body">
        <p className="project-category">{project.category}</p>
        <h3>{project.title}</h3>
        <p className="project-description">{project.description}</p>
        
        <div className="project-tags">
          {project.stack.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>

        {/* Action Row: Inspect case study + Direct repository link */}
        <div className="project-actions-row">
          <button
            id={`inspect-btn-${project.id}`}
            type="button"
            className="project-inspect-btn"
            onClick={(e) => {
              e.stopPropagation()
              onInspect(project.id)
            }}
            aria-haspopup="dialog"
            aria-expanded={isActive}
            aria-label={`Inspect ${project.title} case study`}
            data-cursor="inspect"
          >
            <span>Inspect case study</span>
            <ArrowRight size={14} className="inspect-btn-arrow" />
          </button>

          <a
            className="project-repo-link"
            href={project.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.title} repository on GitHub in a new tab`}
            data-cursor="click"
          >
            <span>Repository</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </article>
  )
}

export default InteractiveProjectCard
