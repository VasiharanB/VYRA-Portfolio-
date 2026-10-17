export interface ArchitectureNode {
  layer: string
  title: string
  tech: string
  detail: string
}

export interface WorkflowStep {
  number: string
  title: string
  detail: string
}

export interface EngineeringDecision {
  title: string
  rationale: string
}

export interface ChallengeResolution {
  challenge: string
  resolution: string
}

export interface CaseStudyData {
  id: string
  number: string
  category: string
  title: string
  subtitle: string
  tagline: string
  repoUrl: string
  tone: 'violet' | 'lime' | 'orange' | 'blue' | 'pink' | 'mint'
  stack: string[]
  problem: {
    summary: string
    points: string[]
  }
  workflow: {
    title: string
    steps: WorkflowStep[]
  }
  architecture: {
    overview: string
    nodes: ArchitectureNode[]
  }
  decisions: EngineeringDecision[]
  challenges: ChallengeResolution[]
}

export const CASE_STUDIES: Record<string, CaseStudyData> = {
  'smart-issue-tracker': {
    id: 'smart-issue-tracker',
    number: '01',
    category: 'AI · TRIAGE WORKFLOWS',
    title: 'Smart Issue Tracker',
    subtitle: 'Semantic duplicate-ticket detection and AI-assisted verification',
    tagline: 'Eliminating redundant engineering triage with vector embeddings and sub-millisecond similarity indexing',
    repoUrl: 'https://github.com/VasiharanB/Smart-Issue-Tracker',
    tone: 'violet',
    stack: ['React', 'TypeScript', 'Django', 'Django REST Framework', 'PostgreSQL', 'FAISS', 'Python'],
    problem: {
      summary: 'In software support and bug tracking operations, incoming issues frequently describe identical defects using different vocabulary, leading to triage bottlenecks and duplicate developer work.',
      points: [
        'Keyword searches fail to match conceptually identical issues filed under disparate natural language phrasings.',
        'Developers spend valuable engineering capacity investigating problems already resolved or currently in progress.',
        'Lack of automated validation during authoring allows duplicate clusters to accumulate unnoticed in backlogs.',
      ],
    },
    workflow: {
      title: 'End-to-End Triage & Detection Workflow',
      steps: [
        {
          number: '01',
          title: 'Drafting & Issue Input',
          detail: 'The user creates a ticket by entering an issue title, category, and descriptive context.',
        },
        {
          number: '02',
          title: 'Embedding Extraction',
          detail: 'The backend pipeline computes semantic vector embeddings representing the core conceptual signature of the report.',
        },
        {
          number: '03',
          title: 'High-Speed Vector Query',
          detail: 'FAISS queries the embedding against an index of open and historical tickets to evaluate vector cosine distances.',
        },
        {
          number: '04',
          title: 'Similarity Gating & Feedback',
          detail: 'Candidates matching above similarity thresholds are surfaced with confidence ratings before ticket submission is committed.',
        },
        {
          number: '05',
          title: 'Triage Decision & Storage',
          detail: 'The author or triage engineer confirms duplicate linkage or proceeds with dispatching a new ticket into PostgreSQL.',
        },
      ],
    },
    architecture: {
      overview: 'A decoupled architecture separating real-time vector search from transactional ticket management to preserve query throughput.',
      nodes: [
        {
          layer: 'CLIENT TIER',
          title: 'Interactive Ticket Workspace',
          tech: 'React / TypeScript',
          detail: 'Responsive ticket authoring form, real-time duplicate alert modals, similarity score meters, and triage queues.',
        },
        {
          layer: 'API GATEWAY',
          title: 'REST API & Authentication Services',
          tech: 'Django / Django REST Framework',
          detail: 'CRUD endpoints, token authentication, role validation, and embedding extraction orchestration.',
        },
        {
          layer: 'VECTOR ENGINE',
          title: 'High-Speed Similarity Index',
          tech: 'FAISS (Facebook AI Similarity Search)',
          detail: 'In-memory vector indexing for sub-millisecond similarity queries across pre-computed issue embeddings.',
        },
        {
          layer: 'PERSISTENCE TIER',
          title: 'Transactional Database',
          tech: 'PostgreSQL',
          detail: 'Persisting ticket relational data, user roles, comments, audit logs, and ticket lifecycle history.',
        },
      ],
    },
    decisions: [
      {
        title: 'Decoupling Vector Search from Relational Queries',
        rationale: 'Isolating FAISS vector math from PostgreSQL relational queries prevents computationally heavy vector comparisons from locking table transactions.',
      },
      {
        title: 'Human-in-the-Loop Confidence Thresholding',
        rationale: 'Instead of destructive automated ticket merges, the system surfaces top similarity matches for engineer verification, avoiding false-positive closures.',
      },
    ],
    challenges: [
      {
        challenge: 'Maintaining Index Synchronization on Issue Updates',
        resolution: 'Structured Django signals to trigger automatic index re-calculation whenever ticket descriptions are updated, resolved, or deleted.',
      },
      {
        challenge: 'Technical Terminology vs Conversational Phrasing',
        resolution: 'Normalized code snippets and stack traces before vectorization to ensure model focus remains on the descriptive error semantics.',
      },
    ],
  },

  'cricket-conquest': {
    id: 'cricket-conquest',
    number: '02',
    category: 'REAL-TIME SYSTEMS',
    title: 'Cricket Conquest',
    subtitle: 'Real-time IPL auction platform with live bidding workflows and role-based access',
    tagline: 'Deterministic state synchronization and zero-latency bidding for competitive sports auctions',
    repoUrl: 'https://github.com/VasiharanB/cricket-conquest-ipl-auction',
    tone: 'lime',
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'WebSockets', 'MySQL'],
    problem: {
      summary: 'Live sports auctions require instantaneous, synchronized room state across all participants. Standard HTTP polling introduces latency, stale purse balances, and race conditions where multiple teams attempt to secure the same player simultaneously.',
      points: [
        'Concurrent bid submissions risk double-allocating players if timing is not centrally synchronized.',
        'Team purses and roster caps must be strictly validated before any bid can be registered.',
        'Auction rooms require clear separation between host administration controls and franchise bidding controls.',
      ],
    },
    workflow: {
      title: 'Real-Time Auction Lifecycle',
      steps: [
        {
          number: '01',
          title: 'Room Configuration',
          detail: 'Host initializes auction room parameters: franchise budgets, team squad caps, and bid countdown timers.',
        },
        {
          number: '02',
          title: 'Role-Based Authentication',
          detail: 'Participants connect to the auction room through authenticated roles: Host, Franchise Owner, or Spectator.',
        },
        {
          number: '03',
          title: 'Player on Podium',
          detail: 'Host calls an athlete to the block, broadcasting player profile and opening base price to all connected sockets.',
        },
        {
          number: '04',
          title: 'Live Bidding Battles',
          detail: 'Franchise owners submit incremental bids. The server validates purse solvency and broadcasts new high bid with timer reset.',
        },
        {
          number: '05',
          title: 'Hammer Fall & Allocation',
          detail: 'When the timer hits zero with no new bids, player is locked to the highest bidder, purse is debited, and roster count updates.',
        },
      ],
    },
    architecture: {
      overview: 'A WebSocket event-driven topology routing incoming bids through a centralized in-memory queue to guarantee deterministic order.',
      nodes: [
        {
          layer: 'CLIENT TIER',
          title: 'Live Auction Dashboard & Podium',
          tech: 'React / TypeScript',
          detail: 'Real-time countdown visualizer, budget meters, interactive bid buttons, and live squad roster tables.',
        },
        {
          layer: 'SOCKET GATEWAY',
          title: 'Bidirectional WebSocket Broker',
          tech: 'Node.js / WebSockets',
          detail: 'Managing persistent socket connections, room channels, and low-latency message broadcasts.',
        },
        {
          layer: 'STATE ENGINE',
          title: 'Serialized In-Memory Auction Controller',
          tech: 'Node.js Event Engine',
          detail: 'Executing single-threaded bid serialization, purse balance validation, and authoritative countdown timers.',
        },
        {
          layer: 'PERSISTENCE TIER',
          title: 'Relational Auction Ledger',
          tech: 'MySQL',
          detail: 'Persisting room settings, player catalogs, team squads, and complete timestamped bid transaction histories.',
        },
      ],
    },
    decisions: [
      {
        title: 'Authoritative Server State Machine',
        rationale: 'The server holds absolute truth over timers and current bids. Clients render optimistic UI cues that reconcile against server broadcasts, eliminating client clock discrepancies.',
      },
      {
        title: 'Atomic Purse and Roster Validation',
        rationale: 'Bids are verified atomically at the socket gateway before broadcast, rejecting bids that exceed remaining purse funds or violate squad limits.',
      },
    ],
    challenges: [
      {
        challenge: 'Simultaneous Bid Collision Handling',
        resolution: 'Structured an in-memory queue that processes bids sequentially, locking the active high bid to the earliest server timestamp and immediately rejecting stale requests.',
      },
      {
        challenge: 'Network Drops and Client Reconnection',
        resolution: 'Engineered room snapshot synchronization so reconnected sockets immediately re-hydrate active player, countdown timer, and purse states on join.',
      },
    ],
  },

  'jgc-construction-erp': {
    id: 'jgc-construction-erp',
    number: '03',
    category: 'BUSINESS SOFTWARE',
    title: 'JGC Construction ERP',
    subtitle: 'Construction operations, projects, CRM, vendor workflows, and inventory',
    tagline: 'Unified operational platform bridging distributed job sites, central warehouse logistics, and milestone billing',
    repoUrl: 'https://github.com/VasiharanB/jgc_constructions',
    tone: 'orange',
    stack: ['PHP', 'MySQL', 'JavaScript', 'SQL', 'HTML5 & CSS3'],
    problem: {
      summary: 'Construction companies manage distributed job sites, volatile raw material supplies, subcontractor invoices, and milestone contracts across disconnected spreadsheets, causing inventory shrinkage, delayed billing, and cost overruns.',
      points: [
        'Lack of real-time material tracking against original project budget estimations.',
        'Uncoordinated stock dispatches between central warehouses and on-site consumption.',
        'Fragmented client milestone invoicing with delayed site engineer verification.',
      ],
    },
    workflow: {
      title: 'Operational ERP Workflow',
      steps: [
        {
          number: '01',
          title: 'Project Initiation',
          detail: 'Administrator allocates a new construction project with site location, designated budget, and milestone phases.',
        },
        {
          number: '02',
          title: 'Site Material Requisition',
          detail: 'Site engineers submit daily requisitions for raw materials (cement, steel rebars, aggregate) mapped to project milestones.',
        },
        {
          number: '03',
          title: 'Warehouse Fulfillment & Vendor Orders',
          detail: 'Store in-charge verifies stock levels, authorising warehouse dispatch or generating vendor purchase orders for shortages.',
        },
        {
          number: '04',
          title: 'CRM & Client Billing',
          detail: 'CRM module records client agreements, site inspection sign-offs, and automated stage billing milestones.',
        },
        {
          number: '05',
          title: 'Financial Auditing & Reporting',
          detail: 'Financial modules calculate material expenses against planned budgets, generating executive operational reports.',
        },
      ],
    },
    architecture: {
      overview: 'A modular transactional application architecture built with PHP and normalized relational MySQL schemas for strict data integrity.',
      nodes: [
        {
          layer: 'UI & PRESENTATION',
          title: 'Responsive Management Portal',
          tech: 'HTML5 / CSS3 / Vanilla JS',
          detail: 'Role-specific management screens, dynamic requisition tables, and filtered financial reporting views.',
        },
        {
          layer: 'BUSINESS LOGIC',
          title: 'Modular Operations Core',
          tech: 'PHP Application Layer',
          detail: 'Project lifecycle controllers, inventory dispatch workflows, vendor invoicing, and CRM pipelines.',
        },
        {
          layer: 'ACCESS CONTROL',
          title: 'Role-Based Permission Layer',
          tech: 'Session-Based Auth Guards',
          detail: 'Enforcing separation of duties: Super Admin, Project Manager, Site Engineer, Store In-Charge, Accountant.',
        },
        {
          layer: 'PERSISTENCE TIER',
          title: 'Normalized Relational Store',
          tech: 'MySQL',
          detail: 'Relational schemas linking projects, sites, materials, requisitions, inventory transactions, and client accounts.',
        },
      ],
    },
    decisions: [
      {
        title: 'Transactional Multi-Table Inventory Ledger',
        rationale: 'Material transfers between central warehouse and field sites execute in atomic SQL transactions, ensuring inventory records never drift.',
      },
      {
        title: 'Strict User Audit Logging on Requisitions',
        rationale: 'Every material requisition, dispatch, and billing status change stores timestamped user IDs for clear operational accountability.',
      },
    ],
    challenges: [
      {
        challenge: 'Partial Dispatches and Material Returns',
        resolution: 'Designed inventory tables with balance tracking to accommodate split shipments, damaged material returns, and inter-site stock transfers.',
      },
      {
        challenge: 'Low-Bandwidth Mobile Site Data Entry',
        resolution: 'Optimized forms and server response payloads for fast submissions over low-bandwidth mobile connections on active construction sites.',
      },
    ],
  },

  'sms-spam-detection': {
    id: 'sms-spam-detection',
    number: '04',
    category: 'APPLIED ML & NLP',
    title: 'SMS Spam Detection',
    subtitle: 'Django-based machine learning application for spam/ham classification',
    tagline: 'Natural language processing pipeline delivering instant message verification and historical audit logging',
    repoUrl: 'https://github.com/VasiharanB/sms_spam_detection',
    tone: 'blue',
    stack: ['Python', 'Django', 'Scikit-learn', 'SQLite', 'Pandas', 'NumPy'],
    problem: {
      summary: 'Mobile messaging is constantly exploited by phishing, fraudulent banking notices, and unsolicited marketing. Identifying deceptive SMS messages requires accurate NLP feature extraction and fast classification models wrapped in an accessible web interface.',
      points: [
        'SMS text displays heavy noise: informal slang, deliberate obfuscation, typos, and embedded links.',
        'High false-positive rates risk filtering out critical banking alerts or personal messages.',
        'Lack of prediction logging prevents moderators from tracking classification confidence over time.',
      ],
    },
    workflow: {
      title: 'Message Processing & Classification Pipeline',
      steps: [
        {
          number: '01',
          title: 'Message Input',
          detail: 'User enters text into the classification interface or submits messages for evaluation.',
        },
        {
          number: '02',
          title: 'Text Preprocessing',
          detail: 'Pipeline normalizes tokens: case folding, punctuation stripping, stopword filtering, and stemming.',
        },
        {
          number: '03',
          title: 'Feature Vectorization',
          detail: 'Preprocessed text is converted into numerical feature vectors using TF-IDF token matrices.',
        },
        {
          number: '04',
          title: 'Statistical Inference',
          detail: 'Serialized Scikit-learn model calculates probability scores to determine spam likelihood.',
        },
        {
          number: '05',
          title: 'Verdict & Audit Logging',
          detail: 'Instant classification verdict (Spam vs Legitimate) is displayed with confidence metrics and logged to SQLite.',
        },
      ],
    },
    architecture: {
      overview: 'A lightweight web architecture pairing a Django application server with an in-memory Scikit-learn classification pipeline.',
      nodes: [
        {
          layer: 'USER INTERFACE',
          title: 'Classification View & Telemetry',
          tech: 'Django Templates / CSS3',
          detail: 'Input form, instant visual status indicators, confidence gauges, and historical audit table.',
        },
        {
          layer: 'WEB APPLICATION',
          title: 'Request Routing & Validation',
          tech: 'Django / Python',
          detail: 'Input sanitization, form validation, administrative management views, and reporting filters.',
        },
        {
          layer: 'ML INFERENCE',
          title: 'Scikit-learn NLP Pipeline',
          tech: 'TF-IDF + Serialized Model',
          detail: 'In-memory classifier executing tokenization, vector transformation, and binary probability computation.',
        },
        {
          layer: 'PERSISTENCE TIER',
          title: 'Prediction Audit Store',
          tech: 'SQLite',
          detail: 'Storing historical messages, timestamps, predicted classifications, and confidence metrics for auditing.',
        },
      ],
    },
    decisions: [
      {
        title: 'In-Memory Model Loading on Process Start',
        rationale: 'The trained model and TF-IDF vocabulary are loaded once into Django process memory during boot, eliminating disk deserialization latency per request.',
      },
      {
        title: 'Robust Preprocessing Sanitization',
        rationale: 'Regex-based token cleaning strips deceptive obfuscation (e.g. excessive punctuation, deliberate character substitutions) before vectorization.',
      },
    ],
    challenges: [
      {
        challenge: 'Minimizing False Positives on Critical Alerts',
        resolution: 'Calibrated decision thresholds and evaluated precision-recall trade-offs to prioritize high precision on spam identification.',
      },
      {
        challenge: 'Short-Length Message Representations',
        resolution: 'Leveraged sub-word character n-grams alongside word tokens in TF-IDF to capture indicative patterns in short SMS texts.',
      },
    ],
  },

  'fittrack-desktop': {
    id: 'fittrack-desktop',
    number: '05',
    category: 'DESKTOP ENGINEERING',
    title: 'FitTrack Desktop',
    subtitle: 'Python desktop application with SQLite storage and analytical data visualisation',
    tagline: 'Privacy-first, offline biometric tracking and progress charting without cloud subscriptions',
    repoUrl: 'https://github.com/VasiharanB/FitTrack-Desktop',
    tone: 'pink',
    stack: ['Python', 'Tkinter', 'SQLite', 'Matplotlib', 'SQL'],
    problem: {
      summary: 'Modern fitness tracking tools overwhelmingly require recurring cloud subscriptions and internet connectivity, raising privacy concerns. FitTrack provides an offline-first desktop application with analytical charting and local relational storage.',
      points: [
        'Cloud-dependent fitness apps fail in offline environments and expose sensitive personal biometric records.',
        'Spreadsheets lack structured data validation and require manual formula maintenance for charting.',
        'Desktop users need instant startup, zero background telemetry, and automated visual progress trends.',
      ],
    },
    workflow: {
      title: 'Desktop Logging & Charting Workflow',
      steps: [
        {
          number: '01',
          title: 'Profile Selection',
          detail: 'User launches the desktop application and selects an existing athlete profile or initializes a new one.',
        },
        {
          number: '02',
          title: 'Daily Biometric Logging',
          detail: 'User records daily metrics: body weight, measurements, workout duration, and exercise session notes.',
        },
        {
          number: '03',
          title: 'Input Range Validation',
          detail: 'Application validates numerical ranges and calendar dates before committing transactions to the local database.',
        },
        {
          number: '04',
          title: 'Local Database Commit',
          detail: 'Parameterized SQL queries insert or update records into the local SQLite database.',
        },
        {
          number: '05',
          title: 'Visual Trend Generation',
          detail: 'Embedded Matplotlib figures render interactive line charts and rolling trend curves directly inside the GUI window.',
        },
      ],
    },
    architecture: {
      overview: 'An offline-first desktop architecture integrating a Tkinter UI shell with an embedded Matplotlib charting canvas and local SQLite store.',
      nodes: [
        {
          layer: 'DESKTOP SHELL',
          title: 'Tkinter GUI Framework',
          tech: 'Python Tkinter',
          detail: 'Multi-tab navigation interface providing entry forms, history tables, user settings, and visual analytics.',
        },
        {
          layer: 'CHARTING ENGINE',
          title: 'Embedded Vector Canvas',
          tech: 'Matplotlib / FigureCanvasTkAgg',
          detail: 'Rendering dynamic line charts, rolling averages, and progress curves directly within the Tkinter window.',
        },
        {
          layer: 'DATA ENGINE',
          title: 'Statistical Computations',
          tech: 'Python / SQL Aggregations',
          detail: 'Calculating rolling weekly averages, percentage change deltas, and milestone completions.',
        },
        {
          layer: 'LOCAL DATABASE',
          title: 'Zero-Config Relational Store',
          tech: 'SQLite',
          detail: 'Storing profile configs, daily biometric entries, workout exercises, and user preferences locally on disk.',
        },
      ],
    },
    decisions: [
      {
        title: '100% Offline-First Architecture',
        rationale: 'Zero external network calls guarantees total privacy for sensitive personal biometric records and sub-second application launch times.',
      },
      {
        title: 'Parameterized Local SQL Statements',
        rationale: 'Using strict parameterized SQL queries prevents database corruption and guarantees reliable execution across operating systems.',
      },
    ],
    challenges: [
      {
        challenge: 'Matplotlib Threading Inside Tkinter Event Loop',
        resolution: 'Leveraged FigureCanvasTkAgg with explicit figure clearance and redrawing methods to prevent memory leaks and UI freezing during rapid chart updates.',
      },
      {
        challenge: 'Responsive Canvas Resize Handling',
        resolution: 'Bound Tkinter window configure events to scale Matplotlib figure aspect ratios and font sizes cleanly across monitor resolutions.',
      },
    ],
  },

  'aethon-ai': {
    id: 'aethon-ai',
    number: '06',
    category: 'COLLABORATIVE PLATFORMS',
    title: 'Aethon AI',
    subtitle: 'Collaborative placement-preparation and assessment platform',
    tagline: 'Structured concept practice, timed mock evaluations, and administrative performance analytics',
    repoUrl: 'https://github.com/VasiharanB/aethon-ai',
    tone: 'mint',
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'REST APIs'],
    problem: {
      summary: 'Students preparing for campus recruitment face fragmented practice tools scattered across coding platforms and aptitude question banks. Placement coordinators lack a unified system to assign standardized evaluations and track batch readiness.',
      points: [
        'Disjointed practice tools offer no consolidated overview of candidate competency across technical and quantitative domains.',
        'Placement mentors cannot easily evaluate batch performance distributions or identify struggling candidates early.',
        'Online test sessions risk progress loss if candidates experience unexpected browser reloads or network drops.',
      ],
    },
    workflow: {
      title: 'Assessment & Feedback Lifecycle',
      steps: [
        {
          number: '01',
          title: 'Candidate Authentication',
          detail: 'Student logs in and accesses their personalized dashboard showing active preparation tracks and mock tests.',
        },
        {
          number: '02',
          title: 'Timed Assessment Session',
          detail: 'Candidate launches a timed evaluation covering technical concepts, logical problem-solving, and domain MCQs.',
        },
        {
          number: '03',
          title: 'Incremental Answer Staging',
          detail: 'Selected answers are automatically staged to the server asynchronously to safeguard progress against connection interruptions.',
        },
        {
          number: '04',
          title: 'Automated Scoring & Analytics',
          detail: 'The evaluation engine grades submissions upon completion or timer expiry according to topic scoring rubrics.',
        },
        {
          number: '05',
          title: 'Concept Breakdown Feedback',
          detail: 'Student receives detailed concept breakdowns highlighting strengths and recommended revision topics.',
        },
        {
          number: '06',
          title: 'Admin Batch Portal',
          detail: 'Placement coordinators review batch performance analytics, difficulty distributions, and individual candidate reports.',
        },
      ],
    },
    architecture: {
      overview: 'A full-stack placement portal pairing a React SPA with an Express REST backend and MySQL database with role-based routing.',
      nodes: [
        {
          layer: 'CANDIDATE & ADMIN UI',
          title: 'Responsive Assessment Portal',
          tech: 'React / TypeScript',
          detail: 'Timed test interfaces, real-time question navigators, progress analytics, and admin evaluation tables.',
        },
        {
          layer: 'API GATEWAY',
          title: 'Assessment REST API',
          tech: 'Node.js / Express',
          detail: 'Authentication, session token management, question bank retrieval, and answer submission endpoints.',
        },
        {
          layer: 'EVALUATION ENGINE',
          title: 'Automated Grading Service',
          tech: 'Node.js Evaluation Module',
          detail: 'Scoring answer submissions, calculating percentile ranks, and aggregating topic performance metrics.',
        },
        {
          layer: 'PERSISTENCE TIER',
          title: 'Relational Platform Store',
          tech: 'MySQL',
          detail: 'Storing user accounts, candidate profiles, question banks with difficulty tiers, and attempt histories.',
        },
      ],
    },
    decisions: [
      {
        title: 'Incremental Answer Staging',
        rationale: 'Submitting candidate selections per question asynchronously protects test progress against unexpected network disconnects or accidental page reloads.',
      },
      {
        title: 'Role-Based Route and Data Protection',
        rationale: 'Implemented strict middleware guards separating candidate test environments from administrator question authoring and scoring views.',
      },
    ],
    challenges: [
      {
        challenge: 'Deterministic Countdown Timer Synchronization',
        resolution: 'Engineered server-anchored session timestamps so client-side timer calculations remain accurate and cannot be manipulated by local device clock modifications.',
      },
      {
        challenge: 'Modular Question Bank Schema',
        resolution: 'Designed normalized relational schemas in MySQL supporting diverse question categories, multi-option inputs, and dynamic difficulty weightings.',
      },
    ],
  },
}
