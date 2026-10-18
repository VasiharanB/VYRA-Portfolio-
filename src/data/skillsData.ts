import type { ElementType } from 'react'
import { Code2, Layers3, BrainCircuit } from 'lucide-react'

export interface SkillDomain {
  label: string
  title: string
  icon: ElementType
  items: string[]
}

export interface ToolbeltItem {
  name: string
  category?: string
  note?: string
}

export interface PrincipleImplementation {
  projectId: string
  projectTitle: string
  projectNumber: string
  tone: string
  takeawayTitle: string
  takeawayDetail: string
}

export interface EngineeringPrinciple {
  number: string
  title: string
  summary: string
  rationale: string
  implementations: PrincipleImplementation[]
}

/**
 * Single source of truth mapping technologies to verified VYRA project IDs.
 * Sourced directly from audited project repositories.
 */
export const TECH_TO_PROJECTS: Record<string, string[]> = {
  // Frontend
  'React': ['smart-issue-tracker', 'cricket-conquest', 'aethon-ai'],
  'TypeScript': ['smart-issue-tracker', 'cricket-conquest', 'aethon-ai'],
  'JavaScript': ['jgc-construction-erp', 'cricket-conquest', 'aethon-ai'],
  'HTML & CSS': ['smart-issue-tracker', 'cricket-conquest', 'jgc-construction-erp', 'sms-spam-detection', 'aethon-ai'],
  'Vite': ['smart-issue-tracker', 'aethon-ai'],
  'Tailwind CSS': ['smart-issue-tracker', 'aethon-ai'],
  'Bootstrap': ['jgc-construction-erp'],

  // Backend & APIs
  'Node.js': ['cricket-conquest', 'aethon-ai'],
  'Express': ['aethon-ai'],
  'Django': ['smart-issue-tracker', 'sms-spam-detection'],
  'Django REST Framework': ['smart-issue-tracker'],
  'PHP': ['jgc-construction-erp'],
  'REST APIs': ['smart-issue-tracker', 'cricket-conquest', 'aethon-ai', 'sms-spam-detection'],
  'WebSockets': ['cricket-conquest'],

  // Data & Intelligence
  'MySQL': ['cricket-conquest', 'jgc-construction-erp', 'aethon-ai'],
  'PostgreSQL': ['smart-issue-tracker'],
  'SQLite': ['sms-spam-detection', 'fittrack-desktop'],
  'FAISS': ['smart-issue-tracker'],
  'Embeddings': ['smart-issue-tracker'],
  'Machine Learning': ['sms-spam-detection', 'smart-issue-tracker'],
  'Data Visualisation': ['fittrack-desktop', 'cricket-conquest'],

  // Additional Toolbelt Technologies
  'Python': ['smart-issue-tracker', 'sms-spam-detection', 'fittrack-desktop'],
  'Tkinter': ['fittrack-desktop'],
  'Matplotlib': ['fittrack-desktop'],
  'Scikit-learn': ['sms-spam-detection'],
  'Git & GitHub': ['smart-issue-tracker', 'cricket-conquest', 'jgc-construction-erp', 'sms-spam-detection', 'fittrack-desktop', 'aethon-ai'],

  // Foundational Engineering Competencies (Coursework & Tooling)
  'Java': [],
  'C / C++': [],
  'Linux': [],
  'Postman': [],
  'Figma': [],
}

export const SKILL_DOMAINS: SkillDomain[] = [
  {
    label: '01 / INTERFACES',
    title: 'Frontend engineering',
    icon: Code2,
    items: ['React', 'TypeScript', 'JavaScript', 'HTML & CSS', 'Vite', 'Tailwind CSS', 'Bootstrap'],
  },
  {
    label: '02 / APPLICATIONS',
    title: 'Backend & APIs',
    icon: Layers3,
    items: ['Node.js', 'Express', 'Django', 'Django REST Framework', 'PHP', 'REST APIs', 'WebSockets'],
  },
  {
    label: '03 / DATA & INTELLIGENCE',
    title: 'Data & applied AI',
    icon: BrainCircuit,
    items: ['MySQL', 'PostgreSQL', 'SQLite', 'FAISS', 'Embeddings', 'Machine Learning', 'Data Visualisation'],
  },
]

export const ADDITIONAL_TOOLBELT: ToolbeltItem[] = [
  { name: 'Python', category: 'Language' },
  { name: 'Tkinter', category: 'Desktop UI' },
  { name: 'Matplotlib', category: 'Analytics' },
  { name: 'Scikit-learn', category: 'ML Toolkit' },
  { name: 'Git & GitHub', category: 'Version Control' },
  { name: 'Linux', category: 'Environment', note: 'OS & deployment environment' },
  { name: 'Postman', category: 'Tooling', note: 'API contract testing' },
  { name: 'Java', category: 'Language', note: 'Object-oriented programming' },
  { name: 'C / C++', category: 'Language', note: 'Systems & embedded coursework' },
  { name: 'Figma', category: 'Design', note: 'Interface wireframing' },
]

export const ENGINEERING_PRINCIPLES: EngineeringPrinciple[] = [
  {
    number: '01',
    title: 'Decompose the problem first',
    summary: 'Analyze user workflows, data models, and edge constraints before writing code to build the right solution.',
    rationale: 'Complex software becomes unmanageable when implementation starts before isolating discrete failure domains. Breaking workflows into independent sub-problems—such as segregating real-time message broadcasting from ACID storage transactions—prevents brittle coupling and allows each tier to operate reliably within its constraints.',
    implementations: [
      {
        projectId: 'cricket-conquest',
        projectTitle: 'Cricket Conquest',
        projectNumber: '02',
        tone: 'lime',
        takeawayTitle: 'State Broadcast Separated from Transactional Finalization',
        takeawayDetail: 'Rather than running the live auction within a monolithic transaction, the architecture decomposes bidding into an ephemeral WebSocket stream for responsive broadcast and reserves ACID MySQL transactions strictly for closing player sales.',
      },
      {
        projectId: 'smart-issue-tracker',
        projectTitle: 'Smart Issue Tracker',
        projectNumber: '01',
        tone: 'violet',
        takeawayTitle: 'Two-Tier Retrieval Before Generative Verification',
        takeawayDetail: 'Avoided routing every ticket query through generative LLMs by decomposing triage into fast local cosine retrieval via FAISS, reserving Gemini verification only for borderline similarity thresholds.',
      },
    ],
  },
  {
    number: '02',
    title: 'Structure for long-term clarity',
    summary: 'Keep state deterministic, interfaces decoupled, and code clean so systems remain dependable as requirements evolve.',
    rationale: 'Code clarity is an operational requirement, not an aesthetic preference. Clear data boundaries, explicit typing contracts, and normalized relational schemas minimize cognitive overhead during maintenance and prevent silent regressions from propagating across system layers as business logic expands.',
    implementations: [
      {
        projectId: 'jgc-construction-erp',
        projectTitle: 'JGC Construction ERP',
        projectNumber: '03',
        tone: 'orange',
        takeawayTitle: 'Relational Schemas Across Materials and Site Operations',
        takeawayDetail: 'Structured site procurement, vendor agreements, and field consumption into normalized relational schemas with explicit foreign-key constraints and session-based role verification to maintain end-to-end data integrity.',
      },
      {
        projectId: 'aethon-ai',
        projectTitle: 'Aethon AI',
        projectNumber: '06',
        tone: 'mint',
        takeawayTitle: 'Decoupled Assessment State with Typed Contracts',
        takeawayDetail: 'Engineered strict TypeScript interfaces between the React client and Express API, isolating interactive quiz session state from the server evaluation and progress-scoring engine.',
      },
    ],
  },
  {
    number: '03',
    title: 'Focus on practical reliability',
    summary: 'Software succeeds when it solves real operational friction. Clear interfaces and resilient workflows matter most.',
    rationale: 'A system’s value is defined by how predictably it functions under realistic conditions—intermittent connectivity, unvalidated user input, and concurrent operations. Engineering for reliability means building offline-resilient persistence, deterministic audit trails, and graceful error handling.',
    implementations: [
      {
        projectId: 'fittrack-desktop',
        projectTitle: 'FitTrack Desktop',
        projectNumber: '05',
        tone: 'pink',
        takeawayTitle: 'Offline-First Resilience with Local SQLite Persistence',
        takeawayDetail: 'Decoupled the Python Tkinter event loop from database queries and Matplotlib canvas rendering, ensuring biometric health records and visual analytics remain 100% operational without external network dependencies.',
      },
      {
        projectId: 'sms-spam-detection',
        projectTitle: 'SMS Spam Detection',
        projectNumber: '04',
        tone: 'blue',
        takeawayTitle: 'Auditable Prediction History for Model Verification',
        takeawayDetail: 'Coupled a Scikit-learn TF-IDF Naive Bayes pipeline with persistent SQLite prediction logs, enabling administrators to review edge-case false positives directly in the Django admin interface.',
      },
    ],
  },
]
