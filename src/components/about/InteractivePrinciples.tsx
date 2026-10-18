import { useState } from 'react'
import { ArrowUpRight, Check, ChevronDown, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react'
import { ENGINEERING_PRINCIPLES, type EngineeringPrinciple } from '../../data/skillsData'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface InteractivePrinciplesProps {
  onInspectCaseStudy: (projectId: string) => void
  projectsMap: Record<string, { href: string; title: string }>
}

export function InteractivePrinciples({ onInspectCaseStudy, projectsMap }: InteractivePrinciplesProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)
  const prefersReducedMotion = useReducedMotion()

  const togglePrinciple = (index: number) => {
    setExpandedIndex((current) => (current === index ? null : index))
  }

  return (
    <div className="principles-interactive" role="region" aria-label="Engineering principles and practical implementations">
      <div className="principles-list">
        {ENGINEERING_PRINCIPLES.map((principle, index) => {
          const isExpanded = expandedIndex === index
          const panelId = `principle-panel-${principle.number}`
          const headerId = `principle-header-${principle.number}`

          return (
            <article
              key={principle.number}
              className={`principle-item ${isExpanded ? 'principle-expanded' : ''}`}
            >
              <button
                type="button"
                id={headerId}
                className="principle-trigger"
                onClick={() => togglePrinciple(index)}
                aria-expanded={isExpanded}
                aria-controls={panelId}
              >
                <span className="principle-number">{principle.number}</span>
                <div className="principle-headline-wrap">
                  <h3 className="principle-title">{principle.title}</h3>
                  <p className="principle-summary">{principle.summary}</p>
                </div>
                <div className="principle-toggle-icon" aria-hidden="true">
                  <ChevronDown
                    size={18}
                    className={`toggle-chevron ${isExpanded ? 'chevron-rotated' : ''}`}
                  />
                </div>
              </button>

              {isExpanded && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  className="principle-panel-body"
                >
                  {/* Detailed Engineering Philosophy */}
                  <div className="principle-rationale-box">
                    <span className="rationale-label">
                      <ShieldCheck size={13} /> ENGINEERING PERSPECTIVE
                    </span>
                    <p className="rationale-text">{principle.rationale}</p>
                  </div>

                  {/* Concrete Real Project Connections */}
                  <div className="principle-implementations-wrap">
                    <div className="implementations-heading">
                      <span>VERIFIED APPLICATION IN VYRA PROJECTS</span>
                    </div>

                    <div className="implementations-grid">
                      {principle.implementations.map((impl) => {
                        const projectMeta = projectsMap[impl.projectId]
                        const repoHref = projectMeta?.href || 'https://github.com/VasiharanB'

                        return (
                          <div
                            key={impl.projectId}
                            className={`implementation-card tone-${impl.tone}`}
                          >
                            <div className="impl-card-top">
                              <span className="impl-project-badge">
                                /{impl.projectNumber} {impl.projectTitle}
                              </span>
                              <span className="impl-tone-dot" />
                            </div>

                            <h4 className="impl-takeaway-title">{impl.takeawayTitle}</h4>
                            <p className="impl-takeaway-detail">{impl.takeawayDetail}</p>

                            <div className="impl-actions-row">
                              <button
                                type="button"
                                className="impl-inspect-btn"
                                onClick={() => onInspectCaseStudy(impl.projectId)}
                                aria-label={`Inspect ${impl.projectTitle} case study`}
                              >
                                <span>Inspect case study</span>
                                <ArrowRight size={13} />
                              </button>

                              <a
                                href={repoHref}
                                target="_blank"
                                rel="noreferrer"
                                className="impl-repo-link"
                                aria-label={`Open ${impl.projectTitle} repository on GitHub in a new tab`}
                              >
                                <span>Repository</span>
                                <ExternalLink size={12} />
                              </a>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>

      <div className="principle-foot">
        <Check size={15} /> PRACTICAL ENGINEERING. CONTINUOUS DISCIPLINE.
      </div>
    </div>
  )
}

export default InteractivePrinciples
