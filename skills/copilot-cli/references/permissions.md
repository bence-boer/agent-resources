# Permissions

GitHub Copilot CLI provides granular control over tool, URL, and path permissions.

## Tool Permissions

### Filtering Tools

| Flag | Description |
|------|-------------|
| `--available-tools [tools...]` | Only these tools will be available to the model |
| `--excluded-tools [tools...]` | These tools will not be available to the model |

### Approving/Denying Tools

| Flag | Description |
|------|-------------|
| `--allow-tool [tools...]` | Tools the CLI has permission to use |
| `--deny-tool [tools...]` | Tools the CLI does not have permission to use |
| `--allow-all-tools` | Allow all tools automatically |

## Tool Permission Patterns

The `--allow-tool` and `--deny-tool` parameters use the format `kind(argument)`:

### shell(command)
```bash
# Allow all git commands
--allow-tool 'shell(git:*)'

# Allow specific git command
--allow-tool 'shell(git push)'

# Allow all shell commands
--allow-tool 'shell'
```

### write
```bash
# Allow all file writing
--allow-tool 'write'
```

### MCP Server Tools
```bash
# Allow all tools from MCP server
--allow-tool 'MyMCP'

# Allow specific tool from MCP server
--allow-tool 'MyMCP(my_tool)'
```

### url
```bash
# Allow all URLs
--allow-tool 'url'

# Allow specific URL
--allow-tool 'url(https://github.com)'
```

## URL Permissions

| Flag | Description |
|------|-------------|
| `--allow-url [urls...]` | Allow access to specific URLs or domains |
| `--deny-url [urls...]` | Deny access to specific URLs or domains |
| `--allow-all-urls` | Allow access to all URLs without confirmation |

### Examples
```bash
# Allow GitHub API access via HTTPS
copilot --allow-url github.com

# Allow HTTP access explicitly
copilot --allow-url http://example.com

# Deny specific domain
copilot --deny-url https://malicious-site.com
```

## Path Permissions

| Flag | Description |
|------|-------------|
| `--allow-all-paths` | Disable file path verification and allow access to any path |
| `--disallow-temp-dir` | Prevent automatic access to system temporary directory |
| `--add-dir <directory>` | Add a directory to allowed list |

### Examples
```bash
# Allow access to any path
copilot --allow-all-paths

# Allow specific directory
copilot --add-dir /home/user/projects

# Allow multiple directories
copilot --add-dir ~/workspace --add-dir /tmp
```

## Enabling All Permissions

```bash
# Enable all permissions with single flag
copilot --allow-all
copilot --yolo

# Equivalent to:
copilot --allow-all-tools --allow-all-paths --allow-all-urls
```

## Precedence Rules

1. Denial rules always take precedence over allow rules
2. `--excluded-tools` filters tools before approval checks
3. URL/Path permissions are protocol-aware
