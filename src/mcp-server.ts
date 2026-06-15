import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import type { ToolAnnotations } from "@modelcontextprotocol/sdk/types.js"
import { z } from "zod"
import { NaverCloudReadOnlyClient } from "./navercloud-client.js"
import { READ_ONLY_OPERATIONS } from "./read-only-policy.js"

export const ADVISOR_TOOL_NAME = "ncloud_advise_inventory_risks"

const optionalString = z.string().min(1).optional()
const optionalPageNo = z.number().int().min(1).optional()
const optionalPageSize = z.number().int().min(1).max(100).optional()
const readOnlyToolAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
} as const satisfies ToolAnnotations

function withReadOnlyAnnotations<const Config extends object>(
  config: Config,
): Config & { readonly annotations: ToolAnnotations } {
  return { ...config, annotations: readOnlyToolAnnotations }
}

export function createNaverCloudMcpServer(client: NaverCloudReadOnlyClient): McpServer {
  const server = new McpServer({ name: "ncloud-readonly", version: "0.1.0" })

  server.registerTool(
    "ncloud_list_servers",
    withReadOnlyAnnotations({
      title: READ_ONLY_OPERATIONS.ncloud_list_servers.title,
      description: READ_ONLY_OPERATIONS.ncloud_list_servers.description,
      inputSchema: {
        regionCode: optionalString.describe("Region code. Defaults to NCLOUD_REGION_CODE or KR."),
        pageNo: optionalPageNo,
        pageSize: optionalPageSize,
      },
    }),
    async ({ regionCode, pageNo, pageSize }) => toText(await client.request({
      toolName: "ncloud_list_servers",
      operation: READ_ONLY_OPERATIONS.ncloud_list_servers,
      query: { regionCode, pageNo, pageSize },
    })),
  )

  server.registerTool(
    "ncloud_get_server",
    withReadOnlyAnnotations({
      title: READ_ONLY_OPERATIONS.ncloud_get_server.title,
      description: READ_ONLY_OPERATIONS.ncloud_get_server.description,
      inputSchema: {
        serverInstanceNo: z.string().min(1).describe("Server instance number."),
        regionCode: optionalString.describe("Region code. Defaults to NCLOUD_REGION_CODE or KR."),
      },
    }),
    async ({ serverInstanceNo, regionCode }) => toText(await client.request({
      toolName: "ncloud_get_server",
      operation: READ_ONLY_OPERATIONS.ncloud_get_server,
      query: { serverInstanceNo, regionCode },
    })),
  )

  server.registerTool(
    "ncloud_list_vpcs",
    withReadOnlyAnnotations({
      title: READ_ONLY_OPERATIONS.ncloud_list_vpcs.title,
      description: READ_ONLY_OPERATIONS.ncloud_list_vpcs.description,
      inputSchema: { regionCode: optionalString },
    }),
    async ({ regionCode }) => toText(await client.request({
      toolName: "ncloud_list_vpcs",
      operation: READ_ONLY_OPERATIONS.ncloud_list_vpcs,
      query: { regionCode },
    })),
  )

  server.registerTool(
    "ncloud_list_subnets",
    withReadOnlyAnnotations({
      title: READ_ONLY_OPERATIONS.ncloud_list_subnets.title,
      description: READ_ONLY_OPERATIONS.ncloud_list_subnets.description,
      inputSchema: { regionCode: optionalString, vpcNo: optionalString },
    }),
    async ({ regionCode, vpcNo }) => toText(await client.request({
      toolName: "ncloud_list_subnets",
      operation: READ_ONLY_OPERATIONS.ncloud_list_subnets,
      query: { regionCode, vpcNo },
    })),
  )

  server.registerTool(
    "ncloud_list_acgs",
    withReadOnlyAnnotations({
      title: READ_ONLY_OPERATIONS.ncloud_list_acgs.title,
      description: READ_ONLY_OPERATIONS.ncloud_list_acgs.description,
      inputSchema: { regionCode: optionalString, vpcNo: optionalString },
    }),
    async ({ regionCode, vpcNo }) => toText(await client.request({
      toolName: "ncloud_list_acgs",
      operation: READ_ONLY_OPERATIONS.ncloud_list_acgs,
      query: { regionCode, vpcNo },
    })),
  )

  server.registerTool(
    "ncloud_list_load_balancers",
    withReadOnlyAnnotations({
      title: READ_ONLY_OPERATIONS.ncloud_list_load_balancers.title,
      description: READ_ONLY_OPERATIONS.ncloud_list_load_balancers.description,
      inputSchema: { regionCode: optionalString, pageNo: optionalPageNo, pageSize: optionalPageSize },
    }),
    async ({ regionCode, pageNo, pageSize }) => toText(await client.request({
      toolName: "ncloud_list_load_balancers",
      operation: READ_ONLY_OPERATIONS.ncloud_list_load_balancers,
      query: { regionCode, pageNo, pageSize },
    })),
  )

  server.registerTool(
    "ncloud_get_load_balancer",
    withReadOnlyAnnotations({
      title: READ_ONLY_OPERATIONS.ncloud_get_load_balancer.title,
      description: READ_ONLY_OPERATIONS.ncloud_get_load_balancer.description,
      inputSchema: {
        loadBalancerInstanceNo: z.string().min(1).describe("Load balancer instance number."),
        regionCode: optionalString,
      },
    }),
    async ({ loadBalancerInstanceNo, regionCode }) => toText(await client.request({
      toolName: "ncloud_get_load_balancer",
      operation: READ_ONLY_OPERATIONS.ncloud_get_load_balancer,
      query: { loadBalancerInstanceNo, regionCode },
    })),
  )

  server.registerTool(
    "ncloud_list_load_balancer_listeners",
    withReadOnlyAnnotations({
      title: READ_ONLY_OPERATIONS.ncloud_list_load_balancer_listeners.title,
      description: READ_ONLY_OPERATIONS.ncloud_list_load_balancer_listeners.description,
      inputSchema: {
        loadBalancerInstanceNo: z.string().min(1).describe("Load balancer instance number."),
        regionCode: optionalString,
      },
    }),
    async ({ loadBalancerInstanceNo, regionCode }) => toText(await client.request({
      toolName: "ncloud_list_load_balancer_listeners",
      operation: READ_ONLY_OPERATIONS.ncloud_list_load_balancer_listeners,
      query: { loadBalancerInstanceNo, regionCode },
    })),
  )

  server.registerTool(
    "ncloud_list_load_balancer_rules",
    withReadOnlyAnnotations({
      title: READ_ONLY_OPERATIONS.ncloud_list_load_balancer_rules.title,
      description: READ_ONLY_OPERATIONS.ncloud_list_load_balancer_rules.description,
      inputSchema: {
        loadBalancerListenerNo: z.string().min(1).describe("Load balancer listener number."),
        regionCode: optionalString,
      },
    }),
    async ({ loadBalancerListenerNo, regionCode }) => toText(await client.request({
      toolName: "ncloud_list_load_balancer_rules",
      operation: READ_ONLY_OPERATIONS.ncloud_list_load_balancer_rules,
      query: { loadBalancerListenerNo, regionCode },
    })),
  )

  server.registerTool(
    "ncloud_list_target_groups",
    withReadOnlyAnnotations({
      title: READ_ONLY_OPERATIONS.ncloud_list_target_groups.title,
      description: READ_ONLY_OPERATIONS.ncloud_list_target_groups.description,
      inputSchema: { regionCode: optionalString, vpcNo: optionalString },
    }),
    async ({ regionCode, vpcNo }) => toText(await client.request({
      toolName: "ncloud_list_target_groups",
      operation: READ_ONLY_OPERATIONS.ncloud_list_target_groups,
      query: { regionCode, vpcNo },
    })),
  )

  server.registerTool(
    "ncloud_list_targets",
    withReadOnlyAnnotations({
      title: READ_ONLY_OPERATIONS.ncloud_list_targets.title,
      description: READ_ONLY_OPERATIONS.ncloud_list_targets.description,
      inputSchema: {
        targetGroupNo: z.string().min(1).describe("Target group number."),
        regionCode: optionalString,
      },
    }),
    async ({ targetGroupNo, regionCode }) => toText(await client.request({
      toolName: "ncloud_list_targets",
      operation: READ_ONLY_OPERATIONS.ncloud_list_targets,
      query: { targetGroupNo, regionCode },
    })),
  )

  server.registerTool(
    "ncloud_list_source_deploy_projects",
    withReadOnlyAnnotations({
      title: READ_ONLY_OPERATIONS.ncloud_list_source_deploy_projects.title,
      description: READ_ONLY_OPERATIONS.ncloud_list_source_deploy_projects.description,
      inputSchema: { projectName: optionalString, pageNo: optionalPageNo, pageSize: optionalPageSize },
    }),
    async ({ projectName, pageNo, pageSize }) => toText(await client.request({
      toolName: "ncloud_list_source_deploy_projects",
      operation: READ_ONLY_OPERATIONS.ncloud_list_source_deploy_projects,
      query: { projectName, pageNo, pageSize },
    })),
  )

  server.registerTool(
    "ncloud_list_source_deploy_stages",
    withReadOnlyAnnotations({
      title: READ_ONLY_OPERATIONS.ncloud_list_source_deploy_stages.title,
      description: READ_ONLY_OPERATIONS.ncloud_list_source_deploy_stages.description,
      inputSchema: {
        projectId: z.union([z.string().min(1), z.number().int().positive()]),
        stageName: optionalString,
        pageNo: optionalPageNo,
        pageSize: optionalPageSize,
      },
    }),
    async ({ projectId, stageName, pageNo, pageSize }) => toText(await client.request({
      toolName: "ncloud_list_source_deploy_stages",
      operation: READ_ONLY_OPERATIONS.ncloud_list_source_deploy_stages,
      path: { projectId },
      query: { stageName, pageNo, pageSize },
    })),
  )

  server.registerTool(
    "ncloud_list_source_deploy_scenarios",
    withReadOnlyAnnotations({
      title: READ_ONLY_OPERATIONS.ncloud_list_source_deploy_scenarios.title,
      description: READ_ONLY_OPERATIONS.ncloud_list_source_deploy_scenarios.description,
      inputSchema: {
        projectId: z.union([z.string().min(1), z.number().int().positive()]),
        stageId: z.union([z.string().min(1), z.number().int().positive()]),
        scenarioName: optionalString,
        pageNo: optionalPageNo,
        pageSize: optionalPageSize,
      },
    }),
    async ({ projectId, stageId, scenarioName, pageNo, pageSize }) => toText(await client.request({
      toolName: "ncloud_list_source_deploy_scenarios",
      operation: READ_ONLY_OPERATIONS.ncloud_list_source_deploy_scenarios,
      path: { projectId, stageId },
      query: { scenarioName, pageNo, pageSize },
    })),
  )

  server.registerTool(
    "ncloud_list_source_deploy_histories",
    withReadOnlyAnnotations({
      title: READ_ONLY_OPERATIONS.ncloud_list_source_deploy_histories.title,
      description: READ_ONLY_OPERATIONS.ncloud_list_source_deploy_histories.description,
      inputSchema: {
        projectId: z.union([z.string().min(1), z.number().int().positive()]),
        pageNo: optionalPageNo,
        pageSize: optionalPageSize,
      },
    }),
    async ({ projectId, pageNo, pageSize }) => toText(await client.request({
      toolName: "ncloud_list_source_deploy_histories",
      operation: READ_ONLY_OPERATIONS.ncloud_list_source_deploy_histories,
      path: { projectId },
      query: { pageNo, pageSize },
    })),
  )

  server.registerTool(
    "ncloud_get_source_deploy_history",
    withReadOnlyAnnotations({
      title: READ_ONLY_OPERATIONS.ncloud_get_source_deploy_history.title,
      description: READ_ONLY_OPERATIONS.ncloud_get_source_deploy_history.description,
      inputSchema: {
        projectId: z.union([z.string().min(1), z.number().int().positive()]),
        historyId: z.union([z.string().min(1), z.number().int().positive()]),
      },
    }),
    async ({ projectId, historyId }) => toText(await client.request({
      toolName: "ncloud_get_source_deploy_history",
      operation: READ_ONLY_OPERATIONS.ncloud_get_source_deploy_history,
      path: { projectId, historyId },
    })),
  )

  server.registerTool(
    ADVISOR_TOOL_NAME,
    withReadOnlyAnnotations({
      title: "Advise inventory risks",
      description: "Read-only advisor: analyze pasted NAVER Cloud inventory JSON for common public exposure risks. This tool does not call NAVER Cloud APIs.",
      inputSchema: {
        inventoryJson: z.string().min(1).describe("Pasted inventory JSON from read-only list/get tools or another trusted source."),
        regionCode: optionalString.describe("Optional region label for the report."),
      },
    }),
    async ({ inventoryJson, regionCode }) => toText(analyzeInventoryRisks({ inventoryJson, regionCode })),
  )

  return server
}

interface InventoryRiskInput {
  inventoryJson: string
  regionCode?: string | undefined
}

interface InventorySignals {
  publicIpReferences: number
  loadBalancerReferences: number
  acgReferences: number
  openCidrReferences: number
}

interface InventoryRiskReport {
  regionCode?: string
  summary: InventorySignals
  recommendations: string[]
  notes: string[]
}

export function analyzeInventoryRisks(input: InventoryRiskInput): InventoryRiskReport {
  const report = createInventoryRiskReport(input.regionCode)
  let inventory: unknown
  try {
    inventory = JSON.parse(input.inventoryJson)
  } catch (error) {
    report.recommendations.push("Provide valid JSON exported from read-only inventory tools, then rerun this advisor.")
    report.notes.push(`JSON parse failed: ${error instanceof Error ? error.message : String(error)}`)
    return report
  }

  collectInventorySignals(inventory, report.summary)

  if (report.summary.publicIpReferences > 0) {
    report.recommendations.push("Review public IP references and confirm each one is intentionally internet-reachable.")
  }
  if (report.summary.loadBalancerReferences > 0) {
    report.recommendations.push("Check load balancers for internet-facing listeners, weak TLS policy, and unnecessary public exposure.")
  }
  if (report.summary.acgReferences > 0) {
    report.recommendations.push("Review ACG inbound rules and keep source ranges limited to trusted networks.")
  }
  if (report.summary.openCidrReferences > 0) {
    report.recommendations.push("Prioritize any rule containing 0.0.0.0/0 or ::/0, especially on SSH, RDP, database, or admin ports.")
  }
  if (report.recommendations.length === 0) {
    report.recommendations.push("No obvious public IP, load balancer, ACG, or open CIDR indicators were found in the pasted JSON.")
  }

  report.notes.push("This advisor uses string-pattern checks only and does not verify live NAVER Cloud state.")
  return report
}

function createInventoryRiskReport(regionCode: string | undefined): InventoryRiskReport {
  const report: InventoryRiskReport = {
    summary: {
      publicIpReferences: 0,
      loadBalancerReferences: 0,
      acgReferences: 0,
      openCidrReferences: 0,
    },
    recommendations: [],
    notes: [],
  }
  if (regionCode !== undefined) {
    report.regionCode = regionCode
  }
  return report
}

function collectInventorySignals(value: unknown, signals: InventorySignals): void {
  if (typeof value === "string") {
    if (containsOpenCidr(value)) signals.openCidrReferences += 1
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) collectInventorySignals(item, signals)
    return
  }
  if (!isRecord(value)) return

  for (const [key, child] of Object.entries(value)) {
    const normalizedKey = key.toLowerCase().replaceAll(/[_.-]/g, "")
    if (normalizedKey.includes("publicip")) signals.publicIpReferences += 1
    if (normalizedKey.includes("loadbalancer")) signals.loadBalancerReferences += 1
    if (normalizedKey.includes("accesscontrolgroup") || normalizedKey.includes("acg")) signals.acgReferences += 1
    collectInventorySignals(child, signals)
  }
}

function containsOpenCidr(value: string): boolean {
  return /(^|[^\d])0\.0\.0\.0\/0([^\d]|$)/.test(value) || /(^|\s)::\/0($|\s)/.test(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function toText(payload: unknown): { content: Array<{ type: "text"; text: string }> } {
  return {
    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
  }
}
