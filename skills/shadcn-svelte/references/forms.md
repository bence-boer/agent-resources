# Forms

## Superforms + Formsnap (Server-Validated Forms)

Forms are one of the most common things you'll build in a web application. The `Form` components in shadcn-svelte are wrappers around [formsnap](https://formsnap.dev) and [sveltekit-superforms](https://superforms.rocks) which provide:

- Composable components for building forms.
- Form field components for scoping form state.
- Form validation using [Zod](https://zod.dev) or any other validation library supported by Superforms.
- Correct `aria` attributes applied to form fields based on states.
- Easy integration with Select, RadioGroup, Switch, Checkbox, and other form components.

### Anatomy

```svelte
<form>
  <Form.Field>
    <Form.Control>
      <Form.Label />
      <!-- Any Form input component -->
    </Form.Control>
    <Form.Description />
    <Form.FieldErrors />
  </Form.Field>
</form>
```

### Basic Example

```svelte
<form method="POST" use:enhance>
  <Form.Field {form} name="email">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Email</Form.Label>
        <Input {...props} bind:value={$formData.email} />
      {/snippet}
    </Form.Control>
    <Form.Description />
    <Form.FieldErrors />
  </Form.Field>
</form>
```

The `name`, `id`, and all accessibility attributes are applied to the input by spreading the `props` object from the `Form.Control` component. The `Form.Label` will automatically be associated with the input using the `for` attribute.

### Step-by-Step Usage

#### 1. Create a form schema

Define the shape of your form using a Zod schema in a file called `schema.ts`:

```ts
// src/routes/settings/schema.ts
import { z } from "zod";

export const formSchema = z.object({
  username: z.string().min(2).max(50),
});

export type FormSchema = typeof formSchema;
```

#### 2. Setup the load function

```ts
// src/routes/settings/+page.server.ts
import type { PageServerLoad } from "./$types.js";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod4 } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod4(formSchema)),
  };
};
```

#### 3. Create form component

Pass the `form` returned from the load function as a prop. Use `SuperValidated` for proper typing:

```svelte
<!-- src/routes/settings/settings-form.svelte -->
<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { formSchema, type FormSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";

  let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } =
    $props();

  const form = superForm(data.form, {
    validators: zod4Client(formSchema),
  });

  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <Input {...props} bind:value={$formData.username} />
      {/snippet}
    </Form.Control>
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

#### 4. Use the component

```svelte
<!-- src/routes/settings/+page.svelte -->
<script lang="ts">
  import type { PageData } from "./$types.js";
  import SettingsForm from "./settings-form.svelte";
  let { data }: { data: PageData } = $props();
</script>

<SettingsForm {data} />
```

#### 5. Create an Action

```ts
// src/routes/settings/+page.server.ts
import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod4(formSchema)),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod4(formSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    return {
      form,
    };
  },
};
```

### SPA Mode Example

For client-only validation without a server action:

```svelte
<script lang="ts" module>
  import { z } from "zod";

  const formSchema = z.object({
    username: z.string().min(2).max(50),
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        // handle valid form
      }
    },
  });

  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <Input {...props} bind:value={$formData.username} />
      {/snippet}
    </Form.Control>
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

---

## Field Component (Composable Form Fields)

The `Field` family is designed for composing accessible form fields without Superforms/Formsnap. It provides labels, controls, descriptions, errors, and semantic grouping.

### Import

```svelte
<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
</script>
```

### Components

- **`Field.Field`** — Core wrapper for a single field.
- **`Field.Label`** — Label element, linked to a control via `for`.
- **`Field.Description`** — Optional helper text.
- **`Field.Error`** — Validation message.
- **`Field.Content`** — Flex column that groups label and description. Not required if you have no description. Useful for horizontal layouts.
- **`Field.Title`** — Title text within a field (used in choice cards).
- **`Field.Group`** — Wraps related fields together.
- **`Field.Set`** — Semantic fieldset grouping.
- **`Field.Legend`** — Legend for a `Field.Set`.
- **`Field.Separator`** — Divider between fields in a group.

### Anatomy

```svelte
<Field.Field>
  <Field.Label for="input-id">Label</Field.Label>
  <!-- Input, Select, Switch, etc. -->
  <Field.Description>Optional helper text.</Field.Description>
  <Field.Error>Validation message.</Field.Error>
</Field.Field>
```

### Basic Usage

```svelte
<Field.Set>
  <Field.Legend>Profile</Field.Legend>
  <Field.Description>This appears on invoices and emails.</Field.Description>
  <Field.Group>
    <Field.Field>
      <Field.Label for="name">Full name</Field.Label>
      <Input id="name" autocomplete="off" placeholder="Evil Rabbit" />
      <Field.Description>This appears on invoices and emails.</Field.Description>
    </Field.Field>
    <Field.Field>
      <Field.Label for="username">Username</Field.Label>
      <Input id="username" autoComplete="off" aria-invalid />
      <Field.Error>Choose another username.</Field.Error>
    </Field.Field>
    <Field.Field orientation="horizontal">
      <Switch id="newsletter" />
      <Field.Label for="newsletter">Subscribe to the newsletter</Field.Label>
    </Field.Field>
  </Field.Group>
</Field.Set>
```

### Examples

#### Input

```svelte
<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
</script>

<Field.Set>
  <Field.Group>
    <Field.Field>
      <Field.Label for="username">Username</Field.Label>
      <Input id="username" type="text" placeholder="Max Leiter" />
      <Field.Description>Choose a unique username for your account.</Field.Description>
    </Field.Field>
    <Field.Field>
      <Field.Label for="password">Password</Field.Label>
      <Field.Description>Must be at least 8 characters long.</Field.Description>
      <Input id="password" type="password" placeholder="••••••••" />
    </Field.Field>
  </Field.Group>
</Field.Set>
```

#### Select

```svelte
<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import * as Select from "$lib/components/ui/select/index.js";

  let department = $state<string>();

  const departments = [
    { value: "engineering", label: "Engineering" },
    { value: "design", label: "Design" },
    { value: "marketing", label: "Marketing" },
  ];

  const departmentLabel = $derived(
    departments.find((d) => d.value === department)?.label ?? "Choose department"
  );
</script>

<Field.Field>
  <Field.Label for="department">Department</Field.Label>
  <Select.Root type="single" bind:value={department}>
    <Select.Trigger id="department">
      {departmentLabel}
    </Select.Trigger>
    <Select.Content>
      {#each departments as department (department.value)}
        <Select.Item {...department} />
      {/each}
    </Select.Content>
  </Select.Root>
  <Field.Description>Select your department or area of work.</Field.Description>
</Field.Field>
```

#### Checkbox

```svelte
<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
</script>

<Field.Group>
  <Field.Set>
    <Field.Legend variant="label">Show these items on the desktop</Field.Legend>
    <Field.Description>Select the items you want to show on the desktop.</Field.Description>
    <Field.Group class="gap-3">
      <Field.Field orientation="horizontal">
        <Checkbox id="hard-disks" checked />
        <Field.Label for="hard-disks" class="font-normal">Hard disks</Field.Label>
      </Field.Field>
      <Field.Field orientation="horizontal">
        <Checkbox id="external-disks" />
        <Field.Label for="external-disks" class="font-normal">External disks</Field.Label>
      </Field.Field>
    </Field.Group>
  </Field.Set>
  <Field.Separator />
  <Field.Field orientation="horizontal">
    <Checkbox id="sync-folders" checked />
    <Field.Content>
      <Field.Label for="sync-folders">Sync Desktop & Documents folders</Field.Label>
      <Field.Description>
        Your Desktop & Documents folders are being synced with iCloud Drive.
      </Field.Description>
    </Field.Content>
  </Field.Field>
</Field.Group>
```

#### Radio

```svelte
<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";

  let plan = $state("monthly");
</script>

<Field.Set>
  <Field.Label>Subscription Plan</Field.Label>
  <Field.Description>Yearly and lifetime plans offer significant savings.</Field.Description>
  <RadioGroup.Root bind:value={plan}>
    <Field.Field orientation="horizontal">
      <RadioGroup.Item value="monthly" id="plan-monthly" />
      <Field.Label for="plan-monthly" class="font-normal">Monthly ($9.99/month)</Field.Label>
    </Field.Field>
    <Field.Field orientation="horizontal">
      <RadioGroup.Item value="yearly" id="plan-yearly" />
      <Field.Label for="plan-yearly" class="font-normal">Yearly ($99.99/year)</Field.Label>
    </Field.Field>
    <Field.Field orientation="horizontal">
      <RadioGroup.Item value="lifetime" id="plan-lifetime" />
      <Field.Label for="plan-lifetime" class="font-normal">Lifetime ($299.99)</Field.Label>
    </Field.Field>
  </RadioGroup.Root>
</Field.Set>
```

#### Switch

```svelte
<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
</script>

<Field.Field orientation="horizontal">
  <Field.Content>
    <Field.Label for="2fa">Multi-factor authentication</Field.Label>
    <Field.Description>
      Enable multi-factor authentication. If you do not have a two-factor device,
      you can use a one-time code sent to your email.
    </Field.Description>
  </Field.Content>
  <Switch id="2fa" />
</Field.Field>
```

#### Choice Card

Wrap `Field` components inside `Field.Label` to create selectable field groups. This works with `RadioGroup.Item`, `Checkbox`, and `Switch` components.

```svelte
<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";

  let computeEnvironment = $state("kubernetes");
</script>

<Field.Group>
  <Field.Set>
    <Field.Label for="compute-environment">Compute Environment</Field.Label>
    <Field.Description>Select the compute environment for your cluster.</Field.Description>
    <RadioGroup.Root bind:value={computeEnvironment}>
      <Field.Label for="kubernetes">
        <Field.Field orientation="horizontal">
          <Field.Content>
            <Field.Title>Kubernetes</Field.Title>
            <Field.Description>
              Run GPU workloads on a K8s configured cluster.
            </Field.Description>
          </Field.Content>
          <RadioGroup.Item value="kubernetes" id="kubernetes" />
        </Field.Field>
      </Field.Label>
      <Field.Label for="vm">
        <Field.Field orientation="horizontal">
          <Field.Content>
            <Field.Title>Virtual Machine</Field.Title>
            <Field.Description>
              Access a VM configured cluster to run GPU workloads.
            </Field.Description>
          </Field.Content>
          <RadioGroup.Item value="vm" id="vm" />
        </Field.Field>
      </Field.Label>
    </RadioGroup.Root>
  </Field.Set>
</Field.Group>
```

### Fieldset

Use `Field.Set` with `Field.Legend` for semantic grouping of related fields:

```svelte
<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
</script>

<Field.Set>
  <Field.Legend>Address Information</Field.Legend>
  <Field.Description>We need your address to deliver your order.</Field.Description>
  <Field.Group>
    <Field.Field>
      <Field.Label for="street">Street Address</Field.Label>
      <Input id="street" type="text" placeholder="123 Main St" />
    </Field.Field>
    <div class="grid grid-cols-2 gap-4">
      <Field.Field>
        <Field.Label for="city">City</Field.Label>
        <Input id="city" type="text" placeholder="New York" />
      </Field.Field>
      <Field.Field>
        <Field.Label for="zip">Postal Code</Field.Label>
        <Input id="zip" type="text" placeholder="90502" />
      </Field.Field>
    </div>
  </Field.Group>
</Field.Set>
```

### Field Group

Stack `Field` components with `Field.Group`. Add `Field.Separator` to divide them:

```svelte
<Field.Group>
  <Field.Set>
    <Field.Label>Responses</Field.Label>
    <Field.Description>
      Get notified when ChatGPT responds to requests that take time.
    </Field.Description>
    <Field.Group data-slot="checkbox-group">
      <Field.Field orientation="horizontal">
        <Checkbox id="push" checked disabled />
        <Field.Label for="push" class="font-normal">Push notifications</Field.Label>
      </Field.Field>
    </Field.Group>
  </Field.Set>
  <Field.Separator />
  <Field.Set>
    <Field.Label>Tasks</Field.Label>
    <Field.Description>Get notified when tasks have updates.</Field.Description>
    <Field.Group data-slot="checkbox-group">
      <Field.Field orientation="horizontal">
        <Checkbox id="push-tasks" />
        <Field.Label for="push-tasks" class="font-normal">Push notifications</Field.Label>
      </Field.Field>
      <Field.Field orientation="horizontal">
        <Checkbox id="email-tasks" />
        <Field.Label for="email-tasks" class="font-normal">Email notifications</Field.Label>
      </Field.Field>
    </Field.Group>
  </Field.Set>
</Field.Group>
```

### Responsive Layout

- **Vertical fields:** Default orientation stacks label, control, and helper text — ideal for mobile-first layouts.
- **Horizontal fields:** Set `orientation="horizontal"` on `Field.Field` to align the label and control side-by-side. Pair with `Field.Content` to keep descriptions aligned.
- **Responsive fields:** Set `orientation="responsive"` for automatic column layouts inside container-aware parents. Apply `@container/field-group` classes on `Field.Group` to switch orientations at specific breakpoints.

```svelte
<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
</script>

<form>
  <Field.Set>
    <Field.Legend>Profile</Field.Legend>
    <Field.Description>Fill in your profile information.</Field.Description>
    <Field.Separator />
    <Field.Group>
      <Field.Field orientation="responsive">
        <Field.Content>
          <Field.Label for="name">Name</Field.Label>
          <Field.Description>Provide your full name for identification</Field.Description>
        </Field.Content>
        <Input id="name" placeholder="Evil Rabbit" required />
      </Field.Field>
      <Field.Separator />
      <Field.Field orientation="responsive">
        <Field.Content>
          <Field.Label for="message">Message</Field.Label>
          <Field.Description>
            You can write your message here. Keep it short, preferably under 100 characters.
          </Field.Description>
        </Field.Content>
        <Textarea
          id="message"
          placeholder="Hello, world!"
          required
          class="min-h-[100px] resize-none sm:min-w-[300px]"
        />
      </Field.Field>
      <Field.Separator />
      <Field.Field orientation="responsive">
        <Button type="submit">Submit</Button>
        <Button type="button" variant="outline">Cancel</Button>
      </Field.Field>
    </Field.Group>
  </Field.Set>
</form>
```

### Validation and Error States

- Add `data-invalid` to `Field.Field` to switch the entire block into an error state.
- Add `aria-invalid` on the input itself for assistive technologies.
- Render `Field.Error` immediately after the control or inside `Field.Content` to keep error messages aligned with the field.

```svelte
<Field.Field data-invalid>
  <Field.Label for="email">Email</Field.Label>
  <Input id="email" type="email" aria-invalid />
  <Field.Error>Enter a valid email address.</Field.Error>
</Field.Field>
```

### Accessibility

- `Field.Set` and `Field.Legend` keep related controls grouped for keyboard and assistive tech users.
- `Field.Field` outputs `role="group"` so nested controls inherit labeling from `Field.Label` and `Field.Legend` when combined.
- Apply `Field.Separator` sparingly to ensure screen readers encounter clear section boundaries.
