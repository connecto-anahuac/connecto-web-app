## Connecto Claude Guidelines

This file defines the default operating rules for Claude Code in this repository.

## Project Snapshot

- Stack: Next.js 16.2.4, React 19.2.4, TypeScript 5, Tailwind CSS 4, ESLint 9, Zod 4.
- Routing uses the Next.js App Router under `src/app`.
- Current styling entry point is `src/app/globals.css` with Tailwind 4 and CSS variables.
- Treat this codebase as server-first. Add client boundaries only where interaction requires them.

## Primary Decision Rules

- Classify the user request before coding and choose the most relevant workflow.
- When the request is Figma-driven, do not start implementation from raw Figma output.
- Prefer reusing existing components and patterns before creating new ones.
- Keep changes minimal, local, and consistent with the repository's architecture.

## Next.js App Router Rules

When implementing product features, follow the `nextjs-app-router-architecture` skill as the default project architecture.

- Keep `src/app` thin. Route files should mostly compose page templates and route metadata concerns.
- Use a layered structure when features grow beyond a simple page:
	- `src/features/<domain>` for domain UI and feature logic
	- `src/shared` for cross-domain reusable UI and providers
	- `src/external` for DTOs, handlers, services, repositories, and external integrations
- Prefer server-side data fetching first. Only add client components for interactive UI or client state.
- For client-facing feature UIs, use a Container / Presenter / Hook split when the feature is non-trivial.
- For server mutations, keep actions thin and typed.
- Validate external or boundary data with Zod.
- Add metadata at the layout level rather than bloating individual page files unless route-specific metadata is truly required.

## Figma Workflow Rules

When the task involves implementing or mapping a Figma design, follow these rules.

### Skill Routing

- Use the Figma implementation workflow for design-to-code tasks.
- Use `figma-code-connect` when the deliverable is a `.figma.ts` or `.figma.js` mapping file.
- Use `figma-create-design-system-rules` when the deliverable is project rules or agent guidance.

### Required Retrieval Flow

- Never implement directly from a raw, oversized Figma response.
- Always use the `Figma Design Fetcher` subagent when design data needs staged retrieval.
- The fetcher must follow this sequence:
	1. Get structured design context for the target node.
	2. If the response is too large, truncated, or too coarse, fetch metadata for the same node.
	3. Re-fetch only the necessary child nodes.
	4. Repeat recursively until implementation-critical structure is covered.
	5. Fetch screenshots for the root and any child nodes whose visual detail is still ambiguous.
- Implementation may begin only after both structured design context and screenshot references are available for the relevant areas.

### Figma Interpretation Rules

- Treat Figma output as reference material, not final production code.
- Prefer project tokens, CSS variables, and existing component APIs over literal values from Figma.
- Do not fetch the entire subtree or full token inventory unless the task explicitly requires it.
- Avoid placeholder assets when Figma provides a usable source.
- Do not add a new icon package just to approximate the design.

## Code Connect Rules

When creating or updating Code Connect templates:

- Require a valid Figma URL with `node-id`.
- Confirm published components exist before proceeding.
- Use Code Connect suggestion and context tools before writing templates.
- Match Figma property types to code props strictly.
- Do not invent code props that are not present in the target component API.
- Map all enum values exhaustively when variant properties are used.

## Styling Rules

- Use Tailwind CSS 4 utilities and the project's CSS variables as the default styling mechanism unless a different local pattern already exists.
- Prefer tokens and variables over hardcoded colors, spacing, radii, and typography values.
- Extend `src/app/globals.css` or a proper shared styling surface deliberately instead of scattering one-off global overrides.
- Preserve accessibility, semantic HTML, and responsive behavior by default.

## Implementation Guardrails

- Reuse before creating: check whether a component or pattern already exists before building a new abstraction.
- Keep server and client boundaries explicit and minimal.
- Do not place business logic in route files when it belongs in a feature or external layer.
- Do not couple feature code directly to low-level services or repositories.
- Do not bypass validation at architecture boundaries.
- Do not introduce architectural sprawl for a tiny change. Use the full layered structure when complexity justifies it.

## Validation Rules

After meaningful changes, run the narrowest relevant validation first.

- Use `npm run lint` as the baseline repository validation.
- For Figma implementation work, visually verify the result against the screenshot reference before considering the task complete.
- If a change introduces a new abstraction or data contract, validate types and runtime assumptions in the touched area.

## Output Expectations For Claude

- Be concise and implementation-oriented.
- Explain tradeoffs only when they affect the decision.
- If architectural assumptions are unclear, ask once before committing to the wrong structure.
- Prefer making the change over describing the change, unless the user explicitly asked for planning only.
