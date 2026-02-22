# Logging

GitHub Copilot CLI logging configuration.

## Log Levels

| Level | Description |
|-------|-------------|
| `none` | No logging output |
| `error` | Only error messages |
| `warning` | Error and warning messages |
| `info` | Error, warning, and info messages |
| `debug` | All messages including debug |
| `all` | Same as debug |
| `default` | Error, warning, and info messages (same as info) |

## Usage

```bash
# Set logging to ./logs
copilot --log-dir ./logs

# Enable debug level logging
copilot --log-level debug

# Set via environment
# Default log directory: ~/.copilot/logs/
```

## Log Directory

- Default: `~/.copilot/logs/`
- Can be overridden with `--log-dir` flag
