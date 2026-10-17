import React from 'react'

export interface StrategicFallbackProps {
  reason?: string
}

export function StrategicFallback({ reason }: StrategicFallbackProps) {
  return (
    <div className="strategic-stage" aria-hidden="true" data-fallback-reason={reason}>
      {/* Background Circuit Grid */}
      <div className="strategic-grid" />

      {/* Isometric Vector Circuit Board Graphic */}
      <svg
        className="strategic-svg-graphic"
        viewBox="0 0 600 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="knightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e241c" />
            <stop offset="100%" stopColor="#0c0f0c" />
          </linearGradient>
          <radialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b9f36a" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#b9f36a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Back Glow */}
        <circle cx="300" cy="240" r="180" fill="url(#auraGlow)" />

        {/* Isometric Chessboard Isometric Grid Lines */}
        <g opacity="0.45" stroke="#262d22" strokeWidth="1">
          {/* Isometric Diamond Grid */}
          <path d="M300 280 L480 370 L300 460 L120 370 Z" fill="#0d100c" />
          <path d="M300 280 L390 325 L210 415 L120 370 Z" fill="#131712" />
          <path d="M390 325 L480 370 L300 460 L210 415 Z" fill="#181d16" />
          <path d="M210 325 L300 370 L390 325" fill="none" />
          <path d="M255 347 L345 392" fill="none" />
          <path d="M165 392 L345 302" fill="none" />
        </g>

        {/* Circuit Bus Lines & Intersection Vias */}
        <path d="M300 370 L210 415 L180 400" stroke="var(--acid)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
        <circle cx="180" cy="400" r="4" fill="var(--acid)" />
        <text x="110" y="420" fill="var(--acid)" fontFamily="var(--mono)" fontSize="9" letterSpacing="0.1em">01 // STRATEGY</text>

        <path d="M300 370 L390 415 L430 395" stroke="var(--acid)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
        <circle cx="430" cy="395" r="4" fill="var(--acid)" />
        <text x="410" y="420" fill="var(--acid)" fontFamily="var(--mono)" fontSize="9" letterSpacing="0.1em">02 // ARCHITECTURE</text>

        <path d="M300 370 L300 445 L350 470" stroke="var(--acid)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8" />
        <circle cx="350" cy="470" r="4" fill="var(--acid)" />
        <text x="320" y="490" fill="var(--acid)" fontFamily="var(--mono)" fontSize="9" letterSpacing="0.1em">03 // EXECUTION</text>

        {/* THE CHESS KNIGHT ICONIC SILHOUETTE */}
        <g transform="translate(300, 150) scale(1.1)">
          {/* Base Pedestal */}
          <path
            d="M-45 120 L45 120 L38 108 L-38 108 Z"
            fill="#16181b"
            stroke="rgba(240, 243, 231, 0.25)"
            strokeWidth="1"
          />
          <path
            d="M-34 108 L34 108 L28 92 L-28 92 Z"
            fill="#101214"
            stroke="rgba(240, 243, 231, 0.18)"
            strokeWidth="1"
          />
          <line x1="-30" y1="92" x2="30" y2="92" stroke="var(--acid)" strokeWidth="1.5" strokeOpacity="0.7" />

          {/* Horse Head & Neck Contour */}
          <path
            d="M-22 92
               C-35 65, -42 35, -34 5
               L-46 -15 L-36 -28 L-48 -50 L-32 -62
               L-24 -92 L-10 -72
               C12 -65, 30 -45, 45 -22
               C56 -8, 64 2, 65 14
               L52 22 L40 18
               C26 24, 16 38, 14 55
               C12 70, 18 82, 22 92 Z"
            fill="url(#knightGradient)"
            stroke="rgba(240, 243, 231, 0.4)"
            strokeWidth="1.2"
          />

          {/* Restrained Cybernetic Eye & Seam */}
          <circle cx="18" cy="-12" r="4" fill="#16181b" stroke="rgba(240, 243, 231, 0.3)" strokeWidth="1" />
          <circle cx="18" cy="-12" r="2.2" fill="var(--acid)" />
        </g>
      </svg>

      {/* Subtitle Stamp */}
      <div className="strategic-fallback-meta">
        <span>STRATEGIC SYSTEMS // 2D MODE</span>
        <span>STAUNTON KNIGHT ARCHITECTURE</span>
      </div>
    </div>
  )
}

export default StrategicFallback
