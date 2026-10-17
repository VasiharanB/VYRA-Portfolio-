import React, { useState, Suspense } from 'react'
import { useWebGLSupport } from '../../hooks/useWebGLSupport'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { OrbitalFallback } from './OrbitalFallback'

// Lazy-load the heavy 3D canvas so initial bundle execution is lightweight
const GyroscopeCanvas = React.lazy(() => import('./GyroscopeCanvas'))

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
    console.warn('[VYRA 3D Engine] Falling back to 2D Orbital Graphic due to render error:', error, errorInfo)
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
  // Allow manual toggle for auditing and comparison
  const [manualMode, setManualMode] = useState<'auto' | '2d' | '3d'>('auto')

  // Determine whether to show 3D or 2D fallback
  const shouldUseFallback =
    manualMode === '2d' ||
    Boolean(contextError) ||
    !webglSupported ||
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
      {/* Engine Switcher / Mode indicator integrated into top-right of the unboxed spatial area */}
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
          onClick={() => setManualMode((m) => (m === '2d' ? '3d' : '2d'))}
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
          title="Click to toggle between real-time 3D and 2D fallback"
          aria-label={`Current visual engine: ${shouldUseFallback ? '2D Fallback' : '3D WebGL'}. Click to toggle.`}
        >
          {shouldUseFallback ? 'MODE: 2D FALLBACK' : 'MODE: 3D WEBGL'} ⟳
        </button>
      </div>

      {shouldUseFallback ? (
        <OrbitalFallback reason={fallbackReason} />
      ) : (
        <ThreeErrorBoundary fallback={<OrbitalFallback reason="Runtime 3D boundary caught error" />}>
          <Suspense fallback={<OrbitalFallback reason="Loading 3D scene" />}>
            <GyroscopeCanvas
              reducedMotion={prefersReducedMotion}
              onContextLoss={(reason) => {
                console.warn('[VYRA 3D Engine] Context loss triggered:', reason)
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
