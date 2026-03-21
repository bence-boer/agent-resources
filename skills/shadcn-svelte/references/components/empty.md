---
title: Empty
description: Use the Empty component to display a empty state.
component: true
links:
  source: https://github.com/huntabyte/shadcn-svelte/tree/next/sites/docs/src/lib/registry/ui/empty
---

## Installation

## Usage

```svelte
<script lang="ts">
  import * as Empty from "$lib/components/ui/empty/index.js";
  import FolderCodeIcon from "@tabler/icons-svelte/icons/folder-code";
</script>
```

```svelte
<Empty.Root>
  <Empty.Header>
    <Empty.Media variant="icon">
      <FolderCodeIcon />
    </Empty.Media>
    <Empty.Title>No data</Empty.Title>
    <Empty.Description>No data found</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button>Add data</Button>
  </Empty.Content>
</Empty.Root>
```

## Examples

### Outline

Use the `border` utility class to create a outline empty state.

### Background

Use the `bg-*` and `bg-gradient-*` utilities to add a background to the empty state.

### Avatar

Use the `EmptyMedia` component to display an avatar in the empty state.

### Avatar Group

Use the `EmptyMedia` component to display an avatar group in the empty state.

### InputGroup

You can add an `InputGroup` component to the `EmptyContent` component.

