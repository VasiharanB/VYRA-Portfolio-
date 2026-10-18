import React, { useCallback } from 'react'
import {
  ArrowRight, ArrowUpRight, Check, ExternalLink,
  Layers, RotateCcw, Sparkles, X, ArrowDown
} from 'lucide-react'
import {
  SKILL_DOMAINS,
  ADDITIONAL_TOOLBELT,
  TECH_TO_PROJECTS,
  type SkillDomain
} from '../../data/skillsData'
import type { ProjectData } from '../work/InteractiveProjectCard'

interface InteractiveTechToolbeltProps {
  selectedTech: string | null
  hoveredTech: string | null
  onSelectTech: (tech: string | null) => void
  onHoverTech: (tech: string | null) => void
  onInspectCaseStudy: (projectId: string) => void
  projects: ProjectData[]
}

export function InteractiveTechToolbelt({
  selectedTech,
  hoveredTech,
  onSelectTech,
  onHoverTech,
  onInspectCaseStudy,
  projects,
}: InteractiveTechToolbeltProps) {
  const activeTech = selectedTech || hoveredTech
  const matchingProjectIds = activeTech ? (TECH_TO_PROJECTS[activeTech] || []) : []
  const matchingProjects = projects.filter((p) => matchingProjectIds.includes(p.id))

  const handleTechClick = useCallback((tech: string) => {
    if (selectedTech === tech) {
      onSelectTech(null)
    } else {
      onSelectTech(tech)
    }
  }, [selectedTech, onSelectTech])

  const handleClearSelection = useCallback(() => {
    onSelectTech(null)
    onHoverTech(null)
  }, [onSelectTech, onHoverTech])

  const handleScrollToWork = useCallback(() => {
    const el = document.getElementById('work')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <div className="interactive-toolbelt-wrapper">
      {/* 3 Main Engineering Domains */}
      <div className="skill-grid" role="group" aria-label="Interactive skill domains">
        {SKILL_DOMAINS.map((group) => {
          const GroupIcon = group.icon

          return (
            <article className="skill-card" key={group.label}>
              <div className="skill-card-top">
                <span className="skill-icon" aria-hidden="true">
                  <GroupIcon size={20} strokeWidth={1.6} />
                </span>
                <span className="skill-label">{group.label}</span>
              </div>

              <h3>{group.title}</h3>

              <div className="skill-chips" role="toolbar" aria-label={`${group.title} technologies`}>
                {group.items.map((tech) => {
                  const projectCount = TECH_TO_PROJECTS[tech]?.length || 0
                  const isSelected = selectedTech === tech
                  const isActive = activeTech === tech

                  return (
                    <button
                      key={tech}
                      type="button"
                      className={`skill-pill-btn ${isSelected ? 'pill-selected' : ''} ${isActive ? 'pill-active' : ''}`}
                      onClick={() => handleTechClick(tech)}
                      onMouseEnter={() => onHoverTech(tech)}
                      onMouseLeave={() => onHoverTech(null)}
                      onFocus={() => onHoverTech(tech)}
                      onBlur={() => onHoverTech(null)}
                      aria-pressed={isSelected}
                      aria-label={`${tech}: used in ${projectCount} verified project${projectCount === 1 ? '' : 's'}`}
                      data-cursor="click"
                    >
                      <span className="pill-name">{tech}</span>
                      {projectCount > 0 && (
                        <span className="pill-badge" aria-hidden="true">
                          {projectCount}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </article>
          )
        })}
      </div>

      {/* Additional Technologies / Foundational Engineering Toolbelt */}
      <div className="toolbelt">
        <span className="toolbelt-label">ADDITIONAL TECHNOLOGIES</span>
        <div className="toolbelt-list" role="toolbar" aria-label="Additional technologies and coursework">
          {ADDITIONAL_TOOLBELT.map((item) => {
            const projectCount = TECH_TO_PROJECTS[item.name]?.length || 0
            const hasProjects = projectCount > 0
            const isSelected = selectedTech === item.name
            const isActive = activeTech === item.name

            if (hasProjects) {
              return (
                <button
                  key={item.name}
                  type="button"
                  className={`toolbelt-pill-btn ${isSelected ? 'pill-selected' : ''} ${isActive ? 'pill-active' : ''}`}
                  onClick={() => handleTechClick(item.name)}
                  onMouseEnter={() => onHoverTech(item.name)}
                  onMouseLeave={() => onHoverTech(null)}
                  onFocus={() => onHoverTech(item.name)}
                  onBlur={() => onHoverTech(null)}
                  aria-pressed={isSelected}
                  aria-label={`${item.name}: used in ${projectCount} verified project${projectCount === 1 ? '' : 's'}`}
                >
                  <span className="toolbelt-arrow" aria-hidden="true">↳</span>
                  <span className="toolbelt-name">{item.name}</span>
                  <span className="toolbelt-count" aria-hidden="true">({projectCount})</span>
                </button>
              )
            }

            return (
              <span
                key={item.name}
                className="toolbelt-static-tag"
                title={item.note || 'Foundational coursework & engineering workflow'}
              >
                <span className="toolbelt-arrow" aria-hidden="true">↳</span>
                <span>{item.name}</span>
              </span>
            )
          })}
        </div>
      </div>

      {/* Interactive Connected Projects Preview Bar */}
      <div
        className={`stack-connected-strip ${activeTech ? 'strip-active' : 'strip-idle'}`}
        aria-live="polite"
      >
        {activeTech ? (
          <div className="strip-content">
            <div className="strip-header">
              <div className="strip-meta">
                <span className="strip-status-dot" />
                <span className="strip-label">FILTER ACTIVE:</span>
                <strong className="strip-tech-name">{activeTech}</strong>
                <span className="strip-count-tag">
                  {matchingProjects.length > 0
                    ? `${matchingProjects.length} VERIFIED PROJECT${matchingProjects.length === 1 ? '' : 'S'}`
                    : 'FOUNDATIONAL COMPETENCY'}
                </span>
              </div>

              <div className="strip-actions">
                {matchingProjects.length > 0 && (
                  <button
                    type="button"
                    className="strip-scroll-btn"
                    onClick={handleScrollToWork}
                    title="View highlighted cards in Selected Work section"
                  >
                    <span>View in Work grid</span>
                    <ArrowDown size={13} />
                  </button>
                )}

                {selectedTech && (
                  <button
                    type="button"
                    className="strip-clear-btn"
                    onClick={handleClearSelection}
                    aria-label="Clear active technology filter"
                  >
                    <X size={13} />
                    <span>Clear filter</span>
                  </button>
                )}
              </div>
            </div>

            {matchingProjects.length > 0 ? (
              <div className="strip-projects-row">
                {matchingProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`strip-project-card tone-${project.tone}`}
                  >
                    <div className="strip-card-info">
                      <span className="strip-card-num">/{project.number}</span>
                      <span className="strip-card-title">{project.title}</span>
                      <span className="strip-card-cat">{project.category}</span>
                    </div>

                    <div className="strip-card-btns">
                      <button
                        type="button"
                        className="strip-card-inspect-btn"
                        onClick={() => onInspectCaseStudy(project.id)}
                        aria-label={`Inspect ${project.title} case study`}
                      >
                        <span>Case study</span>
                        <ArrowRight size={12} />
                      </button>

                      <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        className="strip-card-repo-btn"
                        aria-label={`Open ${project.title} repository in a new tab`}
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="strip-empty-note">
                {activeTech} is part of Vasiharan’s core engineering coursework and developer workflows (hardware logic, embedded systems, or API debugging).
              </p>
            )}
          </div>
        ) : (
          <div className="strip-idle-hint">
            <span className="idle-indicator">✳</span>
            <span>
              Select or hover any technology above to highlight verified projects that implement it.
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default InteractiveTechToolbelt
