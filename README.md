# Zeotap Platform Intelligence Hub

A personal, interactive documentation platform built to help new Zeotap employees understand the full CDP product architecture — faster than reading Confluence.

## What's Inside

| Section | Description |
|---|---|
| **Platform Hub** (`index.html`) | Central learning dashboard with 18 interactive features |
| **18 Chapter Pages** | Deep-dives on every major product area |
| **Pipeline Simulator** | "Journey of a Click" — trace an event through 7 pipeline stages |
| **Learning Hub** | Onboarding paths, quizzes, and 9 achievement badges |
| **5 Appendix Pages** | API reference, glossary, FAQ, changelog, contributing guide |

## Interactive Features

- **Architecture Graph** — Canvas 2D force-directed graph of 17 platform components
- **Event Flow Grid** — 10-stage event ingestion pipeline with autoplay + system log ticker
- **Mission Mode** — 4 guided missions teaching core platform concepts step by step
- **⌘K Search** — instant fuzzy search across all 22+ indexed pages
- **Guided Pathway Modals** — "I Want To" sidebar tasks with 3-step how-to guides
- **Stats Counter** — animated metrics (14.2B profiles, 2.1M/s events, 100+ destinations)
- **Reading Time + Feedback** — per-chapter read estimates and thumbs-up/down widget
- **Learning Engine** — 16 modules, 4 quizzes, badge system with localStorage persistence

## Running Locally

```bash
python3 -m http.server 8080
# Open http://localhost:8080
```

No build step. No dependencies to install. Pure HTML/CSS/JS.

## Chapter Map

```
01 Platform Overview      →  02 Data Collection & SDKs
03 Data Ingestion         →  03 Identity Resolution
04 GenAI & Zoe            →  05 Profile Store
06 Audience Management    →  07 Customer Journeys
08 Data Activation        →  10 ML Platform
11 Reporting & BI         →  12 Unity Dashboard
13 Privacy & GDPR         →  14 Auth & IAM
15 Infrastructure         →  16 Observability
17 CI/CD                  →  18 Testing & QA
```

## Tech Stack

- **HTML/CSS/JS** — zero framework dependency
- **Canvas 2D** — custom physics graph engine (`three-d-graph.js`)
- **IntersectionObserver** — scroll-spy, stats animation, lazy interactions
- **localStorage** — mission progress, badge unlocks, page feedback persistence
- **Mermaid.js** (CDN) — architecture diagrams in chapter pages

## Contributing

See [contributing.html](contributing.html) for guidelines on adding chapters or fixing content.
