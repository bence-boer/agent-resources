---
title: Date Picker
description: A date picker component with range and presets.
component: true
links:
  source: https://github.com/huntabyte/shadcn-svelte/tree/next/sites/docs/src/lib/registry/examples/date-picker-demo.svelte
---

## Installation

The Date Picker is built using a composition of the `<Popover />` and either the `<Calendar />` or `<RangeCalendar />` components.

See installation instructions for [Popover](popover.md#installation), [Calendar](calendar.md#installation), and [Range Calendar](range-calendar.md#installation).

## Usage

```svelte showLineNumbers title="lib/components/example-date-picker.svelte"
<script lang="ts">
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import {
    type DateValue,
    DateFormatter,
    getLocalTimeZone,
  } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";

  const df = new DateFormatter("en-US", {
    dateStyle: "long",
  });

  let value = $state<DateValue>();
</script>

<Popover.Root>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class={cn(
          "w-[280px] justify-start text-start font-normal",
          !value && "text-muted-foreground"
        )}
        {...props}
      >
        <CalendarIcon class="me-2 size-4" />
        {value ? df.format(value.toDate(getLocalTimeZone())) : "Select a date"}
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar bind:value type="single" initialFocus captionLayout="dropdown" />
  </Popover.Content>
</Popover.Root>
```

## Examples

### Date of Birth Picker

### Picker with Input

<!--need to fix code not showing due to type-->

### Date and Time Picker

### Natural Language Picker

This component uses the `chrono-node` library to parse natural language dates.

