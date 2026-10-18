import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  Search, X, ArrowRight, CornerDownLeft, Copy, Check,
  ExternalLink, Layers, BrainCircuit, Compass, Sparkles,
  Github, Linkedin, Mail, ArrowUpRight, ShieldCheck, AlertCircle
} from 'lucide-react'
import { PROJECTS } from '../../data/projectsData'
import { TECH_TO_PROJECTS } from '../../data/skillsData'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useTheme } from '../../context/ThemeContext'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onSelectProject: (projectId: string) => void
  onSelectTechnology: (tech: string) => void
  onNavigateSection: (sectionId: string) => void
  onReplayIntro: () => void
}

interface CommandItem {
  id: string
  group: 'projects' | 'technologies' | 'navigation' | 'actions'
  title: string
  subtitle?: string
  badge?: string
  tone?: string
  keywords?: string[]
  onSelect: () => void
  icon: React.ElementType
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectProject,
  onSelectTechnology,
  onNavigateSection,
  onReplayIntro,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [copyFeedback, setCopyFeedback] = useState<'idle' | 'copied' | 'failed'>('idle')
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const paletteRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { toggleTheme, isDark } = useTheme()

  const portfolioEmail = 'vasiharan030@gmail.com'

  const handleCopyEmail = useCallback(async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(portfolioEmail)
        setCopyFeedback('copied')
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = portfolioEmail
        textArea.style.position = 'fixed'
        textArea.style.left = '-9999px'
        textArea.style.top = '-9999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        if (successful) {
          setCopyFeedback('copied')
        } else {
          setCopyFeedback('failed')
        }
      }
    } catch {
      setCopyFeedback('failed')
    }

    setTimeout(() => {
      setCopyFeedback('idle')
    }, 2500)
  }, [portfolioEmail])

  // Build searchable items list
  const allItems = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = []

    // 1. Projects
    PROJECTS.forEach((project) => {
      items.push({
        id: `project-${project.id}`,
        group: 'projects',
        title: project.title,
        subtitle: project.description,
        badge: `/${project.number} · ${project.category}`,
        tone: project.tone,
        keywords: [project.title, project.category, ...project.stack, project.featured],
        icon: project.icon,
        onSelect: () => {
          onClose()
          onSelectProject(project.id)
        },
      })
    })

    // 2. Technologies
    Object.keys(TECH_TO_PROJECTS).forEach((tech) => {
      const projectIds = TECH_TO_PROJECTS[tech] || []
      const projectNames = PROJECTS.filter((p) => projectIds.includes(p.id)).map((p) => p.title)

      items.push({
        id: `tech-${tech.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        group: 'technologies',
        title: tech,
        subtitle: projectNames.length > 0
          ? `Verified in: ${projectNames.join(', ')}`
          : 'Foundational engineering competency & workflow tool',
        badge: projectNames.length > 0 ? `${projectNames.length} PROJECT${projectNames.length === 1 ? '' : 'S'}` : 'CORE TOOL',
        keywords: [tech, ...projectNames],
        icon: Layers,
        onSelect: () => {
          onClose()
          onSelectTechnology(tech)
        },
      })
    })

    // 3. Navigation Sections
    const sections = [
      { id: 'home', title: 'Home', subtitle: 'FIG. 01 — Strategic systems 3D chess hero', badge: '01' },
      { id: 'services', title: 'What I Can Build', subtitle: 'Freelance web apps, custom ERPs, real-time tools & AI retrieval', badge: '02' },
      { id: 'work', title: 'Selected Work', subtitle: 'Interactive engineering case studies & architecture diagrams', badge: '03' },
      { id: 'pieces', title: 'Chess Qualities', subtitle: 'The pieces behind my game — 6 engineering disciplines', badge: '04' },
      { id: 'stack', title: 'Tech Stack & Toolbelt', subtitle: 'Interactive technology filters & operational tooling', badge: '05' },
      { id: 'about', title: 'About & Principles', subtitle: 'Hardware-to-software perspective & 3 core principles', badge: '06' },
      { id: 'contact', title: 'Contact & Opportunities', subtitle: 'Communication channels & freelance project discussion', badge: '07' },
    ]

    sections.forEach((sec) => {
      items.push({
        id: `section-${sec.id}`,
        group: 'navigation',
        title: sec.title,
        subtitle: sec.subtitle,
        badge: sec.badge,
        keywords: [sec.title, sec.id, sec.subtitle],
        icon: Compass,
        onSelect: () => {
          onClose()
          onNavigateSection(sec.id)
        },
      })
    })

    // 4. Quick Actions
    items.push(
      {
        id: 'action-toggle-theme',
        group: 'actions',
        title: isDark ? 'Switch to Ivory Palette (Light Mode)' : 'Switch to Obsidian Palette (Dark Mode)',
        subtitle: isDark ? 'Warm ivory editorial surface with high-contrast typography' : 'Signature dark graphite with metallic chess pieces',
        badge: isDark ? 'IVORY' : 'OBSIDIAN',
        keywords: ['theme', 'palette', 'light', 'dark', 'mode', 'ivory', 'obsidian', 'color', 'shift'],
        icon: Sparkles,
        onSelect: () => {
          onClose()
          toggleTheme()
        },
      },
      {
        id: 'action-copy-email',
        group: 'actions',
        title: copyFeedback === 'copied' ? 'Email copied to clipboard!' : 'Copy Email Address',
        subtitle: portfolioEmail,
        badge: copyFeedback === 'copied' ? 'COPIED' : 'ACTION',
        keywords: ['email', 'copy', 'contact', 'vasiharan030@gmail.com', 'mail'],
        icon: copyFeedback === 'copied' ? Check : Copy,
        onSelect: () => {
          handleCopyEmail()
        },
      },
      {
        id: 'action-github',
        group: 'actions',
        title: 'Open GitHub Profile',
        subtitle: 'https://github.com/VasiharanB',
        badge: 'EXTERNAL',
        keywords: ['github', 'profile', 'repositories', 'code', 'vasiharanb'],
        icon: Github,
        onSelect: () => {
          onClose()
          window.open('https://github.com/VasiharanB', '_blank', 'noreferrer')
        },
      },
      {
        id: 'action-linkedin',
        group: 'actions',
        title: 'Connect on LinkedIn',
        subtitle: 'https://www.linkedin.com/in/vasiharan-b-ba0772322/',
        badge: 'EXTERNAL',
        keywords: ['linkedin', 'connect', 'social', 'profile'],
        icon: Linkedin,
        onSelect: () => {
          onClose()
          window.open('https://www.linkedin.com/in/vasiharan-b-ba0772322/', '_blank', 'noreferrer')
        },
      },
      {
        id: 'action-replay-intro',
        group: 'actions',
        title: 'Replay Initialization Sequence',
        subtitle: 'Re-trigger the startup telemetry and system check intro',
        badge: 'ACTION',
        keywords: ['replay', 'intro', 'initialize', 'loader', 'telemetry'],
        icon: Sparkles,
        onSelect: () => {
          onClose()
          onReplayIntro()
        },
      }
    )

    return items
  }, [onClose, onSelectProject, onSelectTechnology, onNavigateSection, onReplayIntro, handleCopyEmail, copyFeedback, portfolioEmail])

  // Filter items based on query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      // Default initial view: show projects, navigation, and primary actions
      return allItems.filter((item) => item.group === 'projects' || item.group === 'navigation' || item.id === 'action-copy-email')
    }

    return allItems.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q)
      const matchSubtitle = item.subtitle ? item.subtitle.toLowerCase().includes(q) : false
      const matchBadge = item.badge ? item.badge.toLowerCase().includes(q) : false
      const matchKeywords = item.keywords ? item.keywords.some((k) => k.toLowerCase().includes(q)) : false

      return matchTitle || matchSubtitle || matchBadge || matchKeywords
    })
  }, [allItems, query])

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Group filtered items
  const groupedResults = useMemo(() => {
    const groups: { [key: string]: CommandItem[] } = {
      projects: [],
      technologies: [],
      navigation: [],
      actions: [],
    }

    filteredItems.forEach((item) => {
      if (groups[item.group]) {
        groups[item.group].push(item)
      }
    })

    return groups
  }, [filteredItems])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (filteredItems.length === 0) return
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length)
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (filteredItems.length === 0) return
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].onSelect()
      }
      return
    }

    // Trap focus inside palette
    if (e.key === 'Tab') {
      const focusables = paletteRef.current?.querySelectorAll<HTMLElement>(
        'input, button, [tabindex]:not([tabindex="-1"])'
      )
      if (focusables && focusables.length > 0) {
        const first = focusables[0]
        const last = focusables[focusables.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
  }, [onClose, filteredItems, selectedIndex])

  // Auto-focus input on open and lock body scroll
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 30)

      return () => {
        document.body.style.overflow = originalOverflow
        clearTimeout(timer)
      }
    }
  }, [isOpen])

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector<HTMLElement>('[data-selected="true"]')
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  if (!isOpen) return null
  if (typeof document === 'undefined') return null

  // Map flat index to item
  let runningIndex = 0

  return createPortal(
    <div
      className="command-portal-root"
      role="none"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop scrim */}
      <div
        className="command-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Command Palette Dialog */}
      <div
        ref={paletteRef}
        className="command-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-palette-title"
      >
        {/* Header Search Bar */}
        <div className="command-search-bar">
          <Search size={18} className="search-icon" aria-hidden="true" />
          <h2 id="command-palette-title" className="sr-only">Portfolio Command Center</h2>
          <input
            ref={inputRef}
            type="text"
            className="command-search-input"
            placeholder="Search projects, technologies, or jump to section (e.g. FAISS, WebSockets, Work)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-autocomplete="list"
            aria-controls="command-results-list"
            aria-activedescendant={
              filteredItems[selectedIndex] ? filteredItems[selectedIndex].id : undefined
            }
          />
          {query.length > 0 && (
            <button
              type="button"
              className="command-clear-btn"
              onClick={() => setQuery('')}
              aria-label="Clear search query"
            >
              <X size={14} />
            </button>
          )}
          <button
            type="button"
            className="command-close-btn"
            onClick={onClose}
            aria-label="Close command palette"
            title="Close dialog (Escape)"
          >
            <span className="kbd-badge">ESC</span>
            <X size={15} />
          </button>
        </div>

        {/* Live Region for Screen Readers */}
        <div className="sr-only" aria-live="polite">
          {filteredItems.length} results available.
          {copyFeedback === 'copied' && ' Email address copied to clipboard.'}
          {copyFeedback === 'failed' && ' Could not copy to clipboard automatically.'}
        </div>

        {/* Copy Feedback Toast inside palette */}
        {copyFeedback !== 'idle' && (
          <div className={`command-feedback-banner feedback-${copyFeedback}`} role="status">
            {copyFeedback === 'copied' ? (
              <>
                <Check size={14} />
                <span>Email address (<strong>{portfolioEmail}</strong>) copied to clipboard!</span>
              </>
            ) : (
              <>
                <AlertCircle size={14} />
                <span>Clipboard access unavailable. Please reach me directly at <strong>{portfolioEmail}</strong></span>
              </>
            )}
          </div>
        )}

        {/* Scrollable Results List */}
        <div
          ref={listRef}
          id="command-results-list"
          className="command-results-list"
          role="listbox"
        >
          {filteredItems.length === 0 ? (
            <div className="command-empty-state">
              <Search size={24} className="empty-icon" />
              <p className="empty-title">No matches found for “{query}”</p>
              <p className="empty-sub">
                Try searching for a project (e.g. <em>Smart Issue Tracker</em>, <em>Cricket Conquest</em>), a stack item (e.g. <em>FAISS</em>, <em>WebSockets</em>, <em>Django</em>, <em>Tkinter</em>), or a page section (e.g. <em>Work</em>, <em>Contact</em>).
              </p>
            </div>
          ) : (
            <>
              {/* Group: Projects */}
              {groupedResults.projects.length > 0 && (
                <div className="command-group" role="group" aria-labelledby="group-heading-projects">
                  <div id="group-heading-projects" className="command-group-heading">
                    <span>PROJECTS & CASE STUDIES</span>
                    <span className="group-count">{groupedResults.projects.length}</span>
                  </div>
                  {groupedResults.projects.map((item) => {
                    const currentIndex = runningIndex++
                    const isSelected = selectedIndex === currentIndex
                    const ItemIcon = item.icon

                    return (
                      <div
                        key={item.id}
                        id={item.id}
                        role="option"
                        aria-selected={isSelected}
                        data-selected={isSelected}
                        className={`command-item tone-${item.tone || 'lime'} ${isSelected ? 'item-selected' : ''}`}
                        onClick={item.onSelect}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                      >
                        <div className="item-icon-col">
                          <ItemIcon size={16} />
                        </div>
                        <div className="item-content-col">
                          <div className="item-title-row">
                            <span className="item-title">{item.title}</span>
                            {item.badge && <span className="item-badge">{item.badge}</span>}
                          </div>
                          {item.subtitle && <p className="item-subtitle">{item.subtitle}</p>}
                        </div>
                        <div className="item-enter-hint">
                          <span>Inspect</span>
                          <CornerDownLeft size={11} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Group: Technologies */}
              {groupedResults.technologies.length > 0 && (
                <div className="command-group" role="group" aria-labelledby="group-heading-tech">
                  <div id="group-heading-tech" className="command-group-heading">
                    <span>TECHNOLOGY & VERIFIED STACK</span>
                    <span className="group-count">{groupedResults.technologies.length}</span>
                  </div>
                  {groupedResults.technologies.map((item) => {
                    const currentIndex = runningIndex++
                    const isSelected = selectedIndex === currentIndex
                    const ItemIcon = item.icon

                    return (
                      <div
                        key={item.id}
                        id={item.id}
                        role="option"
                        aria-selected={isSelected}
                        data-selected={isSelected}
                        className={`command-item ${isSelected ? 'item-selected' : ''}`}
                        onClick={item.onSelect}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                      >
                        <div className="item-icon-col">
                          <ItemIcon size={16} />
                        </div>
                        <div className="item-content-col">
                          <div className="item-title-row">
                            <span className="item-title">{item.title}</span>
                            {item.badge && <span className="item-badge">{item.badge}</span>}
                          </div>
                          {item.subtitle && <p className="item-subtitle">{item.subtitle}</p>}
                        </div>
                        <div className="item-enter-hint">
                          <span>Filter</span>
                          <CornerDownLeft size={11} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Group: Navigation */}
              {groupedResults.navigation.length > 0 && (
                <div className="command-group" role="group" aria-labelledby="group-heading-nav">
                  <div id="group-heading-nav" className="command-group-heading">
                    <span>SECTIONS & NAVIGATION</span>
                    <span className="group-count">{groupedResults.navigation.length}</span>
                  </div>
                  {groupedResults.navigation.map((item) => {
                    const currentIndex = runningIndex++
                    const isSelected = selectedIndex === currentIndex
                    const ItemIcon = item.icon

                    return (
                      <div
                        key={item.id}
                        id={item.id}
                        role="option"
                        aria-selected={isSelected}
                        data-selected={isSelected}
                        className={`command-item ${isSelected ? 'item-selected' : ''}`}
                        onClick={item.onSelect}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                      >
                        <div className="item-icon-col">
                          <ItemIcon size={16} />
                        </div>
                        <div className="item-content-col">
                          <div className="item-title-row">
                            <span className="item-title">{item.title}</span>
                            {item.badge && <span className="item-badge">SEC {item.badge}</span>}
                          </div>
                          {item.subtitle && <p className="item-subtitle">{item.subtitle}</p>}
                        </div>
                        <div className="item-enter-hint">
                          <span>Jump</span>
                          <CornerDownLeft size={11} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Group: Actions */}
              {groupedResults.actions.length > 0 && (
                <div className="command-group" role="group" aria-labelledby="group-heading-actions">
                  <div id="group-heading-actions" className="command-group-heading">
                    <span>QUICK ACTIONS</span>
                    <span className="group-count">{groupedResults.actions.length}</span>
                  </div>
                  {groupedResults.actions.map((item) => {
                    const currentIndex = runningIndex++
                    const isSelected = selectedIndex === currentIndex
                    const ItemIcon = item.icon

                    return (
                      <div
                        key={item.id}
                        id={item.id}
                        role="option"
                        aria-selected={isSelected}
                        data-selected={isSelected}
                        className={`command-item ${isSelected ? 'item-selected' : ''}`}
                        onClick={item.onSelect}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                      >
                        <div className="item-icon-col">
                          <ItemIcon size={16} />
                        </div>
                        <div className="item-content-col">
                          <div className="item-title-row">
                            <span className="item-title">{item.title}</span>
                            {item.badge && <span className="item-badge">{item.badge}</span>}
                          </div>
                          {item.subtitle && <p className="item-subtitle">{item.subtitle}</p>}
                        </div>
                        <div className="item-enter-hint">
                          <span>Execute</span>
                          <CornerDownLeft size={11} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Command Palette Footer */}
        <div className="command-footer">
          <div className="footer-shortcuts">
            <span className="shortcut-item">
              <kbd>↑</kbd> <kbd>↓</kbd> <span>Navigate</span>
            </span>
            <span className="shortcut-item">
              <kbd>↵</kbd> <span>Select</span>
            </span>
            <span className="shortcut-item">
              <kbd>ESC</kbd> <span>Close</span>
            </span>
          </div>
          <div className="footer-signature">
            <span>VYRA COMMAND CENTER · VASIHARAN B</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default CommandPalette
