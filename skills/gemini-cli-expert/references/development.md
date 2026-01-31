# Development & Contribution

## Local Development

1. **Clone:** `git clone https://github.com/google-gemini/gemini-cli.git`
2. **Install:** `npm install`
3. **Run (Dev):** `npm run start` (Hot reloading)
4. **Link:** `npm link packages/cli` (Global `gemini` command uses local build)

## Tools API
Developers can create custom tools using the Tools API.
- Tools must define a **Schema** (JSON Schema) for arguments.
- Tools must implement an **Execute** function.

## Contributing
- Fork and clone.
- Create a branch.
- Follow code style.
- Submit PR.
