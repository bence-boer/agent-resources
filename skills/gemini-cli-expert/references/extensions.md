# Extensions

Extensions package prompts, MCP servers, custom commands, hooks, sub-agents, and agent skills into a user-friendly format.

## Structure
An extension is a directory or git repo containing `extension.yaml` and resources.

## Writing Extensions

### `extension.yaml`
```yaml
name: my-extension
version: 1.0.0
description: Adds cool features.
author: Me

commands:
  - name: my-command
    prompt: "Do something cool"

hooks:
  - name: my-hook
    event: BeforeModel
    script: hooks/my-hook.py

skills:
  - path: skills/my-skill
```

### Best Practices
- Keep extensions focused.
- Version your extensions.
- Use clear descriptions.

## Releasing
- Push to a public Git repository.
- Users install via URL: `/extensions install https://github.com/user/repo`
