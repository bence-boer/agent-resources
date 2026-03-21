---
title: Spinner
description: An indicator that can be used to show a loading state.
component: true
links:
  source: https://github.com/huntabyte/shadcn-svelte/tree/next/sites/docs/src/lib/registry/ui/spinner
---

## Installation

## Usage

```svelte
<script lang="ts">
  import { Spinner } from "$lib/components/ui/spinner/index.js";
</script>
```

```svelte
<Spinner />
```

## Customization

You can replace the default spinner icon with any other icon by editing the `Spinner` component.

## Examples

### Size

Use the `size-*` utility class to change the size of the spinner.

### Color

Use the `text-*` utility class to change the color of the spinner.

### Button

Add a spinner to a button to indicate a loading state. The `<Button />` will handle the spacing between the spinner and the text.

### Badge

You can also use a spinner inside a badge.

### Input Group

Input Group can have spinners inside `<InputGroup.Addon>`.

### Empty

### Item

Use the spinner inside `<Item.Media>` to indicate a loading state.

