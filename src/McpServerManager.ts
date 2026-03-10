import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import type { 
  ResourceMetadata, 
  ReadResourceCallback, 
  ReadResourceTemplateCallback,
  RegisteredResource,
  RegisteredResourceTemplate
} from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Configuration options for the MCP Server.
 */
export interface McpServerConfig {
  name: string;
  version: string;
}

/**
 * A class to handle the creation and management of MCP servers.
 * This class provides a wrapper around the MCP SDK's McpServer, 
 * making it easier to register tools, resources, and prompts, 
 * and to connect to transports.
 */
export class McpServerManager {
  private readonly server: McpServer;

  /**
   * Initializes a new instance of the McpServerManager class.
   * @param config The configuration for the MCP server.
   */
  constructor(config: McpServerConfig) {
    this.server = new McpServer({
      name: config.name,
      version: config.version,
    });
  }

  /**
   * Gets the underlying McpServer instance.
   */
  get instance(): McpServer {
    return this.server;
  }

  /**
   * Registers a tool with the MCP server.
   * @param name The name of the tool.
   * @param config The configuration for the tool (description, input schema).
   * @param handler The handler function for the tool.
   */
  registerTool(
    name: string,
    config: any,
    handler: any
  ): void {
    this.server.registerTool(name, config, handler);
  }

  /**
   * Registers a resource with the MCP server.
   * @param name The name of the resource.
   * @param uriOrTemplate The URI or ResourceTemplate for the resource.
   * @param config The metadata for the resource.
   * @param handler The handler function for the resource.
   */
  registerResource(name: string, uriOrTemplate: string, config: ResourceMetadata, readCallback: ReadResourceCallback): RegisteredResource;
  registerResource(name: string, uriOrTemplate: ResourceTemplate, config: ResourceMetadata, readCallback: ReadResourceTemplateCallback): RegisteredResourceTemplate;
  registerResource(
    name: string,
    uriOrTemplate: string | ResourceTemplate,
    config: ResourceMetadata,
    readCallback: ReadResourceCallback | ReadResourceTemplateCallback
  ): RegisteredResource | RegisteredResourceTemplate {
    if (typeof uriOrTemplate === 'string') {
        return this.server.registerResource(name, uriOrTemplate, config, readCallback as ReadResourceCallback);
    } else {
        return this.server.registerResource(name, uriOrTemplate, config, readCallback as ReadResourceTemplateCallback);
    }
  }

  /**
   * Registers a prompt with the MCP server.
   * @param name The name of the prompt.
   * @param options The options for the prompt (description, arguments schema).
   * @param handler The handler function for the prompt.
   */
  registerPrompt(
    name: string,
    options: any,
    handler: any
  ): void {
    this.server.registerPrompt(name, options, handler);
  }

  /**
   * Connects the MCP server to a transport.
   * @param transport The transport to connect to (defaults to StdioServerTransport).
   */
  async start(transport: Transport = new StdioServerTransport()): Promise<void> {
    try {
      await this.server.connect(transport);
      console.error(`MCP Server started.`);
    } catch (error) {
      console.error("Failed to start MCP Server:", error);
      throw error;
    }
  }
}
