---
title: Kbd
description: Used to display textual user input from keyboard.
component: true
links:
  source: https://github.com/huntabyte/shadcn-svelte/tree/next/sites/docs/src/lib/registry/ui/kbd
---

## Installation

## Usage

```svelte
<script lang="ts">
  import * as Kbd from "$lib/components/ui/kbd/index.js";
</script>
```

```svelte
<Kbd.Root>B</Kbd.Root>
```

## Examples

### Group

Use the `Kbd.Group` component to group keyboard keys together.

### Button

Use the `Kbd.Root` component inside a `Button` component to display a keyboard key inside a button.

### Tooltip

You can use the `Kbd.Root` component inside a `Tooltip` component to display a tooltip with a keyboard key.

### Input Group

You can use the `Kbd.Root` component inside a `InputGroup.Addon` component to display a keyboard key inside an input group.

