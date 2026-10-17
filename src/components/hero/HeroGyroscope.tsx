import React, { useState, Suspense } from 'react'
import { useWebGLSupport } from '../../hooks/useWebGLSupport'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { StrategicFallback } from './StrategicFallback'

// Lazy-load the 3D Strategic Chess Canvas so initial bundle load remains ultra-fast
const StrategicChessCanvas = React.lazy(() => import('./StrategicChessCanvas'))

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ThreeErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('[VYRA Strategic 3D] Falling back to 2D Graphic due to render error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

export function HeroGyroscope() {
  const { supported: webglSupported } = useWebGLSupport()
  const prefersReducedMotion = useReducedMotion()

  const [contextError, setContextError] = useState<string | null>(null)
  const [manualMode, setManualMode] = useState<'auto' | '2d' | '3d'>('auto')

  // Determine whether to show 3D or 2D fallback
  const shouldUseFallback =
    manualMode === '2d' ||
    (Boolean(contextError) && manualMode !== '3d') ||
    (!webglSupported && manualMode !== '3d') ||
    (prefersReducedMotion && manualMode !== '3d')

  const fallbackReason = manualMode === '2d'
    ? 'Manual 2D mode selected'
    : contextError
    ? contextError
    : !webglSupported
    ? 'WebGL 1/2 not supported on this browser'
    : prefersReducedMotion
    ? 'prefers-reduced-motion active'
    : undefined

  return (
    <div className="hero-gyroscope-wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Visual Engine Mode Switcher in top right of the unboxed spatial hero */}
      <div
        className="engine-toggle-hud"
        style={{
          position: 'absolute',
          top: '10px',
          right: '8px',
          zIndex: 6,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--mono)',
          fontSize: '8px',
          letterSpacing: '0.1em',
        }}
      >
        <button
          type="button"
          onClick={() => {
            setContextError(null)
            setManualMode((m) => (m === '2d' ? '3d' : '2d'))
          }}
          style={{
            background: 'rgba(17, 19, 17, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(240, 243, 231, 0.16)',
            color: shouldUseFallback ? '#a0a39a' : 'var(--acid)',
            padding: '3px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '8px',
            fontFamily: 'var(--mono)',
            transition: 'all 0.2s',
          }}
          title="Click to toggle between real-time 3D and 2D strategic graphic"
          aria-label={`Current visual engine: ${shouldUseFallback ? '2D Fallback' : '3D WebGL'}. Click to toggle.`}
        >
          {shouldUseFallback ? 'MODE: 2D FALLBACK' : 'MODE: 3D WEBGL'} ⟳
        </button>
      </div>

      {shouldUseFallback ? (
        <StrategicFallback reason={fallbackReason} />
      ) : (
        <ThreeErrorBoundary fallback={<StrategicFallback reason="Runtime 3D boundary caught error" />}>
          <Suspense fallback={<StrategicFallback reason="Loading 3D scene" />}>
            <StrategicChessCanvas
              reducedMotion={prefersReducedMotion}
              onContextLoss={(reason) => {
                console.warn('[VYRA Strategic 3D] Context loss triggered:', reason)
                setContextError(reason)
              }}
            />
          </Suspense>
        </ThreeErrorBoundary>
      )}
    </div>
  )
}

export default HeroGyroscope
