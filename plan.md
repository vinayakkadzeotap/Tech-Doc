# Zeotap Universe — Interactive CDP Map

## Vision
A full-screen, immersive "Zeotap Universe" page where the entire CDP platform is laid out as an interactive constellation map. Users pan, zoom, click nodes, trigger data-flow animations, and learn the entire product by exploring — like Google Maps meets a sci-fi command center.

## Page Access
- **New navbar button**: "Universe" with a `Globe` icon, placed as the 2nd nav item (after Dashboard)
- **Route**: `/universe` — a new dashboard page
- **Full-bleed layout**: The page fills 100vh below the navbar, no padding, no scroll

---

## Architecture & Tech

### Rendering: HTML5 Canvas (2D)
- **No new dependencies** — pure Canvas API via a React `useRef` + `useEffect` render loop
- Why not Three.js: adds ~500KB, overkill for a 2D node graph; canvas gives us full control, zero bundle bloat
- Custom pan/zoom via mouse/touch events (like Google Maps)
- 60fps render loop with `requestAnimationFrame`

### Data Source
- Reuse the **6 architectural layers** (23 nodes) from `ArchitectureGraph.tsx` as the primary node data
- Augment with the **5 learning tracks** (42 modules) mapped onto the nodes
- Add **data flow connections** from `DataPipelineSimulator.tsx` stages

---

## Layout: The "Constellation Map"

### Node Categories (color-coded regions, like the reference image)
Each category is a "galaxy cluster" positioned in a region of the canvas:

| Region | Category | Color | Nodes |
|--------|----------|-------|-------|
| Top-center | **Collect** (SDKs & Sources) | `#38bdf8` cyan | Web SDK, Mobile SDK, S2S API, Integr8 |
| Upper-left | **Ingest & Process** | `#8b5cf6` purple | Kafka, Beam, Spark, CDAP |
| Center | **Store & Unify** | `#a855f7` purple | Identity Graph, Delta Lake, BigQuery |
| Center-right | **Intelligence** | `#ec4899` pink | Audience Engine, Ada AI, ML Platform, Journey Engine |
| Lower-right | **Activate** | `#f59e0b` amber | Destinations, SmartPixel |
| Bottom | **Platform Services** | `#10b981` green | GKE, Terraform, Observability, CI/CD |

### Node Rendering
- **Major nodes** (e.g., Identity Graph, Kafka): Large glowing sphere (radius ~30px), bold label
- **Minor nodes** (e.g., individual SDKs): Smaller sphere (radius ~14px), label on hover
- **Connections**: Curved lines between connected nodes with animated particle flow (small dots traveling along the path)
- **Background**: Deep space (#020617) with subtle star-field particles

---

## Interactions

### 1. Pan & Zoom (Google Maps style)
- **Mouse drag** → pan the canvas
- **Scroll wheel** → zoom in/out (min 0.3x, max 3x)
- **Pinch-to-zoom** on touch devices
- **Minimap** (bottom-right corner): Small overview rectangle showing viewport position

### 2. Node Hover
- Node glows brighter, radius expands slightly
- Tooltip appears with: name, tech stack, 1-line description
- Connected edges highlight

### 3. Node Click → Detail Panel
- Slide-in panel (right side, 400px wide) with:
  - Node name + icon + category badge
  - Description paragraph
  - **Tech stack** chips (e.g., "Apache Kafka", "Avro")
  - **Connected to**: clickable list of adjacent nodes
  - **Related modules**: links to `/learn/[trackId]/[moduleId]` for relevant learning content
  - **"Simulate" button**: for pipeline nodes, triggers a data-flow animation from that node through the graph

### 4. Data Flow Animation
- Click "Simulate Flow" (or a floating play button)
- Animated particles (colored dots) travel along the edges from Collect → Ingest → Store → Intelligence → Activate
- Each node "lights up" as particles pass through it
- Event type selector: page_view (blue), purchase (green), signup (purple)
- Speed control: 0.5x, 1x, 2x

### 5. Legend & Controls (top overlay)
- **Category legend**: colored dots with labels (like the reference image)
- **Reset View** button: returns to default zoom/position
- **Search**: filter/highlight nodes by name
- **Layer toggles**: show/hide category groups

### 6. Keyboard shortcuts
- `R` → reset view
- `+`/`-` → zoom
- `Escape` → close detail panel
- Arrow keys → pan

---

## File Structure

```
app/(dashboard)/universe/page.tsx          — Page wrapper (server component, auth check)
components/universe/UniverseCanvas.tsx     — Main canvas component (client, ~500 lines)
components/universe/UniverseDetailPanel.tsx — Right-side detail panel
components/universe/UniverseControls.tsx   — Legend, search, layer toggles, reset
components/universe/UniverseMinimap.tsx     — Corner minimap
lib/utils/universe-data.ts                 — Node positions, connections, metadata
```

---

## Implementation Steps

### Step 1: Data layer (`lib/utils/universe-data.ts`)
- Define `UniverseNode` type: id, label, description, category, color, x, y, radius, techStack[], connectedTo[], relatedModules[]
- Define `UniverseEdge` type: from, to, color, animated
- Export `UNIVERSE_NODES` (23 nodes with hand-tuned x,y positions forming the constellation layout)
- Export `UNIVERSE_EDGES` (~30 connections representing data flow)
- Export `UNIVERSE_CATEGORIES` with colors and labels

### Step 2: Canvas renderer (`UniverseCanvas.tsx`)
- Canvas setup with devicePixelRatio for retina
- Render loop: clear → draw stars → draw edges (with particle animation) → draw nodes → draw labels
- Pan/zoom state via transform matrix
- Mouse/touch event handlers for pan, zoom, hover detection, click detection
- Node hit-testing (point-in-circle)

### Step 3: Controls overlay (`UniverseControls.tsx`)
- Category legend (top bar)
- Reset View button
- Node search input (filters/highlights matching nodes)
- Layer visibility toggles
- Data flow simulation controls (event type, play/pause, speed)

### Step 4: Detail panel (`UniverseDetailPanel.tsx`)
- Slide-in from right on node click
- Node info, tech stack, connections, related learning modules
- "Simulate from here" button
- Close button + Escape key

### Step 5: Minimap (`UniverseMinimap.tsx`)
- Small canvas (150×100px) in bottom-right
- Shows all nodes as tiny dots
- Viewport rectangle that can be dragged

### Step 6: Navbar integration
- Add "Universe" nav item with `Globe` icon to Navbar.tsx
- Route: `/universe`

### Step 7: Page wrapper (`app/(dashboard)/universe/page.tsx`)
- Server component with auth check
- Full-height layout (h-[calc(100vh-64px)])
- Renders UniverseCanvas + overlays

---

## Visual Effects

- **Star field**: 200 tiny dots with varying opacity, parallax on pan
- **Node glow**: Radial gradient behind each node, pulses gently
- **Edge particles**: 3-5 small dots per edge, traveling along bezier curves
- **Hover bloom**: Node radius +20%, glow intensity +50%
- **Flow animation**: Larger, brighter particles with trail effect
- **Category halos**: Subtle circular gradient behind each cluster region

---

## Performance Considerations

- Canvas rendering (not DOM) — handles hundreds of nodes at 60fps
- Only render nodes/edges within the viewport (frustum culling)
- Particle animation uses pooled objects (no GC pressure)
- Minimap renders at 10fps (throttled)
- Detail panel is regular React DOM (not canvas)
