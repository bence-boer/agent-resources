---
title: Button Group
description: A container that groups related buttons together with consistent styling.
component: true
links:
  source: https://github.com/huntabyte/shadcn-svelte/tree/next/sites/docs/src/lib/registry/ui/button-group
---

## Installation

## Usage

```svelte
<script lang="ts">
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
</script>
```

```svelte
<ButtonGroup.Root>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup.Root>
```

## Accessibility

- The `ButtonGroup` component has the `role` attribute set to `group`.
- Use `tabindex` to navigate between the buttons in the group.
- Use `aria-label` or `aria-labelledby` to label the button group.

```svelte showLineNumbers
<ButtonGroup aria-label="Button group">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup>
```

## ButtonGroup vs ToggleGroup

- Use the `ButtonGroup` component when you want to group buttons that perform an action.
- Use the `ToggleGroup` component when you want to group buttons that toggle a state.

## Examples

### Orientation

Set the `orientation` prop to change the button group layout.

### Size

Control the size of buttons using the `size` prop on individual buttons.

### Nested

Nest `ButtonGroup` components to create button groups with spacing.

### Separator

The `ButtonGroupSeparator` component visually divides buttons within a group.

Buttons with variant `outline` do not need a separator since they have a border. For other variants, a separator is recommended to improve the visual hierarchy.

### Split

Create a split button group by adding two buttons separated by a `ButtonGroupSeparator`.

### Input

Wrap an `Input` component with buttons.

### Input Group

Wrap an `InputGroup` component to create complex input layouts.

### Dropdown Menu

Create a split button group with a `DropdownMenu` component.

### Select

Pair with a `Select` component.

### Popover

Use with a `Popover` component.

