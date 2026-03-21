---
title: Popover
description: Displays rich content in a portal, triggered by a button.
component: true
links:
  source: https://github.com/huntabyte/shadcn-svelte/tree/next/sites/docs/src/lib/registry/ui/popover
  doc: https://bits-ui.com/docs/components/popover
  api: https://bits-ui.com/docs/components/popover#api-reference
---

## Installation

## Usage

```svelte showLineNumbers
<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js";
</script>
```

```svelte showLineNumbers
<Popover.Root>
  <Popover.Trigger>Open</Popover.Trigger>
  <Popover.Content>Place content for the popover here.</Popover.Content>
</Popover.Root>
```
