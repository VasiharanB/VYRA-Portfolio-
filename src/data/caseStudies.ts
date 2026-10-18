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
    flowLabels: string[]
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
    tagline: 'Combining dense vector embeddings with Gemini LLM verification to detect duplicate customer support tickets',
    repoUrl: 'https://github.com/VasiharanB/Smart-Issue-Tracker',
    tone: 'violet',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Django', 'Django REST Framework', 'PostgreSQL', 'FAISS', 'Google Gemini'],
    problem: {
      summary: 'Customer support teams in growing organizations face repeated spikes in duplicate ticket submissions during service outages, billing issues, or common product defects. Manually triaging duplicates consumes representative hours, inflates ticket backlogs, and delays response times for unique, critical issues.',
      points: [
        'Standard keyword matching misses duplicates that describe identical technical defects using differing vocabulary or phrasing.',
        'Support engineers spend significant time investigating issues already assigned to active engineering workflows.',
        'Unlinked duplicate submissions fragment user impact tracking, making it difficult to assess true defect frequency.',
      ],
    },
    workflow: {
      title: 'End-to-End Duplicate Detection & Triage Workflow',
      steps: [
        {
          number: '01',
          title: 'Ticket Submission',
          detail: 'User submits a support request containing a subject, category, and descriptive context via the React customer intake portal.',
        },
        {
          number: '02',
          title: 'Embedding Extraction',
          detail: 'The backend pipeline passes ticket text to Sentence-Transformers (all-MiniLM-L6-v2) to generate a 384-dimensional dense vector embedding.',
        },
        {
          number: '03',
          title: 'Vector Candidate Search',
          detail: 'FAISS (IndexFlatIP) evaluates cosine similarity distances across pre-indexed historical tickets to retrieve the top 5 candidate matches.',
        },
        {
          number: '04',
          title: 'Tiered Verification Gating',
          detail: 'Candidates with similarity >= 90% are marked duplicates; matches between 75% and 90% are routed to Gemini 1.5 Flash for structured semantic validation; below 75% are classified as unique.',
        },
        {
          number: '05',
          title: 'Database Commitment & History',
          detail: 'The final classification is saved to PostgreSQL, incrementing master ticket supporter counts for duplicates and logging analysis reasoning for admin auditing.',
        },
      ],
    },
    architecture: {
      overview: 'A decoupled SPA-API architecture combining local FAISS vector search with Google Gemini LLM validation over Django REST Framework.',
      flowLabels: [
        'POST /api/tickets/create (JSON Payload)',
        '384-d Embedding Extraction (all-MiniLM-L6-v2)',
        'FAISS Top-5 Search & Gemini Verification (PostgreSQL Commit)',
      ],
      nodes: [
        {
          layer: 'CLIENT TIER',
          title: 'Support Portal & Admin Dashboard',
          tech: 'React 18 / TypeScript / Tailwind CSS',
          detail: 'Intake form portal, admin dashboard with volume charts, duplicate rate metrics, ticket management controls, and analysis history logs.',
        },
        {
          layer: 'API GATEWAY',
          title: 'REST API & Serialization Services',
          tech: 'Django 5 / Django REST Framework',
          detail: 'Web API endpoints for ticket intake, admin status updates, CORS configuration, and embedding extraction orchestration.',
        },
        {
          layer: 'AI / DEDUPLICATION ENGINE',
          title: 'Hybrid Vector Search & LLM Verifier',
          tech: 'FAISS (IndexFlatIP) + Google Gemini Flash',
          detail: 'Local cosine similarity search across 384-d vectors paired with Gemini 1.5 Flash structured verification and fallback thresholding.',
        },
        {
          layer: 'PERSISTENCE TIER',
          title: 'Relational Database',
          tech: 'PostgreSQL',
          detail: 'Persisting ticket records, master-duplicate linkages, supporter counters, category definitions, and analysis decision logs.',
        },
      ],
    },
    decisions: [
      {
        title: 'Hybrid Deduplication with Selective LLM Verification',
        rationale: 'High-confidence vector matches (>= 90%) are linked directly without invoking external models, preserving API quota. Ambiguous borderline cases (75%–90%) are verified by Gemini 1.5 Flash using structured Pydantic schemas.',
      },
      {
        title: 'Local Fallback on API Rate Limits or Outages',
        rationale: 'If external LLM verification encounters rate limits or network latency, the system falls back to local FAISS similarity scoring, ensuring user ticket submissions are never blocked.',
      },
    ],
    challenges: [
      {
        challenge: 'Semantic Ambiguity Between Related but Distinct Issues',
        resolution: 'Pure vector cosine similarity occasionally pairs tickets that share common technical keywords but describe different underlying defects. Routing borderline scores to Gemini with prompt constraints validates whether issues share identical root causes.',
      },
      {
        challenge: 'Maintaining Efficient Local Vector Search',
        resolution: 'Utilized CPU-optimized FAISS with an inner-product index (IndexFlatIP) and normalized 384-dimensional embeddings, keeping vector distance calculations lightweight without requiring GPU infrastructure.',
      },
    ],
  },

  'cricket-conquest': {
    id: 'cricket-conquest',
    number: '02',
    category: 'REAL-TIME SYSTEMS',
    title: 'Cricket Conquest',
    subtitle: 'Real-time IPL auction platform with live bidding workflows and role-based access',
    tagline: 'Role-governed live auction platform with WebSocket state broadcasts and transactional sale finalization',
    repoUrl: 'https://github.com/VasiharanB/cricket-conquest-ipl-auction',
    tone: 'lime',
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'WebSockets', 'MySQL'],
    problem: {
      summary: 'College tech fest sports auctions require synchronized live stage state across auctioneers, room organizers, volunteers, and participant franchises. Standard HTTP polling introduces latency and inconsistent room states during fast-paced bidding sequences.',
      points: [
        'Participant and spectator interfaces require real-time state synchronization when stage phases, high bids, or countdown timers change.',
        'Bidding franchises must be prevented from submitting bids exceeding their remaining purse or violating minimum squad size constraints.',
        'Auction rooms require role-based access control to enforce separation between administrative controllers and participant bidders.',
      ],
    },
    workflow: {
      title: 'Real-Time Auction Lifecycle',
      steps: [
        {
          number: '01',
          title: 'Session & Team Setup',
          detail: 'Organizers configure auction parameters, assign franchise starting purses (e.g. ₹100 Cr), and define minimum squad limits in the admin dashboard.',
        },
        {
          number: '02',
          title: 'Role-Based Authentication',
          detail: 'Organizers (Admin, Auctioneer, Volunteer) authenticate via JWT credentials; team representatives enter dedicated participant rooms with assigned access codes.',
        },
        {
          number: '03',
          title: 'Player Presentation & Bidding',
          detail: 'The auctioneer calls an athlete to the block. Stage status transitions from PLAYER_READY to BIDDING and broadcasts to all connected sockets.',
        },
        {
          number: '04',
          title: 'Live Bid Validation & Broadcast',
          detail: 'When a bid is submitted via POST /api/auction/bid, the server verifies team purse feasibility, logs the bid, updates the current high bid, resets the countdown timer, and broadcasts the state.',
        },
        {
          number: '05',
          title: 'Transactional Sale Finalization',
          detail: 'When the timer expires, the auctioneer finalizes the sale via an explicit database transaction that debits the team purse, marks the player SOLD, and logs the purchase.',
        },
      ],
    },
    architecture: {
      overview: 'An Express and WebSocket server architecture coordinating real-time stage broadcasts with MySQL transactional finalization.',
      flowLabels: [
        'Live Bid Event & Auth Session Token (REST / WebSocket)',
        'Purse Feasibility Check & High-Bid Update',
        'WebSocket State Broadcast & Row-Locked Sale Transaction',
      ],
      nodes: [
        {
          layer: 'CLIENT TIER',
          title: 'Organizer Stage & Participant Portal',
          tech: 'React 19 / TypeScript / Vite',
          detail: 'Live auction stage, countdown timer visualizer, purse balance meters, participant bidding interface, and role-gated admin control views.',
        },
        {
          layer: 'REAL-TIME GATEWAY',
          title: 'WebSocket Broadcast Service',
          tech: 'Node.js / ws WebSocket Library',
          detail: 'Managing active client socket connections, room channels, and broadcasting state transitions (bids, stage advances, timer resets) to all participants.',
        },
        {
          layer: 'APPLICATION & BIDDING LOGIC',
          title: 'Auction Session & Bidding Services',
          tech: 'Express 4 / TypeScript',
          detail: 'Validating bid increments, checking purse feasibility relative to minimum squad requirements, and coordinating timer stage progressions.',
        },
        {
          layer: 'PERSISTENCE TIER',
          title: 'Relational Database with Row Locks',
          tech: 'MySQL 8 (mysql2/promise)',
          detail: 'Storing teams, players, and bid logs; finalizing sales using transactions with SELECT ... FOR UPDATE row-level locks on sessions, players, and teams.',
        },
      ],
    },
    decisions: [
      {
        title: 'Row-Locked Transactions for Player Sale Commitments',
        rationale: 'While real-time bid updates are broadcast quickly over WebSockets, the final sale action (AuctionTransactionService.sellCurrentPlayer) executes within an explicit MySQL transaction using SELECT ... FOR UPDATE on sessions, players, and teams to ensure purse debits and roster counts never drift.',
      },
      {
        title: 'Purse Feasibility Enforcement on Bidding',
        rationale: 'Before a bid is accepted, the server verifies that the franchise retains sufficient purse reserves after the proposed bid to acquire remaining required players at base price, preventing teams from becoming insolvent.',
      },
    ],
    challenges: [
      {
        challenge: 'Synchronizing Client Stage on Network Reconnection',
        resolution: 'Temporary network disconnects during a live auction can leave client browsers out of sync. Engineered an authoritative state endpoint (/api/auction/state) that re-hydrates active player, high bid, and timer state upon reconnection.',
      },
      {
        challenge: 'Supporting Auctioneer Sale Reversal (Undo Functionality)',
        resolution: 'If a bid dispute occurs, an undo transaction safely reverses the latest player purchase record, restores the debited purse amount to the team, and resets player status back to AVAILABLE.',
      },
    ],
  },

  'jgc-construction-erp': {
    id: 'jgc-construction-erp',
    number: '03',
    category: 'BUSINESS SOFTWARE',
    title: 'JGC Construction ERP',
    subtitle: 'Construction operations, projects, CRM, vendor workflows, and inventory',
    tagline: 'Centralized construction operations connecting distributed job sites, materials inventory, and client leads',
    repoUrl: 'https://github.com/VasiharanB/jgc_constructions',
    tone: 'orange',
    stack: ['PHP', 'MySQL', 'JavaScript', 'HTML5', 'CSS3', 'SQL'],
    problem: {
      summary: 'Construction companies manage distributed building sites, fluctuating raw material inventories, subcontractor vendors, and prospective client quotations. Disconnected spreadsheets cause delayed reporting, inventory discrepancies, and untracked material movement between warehouses and active sites.',
      points: [
        'On-site material deliveries and usage are difficult to track against project requirements without centralized data records.',
        'Client leads, quotations, site visits, and BOQ items require structured tracking through project initiation.',
        'Project managers need unified dashboard summaries across ongoing site activities and material minimum-stock levels.',
      ],
    },
    workflow: {
      title: 'Construction Operations & Inventory Lifecycle',
      steps: [
        {
          number: '01',
          title: 'Project & Site Definition',
          detail: 'Administrator initializes project records, assigned physical site locations, project managers, and initial scope parameters.',
        },
        {
          number: '02',
          title: 'Lead & CRM Management',
          detail: 'Sales teams log prospective client leads, schedule site visits, track follow-up activities, and prepare milestone quotations.',
        },
        {
          number: '03',
          title: 'Material Master & Vendor Registry',
          detail: 'Store managers define raw material items, specify unit costs, set reorder thresholds, and register approved vendor suppliers.',
        },
        {
          number: '04',
          title: 'Stock Requisitions & Movement',
          detail: 'Field sites submit material requests; warehouse dispatches record inventory transaction records tracking dispatched stock.',
        },
        {
          number: '05',
          title: 'Operational Dashboard Analytics',
          detail: 'Management views centralized dashboards showing active project counts, inventory stock summaries, and low-stock alerts.',
        },
      ],
    },
    architecture: {
      overview: 'A modular PHP web application connected to normalized MySQL relational schemas for site and inventory tracking.',
      flowLabels: [
        'HTTP Request (Requisition & Material Input)',
        'Modular Operations & Access Control Evaluation',
        'Relational Queries & Inventory Transaction Ledger',
      ],
      nodes: [
        {
          layer: 'UI & PRESENTATION',
          title: 'Responsive Management Dashboard',
          tech: 'HTML5 / CSS3 / Vanilla JS',
          detail: 'Custom dark dashboard interface with operational summaries, dynamic stock tables, and material entry forms.',
        },
        {
          layer: 'APPLICATION CONTROLLERS',
          title: 'Modular PHP Operations Core',
          tech: 'PHP Application Logic',
          detail: 'Processing project lifecycles, material stock transactions, CRM lead updates, and quotation calculations.',
        },
        {
          layer: 'DATA ACCESS LAYER',
          title: 'Database Operations & Migrations',
          tech: 'PHP Database Wrapper (db.php)',
          detail: 'Managing database connections, versioned schema patches, and parameterized SQL queries.',
        },
        {
          layer: 'PERSISTENCE TIER',
          title: 'Normalized Relational Database',
          tech: 'MySQL',
          detail: 'Relational tables linking projects, sites, material inventory records, vendor profiles, and CRM activity logs.',
        },
      ],
    },
    decisions: [
      {
        title: 'Modular Schema Partitioning Across Domains',
        rationale: 'Separated database structures for CRM, materials inventory, and project sites to allow independent maintenance and targeted SQL migration patches without operational disruption.',
      },
      {
        title: 'Minimum Stock Warning Indicators',
        rationale: 'Integrated reorder-level calculations directly into the material ledger to flag low-stock items on the main dashboard before site delays occur.',
      },
    ],
    challenges: [
      {
        challenge: 'Coordinating Versioned Database Changes',
        resolution: 'Structured versioned SQL schema migration scripts and incremental patches to systematically maintain database consistency across application updates.',
      },
      {
        challenge: 'Maintaining Responsive Tables on Field Devices',
        resolution: 'Styled mobile-friendly table layouts with horizontal scrolling and card transforms to allow site managers to review inventory and requisitions on phones.',
      },
    ],
  },

  'sms-spam-detection': {
    id: 'sms-spam-detection',
    number: '04',
    category: 'APPLIED ML & NLP',
    title: 'SMS Spam Detection',
    subtitle: 'Django-based SMS classification application with machine learning and report generation',
    tagline: 'Web classification service processing message text through NLP models with prediction history and PDF reporting',
    repoUrl: 'https://github.com/VasiharanB/sms_spam_detection',
    tone: 'blue',
    stack: ['Python', 'Django', 'Machine Learning', 'BERT', 'SQLite', 'HTML & CSS'],
    problem: {
      summary: 'Mobile messaging is constantly exploited by phishing campaigns, fraudulent banking alerts, and unsolicited marketing. Identifying deceptive SMS messages requires accurate text preprocessing, model inference, and persistent audit logs accessible through a clean web interface.',
      points: [
        'SMS messages exhibit heavy noise: informal slang, deliberate character substitution, typos, and disguised URLs.',
        'Users and moderators require clear visual classification output with confidence indicators for reviewed texts.',
        'Administrators need historical prediction logging and exportable summaries for audit review.',
      ],
    },
    workflow: {
      title: 'Message Intake & Classification Workflow',
      steps: [
        {
          number: '01',
          title: 'Message Submission',
          detail: 'User enters SMS text into the web classification form or submits samples for evaluation.',
        },
        {
          number: '02',
          title: 'Text Preprocessing',
          detail: 'Input text is normalized, sanitized, and prepared for feature extraction and tokenization.',
        },
        {
          number: '03',
          title: 'Model Classification',
          detail: 'The machine learning / BERT model processes message features to evaluate spam versus ham classification probabilities.',
        },
        {
          number: '04',
          title: 'Verdict Presentation',
          detail: 'The interface displays the resulting classification verdict alongside visual status indicators.',
        },
        {
          number: '05',
          title: 'Audit Logging & PDF Export',
          detail: 'Prediction records are saved to SQLite with timestamps and classification outcomes, with support for exportable PDF reports.',
        },
      ],
    },
    architecture: {
      overview: 'A Django web service integrating an NLP classification model with persistent SQLite history and PDF reporting.',
      flowLabels: [
        'Form POST (SMS Text Payload)',
        'Text Preprocessing & Model Inference',
        'Classification Result & Audit Log Storage',
      ],
      nodes: [
        {
          layer: 'USER INTERFACE',
          title: 'Classification Portal & Dashboard',
          tech: 'Django Templates / CSS3 / JavaScript',
          detail: 'Message input view, classification result indicators, prediction history table, and PDF export trigger.',
        },
        {
          layer: 'APPLICATION SERVER',
          title: 'Django Web Controllers',
          tech: 'Django (Python)',
          detail: 'Request routing, form validation, administrative interface management, and PDF report generation routines.',
        },
        {
          layer: 'MACHINE LEARNING ENGINE',
          title: 'NLP Classification Model',
          tech: 'Machine Learning / BERT Pipeline',
          detail: 'Tokenizing input message text and executing binary classification inference to identify spam or ham patterns.',
        },
        {
          layer: 'PERSISTENCE TIER',
          title: 'Prediction History Store',
          tech: 'SQLite',
          detail: 'Storing historical scans, timestamps, predicted classifications, and Django admin user credentials.',
        },
      ],
    },
    decisions: [
      {
        title: 'Integrated Audit Logging with Exportable Reports',
        rationale: 'Every classification is recorded in the database with timestamps and status, enabling PDF summary report generation for audit review.',
      },
      {
        title: 'Django Admin Integration for Record Review',
        rationale: 'Leveraged Django native administration interface for administrative oversight, search filters, and record management.',
      },
    ],
    challenges: [
      {
        challenge: 'Handling Irregular Text Formatting in Short Messages',
        resolution: 'SMS messages frequently feature informal spelling, concatenated words, and excessive punctuation that degrade standard tokenization.',
      },
      {
        challenge: 'Managing Model Inference Within Web Request Lifecycles',
        resolution: 'Structured model loading during application initialization so prediction calls execute efficiently within Django view request lifecycles.',
      },
    ],
  },

  'fittrack-desktop': {
    id: 'fittrack-desktop',
    number: '05',
    category: 'DESKTOP ENGINEERING',
    title: 'FitTrack Desktop',
    subtitle: 'Python desktop application with Tkinter native GUI, embedded Matplotlib analytics, and local SQLite',
    tagline: 'Offline biometric telemetry console featuring MVC architecture, custom Canvas graphics, and analytical charting',
    repoUrl: 'https://github.com/VasiharanB/FitTrack-Desktop',
    tone: 'pink',
    stack: ['Python', 'Tkinter', 'SQLite', 'Matplotlib', 'SQL'],
    problem: {
      summary: 'Cloud-dependent health and fitness trackers require ongoing connectivity and external data storage, raising personal privacy concerns. Desktop users need a self-contained, responsive application for logging personal biometric metrics with visual progress analytics.',
      points: [
        'Desktop software must run reliably offline without external network dependencies or remote service latency.',
        'Users need structured biometric record storage rather than error-prone manual spreadsheets.',
        'Graphical health visualization requires embedded desktop charts rather than separate external reporting tools.',
      ],
    },
    workflow: {
      title: 'Desktop Logging & Charting Workflow',
      steps: [
        {
          number: '01',
          title: 'Profile Configuration',
          detail: 'User enters subject metrics (height, age, gender) via numeric inputs or real-time desktop sliders.',
        },
        {
          number: '02',
          title: 'Biometric Data Entry',
          detail: 'Daily weight and fitness measurements are logged through the interactive input terminal.',
        },
        {
          number: '03',
          title: 'Telemetry & Metric Calculations',
          detail: 'Application calculates BMI category, ideal weight ranges, and comparative historical deltas.',
        },
        {
          number: '04',
          title: 'Visual Chart Generation',
          detail: 'Embedded Matplotlib figures and custom Tkinter Canvas elements update to show progress trends and category distributions.',
        },
        {
          number: '05',
          title: 'Local Database Persistence',
          detail: 'Entries are committed to local SQLite database tables with search, sorting, and export capabilities.',
        },
      ],
    },
    architecture: {
      overview: 'An offline-first desktop application built with Python and Tkinter, featuring embedded Matplotlib figures and SQLite storage.',
      flowLabels: [
        'User Biometric Form & Slider Input',
        'BMI & Statistics Calculation',
        'Matplotlib Figure Redraw & Local Database Insert',
      ],
      nodes: [
        {
          layer: 'DESKTOP SHELL & GUI',
          title: 'Tkinter Cockpit Interface',
          tech: 'Python Tkinter Native GUI',
          detail: '3-wing telemetry console with profile controls, real-time input sliders, animated Canvas graphics, and theme selection.',
        },
        {
          layer: 'ANALYTICS ENGINE',
          title: 'Embedded Matplotlib Visualizer',
          tech: 'Matplotlib / Canvas Integration',
          detail: 'Rendering biometric trend lines, WHO category spectrum charts, and statistical comparison matrices directly in the window.',
        },
        {
          layer: 'CONTROLLER & MVC LOGIC',
          title: 'Application Controller & Evolution Studio',
          tech: 'Python MVC Architecture',
          detail: 'Managing input validation, metric calculations, and side-by-side execution comparison between classic and orbital versions.',
        },
        {
          layer: 'LOCAL DATABASE',
          title: 'Self-Contained Database',
          tech: 'SQLite 3',
          detail: 'Local storage for user profiles, timestamped biometric records, and application settings without external servers.',
        },
      ],
    },
    decisions: [
      {
        title: '100% Offline-First Architecture',
        rationale: 'Zero external API or network dependencies ensures complete privacy for personal health data and instant application startup.',
      },
      {
        title: 'Modular MVC Architecture Evolution',
        rationale: 'Restructured the application from a single-file procedural script (vasi.py) into modular controllers, views, and models (FitTrack Enterprise) with an interactive comparison studio (showcase.py).',
      },
    ],
    challenges: [
      {
        challenge: 'Embedding Dynamic Matplotlib Charts inside Native Tkinter Frames',
        resolution: 'Standard Matplotlib plotting windows open separate UI shells, disrupting an integrated desktop dashboard experience. Integrated Matplotlib canvas backends directly into Tkinter frame containers with styled dark-theme plot configurations.',
      },
      {
        challenge: 'Maintaining Interactive Canvas Telemetry in Python GUI',
        resolution: 'Implemented custom Tkinter Canvas drawing routines with double-buffering patterns to render smooth biometric gauges without external GUI libraries.',
      },
    ],
  },

  'aethon-ai': {
    id: 'aethon-ai',
    number: '06',
    category: 'COLLABORATIVE PLATFORMS',
    title: 'Aethon AI',
    subtitle: 'Collaborative placement-preparation and assessment platform',
    tagline: 'Multi-portal assessment platform supporting student practice modules, coding evaluations, and admin analytics',
    repoUrl: 'https://github.com/VasiharanB/aethon-ai',
    tone: 'mint',
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'REST APIs'],
    problem: {
      summary: 'Students preparing for competitive campus recruitment require structured practice across coding challenges, aptitude tests, and interview topics. Placement coordinators require administrative tools to manage question banks and evaluate candidate cohorts.',
      points: [
        'Disparate practice tools offer no consolidated overview of candidate preparation across technical and logical domains.',
        'Coordinators need administrative control to create assessments, curate question banks, and track cohort readiness.',
        'Test sessions require reliable answer recording and session tracking to prevent data loss.',
      ],
    },
    workflow: {
      title: 'Assessment & Feedback Lifecycle',
      steps: [
        {
          number: '01',
          title: 'Student Authentication',
          detail: 'Candidate logs in through the student portal to access assigned assessments and preparation modules.',
        },
        {
          number: '02',
          title: 'Module & Assessment Selection',
          detail: 'Candidate selects coding challenges, aptitude tracks, or company-specific practice tests.',
        },
        {
          number: '03',
          title: 'Timed Assessment Execution',
          detail: 'Student completes questions within session time limits with question navigation and answer recording.',
        },
        {
          number: '04',
          title: 'Scoring & Analytics Generation',
          detail: 'The platform records answers, computes section scores, and updates individual progress analytics.',
        },
        {
          number: '05',
          title: 'Administrative Oversight',
          detail: 'Placement coordinators inspect the admin dashboard for student management, question curation, and performance reports.',
        },
      ],
    },
    architecture: {
      overview: 'A full-stack web platform pairing a React frontend with a Node.js/Express API and MySQL relational storage.',
      flowLabels: [
        'Asynchronous Answer Staging & Test Events',
        'Session Verification & Scoring Rubric',
        'Score Calculation & Attempt History Persistence',
      ],
      nodes: [
        {
          layer: 'CLIENT TIER',
          title: 'Student & Admin Portals',
          tech: 'React / TypeScript',
          detail: 'Timed test interfaces, coding challenge workspace, aptitude modules, student management views, and admin analytics.',
        },
        {
          layer: 'API GATEWAY',
          title: 'Express REST API',
          tech: 'Node.js / Express',
          detail: 'Authentication, route protection, student profile endpoints, question bank delivery, and answer submission handling.',
        },
        {
          layer: 'EVALUATION & ASSESSMENT ENGINE',
          title: 'Scoring & Progress Logic',
          tech: 'Node.js Service Modules',
          detail: 'Scoring candidate answer submissions, calculating domain progress metrics, and aggregating cohort performance data.',
        },
        {
          layer: 'PERSISTENCE TIER',
          title: 'Relational Database',
          tech: 'MySQL',
          detail: 'Storing user credentials, candidate profiles, question banks categorized by topic and difficulty, and test attempt histories.',
        },
      ],
    },
    decisions: [
      {
        title: 'Separation of Student and Administrator Portals',
        rationale: 'Dedicated portal routes and views prevent accidental exposure of evaluation keys and administrative management tools to students while sharing common database models.',
      },
      {
        title: 'Structured Multi-Category Question Schema',
        rationale: 'Designed relational tables accommodating both multiple-choice aptitude items and coding problem specifications with test cases and difficulty tiers.',
      },
    ],
    challenges: [
      {
        challenge: 'Coordinating Timed Assessment Sessions with Dynamic Navigation',
        resolution: 'Candidates navigate back and forth across multi-question tests while maintaining accurate timer states and recorded answers. Structured client-side assessment state management with per-question answer tracking synchronized against the assessment session.',
      },
      {
        challenge: 'Managing Varied Question Types in Relational Schemas',
        resolution: 'Structured flexible database relations supporting multiple-choice options, text responses, and programming challenge metadata.',
      },
    ],
  },
}
