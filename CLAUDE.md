# Viewscape

Business architecture navigator — terrain discovery UI. Consumes `viewscape-core` as a headless kernel and renders it as an interactive map with domain/capability navigation and perspective switching.

## Commands

```bash
pnpm install        # install dependencies
pnpm dev            # start dev server
pnpm build          # tsc + vite build → dist/
pnpm preview        # preview production build
pnpm test           # vitest run
pnpm test:watch     # vitest watch
pnpm check          # biome check
pnpm check:fix      # biome check --fix
```

## Tech Stack

| Concern | Choice |
|---------|--------|
| Shell | Vite + React + TypeScript |
| Canvas | React Flow / @xyflow/react |
| Kernel state | @xstate/react → viewscape-core Context Machine |
| UI state | Zustand |
| Schemas | Zod (via viewscape-core) |
| Formatting/linting | Biome |
| Testing | Vitest |

## Architecture

Viewscape consumes viewscape-core. The kernel owns all domain logic, navigation state, and graph operations. This project owns rendering, layout, and UX.

### Two-step projection pipeline
1. `lib/projection.ts` — speaks kernel types (Node, Edge, NavigationContext) → PerspectiveView
2. `lib/react-flow-adapter.ts` — speaks React Flow types (ReactFlowNode, ReactFlowEdge)

## Key Design Rules

1. **Never duplicate kernel logic.** If viewscape-core has a function for it, use it. Do not reimplement navigation semantics.

2. **Context Machine is single authority.** Instantiated once in `use-context-machine.ts`. All nav state reads from `snapshot.context.nav`. All mutations via `send(event)`.

3. **Zustand owns UI-only state.** Panel visibility, animation flags, hover state. Zustand must not store or derive canonical navigation state (active domain, capability, journey, perspective, selected node/edge).

4. **Projection must not become a second kernel.** Viewscape may derive renderable visibility and highlight state from kernel state, but must not redefine navigation semantics already owned by viewscape-core.

5. **React Flow is render-only.** Node and edge types are delivery structures for rendering. They must not become the source of truth for terrain semantics.

6. **Viewscape is not GuideRail.** Supports journey activation and contextual highlighting, but not full guided traversal as a primary interaction mode.

7. **No default exports** except where tooling requires it (vite.config, vitest.config, main.tsx, *.stories.tsx).

8. **seed-loader.ts is temporary.** Development data bridge. Must not become the long-term content loading contract.

## Right Panel Routing Rule

Priority order (binding):
1. Selected node → NodeDetailPanel
2. Selected edge → EdgeDetailPanel
3. Active capability → CapabilityDetailPanel
4. Active domain → DomainDetailPanel
5. Nothing → empty state

## Design Tensions / Watchpoints

- Do not duplicate navigation truth between Context Machine and Zustand
- Do not let projection.ts become a second kernel
- Do not let journey support turn Viewscape into GuideRail
- Do not overfit the UI to the banking seed dataset
- Keep React Flow adaptation render-only
- Keep detail panels presentational, not state-owning

## Plan

See `/Users/jladd/Code/plans/viewscape-MVP.md` for the full implementation plan.

## Project Structure

```
src/
├── hooks/          # use-context-machine, use-perspective-provider
├── store/          # Zustand UI store, seed data loader
├── lib/            # projection logic, react-flow adapter
├── components/
│   ├── layout/     # AppShell, TopBar, LeftPanel, RightPanel
│   ├── canvas/     # TerrainCanvas, custom nodes, custom edges
│   ├── navigation/ # DomainCapabilityBrowser, PerspectiveSwitcher, Breadcrumb
│   └── detail/     # NodeDetailPanel, CapabilityDetailPanel, etc.
└── styles/         # CSS reset, variables, react-flow overrides
```
