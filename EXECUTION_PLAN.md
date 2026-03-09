# Zeotap Learning Platform — Full Execution Plan

> **Status:** Draft — Ready for Review
> **Target:** Org-wide interactive learning platform for all roles
> **Tech Stack Decision:** Next.js 14 (App Router) + Supabase + Tailwind CSS + MDX

---

## Architecture Decision

### Why This Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Framework** | Next.js 14 (App Router) | Full-stack React, API routes, SSR/SSG, Vercel-native, massive ecosystem |
| **Auth** | Supabase Auth | Email/password now, SSO/OAuth later. Free tier handles 50K MAU |
| **Database** | Supabase (PostgreSQL) | Progress, quiz scores, user profiles, admin analytics. Real-time subscriptions for leaderboards |
| **Styling** | Tailwind CSS | Matches current design tokens, utility-first, dark mode built-in, responsive |
| **Content** | MDX files in repo | Git-versioned, rich components in markdown, no external CMS dependency |
| **AI** | Anthropic API (proxied) | Server-side API route — no client key exposure |
| **Deployment** | Vercel | Already configured, zero-config Next.js, edge functions, analytics |
| **Charts/Viz** | Recharts + Canvas (existing) | Reuse the existing graph engine, add Recharts for admin dashboards |

### Project Structure

```
zeotap-learn/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (nav, theme, auth provider)
│   ├── page.tsx                  # Landing / role selector
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Authenticated layout (sidebar, progress bar)
│   │   ├── home/page.tsx         # Personalized dashboard based on role
│   │   ├── explore/page.tsx      # Architecture graph (ported from Canvas)
│   │   ├── learn/
│   │   │   ├── page.tsx          # Learning hub (all tracks)
│   │   │   ├── [trackId]/
│   │   │   │   ├── page.tsx      # Track overview + modules list
│   │   │   │   └── [moduleId]/
│   │   │   │       └── page.tsx  # Module content (MDX rendered)
│   │   ├── assess/
│   │   │   ├── page.tsx          # All assessments
│   │   │   ├── [quizId]/page.tsx # Quiz taking experience
│   │   │   └── results/page.tsx  # My results history
│   │   ├── pipeline/page.tsx     # Pipeline simulator (ported)
│   │   ├── certifications/page.tsx
│   │   ├── achievements/page.tsx # Badges + certificates
│   │   ├── glossary/page.tsx
│   │   ├── bookmarks/page.tsx
│   │   └── profile/page.tsx      # User profile + settings
│   ├── (admin)/
│   │   ├── layout.tsx            # Admin-only layout
│   │   ├── dashboard/page.tsx    # Org-wide analytics
│   │   ├── users/page.tsx        # User management
│   │   ├── teams/page.tsx        # Team analytics
│   │   ├── assignments/page.tsx  # Assign tracks to users/teams
│   │   ├── content/page.tsx      # Content management
│   │   └── reports/page.tsx      # Export reports
│   └── api/
│       ├── auth/
│       ├── progress/route.ts     # CRUD user progress
│       ├── quiz/route.ts         # Submit quiz, get scores
│       ├── admin/route.ts        # Admin analytics queries
│       ├── ai/chat/route.ts      # Zoe AI proxy (Anthropic API)
│       ├── feedback/route.ts     # Content ratings + issues
│       └── assignments/route.ts  # Manager assignments
├── components/
│   ├── ui/                       # Design system primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Progress.tsx
│   │   ├── Tabs.tsx
│   │   ├── Toast.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MobileNav.tsx
│   │   └── Footer.tsx
│   ├── learning/
│   │   ├── TrackCard.tsx
│   │   ├── ModuleList.tsx
│   │   ├── ProgressRing.tsx
│   │   ├── MarkCompleteBar.tsx   # Sticky bar at bottom of modules
│   │   ├── QuizEngine.tsx        # Full quiz experience
│   │   ├── ScenarioQuestion.tsx  # Interactive scenario assessments
│   │   └── CertificateBadge.tsx
│   ├── graph/
│   │   ├── ArchitectureGraph.tsx  # Ported Canvas engine as React component
│   │   ├── PipelineSim.tsx
│   │   └── DataFlowViz.tsx
│   ├── admin/
│   │   ├── StatsCards.tsx
│   │   ├── CompletionChart.tsx
│   │   ├── QuizScoreChart.tsx
│   │   ├── UserTable.tsx
│   │   └── TeamBreakdown.tsx
│   ├── ai/
│   │   ├── ZoeChat.tsx           # AI assistant panel
│   │   └── AiGrader.tsx          # AI-graded assessments
│   └── shared/
│       ├── RoleSelector.tsx
│       ├── SearchCommand.tsx     # ⌘K search (ported)
│       ├── ThemeToggle.tsx
│       ├── ContentRating.tsx     # Thumbs up/down + feedback
│       └── FirstRunTour.tsx      # Onboarding coach marks
├── content/                      # MDX content files
│   ├── tracks/
│   │   ├── business-essentials/
│   │   │   ├── _meta.json        # Track config (title, icon, color, role targets)
│   │   │   ├── 01-what-is-zeotap.mdx
│   │   │   ├── 02-what-is-cdp.mdx
│   │   │   ├── 03-our-customers.mdx
│   │   │   ├── 04-how-zeotap-works.mdx
│   │   │   ├── 05-competitive-landscape.mdx
│   │   │   └── 06-business-model.mdx
│   │   ├── product-mastery/
│   │   │   ├── _meta.json
│   │   │   ├── 01-unity-dashboard.mdx
│   │   │   ├── 02-data-collection-ui.mdx
│   │   │   ├── 03-audience-builder.mdx
│   │   │   ├── 04-journey-canvas.mdx
│   │   │   ├── 05-activating-data.mdx
│   │   │   └── 06-reports-dashboards.mdx
│   │   ├── sales-enablement/
│   │   │   ├── _meta.json
│   │   │   ├── 01-zeotap-pitch.mdx
│   │   │   ├── 02-discovery-questions.mdx
│   │   │   ├── 03-demo-playbook.mdx
│   │   │   ├── 04-objection-handling.mdx
│   │   │   ├── 05-case-studies.mdx
│   │   │   └── 06-competitive-battle-cards.mdx
│   │   ├── cs-playbook/
│   │   │   ├── _meta.json
│   │   │   ├── 01-onboarding-checklist.mdx
│   │   │   ├── 02-health-score-guide.mdx
│   │   │   ├── 03-troubleshooting.mdx
│   │   │   ├── 04-escalation-path.mdx
│   │   │   ├── 05-renewal-expansion.mdx
│   │   │   └── 06-integration-guides.mdx
│   │   └── engineering/
│   │       ├── _meta.json
│   │       ├── data-layer/
│   │       │   ├── 01-platform-overview.mdx   # Ported from existing HTML
│   │       │   ├── 02-data-collection.mdx
│   │       │   ├── 03-data-ingestion.mdx
│   │       │   └── 04-identity-resolution.mdx
│   │       ├── intelligence-layer/
│   │       │   ├── 05-profile-store.mdx
│   │       │   ├── 06-audience-management.mdx
│   │       │   ├── 07-customer-journeys.mdx
│   │       │   ├── 08-genai-zoe.mdx
│   │       │   └── 09-ml-platform.mdx
│   │       ├── activation-layer/
│   │       │   ├── 10-data-activation.mdx
│   │       │   ├── 11-reporting.mdx
│   │       │   └── 12-unity-dashboard.mdx
│   │       └── platform-layer/
│   │           ├── 13-privacy-gdpr.mdx
│   │           ├── 14-auth-iam.mdx
│   │           ├── 15-infrastructure.mdx
│   │           ├── 16-observability.mdx
│   │           ├── 17-cicd.mdx
│   │           └── 18-testing.mdx
│   ├── quizzes/
│   │   ├── business-essentials-quiz.json
│   │   ├── product-mastery-quiz.json
│   │   ├── sales-enablement-quiz.json
│   │   ├── engineering-week1-quiz.json
│   │   ├── engineering-week2-quiz.json
│   │   ├── engineering-week3-quiz.json
│   │   ├── engineering-advanced-quiz.json
│   │   └── scenarios/                    # Scenario-based assessments
│   │       ├── duplicate-profiles.json
│   │       ├── audience-mismatch.json
│   │       ├── integration-failure.json
│   │       └── gdpr-erasure-request.json
│   └── glossary.json
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   ├── middleware.ts         # Auth middleware
│   │   └── types.ts              # Generated DB types
│   ├── hooks/
│   │   ├── useProgress.ts
│   │   ├── useQuiz.ts
│   │   ├── useUser.ts
│   │   ├── useAdmin.ts
│   │   └── useSearch.ts
│   ├── utils/
│   │   ├── roles.ts              # Role definitions + track mappings
│   │   ├── badges.ts             # Badge logic (ported from learning-engine.js)
│   │   ├── search.ts             # Full-text search engine
│   │   └── analytics.ts          # Event tracking
│   └── ai/
│       ├── zoe.ts                # Anthropic API wrapper
│       └── grader.ts             # AI assessment grading
├── supabase/
│   └── migrations/
│       ├── 001_users.sql
│       ├── 002_progress.sql
│       ├── 003_quiz_scores.sql
│       ├── 004_badges.sql
│       ├── 005_assignments.sql
│       ├── 006_feedback.sql
│       └── 007_admin_views.sql
├── public/
│   ├── images/
│   │   ├── tracks/               # Hero images for each track
│   │   └── badges/               # Badge artwork
│   └── favicon.svg
├── tailwind.config.ts
├── next.config.mjs
├── package.json
├── tsconfig.json
└── .env.local.example
```

---

## Database Schema (Supabase / PostgreSQL)

```sql
-- Users (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'engineering',  -- engineering, sales, cs, product, marketing, hr, leadership
  team TEXT,
  department TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  is_manager BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Module progress
CREATE TABLE public.progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  track_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started',  -- not_started, in_progress, completed
  scroll_pct INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, track_id, module_id)
);

-- Quiz attempts
CREATE TABLE public.quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  quiz_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB NOT NULL,  -- {question_id: selected_option_index}
  time_taken_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges earned
CREATE TABLE public.badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Certifications
CREATE TABLE public.certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  cert_id TEXT NOT NULL,       -- 'business-essentials', 'product-mastery', etc.
  level TEXT NOT NULL,         -- 'associate', 'professional', 'expert'
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, cert_id, level)
);

-- Manager assignments
CREATE TABLE public.assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assigned_by UUID REFERENCES public.profiles(id) NOT NULL,
  assigned_to UUID REFERENCES public.profiles(id) NOT NULL,
  track_id TEXT NOT NULL,
  due_date TIMESTAMPTZ,
  status TEXT DEFAULT 'assigned',  -- assigned, in_progress, completed, overdue
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content feedback
CREATE TABLE public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  content_type TEXT NOT NULL,  -- 'module', 'quiz', 'track'
  content_id TEXT NOT NULL,
  rating INTEGER,              -- 1-5 or thumbs up(1)/down(-1)
  comment TEXT,
  issue_type TEXT,             -- 'error', 'outdated', 'unclear', 'suggestion'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookmarks
CREATE TABLE public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_id)
);

-- User notes (per module)
CREATE TABLE public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  module_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events (lightweight)
CREATE TABLE public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  event_type TEXT NOT NULL,    -- 'page_view', 'module_start', 'quiz_start', 'search', etc.
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin materialized views
CREATE VIEW public.team_progress AS
SELECT
  p.team,
  p.department,
  p.role,
  COUNT(DISTINCT p.id) as total_users,
  COUNT(DISTINCT pr.user_id) FILTER (WHERE pr.status = 'completed') as active_learners,
  COUNT(pr.id) FILTER (WHERE pr.status = 'completed') as modules_completed,
  AVG(qa.percentage) as avg_quiz_score,
  COUNT(DISTINCT b.user_id) as users_with_badges
FROM public.profiles p
LEFT JOIN public.progress pr ON p.id = pr.user_id
LEFT JOIN public.quiz_attempts qa ON p.id = qa.user_id
LEFT JOIN public.badges b ON p.id = b.user_id
GROUP BY p.team, p.department, p.role;
```

---

## Execution Sprints

### Sprint 0 — Project Setup (Day 1-2)
> Bootstrap the Next.js project, configure tooling, deploy skeleton

**Tasks:**
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Configure Tailwind CSS with custom design tokens (port from current CSS variables)
- [ ] Set up Supabase project + database schema
- [ ] Configure Vercel deployment
- [ ] Set up MDX processing (next-mdx-remote or @next/mdx)
- [ ] Port design system: colors, typography, shadows, gradients from `dark-system.css`
- [ ] Create `.env.local.example` with required env vars
- [ ] Create base layout components (Navbar, Sidebar, Footer)

**Dependencies from you:**
- [ ] Create a Supabase project at supabase.com (free tier is fine)
- [ ] Share the Supabase URL + anon key + service role key
- [ ] Anthropic API key for Zoe AI proxy (if you want AI features)

---

### Sprint 1 — Auth + Core Shell (Day 3-5)
> Users can sign up, log in, select role, see personalized dashboard

**Tasks:**
- [ ] Supabase Auth: email/password signup + login
- [ ] Auth middleware (protect dashboard routes)
- [ ] Signup flow with role selector (Engineering / Sales / CS / Product / Marketing / Leadership)
- [ ] Profile creation on first login (name, role, team, department)
- [ ] Personalized dashboard shell based on role
- [ ] Theme toggle (dark/light) with persistence
- [ ] Mobile-responsive navigation (hamburger menu + bottom tabs)

**Pages built:**
- `/login`
- `/signup`
- `/forgot-password`
- `/home` (personalized dashboard)
- `/profile`

---

### Sprint 2 — Content Migration + MDX Engine (Day 6-10)
> Port existing 18 chapters to MDX, build content rendering engine

**Tasks:**
- [ ] Convert all 18 HTML chapter files to MDX
- [ ] Create MDX components: Callout, CodeBlock, Diagram, ExpandableSection, TechStack, KeyConcepts
- [ ] Build module page renderer (reads MDX, renders with components)
- [ ] Add "Mark Complete" sticky bar at bottom of each module
- [ ] Add reading progress indicator (scroll %)
- [ ] Add estimated reading time
- [ ] Add "Previous / Next" navigation between modules
- [ ] Add content type badges (Concept / Tutorial / Reference / Deep Dive)
- [ ] Port search functionality (⌘K command palette)
- [ ] Add breadcrumbs navigation

**Pages built:**
- `/learn` (all tracks)
- `/learn/[trackId]` (track overview)
- `/learn/[trackId]/[moduleId]` (module content)
- `/glossary`

---

### Sprint 3 — Learning Engine + Progress (Day 11-14)
> Progress tracking, quiz engine, badges — all server-persisted

**Tasks:**
- [ ] Server-side progress API (save/load module completion)
- [ ] Progress sync: on module complete → save to Supabase
- [ ] Track progress visualization (progress rings, completion bars)
- [ ] Port quiz engine to React component
- [ ] Expand quiz bank: 8-10 questions per quiz (from current 3-6)
- [ ] Add scenario-based questions (interactive decision trees)
- [ ] Quiz results saved server-side with attempt history
- [ ] Badge system: ported logic + server persistence
- [ ] Achievement toast notifications (ported from current)
- [ ] "Recommended next" after completing a module
- [ ] Learning streaks (consecutive days of learning)

**Pages built:**
- `/assess` (all quizzes)
- `/assess/[quizId]` (quiz taking)
- `/assess/results` (my history)
- `/achievements` (badges + streaks)

---

### Sprint 4 — Non-Technical Content Tracks (Day 15-20)
> Create Business Essentials, Product Mastery, Sales Enablement, CS Playbook

**Track 1: Business Essentials (All Roles) — 6 modules**
```
01-what-is-zeotap.mdx
   - Company history, mission, founding story
   - The CDP market opportunity
   - Who are Zeotap's customers (verticals, segments)
   - Key metrics (profiles processed, events/sec, destinations)

02-what-is-cdp.mdx
   - CDP explained simply (no jargon)
   - CDP vs DMP vs CRM vs Data Warehouse
   - Why companies need a CDP
   - The "Golden Record" concept

03-our-customers.mdx
   - Customer segments: Enterprise, Mid-market
   - Key verticals: Retail, Finance, Telco, Media, Auto
   - Customer logos and use cases
   - What success looks like for customers

04-how-zeotap-works.mdx
   - Product walkthrough (screenshots, UI-focused)
   - Collect → Unify → Activate flow explained visually
   - Unity Dashboard tour
   - Key features: Audiences, Journeys, Activation, AI

05-competitive-landscape.mdx
   - Market map: CDPs, DMPs, analytics platforms
   - Zeotap vs Segment vs mParticle vs Tealium vs Treasure Data
   - Our differentiators (identity resolution, EU-first, compliance)
   - When we win, when we lose

06-business-model.mdx
   - How Zeotap makes money (SaaS, platform fees, CPM)
   - Pricing tiers and packaging
   - GTM motion (sales-led, partner channel)
   - Growth levers
```

**Track 2: Product Mastery (PM, CS, Sales, Marketing) — 6 modules**
```
01-unity-dashboard.mdx
   - Logging in, navigation, workspace concept
   - Dashboard overview: key metrics at a glance
   - User management: inviting team members, roles
   - Settings and configuration

02-data-collection-ui.mdx
   - Setting up sources in the UI
   - SDK installation wizard walkthrough
   - Server-to-server API setup
   - File upload / batch import
   - Verifying data is flowing

03-audience-builder.mdx
   - Creating your first segment
   - Rule builder: attributes, behaviors, conditions
   - AND/OR logic, nested rules
   - Audience estimation and sizing
   - Saving, naming, organizing audiences
   - Natural language segmentation with Zoe

04-journey-canvas.mdx
   - Creating a customer journey
   - Triggers: segment entry, event, schedule
   - Actions: email, push, webhook, wait, A/B split
   - Building a multi-step campaign
   - Testing and previewing journeys

05-activating-data.mdx
   - Setting up a destination (e.g., Google Ads, Meta, Salesforce)
   - Mapping fields
   - Real-time vs batch sync
   - Monitoring sync status and errors
   - Troubleshooting common sync issues

06-reports-dashboards.mdx
   - Built-in analytics dashboards
   - Audience overlap reports
   - Journey performance metrics
   - Export and sharing
```

**Track 3: Sales & BD Enablement — 6 modules**
```
01-zeotap-pitch.mdx
   - The 30-second elevator pitch
   - Value propositions by persona (CMO, CDO, CTO, DPO)
   - ROI talking points and proof points
   - Customer quotes and testimonials

02-discovery-questions.mdx
   - Qualification framework (MEDDPICC or similar)
   - Questions by pain point
   - Red flags and green flags
   - How to uncover budget and timeline

03-demo-playbook.mdx
   - Pre-demo checklist
   - Demo flow: problem → solution → proof
   - Key screens to show
   - Handling live questions
   - Post-demo follow-up template

04-objection-handling.mdx
   - "We already have Segment"
   - "We're building in-house"
   - "It's too expensive"
   - "We don't have the data maturity"
   - "What about privacy/GDPR?"
   - Response frameworks for each

05-case-studies.mdx
   - Template: Challenge → Solution → Results
   - By vertical: Retail, Finance, Telco, Media
   - Metrics-driven success stories
   - Quotes from champions

06-competitive-battle-cards.mdx
   - Head-to-head: Zeotap vs Segment
   - Head-to-head: Zeotap vs mParticle
   - Head-to-head: Zeotap vs Tealium
   - Head-to-head: Zeotap vs Treasure Data
   - Strengths, weaknesses, traps to set, landmines to avoid
```

**Track 4: Customer Success Playbook — 6 modules**
```
01-onboarding-checklist.mdx
   - 30-60-90 day onboarding plan
   - Technical setup milestones
   - First value milestones
   - Stakeholder mapping

02-health-score-guide.mdx
   - What makes a healthy account
   - Key signals: usage, engagement, support tickets
   - Risk indicators and early warnings
   - How to read the customer health dashboard

03-troubleshooting.mdx
   - "My audience numbers don't match"
   - "Events aren't showing up"
   - "Sync to destination failed"
   - "Identity resolution isn't working"
   - "Performance is slow"
   - Step-by-step diagnostic flows for each

04-escalation-path.mdx
   - L1 → L2 → L3 → Engineering escalation
   - When to escalate vs when to troubleshoot
   - SLA expectations by tier
   - How to write a good escalation ticket
   - Emergency contact procedures

05-renewal-expansion.mdx
   - Renewal playbook: timeline, stakeholders, prep
   - Expansion signals and triggers
   - Cross-sell / upsell opportunities
   - QBR best practices
   - Churn prevention plays

06-integration-guides.mdx
   - Google Ads integration: step-by-step
   - Meta/Facebook integration: step-by-step
   - Salesforce integration: step-by-step
   - Custom webhook setup
   - Common integration errors and fixes
```

**What I need from you for this sprint:**
- [ ] **Company overview**: founding story, mission statement, key metrics (ARR, customers, employees, profiles processed)
- [ ] **Customer logos**: which customers can be publicly referenced
- [ ] **Case studies**: 3-5 real customer success stories (even anonymized like "Major European Retailer")
- [ ] **Competitive intel**: your internal view on Segment, mParticle, Tealium, Treasure Data — where you win/lose
- [ ] **Pricing model**: high-level pricing structure (SaaS tiers, CPM-based, etc.)
- [ ] **Unity Dashboard screenshots**: key UI screens for the product mastery track
- [ ] **Sales playbook**: existing pitch decks, discovery frameworks, objection handling docs
- [ ] **CS playbook**: existing onboarding checklists, health score definitions, escalation docs
- [ ] **Common support issues**: top 10-20 customer support tickets and their resolutions
- [ ] **Integration guides**: step-by-step setup for top 5 destinations

> **If you don't have all of this:** Share what you have, and I'll draft the rest using public Zeotap website/docs + industry knowledge. You review and correct.

---

### Sprint 5 — Interactive Features (Day 21-25)
> Architecture graph, pipeline simulator, Zoe AI — all ported + enhanced

**Tasks:**
- [ ] Port Canvas 2D architecture graph to React component
- [ ] Add touch gestures for mobile (pinch zoom, drag, tap)
- [ ] Port pipeline simulator ("Journey of a Click")
- [ ] Build Zoe AI chat panel (Anthropic API proxied through /api/ai/chat)
- [ ] Context-aware AI: Zoe knows which module user is viewing
- [ ] Add "Ask Zoe about this" button on each module page
- [ ] Port mission mode (guided walkthroughs)
- [ ] First-run tour (coach marks for new users)
- [ ] Content feedback widget (thumbs up/down + optional comment)
- [ ] Bookmarking system (save modules + add notes)

**Pages enhanced:**
- `/explore` (architecture graph)
- `/pipeline` (simulator)
- `/bookmarks`

---

### Sprint 6 — Admin Dashboard (Day 26-30)
> Managers and leadership can track learning across the org

**Tasks:**
- [ ] Admin role check middleware
- [ ] Org-wide stats: total users, completion rate, avg quiz score
- [ ] Team breakdown: progress by team/department
- [ ] Role breakdown: progress by role
- [ ] Individual user detail: what they've completed, quiz scores, time spent
- [ ] Assignment system: assign tracks to users with due dates
- [ ] Assignment tracking: overdue, in-progress, completed
- [ ] Content analytics: most/least popular modules, avg rating, feedback
- [ ] Export: CSV export of progress data
- [ ] Email notifications: assignment reminders, overdue alerts (via Supabase Edge Functions)

**Pages built:**
- `/admin/dashboard`
- `/admin/users`
- `/admin/teams`
- `/admin/assignments`
- `/admin/content`
- `/admin/reports`

**What I need from you:**
- [ ] List of teams/departments at Zeotap (for team analytics)
- [ ] Who should be admins? (roles: admin, manager, learner)
- [ ] Any specific KPIs leadership wants to track?

---

### Sprint 7 — Certification + Assessment Depth (Day 31-35)
> Formal certification program + richer assessments

**Tasks:**
- [ ] Certification tiers: Associate / Professional / Expert
- [ ] Certification requirements per track:
  - Associate: Complete all modules + pass quiz (70%+)
  - Professional: Associate + scenario assessments (80%+)
  - Expert: Professional + peer review exercise
- [ ] Printable/downloadable certificate (PDF generation)
- [ ] Certificate verification page (shareable URL)
- [ ] Scenario-based assessments:
  - Interactive decision trees ("Customer reports X, what do you do?")
  - Multi-step problem solving
  - AI-graded short-answer questions
- [ ] Assessment difficulty scaling (easy → medium → hard)
- [ ] Retake cooldown (24hr wait between quiz retakes)
- [ ] Leaderboard: team-level (not individual to avoid toxicity)

**Pages built:**
- `/certifications`
- `/assess/scenario/[scenarioId]`

---

### Sprint 8 — Polish + Accessibility + Mobile (Day 36-40)
> Production-ready quality

**Tasks:**
- [ ] WCAG AA accessibility audit (axe-core, manual testing)
- [ ] Fix all color contrast issues
- [ ] Add focus indicators to all interactive elements
- [ ] Add ARIA labels to graph, quiz, navigation
- [ ] Keyboard navigation for all features
- [ ] Screen reader testing
- [ ] Mobile optimization: responsive layouts, touch targets, bottom sheets
- [ ] Performance audit: Core Web Vitals, Lighthouse score 95+
- [ ] Error boundaries and graceful error states
- [ ] Empty states for all pages
- [ ] Loading skeletons for data-dependent pages
- [ ] SEO: meta tags, og:image, structured data
- [ ] 404 page
- [ ] Rate limiting on API routes
- [ ] Input validation + XSS prevention

---

### Sprint 9 — Engagement Features (Day 41-45)
> Drive daily usage and retention

**Tasks:**
- [ ] Learning streaks: consecutive days with module/quiz activity
- [ ] Daily goal setting: "Learn 1 module today"
- [ ] Spaced repetition: resurface quiz questions from completed modules
- [ ] "Knowledge refresh" notifications (email digest)
- [ ] Discussion/comments per module (Supabase real-time)
- [ ] Upvote/downvote on comments
- [ ] "Ask a question" on any module
- [ ] "Recently viewed" section on dashboard
- [ ] "Popular this week" modules
- [ ] PWA manifest (offline access, home screen install)

---

### Sprint 10 — Advanced AI + Integrations (Day 46-50)
> AI-powered features and external integrations

**Tasks:**
- [ ] AI-personalized learning recommendations based on role + progress + quiz gaps
- [ ] AI-graded short-answer assessments (Anthropic API)
- [ ] AI-generated study summaries per module
- [ ] Slack integration: daily learning nudges, completion celebrations
- [ ] Calendar integration: schedule learning time blocks
- [ ] Webhook API: notify external systems on certification earned
- [ ] Bulk user import (CSV upload for admin)
- [ ] Custom branding support (for customer-facing version later)

---

## Rollout Strategy

### Phase 1: Internal Alpha (Sprint 0-3 complete)
- **Audience:** Engineering team (10-20 people)
- **Goal:** Validate the platform works, get feedback on UX
- **Success metric:** 80% of eng team completes at least 1 track

### Phase 2: Internal Beta (Sprint 4-6 complete)
- **Audience:** All departments (50-100 people)
- **Goal:** Non-technical tracks available, admin dashboard live
- **Success metric:** 60% org-wide participation, 3+ tracks launched

### Phase 3: General Availability (Sprint 7-8 complete)
- **Audience:** Entire org + new hires
- **Goal:** Mandatory onboarding, certifications active
- **Success metric:** 100% new hire completion in first 30 days

### Phase 4: Expansion (Sprint 9-10 complete)
- **Audience:** Org + potentially customers
- **Goal:** Engagement features, AI personalization, external integrations
- **Success metric:** Weekly active learners > 70% of org

---

## Environment Variables Required

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Anthropic API (for Zoe AI - server-side only)
ANTHROPIC_API_KEY=sk-ant-...

# Optional: Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Optional: Email notifications
RESEND_API_KEY=re_...
```

---

## What I Need From You — Summary Checklist

### Immediate (Before I Start Building)
- [ ] **Supabase project credentials** (URL + keys) — or I can create a project for you
- [ ] **Anthropic API key** for Zoe AI (or confirm if you want to skip AI features for now)

### Sprint 4 (Content Creation)
- [ ] Company overview and founding story
- [ ] Customer logos and case studies (even anonymized)
- [ ] Competitive positioning (internal view on competitors)
- [ ] Pricing model overview
- [ ] Unity Dashboard screenshots (key UI screens)
- [ ] Sales pitch deck / discovery framework
- [ ] CS onboarding checklist / health score definitions
- [ ] Top 20 customer support issues and resolutions
- [ ] Integration setup guides for top destinations

### Sprint 6 (Admin)
- [ ] Org structure: teams, departments
- [ ] Who should be platform admins
- [ ] KPIs leadership wants to measure

### Nice to Have (Anytime)
- [ ] Brand guidelines (logos, color codes, fonts if different from current)
- [ ] Any existing training materials in any format
- [ ] Video content (screen recordings, architecture walkthroughs)
- [ ] Zeotap public documentation URLs (for Zoe AI context)

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Content gap for non-tech tracks | High — adoption stalls | Draft from public info, iterate with stakeholders |
| Supabase free tier limits | Medium — 500MB DB, 1GB storage | More than enough for this use case; upgrade if needed |
| MDX migration breaks existing content | Medium | Parallel run: keep old HTML live until MDX version is verified |
| Scope creep across 10 sprints | High | Ship Sprint 0-3 first, get feedback, then decide on Sprint 4+ |
| Single developer bottleneck | High | Prioritize ruthlessly, ship incrementally |

---

## Success Metrics

| Metric | Target | How We Measure |
|--------|--------|----------------|
| Org participation rate | 80%+ | Users who complete at least 1 module / total employees |
| New hire onboarding time | < 2 weeks to complete mandatory tracks | Time from signup to certification |
| Quiz pass rate | 75%+ average | Avg quiz score across all users |
| Content satisfaction | 4.0+ / 5.0 | Content feedback ratings |
| Weekly active learners | 70%+ of registered users | Users with activity in last 7 days |
| Admin adoption | 100% managers | Managers logging into admin dashboard monthly |

---

*This plan is designed to be executed incrementally. Each sprint delivers usable value. Ship Sprint 0-3 as the MVP, gather feedback, then proceed with Sprint 4+.*
