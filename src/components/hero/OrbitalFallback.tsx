import React from 'react'

export interface OrbitalFallbackProps {
  reason?: string
}

export function OrbitalFallback({ reason }: OrbitalFallbackProps) {
  return (
    <div className="orbital-stage" aria-hidden="true" data-fallback-reason={reason}>
      <div className="orbital-grid" />
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="orbit orbit-three" />
      <div className="orbit-core">
        <span className="core-letter">V</span>
        <span className="core-spark">✳</span>
      </div>
      <div className="orbit-node node-one" />
      <div className="orbit-node node-two" />
      <div className="orbit-node node-three" />
      <div className="orbit-label label-one">IDEA → BUILD</div>
      <div className="orbit-label label-two">HUMAN FIRST</div>
    </div>
  )
}

export default OrbitalFallback
