# CLAUDE.md

## Project Overview

`my-first-mcp` is a Model Context Protocol (MCP) server built with TypeScript. It exposes tools, resources, and prompts to AI assistants via stdio transport.

## Build & Run

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run the server directly (e.g. for integration)
node build/index.js

# Run the MCP inspector (for testing)
npm run inspector
```

The compiled output lands in `build/`. The server entry point is `build/index.js`.

## Architecture

- **Transport:** stdio (communicates with parent process via stdin/stdout)
- **Framework:** `@modelcontextprotocol/sdk`
- **Validation:** `zod` for tool input schemas
- **Module system:** ES modules (`"type": "module"`)

## Source Structure

```
src/
  index.ts        # MCP server definition — tools, resources, prompts
  data/
    test.txt      # Static text served by the apartment-rules resource
```

## Registered Capabilities

### Tools

| Name | Description | Inputs |
|------|-------------|--------|
| `add-numbers` | Adds two numbers | `a: number`, `b: number` |
| `get_github_repos` | Fetches public repos for a GitHub user | `username: string` |

### Resources

| URI | Name | Description |
|-----|------|-------------|
| `rules://all` | `apartment-rules` | Serves content from `src/data/test.txt` |

### Prompts

| Name | Description | Args |
|------|-------------|------|
| `explain-sql` | Explains a SQL query in Russian and Chinese | `sql: string` |

## Development Notes

- All server logic lives in `src/index.ts`
- After editing source files, run `npm run build` before testing
- Use `npm run inspector` to interactively test tools/resources/prompts via the MCP Inspector UI
