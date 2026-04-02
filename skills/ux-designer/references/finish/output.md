To communicate a design, use the <ui-spec> XML format as shown below. Use this format only if the expected output is a design (not a plan, code diff, or prose explanation).

## When to use
- The user request is for a UI, screen, component, or visual state, not just a change plan or code.
- The design should be unambiguous, testable, and ready for implementation or review.

## How to use
- Wrap the design in a single <ui-spec>...</ui-spec> XML block.
- Use <component>, <screen>, <frame>, <variant>, <visual-state>, <instance>, <icon>, <text>, <button>, <image>, etc. as shown in the example below.
- Specify layout, style, and data as attributes or nested elements.
- Use custom attributes or elements even if they are not standard HTML/CSS or not listed in the example — the goal is clear communication, not valid HTML.
- Include all relevant states (empty, loading, error, populated) and variants (default, hover, active, etc.).
- Use clear, explicit names for components, screens, and states.
- Follow the skill's absolute rules and scenario/principle guidance for structure and clarity.
- If unsure, start with [context.md](../foundation/context.md) and route to the appropriate scenario and principle files.
- See [review.md](review.md) for review questions to validate your design.


## Example format

```xml
<ui-spec>
  
  <component id="UserCard">
    <variant name="Default">
      <frame layout="row, space-between, align-center" style="p-md, bg-white, border-gray, rounded-sm">
        <frame layout="row, gap-sm, align-center">
           <image source="avatar-placeholder" style="size-40, rounded-full" />
           <text style="font-semibold, text-dark">User Name</text>
           <text style="badge-blue, text-xs, uppercase">Role</text>
        </frame>
        <button style="btn-ghost, text-red">Revoke</button>
      </frame>
    </variant>
    
    <variant name="Hover">
      <frame style="bg-gray-50, shadow-md, cursor-pointer">
        <button style="btn-solid-red">Revoke</button>
      </frame>
    </variant>
  </component>

  <screen id="AdminDashboard" style="bg-canvas-light, min-h-screen">
    
    <frame id="Header" layout="row, space-between" style="fixed-top, px-lg, py-sm, bg-white, border-bottom">
      <text style="h2, text-brand">Admin Panel</text>
      <button style="btn-outline" on-click="show(LogoutDropdown)">Profile</button>
      
      <frame id="LogoutDropdown" state="hidden" style="absolute-below-right, mt-xs, w-48, bg-white, shadow-xl, rounded-md">
        <text style="p-sm, hover:bg-gray-100">Settings</text>
        <text style="p-sm, text-red, hover:bg-red-50">Logout</text>
      </frame>
    </frame>

    <frame id="Workspace" layout="col, gap-lg, center-x" style="mt-20, max-w-screen-md">
      
      <frame id="Tabs" layout="row, gap-md, border-bottom">
        <text style="tab-active, border-b-2, border-brand, pb-xs">Users</text>
        <text style="tab-inactive, text-gray, pb-xs">Invites</text>
      </frame>

      <visual-state name="Empty Users List">
        <frame layout="col, center, gap-md" style="h-64">
          <icon name="users-slash" style="size-2xl, text-gray-300" />
          <text style="h3, text-gray-500">No users to manage</text>
          <button style="btn-primary">Invite someone</button>
        </frame>
      </visual-state>

      <visual-state name="Populated Users List">
        <frame layout="col, gap-xs" style="w-full">
          <instance component="UserCard" data="mock: John Doe, Admin" />
          <instance component="UserCard" data="mock: Jane Smith, Editor" />
          <instance component="UserCard" data="mock: Bob Jones, Viewer" />
        </frame>
      </visual-state>

    </frame>

  </screen>
</ui-spec>
```
