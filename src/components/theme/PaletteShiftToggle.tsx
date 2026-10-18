import React from 'react'
import { useTheme } from '../../context/ThemeContext'

interface PaletteShiftToggleProps {
  className?: string
  id?: string
  compact?: boolean
}

export function PaletteShiftToggle({
  className = '',
  id = 'vyra-palette-shift-toggle',
  compact = false,
}: PaletteShiftToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme()

  const nextThemeLabel = isDark ? 'Ivory' : 'Obsidian'
  const currentLabel = isDark ? 'OBSIDIAN' : 'IVORY'
  const accessibleName = `Switch to ${nextThemeLabel} theme (currently ${currentLabel})`

  return (
    <button
      type="button"
      id={id}
      className={`palette-shift-btn ${isDark ? 'theme-obsidian' : 'theme-ivory'} ${compact ? 'is-compact' : ''} ${className}`}
      onClick={toggleTheme}
      aria-label={accessibleName}
      title={accessibleName}
      data-cursor="click"
    >
      {/* 2x2 Chessboard Geometry Glyph */}
      <div className="chessboard-glyph" aria-hidden="true">
        <span className="glyph-tile tile-tl" />
        <span className="glyph-tile tile-tr" />
        <span className="glyph-tile tile-bl" />
        <span className="glyph-tile tile-br" />
      </div>

      {/* Palette Label */}
      <span className="palette-label">
        <span className="palette-label-text">{currentLabel}</span>
      </span>

      {/* Subtle indicator pip */}
      <span className="palette-pip" aria-hidden="true" />
    </button>
  )
}

export default PaletteShiftToggle
