---
title: Table
description: A responsive table component.
component: true
links:
  source: https://github.com/huntabyte/shadcn-svelte/tree/next/sites/docs/src/lib/registry/ui/table
---

## Installation

## Usage

```svelte showLineNumbers
<script lang="ts">
  import * as Table from "$lib/components/ui/table/index.js";
</script>
```

```svelte showLineNumbers
<Table.Root>
  <Table.Caption>A list of your recent invoices.</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-[100px]">Invoice</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Method</Table.Head>
      <Table.Head class="text-end">Amount</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell class="font-medium">INV001</Table.Cell>
      <Table.Cell>Paid</Table.Cell>
      <Table.Cell>Credit Card</Table.Cell>
      <Table.Cell class="text-end">$250.00</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

## Data Table

You can use the `<Table />` component to build more complex data tables. Combine it with [@tanstack/table](https://tanstack.com/table) to create tables with sorting, filtering and pagination.

See [Data Table](data-table.md) for more information.

You can also see an example of a data table in the upstream Tasks demo.
