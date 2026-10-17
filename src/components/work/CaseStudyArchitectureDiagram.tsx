import { useId } from 'react'
import {
  Monitor, Network, BrainCircuit, Database, ArrowDown,
  Layers3, HardDrive, Cpu, Terminal, Sparkles
} from 'lucide-react'
import type { ArchitectureNode } from '../../data/caseStudies'

interface CaseStudyArchitectureDiagramProps {
  overview: string
  nodes: ArchitectureNode[]
  tone?: string
}

function getNodeIcon(layer: string, index: number) {
  const upper = layer.toUpperCase()
  if (upper.includes('CLIENT') || upper.includes('UI') || upper.includes('DESKTOP') || upper.includes('PRESENTATION')) {
    return upper.includes('DESKTOP') ? Terminal : Monitor
  }
  if (upper.includes('SOCKET') || upper.includes('GATEWAY') || upper.includes('API') || upper.includes('ACCESS')) {
    return Network
  }
  if (upper.includes('VECTOR') || upper.includes('ML') || upper.includes('ENGINE') || upper.includes('STATE') || upper.includes('CHART')) {
    return upper.includes('VECTOR') || upper.includes('ML') ? BrainCircuit : upper.includes('CHART') ? Sparkles : Cpu
  }
  if (upper.includes('PERSISTENCE') || upper.includes('DATABASE') || upper.includes('STORE') || upper.includes('DATA')) {
    return Database
  }
  return index === 0 ? Monitor : index === 1 ? Network : index === 2 ? Layers3 : HardDrive
}

// Flow connector descriptions between the standard 4 layers
const DEFAULT_FLOW_LABELS = [
  'Validated Input / Auth Token',
  'Query Execution / Data Framing',
  'Atomic Transaction / Persistent State'
]

export function CaseStudyArchitectureDiagram({
  overview,
  nodes,
  tone = 'lime'
}: CaseStudyArchitectureDiagramProps) {
  const diagramId = useId()

  return (
    <div className={`architecture-diagram-container tone-${tone}`} aria-label="System Architecture & Data Flow Topology">
      <div className="diagram-header">
        <div className="diagram-topline">
          <span className="diagram-tag">TOPOLOGY SPECIFICATION</span>
          <span className="diagram-status">
            <span className="status-live-dot" /> VERIFIED TIERS ({nodes.length})
          </span>
        </div>
        <p className="diagram-overview-text">{overview}</p>
      </div>

      <div className="diagram-flow-pipeline" role="region" aria-label="Tiered Architecture Pipeline">
        {nodes.map((node, index) => {
          const NodeIcon = getNodeIcon(node.layer, index)
          const isLast = index === nodes.length - 1
          const flowLabel = DEFAULT_FLOW_LABELS[index] || 'Data Stream'

          return (
            <div key={`${diagramId}-node-${index}`} className="architecture-step-wrapper">
              {/* Architecture Node Card */}
              <div className="architecture-node-card">
                <div className="node-card-accent" />
                
                <div className="node-card-header">
                  <div className="node-icon-wrapper">
                    <NodeIcon size={16} strokeWidth={2} />
                  </div>
                  <div className="node-layer-meta">
                    <span className="node-layer-badge">{node.layer}</span>
                    <span className="node-step-index">TIER 0{index + 1}</span>
                  </div>
                </div>

                <div className="node-card-body">
                  <h4 className="node-title">{node.title}</h4>
                  <div className="node-tech-badge">
                    <span>{node.tech}</span>
                  </div>
                  <p className="node-detail">{node.detail}</p>
                </div>
              </div>

              {/* Directional Flow Conduit between nodes */}
              {!isLast && (
                <div className="architecture-conduit" aria-hidden="true">
                  <div className="conduit-line" />
                  <div className="conduit-pip">
                    <ArrowDown size={14} />
                  </div>
                  <span className="conduit-label">{flowLabel}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CaseStudyArchitectureDiagram
