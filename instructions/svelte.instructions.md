---
name: Svelte Component Guidelines
description: Guidelines for writing Svelte 5 components.
applyTo: "**/*.svelte"
---

# Svelte 5 Component Guidelines

## Component Structure

- Keep components focused on a single responsibility (target: ≤150 lines).
- Use `<script lang="ts">` for all components.
- Order: script → template → style.

## Reactivity (Runes)

- Use `$state` for component-local mutable state.
- Use `$derived` for computed values — NEVER use `$effect` for state synchronization.
- Use `$props` with destructuring and typed interface:
  ```ts
  interface Props {
      name: string;
      count?: number;
  }
  let { name, count = 0 }: Props = $props();
  ```
- Use `$effect` only for DOM side-effects (canvas, third-party libs, timers).
- Prefer `$derived.by(() => ...)` for complex derivations over inline expressions.

## Props & Events

- Define all props with explicit `interface Props`.
- Use callback props (`onchange`, `onclick`) instead of dispatching custom events.
- Prefix event callbacks with `on` (e.g., `ontoggle`, `onselect`).
- Provide sensible default values for optional props.

## Template Patterns

- Use `{#if}` / `{:else}` for conditional rendering.
- Use `{#each items as item (item.id)}` with keyed iteration.
- Use `{#snippet}` / `{@render}` for reusable template fragments.
- Extract complex expressions into `$derived` variables.
- Avoid inline complex logic in event handlers — extract to named functions.

## Styling

- Use scoped `<style>` blocks exclusively (no `:global()` unless necessary).
- Use CSS custom properties for theming (e.g., `var(--border-color)`).
- Co-locate styles with the component they belong to.
- Prefer Tailwind utility classes for layout, custom CSS for component-specific styling.

## Code Quality

- Follow TypeScript guidelines for all script code (see typescript.instructions.md).
- Use `snake_case` for variables, functions, props, and CSS classes.
- Keep event handlers simple — delegate complex logic to separate functions.
- Prefer declarative patterns: `{#each}` over manual DOM manipulation.

## File Organization

- Place reusable components in `$lib/components/`.
- Group related small components in subdirectories (e.g., `$lib/components/ui/`).
- Use `.svelte.ts` files for shared reactive state and logic.

## Anti-Patterns to Avoid

- ❌ Using `$effect` to sync state (use `$derived` instead).
- ❌ Mutating props directly (use callback props for updates).
- ❌ Large monolithic components (break into smaller units).
- ❌ Inline complex template logic (extract to `$derived` or functions).
- ❌ Using stores for simple local state (use runes).
