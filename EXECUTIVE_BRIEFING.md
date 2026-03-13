# ZeoLearn — Complete Platform Documentation & Executive Briefing

> **Prepared for**: CEO, CTO, Leadership Team
> **Date**: March 2026
> **Version**: 3.0
> **Status**: Production (zeo-ai.vercel.app)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Platform Vision & Purpose](#2-platform-vision--purpose)
3. [Technology Architecture](#3-technology-architecture)
4. [Security & Compliance](#4-security--compliance)
5. [Complete Feature Walkthrough](#5-complete-feature-walkthrough)
6. [Admin Console Walkthrough](#6-admin-console-walkthrough)
7. [Content Inventory](#7-content-inventory)
8. [AI & Intelligence Layer](#8-ai--intelligence-layer)
9. [Database Schema](#9-database-schema)
10. [Multi-Persona Review & Ratings](#10-multi-persona-review--ratings)
11. [Gaps & Future Roadmap](#11-gaps--future-roadmap)
12. [Appendix](#12-appendix)

---

## 1. Executive Summary

**ZeoAI** is Zeotap's internal learning and enablement platform — a comprehensive system that onboards, trains, certifies, and continuously upskills every employee across all roles (Engineering, Sales, CS, Product, Marketing, Leadership, HR).

### What It Is
An interactive, gamified learning management system built specifically for Zeotap's CDP product knowledge. It combines structured learning tracks, hands-on simulators, AI-powered assistance, competitive sales tools, and admin analytics — all in a single platform.

### By The Numbers

| Metric | Value |
|--------|-------|
| Learning Tracks | 6 |
| Modules | 56 |
| Total Learning Hours | 32+ |
| Glossary Terms | 52 |
| Badges | 10 |
| Certification Levels | 3 |
| Interactive Simulators | 9 |
| AI Skills | 21 (across 8 industries) |
| Battle Cards | 5 competitors |
| Case Studies | 8 |
| Deal Prep Industries | 5 |
| Partners Documented | 5 |
| Learning Plan Templates | 5 |
| API Endpoints | 30+ |
| Components | 80+ |
| Lines of Code | ~25,000+ |

### Key Differentiators vs. Generic LMS
1. **CDP-specific simulators** — Data Pipeline, Segment Builder, Identity Resolution, Journey Builder, Audience Builder, Churn Detection, Data Health — employees learn by doing, not just reading
2. **ZEOBOT AI** — Floating AI assistant answers any CDP question instantly from Zeotap's documentation
3. **Role-based personalization** — 7 roles get tailored learning paths, recommendations, and assessments
4. **Sales enablement suite** — Battle cards, deal prep, case studies, partner directory built in — not a separate tool
5. **Knowledge Universe** — Interactive architecture visualization showing all 22 platform components and data flows
6. **Celebration engine** — Physics-based particle animations for achievements — genuinely delightful gamification
7. **Admin intelligence** — Real-time analytics, at-risk learner detection, team comparisons, ROI tracking

---

## 2. Platform Vision & Purpose

### Problem Solved
Zeotap's CDP is technically complex, spanning data collection, identity resolution, audience management, activation, and AI/ML. New hires take weeks to become productive. Sales reps struggle to articulate technical differentiators. CS teams lack deep product knowledge for QBRs. Knowledge is fragmented across docs, Slack, and tribal knowledge.

### Target Users
- **Engineering** (18 deep-dive modules) — Platform architecture, infrastructure, CI/CD
- **Sales** (10 modules + battle cards + deal prep) — Pitch, demo, objection handling, verticals
- **Customer Success** (10 modules + TAM track) — Onboarding, health scores, renewals, QBRs
- **Product** (6 modules) — Dashboard, features, audience builder, journeys
- **Marketing** (6 foundational modules) — CDP basics, market positioning
- **Leadership** (cross-track access) — Strategic overview, team performance
- **HR** (onboarding focus) — New hire enablement, role assignment

### Success Metrics
- Time-to-competency (tracked via module completion velocity)
- Quiz pass rates (knowledge retention)
- Certification rates (competency benchmarks)
- Sales readiness scores (sales team preparedness)
- Learning engagement (streaks, active learners, DAU/MAU)

---

## 3. Technology Architecture

### Stack Overview

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14.2 (App Router) | Server Components, streaming, file-based routing |
| **Language** | TypeScript 5.7 (strict) | Type safety across full stack |
| **UI** | React 18.3 + Tailwind CSS 3.4 | Component-based UI with utility-first styling |
| **Icons** | Lucide React 0.468 | 1000+ consistent SVG icons |
| **Charts** | Recharts 2.15 | AreaChart, BarChart, PieChart, RadarChart |
| **Content** | MDX Remote 6.0 | Rich markdown with embedded React components |
| **Diagrams** | Mermaid 11.13 | Architecture and flow diagrams in content |
| **Database** | Supabase (PostgreSQL) | Auth, real-time, RLS, storage |
| **AI** | Mintlify Discovery API | Documentation-powered AI assistant |
| **Validation** | Zod 4.3 | Runtime schema validation on all inputs |
| **Monitoring** | Sentry 10.43 | Error tracking, performance monitoring |
| **PDF Export** | html2canvas + jsPDF | Certificate generation and download |
| **Deployment** | Vercel | Edge network, auto-scaling, preview deploys |

### Design System

| Token | Value | Usage |
|-------|-------|-------|
| Font (Sans) | Inter | All UI text |
| Font (Mono) | JetBrains Mono | Code, technical content |
| Primary Blue | #3b82f6 | Buttons, focus rings, active states |
| Brand Purple | #a855f7 | Gradients, secondary accents |
| Brand Green | #10b981 | Success, completion, checkmarks |
| Brand Amber | #f59e0b | Warnings, sales role |
| Brand Rose | #f43f5e | Errors, destructive actions |
| BG Primary | #020617 | Page background (dark mode) |
| BG Surface | #111827 | Cards, elevated surfaces |
| Text Primary | #e2e8f0 | Main content text |
| Text Muted | #8b9ab8 | Secondary text (WCAG AA compliant) |
| Border | rgba(255,255,255,0.08) | Subtle dividers |
| Radius | 12-24px | Rounded corners throughout |

### Component Library (80+ components across 9 categories)

| Category | Count | Examples |
|----------|-------|----------|
| **UI Primitives** | 14 | Button, Card, Modal, Input, ProgressBar, Badge, Toast, Skeleton, ErrorBoundary |
| **Layout** | 9 | Navbar, Sidebar, MobileBottomNav, PageTransition, ThemeToggle, SearchModal |
| **Learning** | 13 | QuizEngine, ScenarioQuiz, ModuleToolbar, CertificateGenerator, ScrollTracker |
| **Interactive** | 14 | DataPipelineSimulator, SegmentBuilder, IdentityViz, JourneyBuilder, ZEOBOT |
| **Admin** | 8 | AnalyticsCharts, SkillMatrix, ROICharts, OnboardingFunnel, AtRiskLearners |
| **MDX** | 10 | Callout, ArchDiagram, Expandable, KeyConcepts, ComparisonTable, FlowDiagram |
| **Universe** | 4 | UniverseCanvas, Controls, DetailPanel, Minimap |
| **Codebase** | 5 | RepoCard, DomainCard, RepoRelationshipDiagram, DocsPanel |
| **Onboarding** | 2 | WelcomeWizard, SSOButton |

### Accessibility (WCAG AA)
- Skip-to-content link (keyboard-accessible)
- ARIA live regions for screen reader announcements
- Focus trapping in modals with auto-focus
- Keyboard navigation (Cmd+K search, arrow keys, Tab cycling, Escape to close)
- `aria-current="page"` on active nav items
- `aria-expanded`, `aria-haspopup` on dropdowns
- Focus ring utilities on all interactive elements
- WCAG AA contrast ratios on all text
- Form labels with error state descriptions

### Animations
- 6 CSS keyframe animations (fade-in, slide-up, slide-in-right, pulse-glow, scale-in)
- Physics-based celebration particle engine (canvas rendering, gravity, drag, rotation)
- 4 celebration types: badge (60 particles), quiz (40), module (25), certification (80 multi-wave)
- Stagger animations for list items (50ms increments)
- Page transitions (opacity fade, 200ms)

---

## 4. Security & Compliance

### Authentication
- **Supabase Auth** with email/password and Google Workspace OAuth
- **Domain restriction** — Only @zeotap.com email addresses can register
- **SSO-ready** — SSOButton component with domain whitelist configuration
- **Session management** — Server-side auth checks in layouts, middleware session refresh

### Authorization (RBAC)
- **3 permission levels**: Regular user, Manager (`is_manager`), Admin (`is_admin`)
- **Row-Level Security (RLS)** on all Supabase tables:
  - Users access only their own progress, notes, bookmarks, quiz attempts
  - Managers see their assigned users
  - Admins read all data
- **Protected routes** — Middleware redirects unauthenticated users to `/login`

### API Security
- **Rate limiting** — 100 requests/minute per IP (sliding window)
- **Input validation** — Zod schemas on all API inputs (progress, feedback, quiz, assignments)
- **Error handling** — `withErrorHandling()` wrapper catches all route errors, sanitizes responses
- **Safe JSON parsing** — Try-catch on all request body parsing

### HTTP Security Headers
| Header | Value | Protection |
|--------|-------|-----------|
| X-Frame-Options | DENY | Prevents clickjacking |
| X-Content-Type-Options | nosniff | Prevents MIME sniffing |
| Referrer-Policy | strict-origin-when-cross-origin | Limits referrer data leakage |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | Disables sensitive browser APIs |
| Content-Security-Policy | Strict self-only policy | Prevents XSS, injection attacks |
| Cache-Control | Immutable for static, no-cache for API | Proper caching strategy |

### Data Privacy
- Cascading deletes on user data (right to erasure)
- No PII in analytics events
- Consent-aware architecture (TCF 2.2 referenced in content)
- GDPR module in Engineering track

---

## 5. Complete Feature Walkthrough

### 5.1 Landing Page & Authentication

**Landing Page** (`/`)
- Hero section: "Master Zeotap CDP From Any Role"
- 5 role cards (Engineering, Sales, CS, Product, Marketing) with icons and descriptions
- Stats row: 6 Learning Tracks, 56 Modules, 10+ Quizzes, 10 Badges
- CTA buttons: "Start Learning" (primary), "Sign In" (secondary)

**Login** (`/login`)
- Google Workspace Sign-In button (Chrome icon)
- Email/password form (placeholder: you@zeotap.com)
- Domain restriction error handling for non-Zeotap accounts
- Forgot password and signup links

**Signup** (`/signup`) — 2-step flow:
- **Step 1**: Full name, email (@zeotap.com), password (min 6 chars)
- **Step 2**: Role selection (7 roles with icons, descriptions, visual selection) + optional team input
- Auto-creates Supabase profile with selected role

**Onboarding** — WelcomeWizard modal on first login:
- Product overview introduction
- Learning path orientation
- Quick-start recommendations
- Sets `onboarding_completed = true` on dismiss

---

### 5.2 Home Dashboard (`/home`)

The main landing page after login. Fully personalized to the user.

**Welcome Section:**
- Dynamic greeting: "Good morning/afternoon/evening, {firstName}!"
- Module completion status indicator

**Resume Learning Card:**
- Shows most recent in-progress module with direct "Continue" link
- If no modules started: "Get Started" card pointing to first module

**Stats Row (4 columns):**
| Stat | Description |
|------|-------------|
| Overall Progress | Percentage of all modules completed |
| Modules Done | Count of completed modules |
| Quizzes Passed | Count of passed quizzes |
| Badges Earned | Count of earned badges |

**Recommended Next:**
- Smart recommendations based on role, current progress, and track priorities
- Foundational tracks recommended first, then specialized

**Nudge Banners:**
- Engagement nudges for inactive users or milestone reminders

**Progress Dashboard:**
- Analytics charts: progress over time, quiz performance, badge progression
- Uses Recharts (BarChart, PieChart, RadarChart, AreaChart)

**Your Learning Tracks:**
- Grid of track cards with colored icon, title, subtitle, progress bar, module count, estimated hours
- "Required" badge for mandatory tracks

**Activity Feed:**
- Recent activity timeline (module completions, badges earned, quizzes taken)

**Quick Actions (7 tiles):**
| Action | Destination |
|--------|-------------|
| Data Pipeline Simulator | /explore (Pipeline tab) |
| Segment Builder | /explore (Segment tab) |
| Identity Visualization | /explore (Identity tab) |
| Assessments | /assess |
| Achievements | /achievements |
| Certifications | /certifications |
| Glossary | /glossary |

---

### 5.3 Learning Hub (`/learn`)

**Recommended Tracks Section:**
- Tracks matching the user's role shown prominently
- Each track card: colored icon, title, subtitle, modules, hours, progress bar, "Required" badge
- Expandable module list: icon, title, description, content type badge, estimated minutes, completion checkmark

**Other Tracks Section:**
- Non-recommended tracks (still accessible, lower visual priority)

**Module Detail Page** (`/learn/[trackId]/[moduleId]`):
- Full content via MDX with rich components (Callouts, Diagrams, Key Concepts, Comparison Tables)
- Scroll progress tracker
- Module toolbar (bookmark, notes, mark complete)
- Embedded knowledge checks
- Related documentation links (Mintlify)
- Module feedback form

---

### 5.4 Interactive Simulators & Labs (`/explore`)

9 tabbed simulators for hands-on learning:

| # | Tab | Description | Key Features |
|---|-----|-------------|--------------|
| 1 | **Data Pipeline** | Real-time data flow visualization | 6+ pipeline stages, animated data packets, log console, configurable events |
| 2 | **Architecture** | Interactive CDP component map | Visual graph of all platform components with connections |
| 3 | **Identity Resolution** | Profile merge visualization | Deterministic + probabilistic matching, UCID generation flow |
| 4 | **Segment Builder** | Audience segment practice | 7 field types, AND/OR operators, real-time matching against 1M users, templates |
| 5 | **Journey Builder** | Visual journey building | Drag-and-drop canvas with triggers, conditions, actions |
| 6 | **Leaderboard** | Top learners ranking | XP, badges, streak — filterable by team and time period |
| 7 | **Audience Builder** | Full workflow | Discover schema, define segments, estimate reach |
| 8 | **Churn Detection** | Churn prediction lab | Identify churn signals, score risk, recommend interventions |
| 9 | **Data Health** | Pipeline health dashboard | Pipeline status, failure rates, destination health |

---

### 5.5 Assessments & Quizzes (`/assess`)

- **Scenario-based quizzes** — Narrative + branching questions (data pipeline, customer, sales scenarios)
- **Standard multiple-choice** — Knowledge verification with explanations
- Configurable pass score, time tracking, answer explanations
- Badge award on 100% score ("Quiz Ace")
- Celebration animation on pass
- Full history stored in Supabase

---

### 5.6 ZEOBOT AI Assistant

**Floating Widget** (bottom-right, all dashboard pages):
- 420px wide, 600px tall chat panel
- Powered by Mintlify Discovery API (Zeotap documentation)
- Streaming responses with markdown rendering
- "Powered by ZeoAI" badge
- Session-based conversation history
- 3 starter prompts: "What is Zeotap CDP?", "How do I build an audience?", "Tell me about identity resolution"
- Architecture: Client → `/api/zeobot` proxy → Mintlify API (strips citations automatically)

---

### 5.7 Achievements & Certifications

**10 Badges:**

| Badge | Title | How to Earn |
|-------|-------|-------------|
| 🌱 | First Steps | Complete your first module |
| ⚡ | Fast Learner | Complete 5 modules in one session |
| 🎯 | Quiz Ace | Score 100% on any quiz |
| 🏢 | Business Graduate | Complete Business Essentials track |
| 🎨 | Product Expert | Complete Product Mastery track |
| 💼 | Sales Pro | Complete Sales Enablement track |
| 🤝 | CS Champion | Complete Customer Success Playbook |
| ⚙️ | Engineering Master | Complete Engineering Deep Dive |
| 👑 | All-Rounder | Complete every track |
| 🔥 | 7-Day Streak | Learn something 7 days in a row |

**3 Certification Levels:**

| Level | Required Tracks | Required Quizzes | Min Score |
|-------|----------------|-----------------|-----------|
| Associate (Blue) | 1 (Business Essentials) | 1 quiz | 70% |
| Professional (Purple) | 2 (Business + Product) | 2 quizzes | 70% |
| Expert (Gold) | 3 (Business + Product + Engineering) | 4 quizzes | 80% |

- Progress bars, requirements checklists, certificate PDF/PNG generation and download

---

### 5.8 Sales Enablement Suite

**Battle Cards** (`/battle-cards`) — 5 competitors:

| Competitor | Tagline |
|-----------|---------|
| Treasure Data | Enterprise CDP focused on data unification |
| Tealium | Tag management roots, CDP evolved |
| Segment (Twilio) | Developer-first CDP, now under Twilio |
| mParticle | Mobile-first customer data infrastructure |
| Adobe Real-Time CDP | Enterprise suite play within Adobe Experience Cloud |

Each card: Overview tab (differentiators + weaknesses), Head-to-Head tab (feature comparison), Talk Track tab (5 talking points with copy button). Searchable, win/loss badges.

**Case Studies** (`/case-studies`) — 8 studies:

| Customer | Industry | Hero Metric |
|----------|----------|-------------|
| EU Fashion Retailer | Retail | 78% match rate |
| European Telco | Telecom | 19% churn reduction, €4.2M saved |
| Top 10 EU Bank | Finance | 6.4% conversion (3.2x lift) |
| Digital Media Publisher | Media | +45% CPM |
| National Grocery Chain | Retail | +40% active members |
| Mobile Operator (DACH) | Telecom | 25% CAC reduction |
| Pan-European Insurer | Finance | 79% renewal rate (+11pts) |
| Global Pharma Company | Healthcare | +30% engagement |

Expandable cards: Challenge, Solution, Outcome, Metrics grid, Tags. Filterable by industry.

**Deal Prep** (`/deal-prep`) — 5 industries (Retail, Telecom, Finance, Media, Healthcare):
- Key talking points (4 per industry)
- Recommended study modules (5-6 linked)
- Relevant battle cards
- Common objections & responses (3 per industry)
- Suggested demo flow (5 steps)

**Partners** (`/partners`) — 5 partners (Snowflake, GCP, Braze, Salesforce, The Trade Desk) with capabilities and integration levels.

---

### 5.9 Knowledge Universe (`/universe`)

Interactive canvas visualization of Zeotap's architecture:

| Category | Nodes | Examples |
|----------|-------|---------|
| Collect | 4 | Web SDK, Mobile SDK, S2S API, Integr8 |
| Ingest & Process | 4 | Kafka, Beam, Spark, CDAP |
| Store & Unify | 3 | Identity Graph, Profile Store, BigQuery |
| Intelligence | 4 | Audience Engine, Ada/Zoe AI, ML Platform, Journey Engine |
| Activate | 2 | Destinations (100+), SmartPixel (<50ms) |
| Platform Services | 6 | GKE, Terraform, Observability, CI/CD, Privacy, Auth |

22 nodes, 30 edges, 4 animated data flow paths. Pan/zoom, node selection, category filters, search, flow simulation, minimap, keyboard shortcuts.

---

### 5.10 Profile & Library

**Profile** (`/profile`): Avatar upload, personal info (name, designation, location, phone, LinkedIn, bio), organization (team, department, role selector), sales readiness gauge (sales only), streak heatmap.

**Library** (`/library`): Bookmarks tab (saved modules) + Notes tab (searchable user notes). Both show counts.

---

### 5.11 Glossary (`/glossary`)

52 terms across 7 categories (Identity, Data, AI & ML, Infrastructure, Privacy, Activation, General). Searchable, color-coded category badges, related terms. Key terms: Ada, UCID, ID+, Integr8, SmartPixel, Delta Lake, Kafka, BigQuery, Vertex AI, GDPR, TCF 2.2.

---

## 6. Admin Console Walkthrough

### 6.1 Admin Dashboard & Analytics (`/admin/dashboard`)

**Primary KPIs (4 columns):** Total Users, Active Learners, Modules Completed, Avg Quiz Score

**Secondary Stats (3 columns):** Badges Earned, Quiz Pass Rate, Avg Feedback Rating

**Engagement Analytics:** DAU trend (AreaChart), module completions, top search terms, WAU/MAU/total events

**Additional Sections:**
- Team Comparison Chart (side-by-side)
- Onboarding Funnel (signup → module → completion → certification)
- Track Completion Rates (6 tracks with progress bars)
- Users by Role (7 roles, color-coded bars)
- Documentation Health Dashboard (if Mintlify configured)
- Most Active This Week (top 5 users)
- Recent Users table (last 20)
- Links: Manage Users, Manage Assignments, Report Export

---

### 6.2 User Management (`/admin/users`)

| Column | Content |
|--------|---------|
| User | Name + email, admin/manager badges |
| Role | Color-coded badge |
| Team | Team name |
| Progress | Visual progress bar with % |
| Modules | Completed count |
| Badges | Badge count |
| Joined | Registration date |

Sortable by completion percentage. Total user count summary.

---

### 6.3 Assignment Management (`/admin/assignments`)

**Single Assignment:** User dropdown, track selector, due date, notes, create button.

**Bulk Assign from Templates:**

| Template | Duration | Roles | Tracks |
|----------|----------|-------|--------|
| CS Onboarding | 21 days | CS | Business, CS Playbook, TAM |
| Sales Ramp | 28 days | Sales | Business, Sales, Product |
| Engineering Starter | 14 days | Engineering | Business, Engineering |
| Marketing Foundations | 14 days | Marketing | Business, Product |
| Full Certification | 42 days | All | Business, Product, Sales, Engineering |

Multi-select users, "Assign to X users" button.

**Assignments Table:** User, Track, Status (assigned/in_progress/completed/overdue), Due Date, Assigned Date.

---

### 6.4 Content Management (`/admin/content`)

**Tab 1 — Module Freshness:**
- Summary: Current (green), Needs Review (amber), Stale (red) counts
- Filterable list: status badge, title, track, type, last reviewed, "Mark Reviewed" button

**Tab 2 — Glossary Editor:**
- All 52 terms as editable rows (term, category badge, definition, inline edit/save)

**Content Editor** (`/admin/content/manage`):
- Expandable tracks: editable icon, title, subtitle
- Nested modules: editable icon, title, description, minutes, content type, delete

---

### 6.5 Feedback Management (`/admin/feedback`)

- Header: Open count (amber), Addressed count (green)
- Filter tabs: All | Open | Addressed
- Cards: user, date, status, content type, star rating, issue type, comment, admin response
- Address modal: original feedback display, admin response textarea, mark as addressed

---

### 6.6 Team Dashboard (`/admin/team`)

- Summary: Team Members, Avg Modules/Person, Most Active Track
- At-Risk Learners component (health score < threshold)
- Skill Matrix (role vs. track mastery grid)
- Member cards: avatar, name, role, team, modules count, badges count, per-track progress bars

---

### 6.7 ROI & Adoption Metrics (`/admin/roi`)

- Adoption Targets: target vs. actual with visual tracking
- ROI Charts: time-to-competency, engagement trends, training ROI

---

### 6.8 Platform Settings (`/admin/settings`)

**Slack Integration:**
- Webhook URL + test button
- Event toggles: Assignments, Badges, Completions, Certifications
- Save Settings

---

## 7. Content Inventory

### All Learning Tracks & Modules

**Track 1: Business Essentials** (Mandatory, 6 modules, 3 hrs)
| # | Module | Type | Time |
|---|--------|------|------|
| 1 | What is Zeotap? | Concept | 20 min |
| 2 | What is a CDP? | Concept | 25 min |
| 3 | Our Customers | Concept | 20 min |
| 4 | How Zeotap Works | Tutorial | 30 min |
| 5 | Competitive Landscape | Concept | 25 min |
| 6 | Business Model | Concept | 20 min |

**Track 2: Product Mastery** (6 modules, 4 hrs)
| # | Module | Type | Time |
|---|--------|------|------|
| 1 | Unity Dashboard | Tutorial | 30 min |
| 2 | Data Collection UI | Tutorial | 35 min |
| 3 | Audience Builder | Tutorial | 40 min |
| 4 | Journey Canvas | Tutorial | 40 min |
| 5 | Activating Data | Tutorial | 35 min |
| 6 | Reports & Dashboards | Tutorial | 30 min |

**Track 3: Sales Enablement** (10 modules, 5.5 hrs)
| # | Module | Type | Time |
|---|--------|------|------|
| 1 | The Zeotap Pitch | Concept | 25 min |
| 2 | Discovery Questions | Reference | 30 min |
| 3 | Demo Playbook | Tutorial | 35 min |
| 4 | Objection Handling | Reference | 25 min |
| 5 | Case Studies | Concept | 20 min |
| 6 | Battle Cards | Reference | 30 min |
| 7 | Vertical: Retail | Reference | 30 min |
| 8 | Vertical: Finance | Reference | 30 min |
| 9 | Vertical: Telco | Reference | 30 min |
| 10 | ROI Calculator | Reference | 25 min |

**Track 4: Customer Success Playbook** (10 modules, 5.5 hrs)
| # | Module | Type | Time |
|---|--------|------|------|
| 1 | Onboarding Checklist | Tutorial | 30 min |
| 2 | Health Score | Concept | 25 min |
| 3 | Troubleshooting | Reference | 40 min |
| 4 | Escalation Path | Reference | 20 min |
| 5 | Renewal & Expansion | Concept | 30 min |
| 6 | Integration Guides | Tutorial | 35 min |
| 7 | Health Score Deep Dive | Reference | 30 min |
| 8 | Expansion Playbook | Tutorial | 35 min |
| 9 | Vertical Success Guides | Reference | 35 min |
| 10 | QBR Template | Tutorial | 25 min |

**Track 5: Technical Account Management** (6 modules, 3 hrs)
| # | Module | Type | Time |
|---|--------|------|------|
| 1 | Account Planning | Tutorial | 30 min |
| 2 | Technical Onboarding | Tutorial | 35 min |
| 3 | Architecture Review | Reference | 30 min |
| 4 | Data Quality Ops | Reference | 25 min |
| 5 | Value Engineering | Concept | 30 min |
| 6 | Advanced Use Cases | Reference | 35 min |

**Track 6: Engineering Deep Dive** (18 modules, 10 hrs)
| # | Module | Type | Time |
|---|--------|------|------|
| 1 | Platform Overview | Deep Dive | 15 min |
| 2 | Data Collection | Deep Dive | 20 min |
| 3 | Data Ingestion | Deep Dive | 25 min |
| 4 | Identity Resolution | Deep Dive | 20 min |
| 5 | Profile Store | Deep Dive | 20 min |
| 6 | Audience Management | Deep Dive | 25 min |
| 7 | Customer Journeys | Deep Dive | 20 min |
| 8 | Data Activation | Deep Dive | 20 min |
| 9 | GenAI / Zoe | Deep Dive | 20 min |
| 10 | ML Platform | Deep Dive | 25 min |
| 11 | Reporting & BI | Deep Dive | 20 min |
| 12 | Unity Dashboard (Tech) | Deep Dive | 20 min |
| 13 | Privacy & GDPR | Deep Dive | 25 min |
| 14 | Auth & IAM | Deep Dive | 20 min |
| 15 | Infrastructure | Deep Dive | 30 min |
| 16 | Observability | Deep Dive | 20 min |
| 17 | CI/CD | Deep Dive | 20 min |
| 18 | Testing | Deep Dive | 20 min |

---

## 8. AI & Intelligence Layer

### ZEOBOT (Documentation AI)
- **Engine**: Mintlify Discovery API
- **Data source**: Zeotap's documentation (docs.zeotap.com)
- **Architecture**: Client widget → `/api/zeobot` proxy → Mintlify API
- **Response**: Streamed via ReadableStream, markdown-rendered
- **Cleanup**: Auto-strips source citations and suggestion blocks

### 21 CDP Skills (AI Skill Router)

**Core Skills (11):**

| Skill | Purpose | Triggers |
|-------|---------|----------|
| cdp-marketing-suite | Universal entry point & router | "help", "what can you do" |
| cdp-audience-finder | Translate goals into segments | "find customers", "target", "segment" |
| cdp-churn-finder | Identify at-risk customers | "churn", "retention", "at-risk" |
| cdp-data-analyzer | Business-driven analysis | "why is X happening", "analyze" |
| cdp-data-enricher | Enhance profiles with signals | "enrich", "add signals" |
| cdp-data-manager | Pipeline monitoring | "pipeline", "sync", "data quality" |
| cdp-data-scientist | Predictive models (BQML) | "predict", "model", "propensity" |
| cdp-health-diagnostics | System status checks | "broken", "failing", "error" |
| cdp-journey-recommender | Customer journeys & NBA | "journey", "next best action" |
| cdp-lookalike-finder | Find similar prospects | "lookalike", "similar", "expand" |
| cdp-metadata-explorer | Schema exploration | "schema", "attributes" |

**Industry Suites (8):**

| Suite | Vertical |
|-------|----------|
| retail-marketing-suite | Retail & E-commerce |
| gaming-marketing-suite | Gaming & Mobile Games |
| telecom-marketing-suite | Telecom & ISP |
| healthcare-marketing-suite | Healthcare & Pharma |
| media-marketing-suite | Media & Streaming |
| automotive-marketing-suite | Automotive & Fleet |
| bfsi-marketing-suite | Banking & Insurance |
| travel-marketing-suite | Travel & Hospitality |

Each suite includes: SKILL.md, kpi-glossary.md, seasonal-calendar.md, industry guides.

### Recommendation Engine (Rule-Based)
- Foundational tracks prioritized first
- Role-relevant tracks weighted higher
- In-progress modules surfaced for resume
- Smart next-module suggestion based on completion gaps

### Learner Health Scoring
- Score: 0-100
- Recency penalty: -2/day inactive (max -60)
- Completion bonus: proportional to modules finished
- Thresholds: Active (>60), At-Risk (30-60), Disengaged (<30)

---

## 9. Database Schema

### Core Tables (17+)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| profiles | User accounts | full_name, email, role, team, is_admin, is_manager, onboarding_completed |
| progress | Module completion | user_id, track_id, module_id, status, time_spent_seconds |
| quiz_attempts | Quiz results | user_id, quiz_id, score, percentage, passed, answers (JSONB) |
| badges | Earned achievements | user_id, badge_id, earned_at |
| certifications | Issued certs | user_id, cert_id, level, issued_at |
| assignments | Manager assignments | assigned_by, assigned_to, track_id, due_date, status |
| feedback | Content feedback | user_id, rating (0-5), comment, issue_type, admin_response |
| bookmarks | Saved modules | user_id, content_type, content_id |
| notes | User annotations | user_id, module_id, content |
| analytics_events | Event tracking | user_id, event_type, event_data (JSONB) |
| tracks | Track definitions | id, title, target_roles, mandatory |
| modules | Module definitions | track_id, id, title, content_type |
| notifications | System notifications | user_id, type, content, read_at |
| platform_settings | Admin config | key, value |
| cdp_assistant_conversations | AI history | user_id, session_id, messages (JSONB) |
| content_reviews | Freshness workflow | content_id, reviewer_id, status |
| manager_teams | Team hierarchies | manager_id, members |

### Security
- Row-Level Security (RLS) on all user-scoped tables
- FK constraints with ON DELETE CASCADE
- UNIQUE constraints preventing duplicate entries
- 15 migration files (1,084 lines)

---

## 10. Multi-Persona Review & Ratings

| Persona | Rating | Top Strength | Top Gap |
|---------|--------|-------------|---------|
| **End User** | 8.2/10 | Rich gamification & simulators | No collaboration or video content |
| **CEO** | 7.5/10 | Strategic alignment across all roles | No executive dashboard or HR integration |
| **CTO** | 7.0/10 | Modern stack, strong security headers | No CI/CD pipeline, exposed secrets |
| **Principal UI/UX** | 8.0/10 | Beautiful dark-first design, WCAG AA | No Storybook, no reduced-motion |
| **Principal Architect** | 6.5/10 | Clean monolith, good DB design | No caching layer, code-coupled content |
| **Director CS** | 8.5/10 | 10-module CS track + TAM track | No CS tool integration |
| **Director Sales** | 8.0/10 | Battle cards + deal prep + case studies | No CRM integration |
| **Director Support/HR** | 6.0/10 | Role-based onboarding | No support track, no HRIS, no compliance |
| **Director ML/DS** | 5.5/10 | AI skill system architecture | All ML is rule-based, no real models |
| **Weighted Average** | **7.2/10** | | |

---

## 11. Gaps & Future Roadmap

### Immediate (Next 2 Weeks)

| # | Item | Impact | Effort |
|---|------|--------|--------|
| 1 | CI/CD pipeline (GitHub Actions: lint, test, build) | Critical | Medium |
| 2 | Rotate exposed API keys | Critical | Low |
| 3 | Redis/Upstash caching (replace in-memory rate limiter) | Critical | Medium |
| 4 | E2E tests for critical flows | High | Medium |

### Short-term (Next Quarter)

| # | Item | Impact | Effort |
|---|------|--------|--------|
| 5 | Executive single-page dashboard | High | Medium |
| 6 | CRM integration (Salesforce/HubSpot) | High | High |
| 7 | HRIS integration (BambooHR/Workday) | High | High |
| 8 | Support & HR learning tracks | High | Medium |
| 9 | Compliance training modules | High | Medium |
| 10 | Headless CMS for content | High | High |
| 11 | Storybook for components | Medium | Medium |
| 12 | Reduced-motion support | Medium | Low |
| 13 | PWA for offline access | Medium | Medium |

### Medium-term (Next 2 Quarters)

| # | Item | Impact | Effort |
|---|------|--------|--------|
| 14 | ML recommendation engine | High | High |
| 15 | NLP sentiment analysis on feedback | Medium | Medium |
| 16 | A/B testing framework | High | High |
| 17 | Semantic search with embeddings | Medium | High |
| 18 | Video/audio content | Medium | Medium |
| 19 | AI role-play simulations | High | High |
| 20 | Discussion/comments (social learning) | Medium | Medium |
| 21 | Live battle card updates | Medium | High |
| 22 | Demo sandbox in deal prep | High | High |
| 23 | CS tool integration (Gainsight) | Medium | High |
| 24 | Predictive learner churn | Medium | High |

### Long-term (6+ Months)

| # | Item | Impact | Effort |
|---|------|--------|--------|
| 25 | Mobile native app | Medium | Very High |
| 26 | Multi-tenant for partners | Medium | Very High |
| 27 | Content marketplace | Medium | High |
| 28 | Adaptive learning paths | High | Very High |
| 29 | Knowledge graph reasoning | Medium | Very High |
| 30 | Real CDP data in simulators | High | Very High |

---

## 12. Appendix

### API Routes (30+ endpoints)

**User & Auth:** `/api/auth/callback`, `/api/profile`, `/api/notifications/preferences`, `/api/notifications`

**Learning:** `/api/progress`, `/api/quiz`, `/api/bookmarks`, `/api/notes`, `/api/activity-feed`, `/api/leaderboard`, `/api/streaks`

**Admin:** `/api/admin/dashboard`, `/api/admin/users`, `/api/admin/assignments`, `/api/admin/assignments/bulk`, `/api/admin/content`, `/api/admin/settings`, `/api/admin/targets`, `/api/admin/roi`, `/api/admin/executive-report`, `/api/admin/docs-health`, `/api/admin/feedback`

**AI & Search:** `/api/cdp-assistant`, `/api/zeobot`, `/api/assistant-actions`, `/api/search`

**Analytics:** `/api/analytics`, `/api/nudges`, `/api/feedback`, `/api/certifications`, `/api/simulators`, `/api/team`, `/api/team/skill-matrix`, `/api/content/docs-status`, `/api/content/review`

### Test Coverage
- 37 test files (15 utility, 12 API, 8 component, 2 accessibility)
- Framework: Vitest + Testing Library + jsdom

### Environment Variables
| Variable | Purpose | Required |
|----------|---------|----------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project | Yes |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase auth | Yes |
| MINTLIFY_API_KEY | ZEOBOT AI | Yes (for AI) |
| NEXT_PUBLIC_MINTLIFY_API_KEY | Client Mintlify | Yes (for AI) |
| NEXT_PUBLIC_MINTLIFY_DOCS_URL | Docs URL | Optional |
| SENTRY_AUTH_TOKEN | Error monitoring | Optional |

### File Structure
```
ZeoAI-main/
├── app/
│   ├── (auth)/          # Login, signup, forgot-password
│   ├── (dashboard)/     # 11 user-facing routes
│   ├── admin/           # 9 admin routes
│   ├── api/             # 30+ API routes
│   └── page.tsx         # Landing page
├── components/          # 80+ components (9 categories)
├── lib/                 # 36 utility modules + Supabase
├── content/cdp-skills/  # 21 skill directories
├── supabase/migrations/ # 15 SQL migrations
├── __tests__/           # 37 test files
└── public/              # Static assets
```

---

*This document represents the complete state of ZeoAI as of March 2026.*
*For live data, visit: zeo-ai.vercel.app/admin/dashboard*
