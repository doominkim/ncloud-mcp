#!/usr/bin/env node
import assert from "node:assert/strict"
import {
  ADVISOR_TOOL_NAME,
  analyzeInventoryRisks,
} from "../dist/mcp-server.js"
import {
  assertReadOnlyOperation,
  beforeReadOnlyCall,
  READ_ONLY_OPERATIONS,
} from "../dist/read-only-policy.js"

const destructiveSegments = new Set([
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
])

for (const [toolName, operation] of Object.entries(READ_ONLY_OPERATIONS)) {
  assert.match(toolName, /^ncloud_(list|get)_/)
  const normalizedToolName = toolName.replaceAll("source_deploy", "sourcedeploy")
  for (const segment of normalizedToolName.split("_")) {
    assert.equal(destructiveSegments.has(segment), false, `${toolName} contains destructive segment ${segment}`)
  }
  assert.equal(operation.method, "GET", `${toolName} must use GET`)
  beforeReadOnlyCall(toolName, operation)
}

assert.equal(READ_ONLY_OPERATIONS.ncloud_list_vpcs.pathTemplate, "/vpc/v2/getVpcList")
assert.equal(READ_ONLY_OPERATIONS.ncloud_list_subnets.pathTemplate, "/vpc/v2/getSubnetList")
assert.equal(Object.hasOwn(READ_ONLY_OPERATIONS, ADVISOR_TOOL_NAME), false)

assert.throws(() => {
  assertReadOnlyOperation({
    toolName: "ncloud_create_server",
    title: "Create server",
    description: "must be blocked",
    service: "ncloud",
    method: "GET",
    pathTemplate: "/vserver/v2/createServerInstances",
    ncloudAction: "createServerInstances",
  })
}, /Blocked/)

assert.throws(() => {
  beforeReadOnlyCall("ncloud_delete_server", READ_ONLY_OPERATIONS.ncloud_list_servers)
}, /Blocked/)

assert.throws(() => {
  beforeReadOnlyCall("ncloud_list_servers", READ_ONLY_OPERATIONS.ncloud_get_server)
}, /mismatched/)

const advisorReport = analyzeInventoryRisks({
  regionCode: "KR",
  inventoryJson: JSON.stringify({
    serverInstanceList: [{ publicIp: "203.0.113.10" }],
    loadBalancerInstanceList: [{ loadBalancerName: "public-lb" }],
    accessControlGroupRuleList: [{ ipBlock: "0.0.0.0/0", portRange: "22" }],
  }),
})

assert.equal(advisorReport.regionCode, "KR")
assert.equal(advisorReport.summary.publicIpReferences, 1)
assert.equal(advisorReport.summary.loadBalancerReferences, 2)
assert.equal(advisorReport.summary.acgReferences, 1)
assert.equal(advisorReport.summary.openCidrReferences, 1)
assert.ok(advisorReport.recommendations.length > 0)

console.log(`read-only-policy-smoke: OK (${Object.keys(READ_ONLY_OPERATIONS).length} API tools checked, advisor checked)`)
