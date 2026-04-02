---
title: Button
description: Displays a button or a component that looks like a button.
component: true
links:
  source: https://github.com/huntabyte/shadcn-svelte/tree/next/sites/docs/src/lib/registry/ui/button
  api: https://bits-ui.com/docs/components/button#api-reference
---

```svelte showLineNumbers
<Button variant="outline">Button</Button>
<Button variant="outline" size="icon" aria-label="Submit">
  <ArrowUpIcon />
</Button>
```

## Installation

## Usage

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<Button variant="outline">Button</Button>
```

## Examples

### Size

```svelte
<!-- Small -->
<Button size="sm" variant="outline">Small</Button>
<Button size="icon-sm" aria-label="Submit" variant="outline">
  <ArrowUpRightIcon />
</Button>

<!-- Medium -->
<Button variant="outline">Default</Button>
<Button size="icon" aria-label="Submit" variant="outline">
  <ArrowUpRightIcon />
</Button>

<!-- Large -->
<Button size="lg" variant="outline">Large</Button>
<Button size="icon-lg" aria-label="Submit" variant="outline">
  <ArrowUpRightIcon />
</Button>
```

### Default

```svelte
<Button>Button</Button>
```

### Outline

```svelte
<Button variant="outline">Outline</Button>
```

### Secondary

```svelte
<Button variant="secondary">Secondary</Button>
```

### Ghost

```svelte
<Button variant="ghost">Ghost</Button>
```

### Destructive

```svelte
<Button variant="destructive">Destructive</Button>
```

### Link

```svelte
<Button variant="link">Link</Button>
```

### Icon

```svelte
<Button variant="outline" size="icon" aria-label="Submit">
  <CircleFadingArrowUpIcon />
</Button>
```

### With Icon

The spacing between the icon and the text is automatically adjusted based on the size of the button. You do not need any margin on the icon.

```svelte
<Button variant="outline" size="sm">
  <IconGitBranch /> New Branch
</Button>
```

### Rounded

Use the `rounded-full` class to make the button rounded.

```svelte
<Button variant="outline" size="icon" className="rounded-full">
  <ArrowUpRightIcon />
</Button>
```

### Spinner

```svelte showLineNumbers
<Button size="sm" variant="outline" disabled>
  <Spinner />
  Submit
</Button>
```

### Button Group

To create a button group, use the `ButtonGroup` component. See [Button Group](button-group.md) for more details.

```svelte showLineNumbers
<ButtonGroup.Root>
  <ButtonGroup.Root class="hidden sm:flex">
    <Button variant="outline" size="icon" aria-label="Go Back">
      <ArrowLeft />
    </Button>
  </ButtonGroup.Root>
  <ButtonGroup.Root>
    <Button variant="outline">Archive</Button>
    <Button variant="outline">Report</Button>
  </ButtonGroup.Root>
  <ButtonGroup.Root>
    <Button variant="outline">Snooze</Button>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Button
            {...props}
            variant="outline"
            size="icon"
            aria-label="More Options"
          >
            <MoreHorizontal />
          </Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" class="w-52">
        <DropdownMenu.Group>
          <DropdownMenu.Item>
            <MailCheck />
            Mark as Read
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <Archive />
            Archive
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Item>
            <Clock />
            Snooze
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <CalendarPlus />
            Add to Calendar
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <ListFilter />
            Add to List
          </DropdownMenu.Item>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              <Tag />
              Label As...
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.RadioGroup bind:value={label}>
                <DropdownMenu.RadioItem value="personal">
                  Personal
                </DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value="work"
                  >Work</DropdownMenu.RadioItem
                >
                <DropdownMenu.RadioItem value="other"
                  >Other</DropdownMenu.RadioItem
                >
              </DropdownMenu.RadioGroup>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Item class="text-destructive focus:text-destructive">
            <Trash2 />
            Trash
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </ButtonGroup.Root>
</ButtonGroup.Root>
```

### Link

You can convert the `<button>` into an `<a>` element by simply passing an `href` as a prop.

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<Button href="/dashboard">Dashboard</Button>
```

Alternatively, you can use the `buttonVariants` helper to create a link that looks like a button.

```svelte
<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button";
</script>

<a href="/dashboard" class={buttonVariants({ variant: "outline" })}>
  Dashboard
</a>
```

## Changelog

### 2025-09-24 New sizes

We have added two new sizes to the button component: `icon-sm` and `icon-lg`. These sizes are used to create icon buttons. To add them, edit `button.svelte` and add the following code under `size` in `buttonVariants`:

```ts showLineNumbers title="components/ui/button.svelte"
export const buttonVariants = tv({
  // ...
  variants: {
    // ...
    size: {
      // ...
      icon: "size-9",
      "icon-sm": "size-8",
      "icon-lg": "size-10",
    },
  },
});
```
