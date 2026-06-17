# @kimduumin/ncloud-mcp

[![npm version](https://img.shields.io/npm/v/@kimduumin/ncloud-mcp.svg)](https://www.npmjs.com/package/@kimduumin/ncloud-mcp)
[![GitHub Repository](https://img.shields.io/badge/GitHub-doominkim%2Fncloud--mcp-181717?logo=github)](https://github.com/doominkim/ncloud-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

NAVER Cloud Platform 인벤토리를 AI 어시스턴트에서 안전하게 조회하기 위한 **read-only MCP server**입니다.

이 프로젝트의 목표는 Ncloud 리소스를 “관리”하는 것이 아니라, 운영자가 AI에게 다음 질문을 안전하게 위임할 수 있게 하는 것입니다.

```text
현재 서버 목록 보여줘
VPC와 서브넷 구조를 정리해줘
로드밸런서 리스너와 타겟 그룹 연결 상태 확인해줘
외부 노출 위험이 있는 인벤토리 JSON을 점검해줘
```

## Repository

- GitHub: [https://github.com/doominkim/ncloud-mcp](https://github.com/doominkim/ncloud-mcp)

## 왜 조회 전용인가요?

NAVER Cloud API에는 상태 변경 작업이 `GET` API로 노출되는 경우가 있습니다. 따라서 단순히 HTTP method가 `GET`인지 확인하는 것만으로는 안전하지 않습니다.

이 MCP 서버는 의도적으로 좁은 조회 도구만 제공합니다.

- 생성, 수정, 삭제, 시작, 정지, 배포, 롤백 도구 없음
- 범용 request 도구 없음
- allowlist에 등록된 조회 API만 호출
- destructive verb와 destructive action name 차단
- MCP tool annotations에 `readOnlyHint`, `destructiveHint: false`, `idempotentHint` 적용
- SourceDeploy도 프로젝트/스테이지/시나리오/히스토리 조회만 제공

> 중요: 이 소프트웨어의 read-only guard는 보조 안전장치입니다. 반드시 NAVER Cloud **read-only Sub Account** 키를 사용하세요. Main Account key나 Admin 권한 key를 사용하지 마세요.

## 주요 기능

| 카테고리 | 제공 기능 |
| --- | --- |
| Server | VPC 서버 목록 및 단일 서버 상세 조회 |
| VPC | VPC, Subnet, ACG 조회 |
| Load Balancer | 로드밸런서 목록/상세, 리스너, 리스너 규칙 조회 |
| Target Group | 타겟 그룹 및 타겟 상태 조회 |
| SourceDeploy | 프로젝트, 스테이지, 시나리오, 배포 히스토리 조회 |
| Local Advisor | 붙여넣은 inventory JSON에서 public IP, LB, ACG, open CIDR 흔적 점검 |

## 제공 도구

도구명은 모두 조회 의도를 드러내도록 `ncloud_list_*`, `ncloud_get_*` 형태로 제한되어 있습니다.

### Server

- `ncloud_list_servers` — VPC 서버 목록 조회
- `ncloud_get_server` — 단일 VPC 서버 상세 조회

### VPC networking

- `ncloud_list_vpcs` — VPC 목록 조회
- `ncloud_list_subnets` — VPC 내 Subnet 목록 조회
- `ncloud_list_acgs` — VPC 내 Access Control Group 목록 조회

### Load Balancer

- `ncloud_list_load_balancers` — VPC Load Balancer 목록 조회
- `ncloud_get_load_balancer` — 단일 Load Balancer 상세 조회
- `ncloud_list_load_balancer_listeners` — Load Balancer Listener 목록 조회
- `ncloud_list_load_balancer_rules` — Listener Rule 목록 조회

### Target Group

- `ncloud_list_target_groups` — VPC 내 Target Group 목록 조회
- `ncloud_list_targets` — Target Group 내 Target 상태 조회

### SourceDeploy

- `ncloud_list_source_deploy_projects` — 프로젝트 목록 조회
- `ncloud_list_source_deploy_stages` — 스테이지 목록 조회
- `ncloud_list_source_deploy_scenarios` — 시나리오 목록 조회
- `ncloud_list_source_deploy_histories` — 배포 히스토리 목록 조회
- `ncloud_get_source_deploy_history` — 배포 히스토리 상세 조회

### Local advisor

- `ncloud_advise_inventory_risks` — 붙여넣은 inventory JSON에서 public IP, load balancer, ACG, open CIDR 흔적 점검


## 사전 요구사항

- Node.js 22 이상
- NAVER Cloud Sub Account API key
- Sub Account에는 조회에 필요한 서비스 권한만 부여하는 것을 권장

## 설치

### npx 사용 권장

별도 clone 없이 MCP client가 `npx`로 바로 실행할 수 있습니다.

```bash
npx -y @kimduumin/ncloud-mcp@latest
```

이 명령은 MCP stdio server를 시작합니다. 정상 실행 시 터미널에 아무 출력 없이 대기할 수 있습니다.

### 소스에서 빌드

```bash
git clone git@github.com:doominkim/ncloud-mcp.git
cd ncloud-mcp
npm install
npm run build
npm test
```

`npm test`는 TypeScript build와 offline read-only policy smoke test를 수행합니다. NAVER Cloud API를 호출하지 않습니다.

## 환경 변수

| 변수 | 필수 | 설명 | 기본값 |
| --- | --- | --- | --- |
| `NCLOUD_ACCESS_KEY` | 예 | Sub Account Access Key ID | - |
| `NCLOUD_SECRET_KEY` | 예 | Sub Account Secret Key | - |
| `NCLOUD_REGION_CODE` | 아니오 | NAVER Cloud region code | `KR` |
| `NCLOUD_SOURCEDEPLOY_PLATFORM` | 아니오 | SourceDeploy API platform. `vpc` 또는 `classic` | `vpc` |

예시:

```zsh
export NCLOUD_ACCESS_KEY="your_read_only_subaccount_access_key"
export NCLOUD_SECRET_KEY="your_read_only_subaccount_secret_key"
```

선택값:

```zsh
export NCLOUD_REGION_CODE="KR"
export NCLOUD_SOURCEDEPLOY_PLATFORM="vpc"
```

secrets 파일을 따로 쓴다면 `export`와 `source`가 모두 필요합니다.

```zsh
# ~/.zshrc
[ -f ~/.zsh_secrets ] && source ~/.zsh_secrets
```

```zsh
# ~/.zsh_secrets
export NCLOUD_ACCESS_KEY="your_read_only_subaccount_access_key"
export NCLOUD_SECRET_KEY="your_read_only_subaccount_secret_key"
```

환경변수가 child process에 보이는지 확인:

```bash
node -e "console.log(process.env.NCLOUD_ACCESS_KEY ? 'access set' : 'access unset'); console.log(process.env.NCLOUD_SECRET_KEY ? 'secret set' : 'secret unset')"
```

## NAVER Cloud API key 발급

Sub Account 상세 화면의 `API Key` 탭에서 발급합니다.

```text
NAVER Cloud Console
→ Services
→ Management & Governance
→ Sub Account
→ Sub Accounts
→ select the Sub Account
→ API Key tab
→ Create Access Key
```

| NAVER Cloud 값 | 환경 변수 |
| --- | --- |
| Access Key ID | `NCLOUD_ACCESS_KEY` |
| Secret Key | `NCLOUD_SECRET_KEY` |

## MCP client 설정

### OpenCode

`~/.config/opencode/opencode.json`에 추가:

```json
{
  "mcp": {
    "navercloud-readonly": {
      "type": "local",
      "command": [
        "npx",
        "-y",
        "@kimduumin/ncloud-mcp@latest"
      ],
      "enabled": true,
      "environment": {
        "NCLOUD_ACCESS_KEY": "{env:NCLOUD_ACCESS_KEY}",
        "NCLOUD_SECRET_KEY": "{env:NCLOUD_SECRET_KEY}",
        "NCLOUD_REGION_CODE": "{env:NCLOUD_REGION_CODE}",
        "NCLOUD_SOURCEDEPLOY_PLATFORM": "{env:NCLOUD_SOURCEDEPLOY_PLATFORM}"
      },
      "timeout": 300000
    }
  }
}
```

OpenCode는 시작 시점에 MCP 설정과 환경변수를 읽습니다. 설정이나 secrets를 바꾼 뒤에는 OpenCode를 완전히 종료하고 다시 시작하세요.

### 일반 MCP 설정 형태

클라이언트가 `command`와 `args` 형식을 쓰는 경우:

```json
{
  "mcpServers": {
    "navercloud-readonly": {
      "command": "npx",
      "args": ["-y", "@kimduumin/ncloud-mcp@latest"],
      "env": {
        "NCLOUD_ACCESS_KEY": "your-access-key",
        "NCLOUD_SECRET_KEY": "your-secret-key",
        "NCLOUD_REGION_CODE": "KR",
        "NCLOUD_SOURCEDEPLOY_PLATFORM": "vpc"
      }
    }
  }
}
```

### 로컬 빌드 사용

```json
{
  "mcp": {
    "navercloud-readonly": {
      "type": "local",
      "command": ["node", "/absolute/path/to/ncloud-mcp/dist/cli.js"],
      "enabled": true,
      "environment": {
        "NCLOUD_ACCESS_KEY": "{env:NCLOUD_ACCESS_KEY}",
        "NCLOUD_SECRET_KEY": "{env:NCLOUD_SECRET_KEY}"
      }
    }
  }
}
```

## 사용 예시

MCP client에서 자연어로 요청하면 됩니다.

```text
현재 NAVER Cloud 서버 목록 보여줘
```

```text
VPC와 서브넷 구조를 표로 정리해줘
```

```text
로드밸런서 목록과 각 리스너 규칙을 조회해줘
```

```text
Target Group별 health check 상태를 확인해줘
```

```text
이 inventory JSON을 ncloud_advise_inventory_risks로 점검해줘
```

## Live verification

다음 조회 도구 범주는 실제 NAVER Cloud 계정에서 mutation 없이 검증했습니다.

- Server list / server detail
- VPC list
- Subnet list
- Access Control Group list
- Load Balancer list / detail
- Load Balancer listener / listener rule list
- Target Group / target list
- SourceDeploy project list
- Local inventory risk advisor

SourceDeploy stage, scenario, history, history detail 도구는 계정에 실제 SourceDeploy project/stage/history가 있어야 완전히 검증할 수 있습니다.

## 문제 해결

| 증상 | 원인 | 해결 방법 |
| --- | --- | --- |
| `Connection closed` | MCP server가 시작 직후 종료됨 | `node dist/cli.js`를 직접 실행해 stderr 확인 |
| `NCLOUD_ACCESS_KEY is required` | Access key 환경변수 없음 | `NCLOUD_ACCESS_KEY`를 export 후 client 재시작 |
| `NCLOUD_SECRET_KEY is required` | Secret key 환경변수 없음 | `NCLOUD_SECRET_KEY`를 export 후 client 재시작 |
| HTTP 401 | key 값 오류 또는 비활성 key | Sub Account API key 상태와 공백/줄바꿈 확인 |
| HTTP 403 | Sub Account 권한 부족 | 필요한 조회 권한만 추가 부여 |
| SourceDeploy 조회 실패 | platform 또는 권한 문제 | `NCLOUD_SOURCEDEPLOY_PLATFORM`이 `vpc`/`classic` 중 맞는지 확인 |

직접 실행해서 확인:

```bash
cd /path/to/ncloud-mcp
node dist/cli.js
```

정상적으로 credentials가 설정되어 있으면 MCP stdio server가 client message를 기다리므로 출력 없이 대기할 수 있습니다.

## License

[MIT](./LICENSE)
