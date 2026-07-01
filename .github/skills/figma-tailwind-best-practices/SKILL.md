---
name: figma-tailwind-best-practices
description: 'Implement Figma designs with Tailwind CSS best practices in this project. Use when: implementing Figma in Tailwind, converting design tokens to Tailwind classes, avoiding arbitrary values, adding custom Tailwind utilities, or translating Figma layout into correct Tailwind CSS 4 code.'
argument-hint: 'Describe the Figma implementation target and any Tailwind constraints'
---

# Figma Tailwind Best Practices

Implement Figma-derived UI with Tailwind CSS in a way that stays faithful to the design without abandoning Tailwind's native workflow.

This skill is for design-to-code work where the output should remain idiomatic Tailwind instead of drifting into ad hoc CSS.

## When to Use

- Implementing a Figma screen or component with Tailwind CSS
- Converting Figma spacing, sizing, radius, typography, and colors into Tailwind classes
- Deciding whether a value should use a built-in Tailwind utility or a custom utility
- Cleaning up Tailwind code that overuses arbitrary values such as `w-[45px]`
- Enforcing Tailwind-first authoring instead of bundling utilities into CSS component classes

## Core Rules

- Use an existing Tailwind utility whenever Tailwind already provides the needed value.
- If the exact value does not exist in Tailwind, do not use arbitrary values like `w-[45px]` as the default solution.
- Define missing values as reusable CSS-backed Tailwind-friendly utilities such as `w-45px` in a shared stylesheet.
- Do not group Tailwind utilities into CSS component classes just to mimic traditional CSS structure.
- Keep Tailwind classes inline on the element unless a true shared utility or token is needed.
- Prefer project tokens and CSS variables over literal one-off color, spacing, radius, and typography values.

## Decision Flow

For every Figma value, decide in this order.

### 1. Check for an existing Tailwind utility

Use Tailwind's native class if it already expresses the value accurately enough.

Do not replace valid native utilities with custom CSS just to mirror Figma literally.

### 2. If Tailwind does not provide the value, create a reusable utility

When the design requires an exact value that Tailwind does not expose, define a reusable utility in a shared CSS surface such as `src/app/globals.css`.

Prefer utilities like these:

```css
@utility w-45px {
  width: 45px;
}

@utility rounded-20px {
  border-radius: 20px;
}
```

Then use them directly in markup:

```tsx
<div className="w-45px rounded-20px" />
```

Do not default to this:

```tsx
<div className="w-[45px] rounded-[20px]" />
```

### 3. If the value repeats or belongs to the design system, promote it to a token

When a custom value is likely to recur, define it through shared variables or theme tokens instead of scattering multiple custom utilities.

Examples:

- Repeated brand colors
- Reused card radius
- Common content widths
- Recurrent shadow or blur values

For this project, prefer extending the shared styling surface in `src/app/globals.css` deliberately.

### 4. Keep the final markup Tailwind-native

Even when custom utilities are required, author the component in normal Tailwind style.

Preferred:

```tsx
<section className="flex w-full items-center gap-4 rounded-20px bg-background px-6 py-4">
```

Avoid introducing CSS component wrappers like this:

```css
.card {
  @apply flex w-full items-center gap-4 px-6 py-4;
}
```

```tsx
<section className="card" />
```

## Figma-to-Tailwind Procedure

1. Use the Figma retrieval workflow first. Do not implement from incomplete or oversized raw Figma output.
2. Extract the implementation-critical values from the design: layout, spacing, size, typography, radius, color, and state differences.
3. Map each value to an existing Tailwind utility where possible.
4. For each missing exact value, decide whether it is one-off or reusable.
5. Add one-off-exact values as narrowly scoped shared utilities only when necessary.
6. Add recurring values as shared tokens or reusable utilities in `src/app/globals.css`.
7. Implement the component with inline Tailwind classes, not CSS abstraction classes.
8. Compare the result against the Figma screenshot and adjust only the mismatched values.

## Common Anti-Patterns

- Copying raw Figma values straight into arbitrary-value utilities everywhere
- Creating `.button`, `.card`, or `.hero` classes that mostly wrap `@apply`
- Introducing literal hex colors directly in markup repeatedly
- Using margins to simulate `gap`
- Defining custom utilities for values Tailwind already supports
- Adding custom utilities in component-local CSS when the shared stylesheet is the correct location

## Completion Standard

The implementation is complete only when the UI is faithful to Figma and the code still reads like real Tailwind code.