# Plugin Management

GitHub Copilot CLI plugin system for extending functionality.

## Commands

### Plugin Install

```bash
copilot plugin install [options] <source>
```

Install a plugin from various sources:
- `plugin@marketplace`
- `owner/repo`
- `owner/repo:path`
- URL

Options:
- `--config-dir <path>` - Path to configuration directory

### Plugin Uninstall

```bash
copilot plugin uninstall [options] <name>
```

Uninstall a plugin.

Arguments:
- `name` - Plugin name (plugin-name or plugin-name@marketplace-name)

Options:
- `--config-dir <path>` - Path to configuration directory

### Plugin Update

```bash
copilot plugin update [options] <name>
```

Update a plugin to the latest version.

Arguments:
- `name` - Plugin name (plugin-name@marketplace-name)

Options:
- `--config-dir <path>` - Path to configuration directory

### Plugin List

```bash
copilot plugin list [options]
```

List installed plugins.

Options:
- `--config-dir <path>` - Path to configuration directory

### Plugin Marketplace

```bash
copilot plugin marketplace [options] [command]
```

Manage plugin marketplaces.

Commands:
- `add [options] <source>` - Add a marketplace
- `remove [options] <name>` - Remove a marketplace
- `list [options>` - List registered marketplaces
- `browse [options] <name>` - Browse plugins in a marketplace
