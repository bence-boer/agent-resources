# Configuration

Gemini CLI is configured via a YAML file, typically at `~/.gemini/config.yaml`.

## Key Settings

```yaml
model: gemini-3-pro
theme: dark
# API Keys (better set via ENV variables)
api_key: ... 
service_account_key_file: ...

trusted_folders:
  - /path/to/my/project
  - /another/trusted/directory
```

## Authentication

- **Google Cloud CLI (Recommended):** Uses `gcloud auth login`.
- **API Key:** Set `GEMINI_API_KEY` env var or in config.
- **Service Account:** Set `GOOGLE_APPLICATION_CREDENTIALS` env var or `service_account_key_file` in config.

## Trusted Folders

Restrict file system access to specific directories for security.
- Configure in `config.yaml`.
- Manage via CLI: `/settings add_trusted_folder /path`

## Token Caching
Gemini CLI supports caching of context tokens to reduce costs and latency.
- **Enable:** Automatically enabled for supported models.
- **Mechanism:** Caches prefix of the conversation history/context.

## Telemetry
Gemini CLI collects anonymous usage data to improve the product.
- **Disable:** Set `telemetry: false` in `config.yaml` or use `GEMINI_TELEMETRY=false` env var.

## Ignore Files (.geminiignore)

Similar to `.gitignore`. Prevents the CLI from reading or searching specific files/dirs.
Place `.geminiignore` in the project root.

**Example:**
```gitignore
.git/
node_modules/
*.log
secrets/
```
