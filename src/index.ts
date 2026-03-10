import path from "node:path"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { z } from "zod"
import { McpServerManager } from "./McpServerManager.js"

const serverManager = new McpServerManager({
  version: "0.0.1",
  name: "MyFirstMcp",
})

serverManager.registerPrompt("explain-sql",
  { title: "Explain SQL Query", description: "Explain the meaning of a SQL query", argsSchema: {
    sql: z.string().describe("SQL query to explain")
    } },
  async (context: any) => {
    const explanation = `The SQL query "${context.sql}" is used to retrieve data from a database table. It selects specific columns and filters the results based on certain conditions.`
    return {
      messages: [
        {
          role: "user",
          content: {
            type: 'text',
            text: `explain this ${context.sql} in a russian and chinese language`
          }
        }
      ]
    }
  }
)

serverManager.registerResource(
  "apartment-rules",
"rules://all",
  {
    mimeType: "text/plain",
    description: "Apartment rules for tenants",
  },
  async (context) => {
    const __fileName = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__fileName)

    // Check if we are running from build/ index.js or src/ index.ts (for loaders)
    const dataPath = __dirname.endsWith("build")
        ? path.join(__dirname, "../src/data", "test.txt")
        : path.join(__dirname, "data", "test.txt");

    const rules = await readFile(dataPath, "utf8")

    return {
      contents: [
        {
          uri: context.toString(),
          text: rules
        }
      ]
    }
  }
)

serverManager.registerTool("add-numbers", {
  description: "Add two numbers together",
  inputSchema: {
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }
}, async (context: any) => {
  return {
    content: [
      {type: "text", text: `total is ${context.a + context.b}`}
    ]
  }
})


serverManager.registerTool('get_github_repos', {
  description: "Fetches public repos for a GitHub user",
  inputSchema: {
    username: z.string().describe("github username"),
  }
}, async (context: any) => {
  type GitHubRepo = {
    name: string
  }

  const apiUrl = `https://api.github.com/users/${context.username}/repos`

  let reposResponse: Response
  try {
    reposResponse = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "MCP-Server",
      },
    })
  } catch (error) {
    console.error("GitHub API error:", error)
    return {
      content: [
        { type: "text", text: `Failed to fetch GitHub repos for ${context.username}` },
      ],
    }
  }

  if (!reposResponse.ok) {
    return {
      content: [
        { type: "text", text: `GitHub API returned ${reposResponse.status} for ${context.username}` },
      ],
    }
  }

  const reposJson: unknown = await reposResponse.json()

  if (!Array.isArray(reposJson)) {
    return {
      content: [
        { type: "text", text: `Unexpected GitHub response for ${context.username}` },
      ],
    }
  }

  const repoNames = (reposJson as GitHubRepo[])
    .map((repo) => repo.name)
    .join("\n\n")

  return {
    content: [
      { type: "text", text: `github repos ${repoNames} for ${context.username}` },
    ],
  }
})


await serverManager.start();
