import React from 'react'
import {
  Layout, Building2, Zap, BrainCircuit,
  ArrowUpRight, ArrowDownRight, Check, ChevronRight, MessageSquare
} from 'lucide-react'

interface ServiceOffering {
  id: string
  number: string
  title: string
  category: string
  headline: string
  clientValue: string
  deliverables: string[]
  technologies: string[]
  verifiedProjectId?: string
  verifiedProjectName?: string
  tone: string
}

const SERVICES: ServiceOffering[] = [
  {
    id: 'web-apps-landing',
    number: '01',
    category: 'FRONTEND & WEB PRESENCE',
    title: 'Business Websites & Modern Web Apps',
    headline: 'Fast, responsive, and visually distinctive web applications built to convert.',
    clientValue:
      'I build bespoke web presences and client interfaces that load quickly, look premium on all viewports, and convey technical authority. Every site includes modern typography, smooth micro-interactions, clean semantic HTML, and solid SEO hygiene.',
    deliverables: [
      'Responsive, mobile-first layouts with zero horizontal jitter',
      'Fluid micro-interactions and accessible custom components',
      'SEO optimization, meta-tag structure, and fast load times',
      'Clean TypeScript codebase ready for hosting and continuous deployment',
    ],
    technologies: ['React', 'TypeScript', 'Modern CSS', 'Vite', 'SEO & Performance'],
    tone: 'lime',
  },
  {
    id: 'custom-erp-dashboards',
    number: '02',
    category: 'BUSINESS SOFTWARE',
    title: 'Custom Dashboards, Admin Portals & ERPs',
    headline: 'Tailored management platforms that eliminate manual operational bottlenecks.',
    clientValue:
      'Off-the-shelf software often forces businesses into rigid workflows. I engineer custom operational tools — from inventory tracking and multi-site project management to CRM pipelines and role-based staff dashboards.',
    deliverables: [
      'Multi-module admin portals with role-based access control (RBAC)',
      'Relational database schemas structured for high integrity and auditing',
      'Inventory, billing, and vendor management workflows',
      'Actionable reporting dashboards with exportable metrics',
    ],
    technologies: ['React', 'Node.js', 'PHP', 'MySQL', 'PostgreSQL', 'REST APIs'],
    verifiedProjectId: 'jgc-construction-erp',
    verifiedProjectName: 'JGC Construction ERP',
    tone: 'orange',
  },
  {
    id: 'realtime-systems',
    number: '03',
    category: 'REAL-TIME WORKFLOWS',
    title: 'Real-Time Platforms & Collaborative Tools',
    headline: 'Low-latency live applications with synchronized multi-client state.',
    clientValue:
      'When your product requires instant state synchronization — live auction rooms, collaborative feeds, multi-user event dashboards, or live notifications — I engineer resilient WebSocket architectures that handle concurrency gracefully.',
    deliverables: [
      'Bidirectional WebSocket pipelines with graceful reconnection fallbacks',
      'Centralized room and participant state synchronization',
      'Anti-race condition validation and atomic transaction finalization',
      'Live status broadcasting with minimal server latency',
    ],
    technologies: ['WebSockets', 'Node.js', 'TypeScript', 'Event Architecture', 'MySQL'],
    verifiedProjectId: 'cricket-conquest',
    verifiedProjectName: 'Cricket Conquest',
    tone: 'lime',
  },
  {
    id: 'applied-ai-retrieval',
    number: '04',
    category: 'APPLIED AI & SEARCH',
    title: 'AI Search, Vector Retrieval & Classification',
    headline: 'Practical, cost-effective AI features grounded in real data.',
    clientValue:
      'Rather than fragile AI wrappers, I integrate proven vector search and machine learning models directly into your web applications to solve specific operational challenges: semantic duplicate detection, automated ticket classification, and smart document retrieval.',
    deliverables: [
      'Vector similarity search using FAISS and high-dimensional embeddings',
      'Cosine similarity thresholding to prevent false-positive matches',
      'Machine learning classification pipelines with persistent prediction history',
      'Clean REST API endpoints seamlessly connected to your frontend',
    ],
    technologies: ['Python', 'Django', 'FAISS', 'Gemini API Embeddings', 'Scikit-learn'],
    verifiedProjectId: 'smart-issue-tracker',
    verifiedProjectName: 'Smart Issue Tracker',
    tone: 'violet',
  },
]

interface FreelanceServicesProps {
  onInspectCaseStudy: (projectId: string) => void
}

export function FreelanceServices({ onInspectCaseStudy }: FreelanceServicesProps) {
  return (
    <section className="services-section section-wrap section-pad" id="services">
      {/* Section Header */}
      <div className="section-heading">
        <div className="section-heading-main">
          <span className="section-index">02</span>
          <div>
            <p className="eyebrow">WHAT I CAN BUILD FOR CLIENTS</p>
            <h2>
              Freelance capabilities & engineering services<span className="headline-period">.</span>
            </h2>
          </div>
        </div>
        <p className="section-note">
          Direct, end-to-end development for founders, businesses, and teams who need dependable software built without unnecessary overhead.
        </p>
      </div>

      {/* Services Grid */}
      <div className="services-grid">
        {SERVICES.map((service) => (
          <div key={service.id} className={`service-card tone-${service.tone}`}>
            <div className="service-card-header">
              <div className="service-meta-top">
                <span className="service-number">/{service.number}</span>
                <span className="service-category">{service.category}</span>
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-headline">{service.headline}</p>
            </div>

            <p className="service-client-value">{service.clientValue}</p>

            <div className="service-deliverables">
              <span className="deliverables-label">WHAT YOU RECEIVE</span>
              <ul className="deliverables-list">
                {service.deliverables.map((item, i) => (
                  <li key={i}>
                    <Check size={14} className="check-icon" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="service-card-footer">
              <div className="service-tech-pills">
                {service.technologies.map((tech) => (
                  <span key={tech} className="tech-pill">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="service-action-row">
                {service.verifiedProjectId ? (
                  <button
                    type="button"
                    className="service-proof-btn"
                    onClick={() => onInspectCaseStudy(service.verifiedProjectId!)}
                    aria-label={`Inspect case study for ${service.verifiedProjectName}`}
                  >
                    <span>Proof in {service.verifiedProjectName}</span>
                    <ChevronRight size={13} />
                  </button>
                ) : (
                  <span className="service-proof-note">Demonstrated in VYRA & client builds</span>
                )}

                <a
                  href={`#contact`}
                  className="service-inquire-link"
                  aria-label={`Inquire about ${service.title}`}
                >
                  Discuss this <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Services CTA Banner */}
      <div className="services-cta-banner">
        <div className="banner-copy">
          <span className="eyebrow">HAVE A SPECIFIC SYSTEM IN MIND?</span>
          <h3>Let’s talk through your technical requirements and build a solid plan.</h3>
        </div>
        <div className="banner-actions">
          <a className="button button-primary" href="#contact">
            Discuss a project <ArrowDownRight size={16} />
          </a>
          <a
            className="button button-quiet"
            href="mailto:vasiharan030@gmail.com?subject=Freelance%20Project%20Inquiry%20%E2%80%94%20Vasiharan%20B"
          >
            Email directly <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </section>
  )
}

export default FreelanceServices
