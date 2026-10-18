import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useTheme } from '../../context/ThemeContext'

const Cinematic3DIntro = lazy(() => import('./Cinematic3DIntro'))

interface LoadingIntroProps {
  onComplete: () => void
}

export function LoadingIntro({ onComplete }: LoadingIntroProps) {
  const prefersReducedMotion = useReducedMotion()
  const { isDark } = useTheme()
  const [stepText, setStepText] = useState('SYS // INITIATING DIGITAL MATRIX · ALIGNING BOARD')
  const [statusText, setStatusText] = useState('[INITIALIZING]')
  const [progressRatio, setProgressRatio] = useState(0)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleFinish = useCallback(() => {
    if (hasCompleted) return
    setHasCompleted(true)
    setIsFadingOut(true)

    try {
      sessionStorage.setItem('vyra_intro_seen', 'true')
    } catch {
      // Ignore storage errors in restricted/incognito environments
    }

    finishTimerRef.current = setTimeout(() => {
      onComplete()
    }, 450)
  }, [hasCompleted, onComplete])

  const handleProgress = useCallback((ratio: number, step: string, status: string) => {
    setProgressRatio(ratio)
    setStepText(step)
    setStatusText(status)
  }, [])

  useEffect(() => {
    // If reduced motion is preferred or already seen in this session, skip immediately
    if (prefersReducedMotion) {
      onComplete()
      return
    }

    try {
      if (sessionStorage.getItem('vyra_intro_seen') === 'true') {
        onComplete()
        return
      }
    } catch {
      // Continue if session storage is unavailable
    }

    // Safety timeout: Ensure the intro never hangs indefinitely under any graphics condition
    const maxSafetyTimeout = setTimeout(() => {
      handleFinish()
    }, 3200)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        handleFinish()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(maxSafetyTimeout)
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [prefersReducedMotion, handleFinish, onComplete])

  return (
    <div
      className={`vyra-loading-intro ${isFadingOut ? 'fade-out' : ''} ${isDark ? 'intro-obsidian' : 'intro-ivory'}`}
      role="status"
      aria-live="polite"
      aria-label="VYRA Systems coming into position opening sequence"
    >
      <div className="intro-backdrop" />
      <div className="intro-grid-pattern" />

      {/* Core Real-Time 3D Cinematic Canvas (Code-Split) */}
      <Suspense fallback={null}>
        <Cinematic3DIntro
          onProgress={handleProgress}
          onReady={() => {}}
          onComplete={handleFinish}
        />
      </Suspense>

      {/* Top Telemetry Header */}
      <div className="intro-topbar">
        <div className="intro-tag">
          <span className="intro-pulse" />
          <span>VYRA // SPATIAL MATRIX</span>
        </div>
        <button
          type="button"
          className="intro-skip-button"
          onClick={handleFinish}
          aria-label="Skip initialization intro"
        >
          SKIP INTRO [ESC]
        </button>
      </div>

      {/* Central Identity & Telemetry Overlay (floating over 3D stage) */}
      <div className="intro-center">
        <div className="intro-brand-title">
          <strong>VYRA<span>.</span></strong>
          <p className="intro-author">VASIHARAN B.</p>
          <small>FULL-STACK DEVELOPER · FREELANCE BUILDER</small>
        </div>

        {/* Real-time Telemetry Status Text Synchronized with 3D Action */}
        <div className="intro-telemetry-readout">
          <p className="intro-step-text">{stepText}</p>
          <div className="intro-progress-bar-wrap">
            <div
              className="intro-progress-bar-fill"
              style={{ width: `${Math.round(progressRatio * 100)}%` }}
            />
          </div>
          <div className="intro-coords-foot">
            <span>LAT 13° 00' N · CHENNAI</span>
            <span style={{ color: 'var(--acid)', fontWeight: 600 }}>{statusText}</span>
            <span>LON 80° 14' E</span>
          </div>
        </div>
      </div>

      {/* Bottom Technical Stamp */}
      <div className="intro-bottombar">
        <span>VASIHARAN B. // SYSTEMS COMING INTO POSITION</span>
        <span>STANDBY · INITIALIZING PORTFOLIO...</span>
      </div>
    </div>
  )
}

export default LoadingIntro
