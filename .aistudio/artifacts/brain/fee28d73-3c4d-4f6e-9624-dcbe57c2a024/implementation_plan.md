# SeaDream 5.0 Tech-Dark Redesign & Live Split-Workbench Architecture

A production-grade transformation of the microstock contributor platform into an ultra-modern tech-dark flagship landing experience inspired by the BytePlus SeaDream 5.0 campaign architecture, integrating full drag-and-drop slot manipulation and an always-open split manual workbench while 100% preserving all metadata engineering and monetization workflows.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and user experience decisions synthesize your confirmed preferences and the BytePlus SeaDream 5.0 reference design:

- **Confirmed Decision 1 (Drag-and-Drop Keyword Manipulation)**: Keyword chips in both the interactive hero sandbox and the main metadata studio will support fluid HTML5/pointer drag-and-drop reordering, direct slot swapping, and numeric slot pinning (#1 to #49) with instant visual feedback.
- **Confirmed Decision 2 (Always-Open Split Manual Workbench)**: The primary editing interface will feature an always-open split-screen layout—with the visual asset preview and live compliance gauges on the left, and the granular 50-slot drag deck, raw delimited text buffer, and find/replace tools on the right.
- **Confirmed Decision 3 (Zero Functional Loss Guarantee)**: 100% of existing functional capabilities—including Gemini Vision metadata generation, multi-agency CSV/XMP export, Google AdSense monetization, Rejection Shield audit, Store Vault packs, and EPS parsing—are strictly retained and unified into the new SeaDream 5.0 tech aesthetic.
- **Confirmed Decision 4 (Sovereign Prestige in Tech-Dark)**: The Bangladesh Sovereign Lal-Sobuj identity (deep emerald green `#006a4e` and crimson ruby `#f42a41`) is integrated into BytePlus's signature deep obsidian canvas (`#050508`), frosted glassmorphic borders, and ambient rim glows without any intrusive decorative clutter or fake stats.

---

### 1. Overview & Core Concept

- **What It Does**: Transposes the visual sophistication, interactive playground tabs, and modular bento layout of BytePlus SeaDream 5.0 onto an enterprise microstock contributor suite. Contributors can upload, inspect, and manually engineer high-earning commercial metadata with fluid drag-and-drop precision, instant multi-agency export, and integrated Google monetization.
- **Target Audience / Persona**: Professional stock photographers, vector illustrators, 3D artists, and creative agencies in Bangladesh and worldwide targeting maximum royalty yield on Adobe Stock, Shutterstock, Freepik, and Getty Images.
- **Key Value**: Replaces cluttered legacy interfaces with an authoritative, frictionless creative-tech workstation that balances automated multimodal intelligence with total manual human control.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Landing & Playground Discovery**: Contributor arrives at the SeaDream 5.0-inspired hero containing a dynamic showcase visual, interactive capability tabs (*Pro 50-Slot Deck*, *Drag & Swap*, *Agency Matrices*, *Rejection Shield*), and dual high-intent CTAs (*Launch Split Workbench* / *Explore Store Vault*).
  2. **Interactive Live Drag Sandbox**: Contributor can drag tags directly between slots in the hero specimen card, test title casing formulas, and observe real-time tachometer compliance meters without having to upload a file first.
  3. **Always-Open Split Manual Workbench**:
     - *Left Column (Visual & Compliance Anchor)*: High-res asset preview, tachometer character bar, title sync radar, and multi-agency preset selector (*Adobe Stock <70c*, *Shutterstock 50 KW*, *Freepik 30 KW*, *Getty 35 KW*).
     - *Right Column (Precision Manipulation Console)*: Fluid drag-and-drop 50-slot deck divided into Tier 1 (Slots 1–5), Tier 2 (Slots 6–10), and Tier 3 (Slots 11–49), with one-click Raw Delimited Text buffer toggle, Find & Replace drawer, and Negative Keywords scanner.
  4. **Multi-Agency Export & Google Monetize Integration**: Contributor executes single-click export across RFC-4180 CSV, IPTC tags, or clipboard presets, paired with the Google AdSense and royalty revenue projection suite.

- **Visual Identity & Theme**:
  - *Canvas & Surfaces*: Deep tech-dark obsidian canvas (`#050508` / `#080b09`) accented with hairline emerald borders (`border-emerald-500/25`), deep glassmorphism (`backdrop-blur-2xl bg-black/60`), and subtle crimson specular rim glows.
  - *Typography*: High-contrast pairing of `Plus Jakarta Sans` for bold geometric headlines and interactive controls, paired with `JetBrains Mono` / tabular numerals (`tabular-nums`) for character counters, slot IDs, and pricing metrics.
  - *Interactive Feedback & Motion*: GPU-accelerated micro-interactions (drag lift elevation, smooth swap transitions $\le 180\text{ms}$, custom drop indicators, and quiet toast feedback).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Native HTML5 / Pointer Drag-and-Drop over Heavy Third-Party Libraries**:
  - *Chosen Approach*: Implement lightweight, zero-dependency HTML5 drag-and-drop state management with animated drop indicators and fallback 1-click slot jump buttons.
  - *Why*: Eliminates bundle bloat, prevents layout stutter during batch uploads, and works seamlessly across both desktop pointer devices and touch screens.
  - *Alternatives Considered*: Heavy drag libraries (`react-beautiful-dnd` or `@dnd-kit`) which introduce significant bundle overhead and potential React 19 compatibility quirks.

- **Decision 2: Seamless Hybridization of SeaDream 5.0 Layout with Bangladesh Sovereign Identity**:
  - *Chosen Approach*: Adopt SeaDream 5.0's exact structural hierarchy (3-zone minimalist header, cinematic hero playground, asymmetric bento capabilities grid, and interactive technical code/JSON panel) while utilizing the sovereign emerald and ruby palette for accents and state indicators.
  - *Why*: Delivers the requested aesthetic alignment with BytePlus's campaign interface while fulfilling prior directives for Lal-Sobuj national pride.

- **Decision 3: Always-Open Split Workbench vs Modals**:
  - *Chosen Approach*: Elevate the manual editing workspace from hidden modal popups to a prominent, always-open split-column workbench directly on the primary viewport.
  - *Why*: Power contributors processing batches of 20–100 images need instantaneous access to tag reordering, inline typo fixes, and CSV copy tools without the friction of opening and closing modal overlays.

---

### 4. Technical Architecture & Data Strategy

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    Top Navigation Bar (One-Row, 3-Zone)                      │
│ [Brand: AdobeMeta Pro] ─── [Playground · Batch · Trends · Monetize] ─── [Export] │
└──────────────────────────────────────┬───────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼───────────────────────────────────────┐
│              SeaDream 5.0 Hero Playground & Interactive Sandbox              │
│  ┌─────────────────────────────┐        ┌─────────────────────────────────┐  │
│  │ Headline & Value Prop       │        │ Live Interactive Specimen Card   │  │
│  │ Dual Action CTAs            │ ◄────► │ 50-Slot Drag Reorder Engine     │  │
│  │ Capability Switcher Tabs    │        │ Real-time Tachometer Meter      │  │
│  └─────────────────────────────┘        └─────────────────────────────────┘  │
└──────────────────────────────────────┬───────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼───────────────────────────────────────┐
│                Always-Open Split Manual Precision Workbench                   │
│  ┌──────────────────────────────┐       ┌─────────────────────────────────┐  │
│  │ Left: Visual & Compliance    │       │ Right: Manual Drag & Raw Deck   │  │
│  │ • High-Res Image Preview     │       │ • Tier 1: Slots 1–5 (Drag/Swap) │  │
│  │ • Character Limit Gauge      │ ◄───► │ • Tier 2: Slots 6–10 (Drag/Swap)│  │
│  │ • Agency Preset Selectors    │       │ • Tier 3: Slots 11–49           │  │
│  │ • Title-to-Keyword Sync Radar│       │ • Raw Delimited Text Buffer     │  │
│  │ • Google Monetize Card       │       │ • Find/Replace & Negative Purge │  │
│  └──────────────────────────────┘       └─────────────────────────────────┘  │
└──────────────────────────────────────┬───────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼───────────────────────────────────────┐
│                 Asymmetric Bento Grid: Microstock Capabilities                │
│  [01. Rejection Shield]  [02. Multi-Agency Matrix]  [03. Google Royalty Hub] │
└──────────────────────────────────────┬───────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼───────────────────────────────────────┐
│        Export Pipeline: RFC-4180 CSV · IPTC Metadata · Direct Clipboard       │
└──────────────────────────────────────────────────────────────────────────────┘
```

- **Interactive State Mapping**:
  - `draggedSlotIndex: number | null`: Tracks the source slot being dragged.
  - `dragOverSlotIndex: number | null`: Highlights the target slot destination with an animated emerald insertion bar.
  - `handleSlotDrop(fromIdx, toIdx)`: Seamlessly splices and inserts the tag at the target position, auto-recalculating algorithmic search weight rankings.
  - `splitWorkbenchActiveItem: BulkItem`: Synchronizes the active asset between the hero playground, the batch processing queue, and the split workbench.
