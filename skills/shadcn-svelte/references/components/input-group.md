---
title: Input Group
description: Display additional information or actions to an input or textarea.
component: true
links:
  source: https://github.com/huntabyte/shadcn-svelte/tree/next/sites/docs/src/lib/registry/ui/input-group
---

## Installation

## Usage

```svelte showLineNumbers
<script lang="ts">
  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import SearchIcon from "@lucide/svelte/icons/search";
</script>
```

```svelte showLineNumbers
<InputGroup.Root>
  <InputGroup.Input placeholder="Search..." />
  <InputGroup.Addon>
    <SearchIcon />
  </InputGroup.Addon>
  <InputGroup.Addon align="inline-end">
    <InputGroup.Button>Search</InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

## Examples

### Icon

### Text

Display additional text information alongside inputs.

### Button

Add buttons to perform actions within the input group.

### Tooltip

Add tooltips to provide additional context or help.

### Textarea

Input groups also work with textarea components. Use `block-start` or `block-end` for alignment.

### Spinner

Show loading indicators while processing input.

### Label

Add labels within input groups to improve accessibility.

### Dropdown

Pair input groups with dropdown menus for complex interactions.

### Button Group

Wrap input groups with button groups to create prefixes and suffixes.

### Custom Input

Add the `data-slot="input-group-control"` attribute to your custom input for automatic behavior and focus state handling.

No style is applied to the custom input. Apply your own styles using the `class` prop.

