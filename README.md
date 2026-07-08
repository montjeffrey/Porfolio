# Jeffrey Montoya - Portfolio Website

A high-performance, animated portfolio website built with Next.js 14+ that bridges the gap between Technical Implementation (Cloud/Security/Code) and Operational Management (CRM/Workflows).

## 🎨 Design

**Theme:** Dark Tech Premium
- Primary Color: Burnt Orange (#E77D22)
- Secondary Color: Soft Cream (#F0EDE4)
- Background: Dark (#0D0D0D)
- Elevated Background: Dark Gray (#1A1A1A)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for contact form)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Portfolio
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory. See `ENV_TEMPLATE.md` for
the full list; the two required server-only variables are:
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```
These are read only by server-side route handlers (`lib/supabase/server.ts`)
and must never be given a `NEXT_PUBLIC_` prefix.

4. Set up Supabase

Run the migration in `supabase/migrations/0001_leads_and_telemetry.sql`
against your Supabase project (via the SQL editor or the Supabase CLI). It
creates the `leads.messages` and `telemetry.component_events` tables with
row-level security enabled and no policies — all access goes through the
service-role key in server route handlers only.

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── contact/           # Contact page wired to /api/leads
│   ├── projects/          # Projects listing and case studies
│   ├── resume/            # Resume Hub page
│   ├── api/               # Route handlers
│   │   ├── leads/         # POST /api/leads — validated, rate-limited, scored
│   │   ├── roi/report/    # POST /api/roi/report — server-recomputed ROI snapshot
│   │   └── telemetry/     # POST /api/telemetry — component usage events
│   ├── layout.tsx         # Root layout with navbar and footer
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles, alignment token blocks
├── components/            # React components
│   ├── Navbar.tsx         # Glassmorphism navigation (mounts AlignmentToggle)
│   ├── Footer.tsx         # Site footer
│   ├── Hero.tsx           # Hero section with typing effect and beam background
│   ├── SkillsBentoGrid.tsx # Skills showcase in Bento grid layout
│   ├── FeaturedProjects.tsx # Featured projects section
│   ├── BrandStatement.tsx # Brand statement section
│   ├── BottomCTA.tsx      # Bottom call-to-action
│   ├── ProjectCard.tsx    # Project card with tech stack marquee
│   ├── AlignmentToggle.tsx # Segmented control for the site alignment theme
│   ├── roi/               # ROI Impact Calculator (sliders, output panel, math disclosure)
│   └── blueprint/          # System Blueprint Visualizer (canvas, node glyphs, inspector)
├── lib/                   # Application logic and utilities
│   ├── alignment/         # Alignment tokens, voice copy, and Zustand store
│   ├── roi/               # ROI model, schema, types, and Zustand store
│   ├── blueprint/         # Blueprint graph data, layout, validation, closure helpers
│   ├── leads/             # Lead zod schema, scoring, and rate limiting
│   ├── supabase/          # Server-only Supabase service client
│   ├── telemetry.ts       # Client-safe telemetry beacon helper
│   └── utils.ts           # Utility functions
├── supabase/
│   └── migrations/        # SQL migrations (leads + telemetry schemas, RLS)
└── public/                # Static assets
```

## 🛠️ Features

### Pages

- **Home:** Hero section with animated typing effect and Three.js beam background, Skills Bento Grid, Featured Projects, Brand Statement
- **Projects:** Filterable project grid with tech stack marquee on hover, case study pages with type-specific layouts
- **About:** Professional journey timeline, certifications, technical proficiencies
- **Contact:** Supabase-integrated contact form with validation
- **Resume Hub:** Multiple resume versions with download/view options

### Components

- **Hero:** Typing effect cycling through skills (Python, AWS, Security, Operations) with animated beam background
- **Skills Bento Grid:** 4-card grid showcasing Cloud, Security, Development, and Operations skills
- **Project Cards:** Interactive cards with tech stack marquee animation on hover
- **Case Studies:** Type-specific layouts:
  - **Web Dev:** Before/After performance metrics slider
  - **ML/Python:** Code blocks + Architecture diagrams
  - **Security:** Terminal output styles

### Animations

- Framer Motion for page transitions and component animations
- Three.js for beam background effect
- CSS animations for typing effect and marquee scrolling

### Modules

- **Alignment Toggle:** A global site-wide theme switcher (`components/AlignmentToggle.tsx`, mounted in the navbar) that swaps between three token sets — Ember, Meridian, and Atelier — each pairing a distinct color palette with a distinct copy "voice" (operator, boardroom, studio). Selection is persisted to `localStorage`, applied pre-paint via a bootstrap script in `app/layout.tsx` to avoid a flash of the wrong theme, and driven by the Zustand store in `lib/alignment/`.
- **ROI Impact Calculator:** A home-page section (`components/roi/RoiCalculator.tsx`) where visitors move sliders describing their operation — technician count, admin time, error/rework rates, loaded hourly cost — and see projected annual savings, hours reclaimed, and payback period update live, backed by a pure model in `lib/roi/model.ts`. A "Show the math" disclosure prints the formulas with live values, and visitors can send the current snapshot along with a contact form submission via `POST /api/roi/report`.
- **System Blueprint Visualizer:** An interactive SVG system diagram (`components/blueprint/BlueprintCanvas.tsx`) showing how a field-service operation's data flows between mobile techs, the ingest API, the CRM core, a routing engine, and an admin dashboard. Selecting a node highlights its connected "blast radius" and opens an inspector panel with details and metrics; animated pulses along edges are gated by device performance tier and respect reduced-motion preferences.

## 📝 Pages Overview

### Home Page
- Hero section with typing effect
- Skills snapshot in Bento Grid layout
- Featured projects preview
- Brand statement
- Bottom CTA section

### Projects Page
- Filterable project grid (All, Web Development, Data/ML, Security Tools, Automation)
- Project cards with tech stack marquee
- Links to detailed case studies

### Case Studies
Each project has a dedicated case study page with:
- Project overview (Challenge, Solution, Impact)
- Technical architecture diagrams
- Key technical decisions
- Results & metrics
- Type-specific layouts based on project category

### About Page
- Professional journey timeline
- Personal story and motivation
- Current and in-progress certifications
- Technical proficiencies breakdown
- Soft skills showcase

### Contact Page
- Contact information sidebar
- "What I Can Help With" section
- Supabase-integrated contact form
- Form validation and success/error states

### Resume Hub
- Three resume versions:
  - Technical Resume
  - Public Information Specialist Resume
  - Solutions Engineer Resume
- Download/View PDF options
- Core competencies section

## 🎯 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **3D Graphics:** Three.js
- **Database:** Supabase (PostgreSQL)
- **Icons:** Lucide React
- **TypeScript:** Full type safety

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run `supabase/migrations/0001_leads_and_telemetry.sql` to create the
   `leads.messages` and `telemetry.component_events` tables (RLS is enabled
   with no policies — default-deny; all access is via the service-role key)
3. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` (see
   `ENV_TEMPLATE.md`)

### Customization

- **Colors:** Edit `tailwind.config.ts` or the token values in `lib/alignment/alignments.json` to change color scheme
- **Content:** Update the relevant page or component directly for content changes
- **Components:** Modify components in `/components` directory

## 📄 License

© 2025 Jeffrey Montoya. All rights reserved.

## 🚀 Deployment

The site can be deployed to Vercel, Netlify, or any platform supporting Next.js.

```bash
npm run build
npm start
```

For Vercel:
```bash
vercel
```

## 📧 Contact

- Email: montjeffrey@gmail.com
- Phone: (201) 841-9697
- LinkedIn: [linkedin.com/in/montjeffrey](https://linkedin.com/in/montjeffrey)
- Location: Dover, NJ (Open to remote opportunities)

