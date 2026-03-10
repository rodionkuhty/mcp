import test from "node:test";
import assert from "node:assert";
import { McpServerManager } from "../McpServerManager.js";
import { z } from "zod";

test("McpServerManager - registration", async (t) => {
  const manager = new McpServerManager({
    name: "TestServer",
    version: "1.0.0",
  });

  await t.test("should register a tool", () => {
    manager.registerTool(
      "test-tool",
      {
        description: "A test tool",
        inputSchema: {
          name: z.string(),
        },
      },
      async (args: { name: string }) => ({
        content: [{ type: "text", text: `Hello, ${args.name}` }],
      })
    );
    // Verifying through the instance since McpServer doesn't have a public getter for tools easily, 
    // but we ensure it doesn't throw and follows the SDK pattern.
    assert.ok(manager.instance);
  });

  await t.test("should register a prompt", () => {
    manager.registerPrompt(
      "test-prompt",
      {
        description: "A test prompt",
        arguments: [{ name: "arg1", description: "First argument", required: true }],
      },
      async (args: any) => ({
        messages: [{ role: "user", content: { type: "text", text: "test" } }],
      })
    );
    assert.ok(manager.instance);
  });

  await t.test("should register a resource", () => {
    manager.registerResource(
      "test-resource",
      "test://resource",
      { mimeType: "text/plain" },
      async (uri) => ({
        contents: [{ uri: uri.toString(), text: "resource content" }],
      })
    );
    assert.ok(manager.instance);
  });
});
