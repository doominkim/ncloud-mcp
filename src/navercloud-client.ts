import { createHmac } from "node:crypto"
import { beforeReadOnlyCall, type ReadOnlyOperation } from "./read-only-policy.js"

export interface NaverCloudCredentials {
  readonly accessKey: string
  readonly secretKey: string
  readonly regionCode: string
  readonly sourceDeployPlatform: "vpc" | "classic"
}

export type QueryValue = string | number | boolean | undefined

export type QueryParams = Record<string, QueryValue>

export type PathParams = Record<string, string | number>

export interface ReadOnlyRequestInput {
  readonly toolName: string
  readonly operation: ReadOnlyOperation
  readonly query?: QueryParams
  readonly path?: PathParams
}

const SERVICE_ORIGINS = {
  ncloud: "https://ncloud.apigw.ntruss.com",
  sourceDeployVpc: "https://vpcsourcedeploy.apigw.ntruss.com",
  sourceDeployClassic: "https://sourcedeploy.apigw.ntruss.com",
} as const

export function readCredentialsFromEnvironment(env: NodeJS.ProcessEnv = process.env): NaverCloudCredentials {
  const accessKey = env.NCLOUD_ACCESS_KEY
  const secretKey = env.NCLOUD_SECRET_KEY
  if (accessKey === undefined || accessKey.length === 0) {
    throw new Error("NCLOUD_ACCESS_KEY is required. Use a read-only NAVER Cloud Sub Account key.")
  }
  if (secretKey === undefined || secretKey.length === 0) {
    throw new Error("NCLOUD_SECRET_KEY is required. Use a read-only NAVER Cloud Sub Account key.")
  }
  const platform = env.NCLOUD_SOURCEDEPLOY_PLATFORM === "classic" ? "classic" : "vpc"
  return {
    accessKey,
    secretKey,
    regionCode: env.NCLOUD_REGION_CODE ?? "KR",
    sourceDeployPlatform: platform,
  }
}

export class NaverCloudReadOnlyClient {
  readonly #credentials: NaverCloudCredentials

  constructor(credentials: NaverCloudCredentials) {
    this.#credentials = credentials
  }

  async request(input: ReadOnlyRequestInput): Promise<unknown> {
    beforeReadOnlyCall(input.toolName, input.operation)
    const operation = resolveSourceDeployService(input.operation, this.#credentials.sourceDeployPlatform)
    const path = applyPathParams(operation.pathTemplate, input.path ?? {})
    const query = normalizeQuery({ ...input.query })
    if (operation.service === "ncloud" && !query.has("regionCode")) {
      query.set("regionCode", this.#credentials.regionCode)
    }
    if (operation.service === "ncloud" && !query.has("responseFormatType")) {
      query.set("responseFormatType", "json")
    }
    if (operation.service === "sourceDeployClassic" || operation.service === "sourceDeployVpc") {
      query.delete("regionCode")
    }
    const pathWithQuery = query.size > 0 ? `${path}?${query.toString()}` : path
    const origin = SERVICE_ORIGINS[operation.service]
    const timestamp = Date.now().toString()
    const signature = createSignature({
      method: operation.method,
      pathWithQuery,
      timestamp,
      accessKey: this.#credentials.accessKey,
      secretKey: this.#credentials.secretKey,
    })

    const headers = new Headers({
      Accept: "application/json",
      "x-ncp-apigw-timestamp": timestamp,
      "x-ncp-iam-access-key": this.#credentials.accessKey,
      "x-ncp-apigw-signature-v2": signature,
    })
    if (operation.service === "sourceDeployClassic" || operation.service === "sourceDeployVpc") {
      headers.set("x-ncp-region_code", this.#credentials.regionCode)
    }

    const response = await fetch(`${origin}${pathWithQuery}`, {
      method: operation.method,
      headers,
    })
    const text = await response.text()
    const payload = parseResponsePayload(text)
    if (!response.ok) {
      throw new Error(`NAVER Cloud API failed (${response.status}): ${JSON.stringify(payload)}`)
    }
    return payload
  }
}

function resolveSourceDeployService(operation: ReadOnlyOperation, platform: "vpc" | "classic"): ReadOnlyOperation {
  if (operation.service !== "sourceDeployVpc") return operation
  if (platform === "vpc") return operation
  return { ...operation, service: "sourceDeployClassic" }
}

function createSignature(input: {
  readonly method: string
  readonly pathWithQuery: string
  readonly timestamp: string
  readonly accessKey: string
  readonly secretKey: string
}): string {
  const message = `${input.method} ${input.pathWithQuery}\n${input.timestamp}\n${input.accessKey}`
  return createHmac("sha256", input.secretKey).update(message, "utf8").digest("base64")
}

function normalizeQuery(params: QueryParams): URLSearchParams {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue
    query.set(key, String(value))
  }
  return query
}

function applyPathParams(pathTemplate: string, params: PathParams): string {
  let path = pathTemplate
  for (const [key, value] of Object.entries(params)) {
    path = path.replaceAll(`{${key}}`, encodeURIComponent(String(value)))
  }
  const missing = path.match(/\{[^}]+\}/g)
  if (missing !== null) {
    throw new Error(`Missing path parameter(s): ${missing.join(", ")}`)
  }
  return path
}

function parseResponsePayload(text: string): unknown {
  if (text.length === 0) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}
