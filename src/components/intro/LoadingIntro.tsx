import React, { useState, useEffect, useCallback } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface LoadingIntroProps {
  onComplete: () => void
}

const TELEMETRY_STEPS = [
  'SYS // BOOT SEQUENCE INITIATED',
  'CORE // CALIBRATING 3D SPATIAL REACTOR',
  'TELEMETRY // SYNCING SATELLITE NODES',
  'INTERFACE // READY · CHENNAI [13°00\'N 80°14\'E]',
]

export function LoadingIntro({ onComplete }: LoadingIntroProps) {
  const prefersReducedMotion = useReducedMotion()
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isFadingOut, setIsFadingOut] = useState(false)

  const handleFinish = useCallback(() => {
    setIsFadingOut(true)
    try {
      sessionStorage.setItem('vyra_intro_seen', 'true')
    } catch {
      // Ignore storage errors in incognito/restricted environments
    }
    setTimeout(() => {
      onComplete()
    }, 600)
  }, [onComplete])

  useEffect(() => {
    // If reduced motion is requested or already seen in this session, skip immediately
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
      // Continue with intro if storage is restricted
    }

    // Step animation sequence over 1.8 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2.5
        if (next >= 100) {
          clearInterval(interval)
          handleFinish()
          return 100
        }
        // Update telemetry status based on progress thresholds
        if (next > 75) setStepIndex(3)
        else if (next > 48) setStepIndex(2)
        else if (next > 22) setStepIndex(1)
        return next
      })
    }, 45)

    // Keyboard listener for Escape key to skip intro
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        clearInterval(interval)
        handleFinish()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearInterval(interval)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [prefersReducedMotion, handleFinish, onComplete])

  return (
    <div
      className={`vyra-loading-intro ${isFadingOut ? 'fade-out' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="VYRA Laboratory initialization sequence"
    >
      <div className="intro-backdrop" />
      <div className="intro-grid-pattern" />

      {/* Top Telemetry Header */}
      <div className="intro-topbar">
        <div className="intro-tag">
          <span className="intro-pulse" />
          <span>VYRA LABS // OS v2.4</span>
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

      {/* Central Kinetic Assembly Stage */}
      <div className="intro-center">
        <div className="intro-monogram-stage">
          {/* Animated SVG drawing the iconic skewed V */}
          <svg
            className="intro-monogram-svg"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Background guide lines */}
            <circle cx="50" cy="50" r="44" stroke="rgba(240, 243, 231, 0.08)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="32" stroke="rgba(185, 243, 106, 0.15)" strokeWidth="1" />
            
            {/* The Stylized Skewed V path */}
            <path
              d="M26 28 L47 76 L74 28"
              stroke="var(--acid)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="intro-v-path"
              style={{
                strokeDasharray: 140,
                strokeDashoffset: Math.max(0, 140 - (progress / 100) * 140),
              }}
            />

            {/* Central accent spark */}
            {progress > 60 && (
              <circle cx="50" cy="50" r="3" fill="var(--acid)" className="intro-spark" />
            )}
          </svg>

          {/* Core glow aura */}
          <div className="intro-glow-aura" />
        </div>

        <div className="intro-brand-title">
          <strong>VYRA<span>.</span></strong>
          <small>DIGITAL ENGINEERING LABORATORY</small>
        </div>

        {/* Real-time Telemetry Status Text */}
        <div className="intro-telemetry-readout">
          <p className="intro-step-text">{TELEMETRY_STEPS[stepIndex]}</p>
          <div className="intro-progress-bar-wrap">
            <div
              className="intro-progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="intro-coords-foot">
            <span>LAT 13° 00' N</span>
            <span>[{Math.round(progress)}%]</span>
            <span>LON 80° 14' E</span>
          </div>
        </div>
      </div>

      {/* Bottom Technical Stamp */}
      <div className="intro-bottombar">
        <span>VASIHARAN B // FULL-STACK DEVELOPER & SYSTEMS ENGINEER</span>
        <span>INITIALIZING SPATIAL CANVAS...</span>
      </div>
    </div>
  )
}

export default LoadingIntro
