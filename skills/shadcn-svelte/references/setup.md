# Setup and Configuration

## Installation (SvelteKit)

### Create project

Use the SvelteKit CLI to create a new project with TailwindCSS:

```bash
npx sv create my-app --add tailwindcss
```

### Setup path aliases

If you are not using the default alias `$lib`, update your `svelte.config.js` file to include those aliases:

```ts
const config = {
  // ... other config
  kit: {
    // ... other config
    alias: {
      "@/*": "./path/to/lib/*",
    },
  },
};
```

### Run the CLI

```bash
npx shadcn-svelte@latest init
```

### Configure components.json

You will be asked a few questions to configure `components.json`:

```txt
Which base color would you like to use? › Slate
Where is your global CSS file? (this file will be overwritten) › src/routes/layout.css
Configure the import alias for lib: › $lib
Configure the import alias for components: › $lib/components
Configure the import alias for utils: › $lib/utils
Configure the import alias for hooks: › $lib/hooks
Configure the import alias for ui: › $lib/components/ui
```

### Add components

You can now start adding components to your project:

```bash
npx shadcn-svelte@latest add button
```

The command above will add the `Button` component to your project. You can then import it like this:

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<Button>Click me</Button>
```

---

## Manual Installation

### Add Tailwind

Use the `sv` CLI to add Tailwind CSS to your project:

```bash
npx sv add tailwindcss
```

### Add dependencies

Add the following dependencies to your project:

```bash
npm install tailwind-variants clsx tailwind-merge tw-animate-css
```

### Add icon library

Install `@lucide/svelte`:

```bash
npm install @lucide/svelte
```

### Configure path aliases

If you are using SvelteKit and are not using the default alias `$lib`, update your `svelte.config.js` file to include those aliases:

```ts
const config = {
  // ... other config
  kit: {
    // ... other config
    alias: {
      "@/*": "./path/to/lib/*",
    },
  },
};
```

If you are _not_ using SvelteKit, then update your path aliases in your `tsconfig.json` and `vite.config.ts`:

```json
{
  "compilerOptions": {
    // ... other options
    "paths": {
      "$lib": ["./src/lib"],
      "$lib/*": ["./src/lib/*"]
    }
  }
}
```

```ts
import path from "path";

export default defineConfig({
  // ... other options
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
});
```

### Configure styles

Add the global CSS file at `src/routes/layout.css`. The file must include:

```css
@import "tailwindcss";
@import "tw-animate-css";
@custom-variant dark (&:is(.dark *));
```

Followed by `:root` and `.dark` CSS variable definitions, `@theme inline` mappings, and a `@layer base` block. See [theming.md](theming.md) for the complete CSS variable reference and the full file template.

The `@layer base` block should include:

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Configure utils

Create a `cn` helper to make it easier to conditionally add and merge Tailwind CSS classes:

```ts
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Import styles to your app

Create `src/routes/+layout.svelte` and import the styles:

```svelte
<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

{@render children?.()}
```

### Add components

You can now start adding components to your project:

```bash
npx shadcn-svelte@latest add button
```

---

## CLI Reference

### init

Use the `init` command to initialize dependencies for a new project. It installs dependencies, adds the `cn` util, and creates CSS variables for the project.

```bash
npx shadcn-svelte@latest init
```

You will be asked a few questions to configure `components.json`:

```txt
Which base color would you like to use? › Slate
Where is your global CSS file? (this file will be overwritten) › src/routes/layout.css
Configure the import alias for lib: › $lib
Configure the import alias for components: › $lib/components
Configure the import alias for utils: › $lib/utils
Configure the import alias for hooks: › $lib/hooks
Configure the import alias for ui: › $lib/components/ui
```

**Options:**

```
Usage: shadcn-svelte init [options]

initialize your project and install dependencies

Options:
  -c, --cwd <path>           the working directory (default: the current directory)
  -o, --overwrite            overwrite existing files (default: false)
  --no-deps                  disable adding & installing dependencies
  --skip-preflight           ignore preflight checks and continue (default: false)
  --base-color <name>        the base color for the components (choices: "slate", "gray", "zinc",
                             "neutral", "stone")
  --css <path>               path to the global CSS file
  --components-alias <path>  import alias for components
  --lib-alias <path>         import alias for lib
  --utils-alias <path>       import alias for utils
  --hooks-alias <path>       import alias for hooks
  --ui-alias <path>          import alias for ui
  --proxy <proxy>            fetch items from registry using a proxy
  -h, --help                 display help for command
```

### add

Use the `add` command to add components and dependencies to your project.

```bash
npx shadcn-svelte@latest add [component]
```

**Options:**

```
Usage: shadcn-svelte add [options] [components...]

add components to your project

Arguments:
  components         the components to add or a url to the component

Options:
  -c, --cwd <path>   the working directory (default: the current directory)
  --no-deps         skips adding & installing package dependencies
  --skip-preflight  ignore preflight checks and continue (default: false)
  -a, --all         install all components to your project (default: false)
  -y, --yes         skip confirmation prompt (default: false)
  -o, --overwrite   overwrite existing files (default: false)
  --proxy <proxy>   fetch components from registry using a proxy
  -h, --help        display help for command
```

### registry build

Use the `registry build` command to generate the registry JSON files. This reads the `registry.json` file and generates the registry JSON files into the `static/r` directory.

```bash
npx shadcn-svelte@latest registry build [registry.json]
```

**Options:**

```
Usage: shadcn-svelte registry build [options] [registry]

build components for a shadcn-svelte registry

Arguments:
  registry             path to registry.json file (default: ./registry.json)

Options:
  -c, --cwd <path>     the working directory (default: the current directory)
  -o, --output <path>  destination directory for json files (default: ./static/r)
  -h, --help           display help for command
```

### Proxy

You can use a proxy when sending requests to fetch from the `shadcn-svelte` registry. If the `HTTP_PROXY` or `http_proxy` environment variables have been set, the request library underneath will respect the proxy settings.

```bash
HTTP_PROXY="<proxy-url>" npx shadcn-svelte@latest init
```

---

## components.json Reference

The `components.json` file holds configuration for your project. The CLI uses it to understand how your project is set up and how to generate components customized for your project.

> The `components.json` file is optional and **only required if you're using the CLI** to add components to your project. If you're using the copy and paste method, you don't need this file.

Create a `components.json` file by running:

```bash
npx shadcn-svelte@latest init
```

### $schema

```json
{
  "$schema": "https://shadcn-svelte.com/schema.json"
}
```

### tailwind.css

Path to the CSS file that imports Tailwind CSS into your project.

```json
{
  "tailwind": {
    "css": "src/app.{p,post}css"
  }
}
```

### tailwind.baseColor

Used to generate the default color palette for your components. **This cannot be changed after initialization.**

```json
{
  "tailwind": {
    "baseColor": "gray" | "neutral" | "slate" | "stone" | "zinc"
  }
}
```

### aliases.lib

Import alias for your library, which is typically where you store your components, utils, hooks, etc.

```json
{
  "aliases": {
    "lib": "$lib"
  }
}
```

### aliases.utils

Import alias for your utility functions.

```json
{
  "aliases": {
    "utils": "$lib/utils"
  }
}
```

### aliases.components

Import alias for your components.

```json
{
  "aliases": {
    "components": "$lib/components"
  }
}
```

### aliases.ui

Import alias for your UI components.

```json
{
  "aliases": {
    "ui": "$lib/components/ui"
  }
}
```

### aliases.hooks

Import alias for your hooks. In Svelte 5 these are reactive functions/classes whose files typically end in `.svelte.ts` or `.svelte.js`.

```json
{
  "aliases": {
    "hooks": "$lib/hooks"
  }
}
```

### typescript

TypeScript can be enabled or disabled.

```json
{
  "typescript": true
}
```

You can also specify a path to a custom TypeScript config file if it has a different name from `tsconfig.json` or `jsconfig.json`, or if it is located in a different directory:

```json
{
  "typescript": {
    "config": "path/to/tsconfig.custom.json"
  }
}
```

### registry

The registry URL tells the CLI where to fetch the shadcn-svelte components/registry from. You can pin this to a specific preview release or your own fork of the registry.

```json
{
  "registry": "https://shadcn-svelte.com/registry"
}
```

---

## Dark Mode

### Install mode-watcher

```bash
npm install mode-watcher
```

### Add the ModeWatcher component

Import the `ModeWatcher` component and use it in your root layout:

```svelte
<script lang="ts">
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";
  let { children } = $props();
</script>

<ModeWatcher />
{@render children?.()}
```

### Add a mode toggle

Place a mode toggle on your site to toggle between light and dark mode. See the `dark-mode-light-switch` and `dark-mode-dropdown-menu` component examples in the shadcn-svelte registry.

---

## Using JavaScript

This project and the components are written in TypeScript. However, a JavaScript version of the components is available via the CLI.

To opt out of TypeScript, set the `typescript` flag to `false` in your `components.json` file:

```json
{
  "style": "default",
  "tailwind": {
    "css": "src/routes/layout.css"
  },
  "typescript": false,
  "aliases": {
    "utils": "$lib/utils",
    "components": "$lib/components",
    "hooks": "$lib/hooks",
    "ui": "$lib/components/ui"
  },
  "registry": "https://shadcn-svelte.com/registry"
}
```

To configure import aliases, create a `jsconfig.json` file:

```json
{
  "compilerOptions": {
    "paths": {
      "$lib/*": ["./src/lib/*"]
    }
  }
}
```
