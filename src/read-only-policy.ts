export type HttpMethod = "GET"

export type NaverCloudService = "ncloud" | "sourceDeployVpc" | "sourceDeployClassic"

export interface ReadOnlyOperation {
  readonly toolName: string
  readonly title: string
  readonly description: string
  readonly service: NaverCloudService
  readonly method: HttpMethod
  readonly pathTemplate: string
  readonly ncloudAction?: string
}

export const READ_ONLY_OPERATIONS = {
  ncloud_list_servers: {
    toolName: "ncloud_list_servers",
    title: "List Ncloud servers",
    description: "Read-only: list NAVER Cloud VPC server instances.",
    service: "ncloud",
    method: "GET",
    pathTemplate: "/vserver/v2/getServerInstanceList",
    ncloudAction: "getServerInstanceList",
  },
  ncloud_get_server: {
    toolName: "ncloud_get_server",
    title: "Get Ncloud server detail",
    description: "Read-only: get details for one NAVER Cloud VPC server instance.",
    service: "ncloud",
    method: "GET",
    pathTemplate: "/vserver/v2/getServerInstanceDetail",
    ncloudAction: "getServerInstanceDetail",
  },
  ncloud_list_vpcs: {
    toolName: "ncloud_list_vpcs",
    title: "List Ncloud VPCs",
    description: "Read-only: list NAVER Cloud VPCs.",
    service: "ncloud",
    method: "GET",
    pathTemplate: "/vpc/v2/getVpcList",
    ncloudAction: "getVpcList",
  },
  ncloud_list_subnets: {
    toolName: "ncloud_list_subnets",
    title: "List Ncloud subnets",
    description: "Read-only: list NAVER Cloud VPC subnets.",
    service: "ncloud",
    method: "GET",
    pathTemplate: "/vpc/v2/getSubnetList",
    ncloudAction: "getSubnetList",
  },
  ncloud_list_acgs: {
    toolName: "ncloud_list_acgs",
    title: "List Ncloud ACGs",
    description: "Read-only: list NAVER Cloud access control groups.",
    service: "ncloud",
    method: "GET",
    pathTemplate: "/vserver/v2/getAccessControlGroupList",
    ncloudAction: "getAccessControlGroupList",
  },
  ncloud_list_load_balancers: {
    toolName: "ncloud_list_load_balancers",
    title: "List Ncloud load balancers",
    description: "Read-only: list NAVER Cloud VPC load balancers.",
    service: "ncloud",
    method: "GET",
    pathTemplate: "/vloadbalancer/v2/getLoadBalancerInstanceList",
    ncloudAction: "getLoadBalancerInstanceList",
  },
  ncloud_get_load_balancer: {
    toolName: "ncloud_get_load_balancer",
    title: "Get Ncloud load balancer detail",
    description: "Read-only: get details for one NAVER Cloud VPC load balancer.",
    service: "ncloud",
    method: "GET",
    pathTemplate: "/vloadbalancer/v2/getLoadBalancerInstanceDetail",
    ncloudAction: "getLoadBalancerInstanceDetail",
  },
  ncloud_list_load_balancer_listeners: {
    toolName: "ncloud_list_load_balancer_listeners",
    title: "List Ncloud load balancer listeners",
    description: "Read-only: list listeners for a NAVER Cloud VPC load balancer.",
    service: "ncloud",
    method: "GET",
    pathTemplate: "/vloadbalancer/v2/getLoadBalancerListenerList",
    ncloudAction: "getLoadBalancerListenerList",
  },
  ncloud_list_load_balancer_rules: {
    toolName: "ncloud_list_load_balancer_rules",
    title: "List Ncloud load balancer rules",
    description: "Read-only: list rules for a NAVER Cloud VPC load balancer listener.",
    service: "ncloud",
    method: "GET",
    pathTemplate: "/vloadbalancer/v2/getLoadBalancerRuleList",
    ncloudAction: "getLoadBalancerRuleList",
  },
  ncloud_list_target_groups: {
    toolName: "ncloud_list_target_groups",
    title: "List Ncloud target groups",
    description: "Read-only: list NAVER Cloud VPC load balancer target groups.",
    service: "ncloud",
    method: "GET",
    pathTemplate: "/vloadbalancer/v2/getTargetGroupList",
    ncloudAction: "getTargetGroupList",
  },
  ncloud_list_targets: {
    toolName: "ncloud_list_targets",
    title: "List Ncloud target group targets",
    description: "Read-only: list targets in a NAVER Cloud VPC target group.",
    service: "ncloud",
    method: "GET",
    pathTemplate: "/vloadbalancer/v2/getTargetList",
    ncloudAction: "getTargetList",
  },
  ncloud_list_source_deploy_projects: {
    toolName: "ncloud_list_source_deploy_projects",
    title: "List SourceDeploy projects",
    description: "Read-only: list NAVER Cloud SourceDeploy projects.",
    service: "sourceDeployVpc",
    method: "GET",
    pathTemplate: "/api/v1/project",
  },
  ncloud_list_source_deploy_stages: {
    toolName: "ncloud_list_source_deploy_stages",
    title: "List SourceDeploy stages",
    description: "Read-only: list SourceDeploy stages in a project.",
    service: "sourceDeployVpc",
    method: "GET",
    pathTemplate: "/api/v1/project/{projectId}/stage",
  },
  ncloud_list_source_deploy_scenarios: {
    toolName: "ncloud_list_source_deploy_scenarios",
    title: "List SourceDeploy scenarios",
    description: "Read-only: list SourceDeploy scenarios in a project stage.",
    service: "sourceDeployVpc",
    method: "GET",
    pathTemplate: "/api/v1/project/{projectId}/stage/{stageId}/scenario",
  },
  ncloud_list_source_deploy_histories: {
    toolName: "ncloud_list_source_deploy_histories",
    title: "List SourceDeploy histories",
    description: "Read-only: list SourceDeploy deployment histories for a project.",
    service: "sourceDeployVpc",
    method: "GET",
    pathTemplate: "/api/v1/project/{projectId}/history",
  },
  ncloud_get_source_deploy_history: {
    toolName: "ncloud_get_source_deploy_history",
    title: "Get SourceDeploy history detail",
    description: "Read-only: get one SourceDeploy deployment history detail.",
    service: "sourceDeployVpc",
    method: "GET",
    pathTemplate: "/api/v1/project/{projectId}/history/{historyId}",
  },
} as const satisfies Record<string, ReadOnlyOperation>

export type ReadOnlyToolName = keyof typeof READ_ONLY_OPERATIONS

const BLOCKED_ACTION_PREFIXES = [
  "add",
  "approve",
  "associate",
  "attach",
  "cancel",
  "change",
  "create",
  "delete",
  "deploy",
  "detach",
  "disable",
  "enable",
  "execute",
  "import",
  "interrupt",
  "modify",
  "reboot",
  "reject",
  "remove",
  "restart",
  "rollback",
  "set",
  "start",
  "stop",
  "terminate",
  "unassign",
  "update",
]

const BLOCKED_TOOL_SEGMENTS = new Set(BLOCKED_ACTION_PREFIXES)

export function isReadOnlyToolName(toolName: string): toolName is ReadOnlyToolName {
  return Object.prototype.hasOwnProperty.call(READ_ONLY_OPERATIONS, toolName)
}

export function beforeReadOnlyCall(toolName: string, operation: ReadOnlyOperation): void {
  if (!isReadOnlyToolName(toolName)) {
    throw new Error(`Blocked unknown NAVER Cloud MCP tool: ${toolName}`)
  }
  if (READ_ONLY_OPERATIONS[toolName] !== operation) {
    throw new Error(`Blocked mismatched NAVER Cloud operation for tool: ${toolName}`)
  }
  if (!toolName.startsWith("ncloud_list_") && !toolName.startsWith("ncloud_get_")) {
    throw new Error(`Blocked non-read NAVER Cloud MCP tool name: ${toolName}`)
  }
  assertNoBlockedToolSegment(toolName)
  assertReadOnlyOperation(operation)
}

export function assertReadOnlyOperation(operation: ReadOnlyOperation): void {
  if (operation.method !== "GET") {
    throw new Error(`Blocked non-read NAVER Cloud API method: ${operation.method}`)
  }
  if (operation.ncloudAction !== undefined) {
    assertReadOnlyNcloudAction(operation.ncloudAction)
  }
  assertNoBlockedPathSegment(operation.pathTemplate)
}

function assertReadOnlyNcloudAction(action: string): void {
  if (!action.startsWith("get")) {
    throw new Error(`Blocked non-query NAVER Cloud action: ${action}`)
  }
  const lowerAction = action.toLowerCase()
  for (const prefix of BLOCKED_ACTION_PREFIXES) {
    if (lowerAction.startsWith(prefix)) {
      throw new Error(`Blocked destructive NAVER Cloud action: ${action}`)
    }
  }
}

function assertNoBlockedToolSegment(toolName: string): void {
  const normalized = toolName.replaceAll("source_deploy", "sourcedeploy")
  for (const segment of normalized.split("_")) {
    if (BLOCKED_TOOL_SEGMENTS.has(segment)) {
      throw new Error(`Blocked destructive NAVER Cloud MCP tool segment: ${toolName}`)
    }
  }
}

function assertNoBlockedPathSegment(pathTemplate: string): void {
  for (const segment of pathTemplate.toLowerCase().split(/[/.?&={}-]+/).filter(Boolean)) {
    if (BLOCKED_TOOL_SEGMENTS.has(segment)) {
      throw new Error(`Blocked destructive NAVER Cloud API path segment: ${pathTemplate}`)
    }
  }
}
