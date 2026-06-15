#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { createNaverCloudMcpServer } from "./mcp-server.js"
import { NaverCloudReadOnlyClient, readCredentialsFromEnvironment } from "./navercloud-client.js"

async function main(): Promise<void> {
  const credentials = readCredentialsFromEnvironment()
  const client = new NaverCloudReadOnlyClient(credentials)
  const server = createNaverCloudMcpServer(client)
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  process.stderr.write(`ncloud-mcp fatal: ${message}\n`)
  process.exit(1)
})
