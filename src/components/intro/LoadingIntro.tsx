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
  const [stepText, setStepText] = useState('SYS // THE CHESSBOARD AWAKENS · ASSEMBLING SPATIAL GRID')
  const [statusText, setStatusText] = useState('[INITIALIZING]')
  const [progressRatio, setProgressRatio] = useState(0)
  const [isFadingOut, setIsFadingOut] = useState(false)

  // Stable refs to guarantee idempotent, single-fire completion
  const isCompletedRef = useRef(false)
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const handleFinish = useCallback(() => {
    if (isCompletedRef.current) return
    isCompletedRef.current = true
    setIsFadingOut(true)

    try {
      sessionStorage.setItem('vyra_intro_seen', 'true')
    } catch {
      // Ignore storage errors in restricted/incognito environments
    }

    finishTimerRef.current = setTimeout(() => {
      onCompleteRef.current()
    }, 450)
  }, [])

  const handleProgress = useCallback((ratio: number, step: string, status: string) => {
    setProgressRatio(ratio)
    setStepText(step)
    setStatusText(status)
  }, [])

  useEffect(() => {
    // If reduced motion is preferred, finish immediately
    if (prefersReducedMotion) {
      onCompleteRef.current()
      return
    }

    // If already seen in this browser session, skip immediately
    try {
      if (sessionStorage.getItem('vyra_intro_seen') === 'true') {
        onCompleteRef.current()
        return
      }
    } catch {
      // Continue if session storage is unavailable
    }

    // Hard safety timeout: Ensure the intro never hangs indefinitely under any graphics condition (4.8s max)
    const safetyTimer = setTimeout(() => {
      handleFinish()
    }, 4800)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        handleFinish()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(safetyTimer)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [prefersReducedMotion, handleFinish])

  // Cleanup finish timer on actual unmount
  useEffect(() => {
    return () => {
      if (finishTimerRef.current) {
        clearTimeout(finishTimerRef.current)
      }
    }
  }, [])

  return (
    <div
      className={`vyra-loading-intro ${isFadingOut ? 'fade-out' : ''} ${isDark ? 'intro-obsidian' : 'intro-ivory'}`}
      role="status"
      aria-live="polite"
      aria-label="VYRA Systems coming into position opening sequence"
    >
      <div className="intro-backdrop" />
      <div className="intro-grid-pattern" />

      {/* Core Real-Time 3D Cinematic Canvas (Code-Split with Deliberate Fallback) */}
      <Suspense
        fallback={
          <div className="intro-3d-fallback" aria-hidden="true">
            <div className="intro-fallback-board-pulse" />
          </div>
        }
      >
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
            <span className="intro-status-badge">{statusText}</span>
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
