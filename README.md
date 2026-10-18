# VYRA — Vasiharan B

A distinctive, chess-inspired portfolio for **Vasiharan B**, a full-stack developer building practical web applications, business software, and AI-assisted products. VYRA combines a dark editorial visual system, immersive 3D details, clear project case studies, and a direct freelance inquiry flow.

**Live portfolio:** https://vyra-portfolio.vercel.app  
**Repository:** https://github.com/VasiharanB/VYRA-Portfolio-

## Experience highlights

- **Cinematic opening sequence** — a 3D chess-inspired intro with a skip option, a bounded safety timeout, and session-aware replay behavior.
- **Interactive 3D hero** — a chess/gyroscope visual identity with reduced-motion and graphics-support fallbacks.
- **Two visual themes** — OBSIDIAN and IVORY, switched with the custom VYRA Palette Shift control. The selected theme is persisted in the browser; first-time visitors follow their system preference.
- **Selected work and case studies** — six project stories with interactive detail drawers and architecture diagrams.
- **Chess-inspired qualities** — interactive King, Queen, Rook, Bishop, Knight, and Pawn sections using attributed 3D Staunton models.
- **Interactive tech toolbelt** — explore technologies and see their relationships to featured projects.
- **Command palette** — quick navigation and actions using `Ctrl+K` on Windows/Linux or `⌘K` on Apple platforms.
- **Freelance services and project inquiry** — a validated inquiry form prepares a message for WhatsApp or offers an email fallback. The visitor reviews and sends the message through their chosen app; the site does not submit it to a portfolio-owned backend.
- **Responsive and considerate interaction** — layouts for mobile, tablet, and desktop, keyboard-friendly controls, reduced-motion handling, and code-split heavier interactive views.

## Featured projects

| Project | Focus |
| --- | --- |
| FitTrack Desktop | Python desktop application, SQLite persistence, and analytics visualisation |
| JGC Construction ERP | Construction operations including CRM, projects, materials, and inventory |
| Cricket Conquest | IPL auction workflow, real-time updates, and role-based access |
| Smart Issue Tracker | Semantic duplicate-ticket detection and AI-assisted verification |
| Aethon AI | Collaborative placement-preparation and assessment platform |
| SMS Spam Detection | Django application for SMS spam/ham classification |

Project cards link to their corresponding repositories from the portfolio.

## Technology

- **UI:** React 18, TypeScript, Vite
- **3D:** Three.js, React Three Fiber, and Drei
- **Motion and icons:** Framer Motion, Lucide React
- **Styling:** custom CSS, responsive layouts, OBSIDIAN/IVORY theme tokens
- **Build checks:** TypeScript validation followed by a Vite production build
- **Hosting:** Vercel

## Run locally

### Requirements

- Node.js **24.x** (the version declared in `package.json`)
- npm

### Setup

```bash
git clone https://github.com/VasiharanB/VYRA-Portfolio-.git
cd VYRA-Portfolio-
npm ci
npm run dev
```

Open the local URL printed by Vite.

### Production build

```bash
npm run build
npm run preview
```

The build script runs TypeScript validation and then creates the production site in `dist/`. There is no separate automated test script currently defined in `package.json`; treat a successful production build as a compile/build check, not as a full browser-based regression test.

## Deploy to Vercel

The repository includes `vercel.json` with the build command, install command, and output directory.

1. Import `VasiharanB/VYRA-Portfolio-` in [Vercel](https://vercel.com/).
2. Keep the project root set to `/`.
3. Use the repository's configured `npm run build` command and `dist` output directory.
4. Connect the Git repository so Vercel can create preview deployments for branches and production deployments from the configured production branch.

The current portfolio does not require environment variables or a portfolio-owned backend. The site loads its web fonts from Google Fonts; outbound contact actions open WhatsApp or the visitor's email application.

## Repository map

```text
src/
  components/
    about/      Engineering principles
    chess/      Interactive chess qualities and 3D pieces
    command/    Command palette
    contact/    Project inquiry form
    cursor/     Custom cursor
    hero/       3D hero and fallbacks
    intro/      Cinematic opening sequence
    services/   Freelance services
    stack/      Interactive technology toolbelt
    theme/      Theme switch
    work/       Project cards and case-study views
  context/      Theme state
  data/         Project, case-study, and skill data
  hooks/        Reduced-motion and WebGL support checks
  styles.css    Responsive UI and theme styling
public/
  models/       Attributed Staunton chess models
scripts/        Model conversion utilities
```

## Attribution and license

The portfolio source is distributed under the MIT License; see [LICENSE](./LICENSE). The 3D Staunton chess models have their own attribution and MIT license details in [public/models/CREDITS.md](./public/models/CREDITS.md). Preserve those notices when redistributing the associated assets.

## Contact

- **Email:** [vasiharan030@gmail.com](mailto:vasiharan030@gmail.com)
- **GitHub:** [@VasiharanB](https://github.com/VasiharanB)
- **LinkedIn:** [Vasiharan B](https://www.linkedin.com/in/vasiharan-b-ba0772322/)
