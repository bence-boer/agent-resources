---
title: Chart
description: Beautiful charts. Built using LayerChart. Copy and paste into your apps.
component: true
links:
  source: https://github.com/huntabyte/shadcn-svelte/tree/next/sites/docs/src/lib/registry/ui/chart
---

Introducing **Charts**. A collection of chart components that you can copy and paste into your apps.

Charts are designed to look great out of the box. They work well with other components are are fully customizable to fit your project.

Browse the Charts Library in the upstream docs.

## Component

We use [LayerChart](https://next.layerchart.com) under the hood.

We designed the `Chart` component with composition in mind. **You build your charts using LayerChart components and only bring in custom components, such as `ChartTooltip`, when and where you need it**

```svelte showLineNumbers /Chart.Container/ /Chart.Tooltip/
<script lang="ts">
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { BarChart } from "layerchart";

  const data = [
    // ...
  ];
</script>

<Chart.Container>
  <BarChart {data} x="date" y="value">
    {#snippet tooltip()}
      <Chart.Tooltip />
    {/snippet}
  </BarChart>
</Chart.Container>
```

We do not wrap LayerChart. This means you're not locked into an abstraction. When a new LayerChart version is released, you can follow the official upgrade path to upgrade your charts.

**The components are yours**.

## Installation

<InstallTabs>
{#snippet cli()}
{/snippet}
{#snippet manual()}
Install `layerchart`:

</Step>

Add the following colors to your CSS file

</Step>

```css title="src/app.css" showLineNumbers
:root {
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
}

.dark {
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
}

@theme inline {
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
}
```

Copy and paste the following code into your project.

</Step>

{/snippet}
</InstallTabs>

## Your First Chart

Let's build your first chart. We'll build a bar chart with an axis, grid, tooltip, and legend.

### Start by defining your data

The following data represents the number of desktop and mobile users for each month.

```svelte title="lib/components/example-chart.svelte" showLineNumbers
<script lang="ts">
  interface ChartDataPointType { month: string; desktop: number; mobile: number }
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ] as const satisfies ChartDataPointType[];
</script>
```

### Define your chart config

The chart config holds configuration for the chart. This is where you place human-readable strings, such as labels, icons, and color tokens for theming.

```svelte title="lib/components/example-chart.svelte" showLineNumbers
<script lang="ts">
  import * as Chart from "$lib/components/ui/chart/index.js";

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } as const satisfies Chart.ChartConfig;
</script>
```

### Build your chart

You can now build your chart using LayerChart components. We're using the `BarChart` component in this example, which is one of LayerChart's "Simplified Charts".

These components handle a lot of the common chart scaffolding for you, while allowing you to customize them to your liking.

{#if viewerData}
{/if}

We now have a group-stacked bar chart with an x axis and a grid.

### Adjusting the Axis Ticks

Our bar chart is currently displaying the full month name for each tick on the x axis. Let's shorten it to just the first three letters.

### Add a custom formatter to the x axis

The `props` prop is how you can pass custom props to the various components that make up the chart. Here we're passing a custom formatter to the x axis.

```svelte showLineNumbers {21-25}
<Chart.Container config={chartConfig} class="min-h-[200px] w-full">
  <BarChart
    data={chartData}
    xScale={scaleBand().padding(0.25)}
    x="month"
    axis="x"
    tooltip={false}
    seriesLayout="group"
    series={[
      {
        key: "desktop",
        label: chartConfig.desktop.label,
        color: chartConfig.desktop.color,
      },
      {
        key: "mobile",
        label: chartConfig.mobile.label,
        color: chartConfig.mobile.color,
      },
    ]}
    props={{
      xAxis: {
        format: (month_label) => month_label.slice(0, 3),
      },
    }}
  />
</Chart.Container>
```

### Add Tooltip

So far we've only used the `BarChart` component from LayerChart. They look great out of the box thanks to some customizations in the `chart` component.

To add a tooltip, we'll use the custom `Chart.Tooltip` component from `chart`.

### Add the `Chart.Tooltip` component to the chart

We'll replace the `tooltip={false}` prop with the `tooltip` snippet where we'll place the `Chart.Tooltip` component.

```svelte showLineNumbers {26-28}
<Chart.Container config={chartConfig} class="min-h-[200px] w-full">
  <BarChart
    data={chartData}
    xScale={scaleBand().padding(0.25)}
    x="month"
    axis="x"
    seriesLayout="group"
    series={[
      {
        key: "desktop",
        label: chartConfig.desktop.label,
        color: chartConfig.desktop.color,
      },
      {
        key: "mobile",
        label: chartConfig.mobile.label,
        color: chartConfig.mobile.color,
      },
    ]}
    props={{
      xAxis: {
        format: (month_label) => month_label.slice(0, 3),
      },
    }}
  >
    {#snippet tooltip()}
      <Chart.Tooltip />
    {/snippet}
  </BarChart>
</Chart.Container>
```

### Add Legend

### Set the `legend` prop to `true`

The `legend` prop is used to show a legend for the chart. We are working with LayerChart to add a payload similar to the tooltip so we can more easily create a custom legend.

```svelte showLineNumbers {8}
<Chart.Container config={chartConfig} class="min-h-[200px] w-full">
  <BarChart
    data={chartData}
    xScale={scaleBand().padding(0.25)}
    x="month"
    axis="x"
    seriesLayout="group"
    legend
    series={[
      {
        key: "desktop",
        label: chartConfig.desktop.label,
        color: chartConfig.desktop.color,
      },
      {
        key: "mobile",
        label: chartConfig.mobile.label,
        color: chartConfig.mobile.color,
      },
    ]}
    props={{
      xAxis: {
        format: (month_label) => month_label.slice(0, 3),
      },
    }}
  >
    {#snippet tooltip()}
      <Chart.Tooltip />
    {/snippet}
  </BarChart>
</Chart.Container>
```

Done. You've built your first chart! What's next?

- [Themes and Colors](#theming)
- [Tooltip](#tooltip)

## Chart Config

The chart config is where you define the labels, icons and colors for a chart.

It is intentionally decoupled from chart data.

This allows you to share config and color tokens between charts. It can also works independently for cases where your data or color tokens live remotely or in a different format.

```svelte
<script lang="ts">
  import MonitorIcon from "@lucide/svelte/icons/monitor";
  import * as Chart from "$lib/components/ui/chart/index.js";

  const chartConfig = {
    desktop: {
      label: "Desktop",
      icon: MonitorIcon,
      // A color like 'hsl(220, 98%, 61%)' or 'var(--color-name)'
      color: "#2563eb",
      // OR a theme object with 'light' and 'dark' keys
      theme: {
        light: "#2563eb",
        dark: "#dc2626",
      },
    },
  } as const satisfies Chart.ChartConfig;
</script>
```

## Theming

Charts has built-in support for theming. You can use css variables (recommended) or color values in any color format, such as hex, hsl, or oklch.

### CSS Variables

### Define your colors in your css file

```css {5-6,13-14} title="src/routes/layout.css" showLineNumbers
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... */
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... */
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
}
```

### Add the color to your `chartConfig`

```svelte {5,9} showLineNumbers
<script lang="ts">
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
    mobile: {
      label: "Mobile",
      color: "var(--chart-2)",
    },
  } as const satisfies Chart.ChartConfig;
</script>
```

### hex, hsl or oklch

You can also define your colors directly in the chart config. Use the color format you prefer.

```svelte showLineNumbers
<script lang="ts">
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
  } as const satisfies Chart.ChartConfig;
</script>
```

### Using Colors

To use the theme colors in your chart, reference the colors using the format `var(--color-KEY)`.

#### Components

```svelte
<Bar fill="var(--color-desktop)" />
```

#### Chart Data

```ts showLineNumbers
interface BrowserChartDataPointType { browser: string; visitors: number; color: string }
const chartData = [
  { browser: "chrome", visitors: 275, color: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, color: "var(--color-safari)" },
] as const satisfies BrowserChartDataPointType[];
```

#### Tailwind

```svelte
<Label class="fill-(--color-desktop)" />
```

## Tooltip

A chart tooltip contains a label, name, indicator and value. You can use a combination of these to customize your tooltip.

You can turn on/off any of these using the `hideLabel`, `hideIndicator` props and customize the indicator style using the `indicator` prop.

Use `labelKey` and `nameKey` to use a custom key for the tooltip label and name.

Chart comes with the `<Chart.Tooltip>` component. You can use this component to add custom tooltips to your chart.

### Props

Use the following props to customize the tooltip.

| Prop             | Type                     | Description                                             |
| :--------------- | :----------------------- | :------------------------------------------------------ |
| `labelKey`       | string                   | The config or data key to use for the label.            |
| `nameKey`        | string                   | The config or data key to use for the name.             |
| `indicator`      | `dot` `line` or `dashed` | The indicator style for the tooltip.                    |
| `hideLabel`      | boolean                  | Whether to hide the label.                              |
| `hideIndicator`  | boolean                  | Whether to hide the indicator.                          |
| `label`          | string                   | A custom label for the tooltip                          |
| `labelFormatter` | function                 | A function to format the label.                         |
| `formatter`      | Snippet                  | A snippet to provide flexible rendering of the tooltip. |

### Colors

Colors are automatically referenced from the chart config.

### Custom

To use a custom key for tooltip label and names, use the `labelKey` and `nameKey` props.

```svelte showLineNumbers /browser/
<script lang="ts">
  interface BrowserChartDataPointType { browser: string; visitors: number; color: string }
  const chartData = [
    { browser: "chrome", visitors: 187, color: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, color: "var(--color-safari)" },
  ] as const satisfies BrowserChartDataPointType[];

  const chartConfig = {
    visitors: {
      label: "Total Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "var(--chart-1)",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
  } as const satisfies ChartConfig;
</script>

<Chart.Tooltip labelKey="visitors" nameKey="browser" />
```

This will use `Total Visitors` for label and `Chrome` and `Safari` for the tooltip names.
