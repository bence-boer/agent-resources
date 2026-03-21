---
title: Alert
description: Displays a callout for user attention.
component: true
links:
  source: https://github.com/huntabyte/shadcn-svelte/tree/next/sites/docs/src/lib/registry/ui/alert
---

## Installation

## Usage

```svelte showLineNumbers
<script lang="ts">
  import * as Alert from "$lib/components/ui/alert/index.js";
</script>
```

```svelte showLineNumbers
<Alert.Root>
  <Alert.Title>Heads up!</Alert.Title>
  <Alert.Description>
    You can add components to your app using the cli.
  </Alert.Description>
</Alert.Root>
```
