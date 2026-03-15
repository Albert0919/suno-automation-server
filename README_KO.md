# Suno Automation Server

[![English](https://img.shields.io/badge/English-English-blue?style=flat-square)](README.md)
[![中文](https://img.shields.io/badge/中文-Chinese-red?style=flat-square)](README_CN.md)
[![日本語](https://img.shields.io/badge/日本語-Japanese-green?style=flat-square)](README_JA.md)
[![한국어](https://img.shields.io/badge/한국어-Korean-yellow?style=flat-square)](README_KO.md)

Suno AI 음악 생성을 위한 로컬 자동화 서버입니다. MCP와 HTTP API 두 가지 모드를 지원합니다.

---

## 한마디로 노래 생성하기

**가장 간단한 사용법**: Claude Code에서 다음과 같이 말하세요:

```
봄을 주제로 한 팝송 만들어줘
```

또는:

```
이별을 주제로 한 슬픈 발라드 만들어줘
```

Claude가 자동으로 이 도구를 호출하여, **자동으로 노래를 생성하고 `downloads/` 폴더에 다운로드합니다**.

이게 전부입니다! 명령어를 외울 필요도 없고, 기술을 알 필요도 없습니다.

---

## 빠른 시작 (3단계)

### 1. 설치

```bash
cd suno-automation-server
npm install
npx playwright install chromium
```

### 2. MCP 설정 (Claude Code에서 호출할 수 있도록)

아래 내용을 `~/.claude/settings.json` 또는 프로젝트 루트 디렉토리의 `.mcp.json`에 추가하세요:

```json
{
  "mcpServers": {
    "suno-automation": {
      "command": "node",
      "args": ["여기에 실제 경로를 입력하세요/src/index.js"]
    }
  }
}
```

**경로 빠르게 얻기**: 프로젝트 디렉토리에서 다음을 실행하세요:

```bash
echo $(pwd)/src/index.js
```

출력된 경로를 `args`에 입력하면 됩니다.

### 3. Suno 로그인 (최초 1회)

```bash
npm run login
```

브라우저가 열리면 수동으로 Suno에 로그인하세요. 로그인 상태가 자동으로 저장됩니다.

**완료!** 이제 Claude에게 어떤 노래를 만들고 싶은지 말만 하면 됩니다.

---

## 사용 예시

Claude에게 직접 말하세요:

| 말하는 내용 | Claude가 하는 일 |
|---------|---------------|
| "생일 축하 노래 만들어줘" | 자동으로 가사 작성, 스타일 선택, 생성 및 다운로드 |
| "자유를 주제로 한 록 스타일 노래 만들어줘" | 록 스타일 노래 생성 |
| "배경음악으로 쓸 연주곡 만들어줘" | 연주곡 생성 (보컬 없음) |
| "서로 다른 스타일의 노래 5곡 일괄 생성해줘" | 여러 곡 자동 생성 및 다운로드 |

---

## 일괄 노래 생성

**여러 곡 일괄 생성**: Claude에게 다음과 같이 말하세요:

```
노래 3곡 일괄 생성해줘:
1. 봄을 주제로 한 팝송
2. 여름을 주제로 한 록송
3. 가을을 주제로 한 포크송
```

또는:

```
희로애락을 주제로 서로 다른 감정의 발라드 5곡 만들어줘
```

Claude가 자동으로 대기열에 추가하고, 생성을 시작하고, `downloads/` 폴더에 다운로드합니다.

---

## 일괄 생성 및 다운로드

**생성과 다운로드를 한 번에**: Claude에게 다음과 같이 말하세요:

```
노래 3곡 일괄 생성하고 다운로드해줘:
1. 생일 축하 노래, 밝은 팝 스타일
2. 졸업 기념 노래, 슬픈 발라드 스타일
3. 결혼 축하 노래, 로맨틱 발라드 스타일
```

Claude가:
1. 각 노래를 자동으로 생성
2. 생성 완료 대기
3. 모든 노래를 `downloads/` 폴더에 자동 다운로드

---

## 모든 사용법 조합

| 사용법 | 말하는 내용 예시 | 설명 |
|-----|-------------|------|
| 단일 생성 | "봄을 주제로 한 노래 만들어줘" | 자동 가사 작성, 스타일 선택, 생성 |
| 단일+다운로드 | "생일 노래 만들고 다운로드해줘" | 생성 후 자동 다운로드 |
| 일괄 생성 | "서로 다른 스타일의 노래 5곡 일괄 생성해줘" | 자동 대기열 생성 |
| 일괄+다운로드 | "노래 3곡 일괄 생성하고 다운로드해줘" | 일괄 생성 후 자동 다운로드 |
| 연주곡 | "피아노 배경음악 만들어줘" | 가사 없는 연주곡 |
| 스타일 지정 | "록 스타일 노래 만들어줘" | 음악 장르 지정 |
| 보컬 지정 | "여성 보컬 발라드 만들어줘" | 남성/여성 보컬 선택 가능 |

---

## 자주 사용하는 음악 스타일

한국어로 스타일을 말해도 됩니다. Claude가 자동으로 변환합니다:

| 한국어 | 영어 |
|-----|------|
| 팝/경쾌 | pop, upbeat |
| 발라드/슬로우 | ballad, emotional, piano |
| 록 | rock, energetic |
| 재즈 | jazz, smooth |
| 포크 | folk, acoustic |
| 랩 | hip hop, rap |
| 일렉트로닉 | electronic, synth |
| 국악/전통 | korean traditional, gayageum |

---

## 비기술자를 위한 상세 설명

### 이 도구는 무엇인가요?

이것은 **AI 음악 자동 생성**을 도와주는 작은 도구입니다. 다음 기능을 제공합니다:
- 🎤 가사 작성, 음악 스타일 선택 자동화
- 🎼 원클릭 노래 생성
- 📥 생성된 음악 파일 자동 다운로드
- 🔄 여러 곡 일괄 생성 (예: 한 번에 10곡 생성)

### 무엇이 필요한가요?

1. **컴퓨터** (Mac 또는 Windows)
2. **Node.js 설치** (무료 소프트웨어, nodejs.org에서 다운로드하여 설치)
3. **Suno 계정** (suno.com에서 가입, 무료 계정은 매월 50곡 생성 가능)

### 첫 번째 단계: 소프트웨어 설치

"터미널"을 엽니다 (Mac은 Command+스페이스, "터미널" 입력; Windows는 Win+R, "cmd" 입력), 그 다음 순서대로 다음 명령어를 입력하세요:

```
cd /clone한_프로젝트_경로/suno-automation-server
npm install
npx playwright install chromium
```

설치가 완료될 때까지 몇 분 정도 기다리세요.

### 두 번째 단계: Suno 계정 로그인

터미널에 다음을 입력하세요:

```
npm run login
```

브라우저가 자동으로 열리면, 수동으로 Suno 계정에 로그인하세요. 로그인 성공 후 브라우저를 닫으면 됩니다. 이후에는 다시 로그인할 필요가 없습니다.

### 세 번째 단계: 서비스 시작

터미널에 다음을 입력하세요:

```
npm run start:http
```

"Server running at http://127.0.0.1:3456"이 보이면 시작이 완료된 것입니다.

**참고**: 이 터미널 창은 계속 열어두세요, 닫지 마세요.

### 네 번째 단계: 첫 번째 노래 생성하기

다른 터미널 창(또는 탭)을 열고, 다음 명령어로 노래를 생성하세요:

```
curl -X POST http://localhost:3456/generate \
  -H "Content-Type: application/json" \
  -d '{"lyrics": "[Verse]\n오늘 날씨가 좋아\n햇살이 밝아\n[Chorus]\n우리 같이 노래하자", "style": "pop, happy, upbeat", "title": "즐거운 하루"}'
```

약 1-2분 정도 기다리면 노래가 자동으로 생성됩니다!

### 명령어 설명 (이해하지 못해도 됩니다, 그대로 복사하면 됩니다)

위 명령어에서:
- `"lyrics"` 뒤에 가사가 옵니다, `\n`은 줄바꿈을 의미하고, `[Verse]`와 `[Chorus]`는 노래 구조 표시입니다
- `"style"` 뒤에 음악 스타일이 옵니다, 영어 쉼표로 구분합니다, 예: `pop` 팝, `rock` 록, `jazz` 재즈
- `"title"` 뒤에 노래 제목이 옵니다

### 자주 사용하는 음악 스타일 참고

| 한국어 스타일 | 영어 표기 |
|---------|---------|
| 팝 | pop |
| 발라드/슬로우 | ballad |
| 록 | rock |
| 재즈 | jazz |
| 일렉트로닉 | electronic |
| 포크 | folk |
| 랩 | hip hop, rap |
| 국악/전통 | korean traditional, gayageum |
| 피아노 반주 | piano, acoustic |
| 경쾌 | upbeat, happy |
| 슬픔 | sad, emotional |

### 여러 노래 일괄 생성하기

가사가 많아 여러 곡을 생성하려면 일괄 기능을 사용하세요:

**첫 번째**: 텍스트 파일을 준비하고, 아래 형식으로 모든 노래를 작성하세요:

```
[
  {"lyrics": "[Verse]\n첫 번째 노래 가사", "title": "노래 제목 1"},
  {"lyrics": "[Verse]\n두 번째 노래 가사", "title": "노래 제목 2"},
  {"lyrics": "[Verse]\n세 번째 노래 가사", "title": "노래 제목 3"}
]
```

**두 번째**: 대기열에 추가:

```
curl -X POST http://localhost:3456/batch/add \
  -H "Content-Type: application/json" \
  -d '{"items": [{"lyrics": "[Verse]\n첫 번째 노래 가사", "title": "노래 1"}, {"lyrics": "[Verse]\n두 번째 노래 가사", "title": "노래 2"}], "defaults": {"style": "pop, ballad"}}'
```

**세 번째**: 생성 시작:

```
curl -X POST http://localhost:3456/batch/start
```

시스템이 자동으로 한 곡씩 생성하며, 각 곡 사이에 약 60초 간격이 있습니다.

### 생성된 노래 다운로드하기

노래 생성 후, 노래의 UUID(고유 번호)를 알아야 다운로드할 수 있습니다. Suno 웹사이트의 노래 페이지 URL에서 찾을 수 있습니다.

다운로드 명령어:

```
curl -X POST http://localhost:3456/download \
  -H "Content-Type: application/json" \
  -d '{"uuid": "노래_UUID", "title": "노래 제목"}'
```

다운로드된 파일은 `downloads` 폴더에 저장됩니다.

### 자주 묻는 질문

**Q: "포트가 사용 중"이라고 나오면 어떻게 하나요?**
A: 서비스가 이미 실행 중이라는 의미입니다. 다시 시작할 필요 없이 그대로 사용하면 됩니다.

**Q: 생성이 실패하면 어떻게 하나요?**
A: Suno 계정에 로그인했는지 확인하고, 계정에 남은 생성 횟수가 있는지 확인하세요.

**Q: 가사에 특수 문자는 어떻게 쓰나요?**
A: 줄바꿈은 `\n`, 큰따옴표는 `\"`를 사용하고, 다른 기호는 그대로 쓰면 됩니다.

**Q: 연주곡을 생성할 수 있나요?**
A: 가능합니다! 명령어에 `"instrumental": true`를 추가하면 됩니다.

---

## 설치 (기술자용)

```bash
cd suno-automation-server
npm install
npx playwright install chromium  # 최초 브라우저 설치 필요
```

## 사용법

### 1. 최초 로그인

```bash
npm run login
# 또는
node src/index.js --login
```

브라우저가 열리면 수동으로 Suno에 로그인하세요. 로그인 상태가 `browser-data/` 디렉토리에 자동 저장됩니다.

### 2. 서비스 시작

**MCP 모드 (기본값, Claude Code용):**

```bash
npm start
# 또는
node src/index.js --mcp
```

**HTTP 모드 (범용 API):**

```bash
npm run start:http
# 또는
node src/index.js --http
```

서비스는 `http://localhost:3456`에서 실행됩니다.

## API

### HTTP API

#### 단일 노래

| 엔드포인트 | 메서드 | 설명 |
|------|------|------|
| `/generate` | POST | 노래 생성 |
| `/status` | GET | 상태 확인 |
| `/login` | POST | 로그인 페이지 열기 |
| `/close` | POST | 브라우저 닫기 |
| `/health` | GET | 헬스 체크 |

**노래 생성 예시:**

```bash
curl -X POST http://localhost:3456/generate \
  -H "Content-Type: application/json" \
  -d '{
    "lyrics": "[Verse 1]\nHello world\n[Chorus]\nLa la la",
    "style": "pop, upbeat, electronic",
    "title": "My Song",
    "autoCreate": true
  }'
```

#### 일괄 생성

| 엔드포인트 | 메서드 | 설명 |
|------|------|------|
| `/batch/add` | POST | 노래를 대기열에 추가 |
| `/batch/status` | GET | 대기열 상태 조회 |
| `/batch/start` | POST | 일괄 처리 시작 |
| `/batch/stop` | POST | 일괄 처리 중지 |
| `/batch/clear` | POST | 대기열 비우기 |

**일괄 생성 예시:**

```bash
# 1. 노래를 대기열에 추가
curl -X POST http://localhost:3456/batch/add \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "lyrics": "[Verse]\nFirst song lyrics",
        "style": "pop, upbeat",
        "title": "Song 1"
      },
      {
        "lyrics": "[Verse]\nSecond song lyrics",
        "style": "jazz, smooth",
        "title": "Song 2"
      }
    ]
  }'

# 2. 일괄 처리 시작 (지연 시간 초 단위 선택 가능)
curl -X POST http://localhost:3456/batch/start \
  -H "Content-Type: application/json" \
  -d '{ "delaySeconds": 60 }'

# 3. 상태 확인
curl http://localhost:3456/batch/status

# 4. 중지 (선택)
curl -X POST http://localhost:3456/batch/stop

# 5. 대기열 비우기 (선택)
curl -X POST http://localhost:3456/batch/clear
```

#### 노래 다운로드

| 엔드포인트 | 메서드 | 설명 |
|------|------|------|
| `/download` | POST | 단일 노래 다운로드 (UUID로) |
| `/download/batch` | POST | 여러 노래 일괄 다운로드 |
| `/download/queue/add` | POST | 다운로드 대기열에 추가 |
| `/download/queue/status` | GET | 다운로드 대기열 상태 조회 |
| `/download/queue/start` | POST | 다운로드 대기열 처리 시작 |
| `/download/queue/stop` | POST | 다운로드 대기열 처리 중지 |
| `/download/queue/clear` | POST | 다운로드 대기열 비우기 |

**단일 노래 다운로드:**

```bash
curl -X POST http://localhost:3456/download \
  -H "Content-Type: application/json" \
  -d '{
    "uuid": "song-uuid-here",
    "format": "mp3",
    "title": "My Song",
    "includeImage": true
  }'
```

**일괄 다운로드:**

```bash
curl -X POST http://localhost:3456/download/batch \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "uuid": "uuid-1", "title": "Song 1" },
      { "uuid": "uuid-2", "title": "Song 2" }
    ],
    "format": "mp3",
    "concurrency": 3
  }'
```

**다운로드 대기열 사용:**

```bash
# 1. 다운로드 대기열에 추가
curl -X POST http://localhost:3456/download/queue/add \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "uuid": "uuid-1", "title": "Song 1" },
      { "uuid": "uuid-2", "title": "Song 2" }
    ],
    "format": "mp3"
  }'

# 2. 다운로드 시작
curl -X POST http://localhost:3456/download/queue/start \
  -H "Content-Type: application/json" \
  -d '{ "concurrency": 3 }'

# 3. 상태 확인
curl http://localhost:3456/download/queue/status
```

### MCP Tools

Claude Code에서 다음 도구를 직접 호출할 수 있습니다:

#### 단일 노래
- `suno_generate` - 노래 생성 (가사, 스타일, 제목 전달)
- `suno_status` - 현재 상태 확인
- `suno_login` - 로그인 페이지 열기

#### 일괄 생성
- `suno_batch_add` - 여러 노래를 대기열에 추가
- `suno_batch_status` - 대기열 상태 조회
- `suno_batch_start` - 일괄 처리 시작 (지연 시간 초 단위 지정 가능)
- `suno_batch_stop` - 일괄 처리 중지
- `suno_batch_clear` - 대기열 비우기

#### 노래 다운로드
- `suno_download` - 단일 노래 다운로드 (UUID로)
- `suno_download_batch` - 여러 노래 일괄 다운로드
- `suno_download_queue_add` - 다운로드 대기열에 추가
- `suno_download_queue_status` - 다운로드 대기열 상태 조회
- `suno_download_queue_start` - 다운로드 대기열 처리 시작
- `suno_download_queue_stop` - 다운로드 대기열 처리 중지
- `suno_download_queue_clear` - 다운로드 대기열 비우기

## 설정

`config.js`를 편집하여 수정:

- 포트 번호 (기본값 3456)
- 브라우저 설정
- 타임아웃 시간
- 일괄 처리 지연 시간 (기본값 60초)

## MCP 클라이언트 설정

Claude Desktop, Cursor, Windsurf, OpenAI Codex CLI 등 MCP 클라이언트와 호환됩니다.

### Claude Desktop

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "suno-automation": {
      "command": "node",
      "args": ["여기에 실제 경로를 입력하세요/src/index.js"],
      "env": {}
    }
  }
}
```

### Cursor

Settings → MCP Servers 또는 `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "suno-automation": {
      "command": "node",
      "args": ["여기에 실제 경로를 입력하세요/src/index.js"],
      "env": {}
    }
  }
}
```

### Windsurf

`~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "suno-automation": {
      "command": "node",
      "args": ["여기에 실제 경로를 입력하세요/src/index.js"],
      "env": {}
    }
  }
}
```

### OpenAI Codex CLI

`~/.codex/mcp.json`:

```json
{
  "mcpServers": {
    "suno-automation": {
      "command": "node",
      "args": ["여기에 실제 경로를 입력하세요/src/index.js"],
      "env": {}
    }
  }
}
```

### OpenClaw

OpenClaw는 자체 플러그인 시스템을 사용하며, 표준 MCP 프로토콜 설정을 지원하지 않습니다. **HTTP API 모드**를 사용한 연동을 권장합니다.

#### 빠른 시작

**단계 1: HTTP 서비스 시작**

```bash
cd /clone한_프로젝트_경로/suno-automation-server
npm run start:http
# 서비스가 http://localhost:3456에서 실행됩니다
```

**단계 2: 최초 Suno 로그인**

```bash
# 브라우저를 열어 로그인
curl -X POST http://localhost:3456/login
```

열리는 브라우저에서 Suno 로그인을 완료하면, 로그인 상태가 자동으로 저장됩니다.

**단계 3: 서비스 상태 확인**

```bash
curl http://localhost:3456/status
```

응답 예시:
```json
{
  "success": true,
  "login": true,
  "automation": {
    "isProcessing": false,
    "currentPage": "create"
  }
}
```

#### API 상세 설명

##### 1. 노래 생성

**엔드포인트**: `POST /generate`

| 파라미터 | 타입 | 필수 | 설명 |
|------|------|------|------|
| lyrics | string | 예 | 가사 내용, 구조 표시 `[Verse]`, `[Chorus]` 등 지원 |
| style | string | 예 | 음악 스타일, 쉼표로 구분, 예: `pop, upbeat, electronic` |
| title | string | 아니오 | 노래 제목 |
| autoCreate | boolean | 아니오 | 자동으로 생성 버튼 클릭 여부, 기본값 `true` |
| gender | string | 아니오 | 보컬 성별: `male` 또는 `female` |
| styleInfluence | number | 아니오 | 스타일 영향력 0-100, 기본값 50 |
| weirdness | number | 아니오 | 창의성 0-100, 기본값 50 |
| instrumental | boolean | 아니오 | 연주곡 여부, 기본값 `false` |

```bash
curl -X POST http://localhost:3456/generate \
  -H "Content-Type: application/json" \
  -d '{
    "lyrics": "[Verse]\n밤하늘의 별\n들을 수 있을까\n[Chorus]\n투명한 마음을 가지고 싶어",
    "style": "pop, ballad, emotional, piano",
    "title": "밤하늘의 별",
    "gender": "male",
    "autoCreate": true
  }'
```

응답 예시:
```json
{
  "success": true,
  "message": "Song generation started",
  "data": {
    "title": "밤하늘의 별",
    "style": "pop, ballad, emotional, piano"
  }
}
```

##### 2. 일괄 노래 생성

여러 노래를 한 번에 생성할 때 사용하며, 공통 기본 설정을 지원합니다.

**대기열에 추가**: `POST /batch/add`

```bash
curl -X POST http://localhost:3456/batch/add \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "lyrics": "[Verse]\n첫 번째 노래 가사", "title": "노래 1" },
      { "lyrics": "[Verse]\n두 번째 노래 가사", "title": "노래 2" },
      { "lyrics": "[Verse]\n세 번째 노래 가사", "title": "노래 3", "style": "jazz, smooth" }
    ],
    "defaults": {
      "style": "pop, upbeat",
      "gender": "female",
      "autoCreate": true
    }
  }'
```

| 파라미터 | 설명 |
|------|------|
| items | 노래 배열, 각 항목은 `lyrics`(필수)를 포함해야 하며, 선택적으로 `title`, `style`(기본값 덮어쓰기) 가능 |
| defaults | 공통 기본 설정, 모든 노래에 적용되며 개별적으로 덮어쓰기 가능 |

**대기열 상태 확인**: `GET /batch/status`

```bash
curl http://localhost:3456/batch/status
```

응답 예시:
```json
{
  "success": true,
  "pending": 2,
  "completed": 1,
  "failed": 0,
  "total": 3,
  "running": true,
  "results": [
    { "title": "노래 1", "success": true, "uuid": "xxx-xxx-xxx" }
  ]
}
```

**일괄 처리 시작**: `POST /batch/start`

```bash
curl -X POST http://localhost:3456/batch/start \
  -H "Content-Type: application/json" \
  -d '{ "delaySeconds": 90 }'
```

| 파라미터 | 설명 |
|------|------|
| delaySeconds | 각 노래 사이의 간격 초 단위, 기본값 60, 범위 5-300 |

**일괄 처리 중지**: `POST /batch/stop`

```bash
curl -X POST http://localhost:3456/batch/stop
```

**대기열 비우기**: `POST /batch/clear`

```bash
curl -X POST http://localhost:3456/batch/clear
```

##### 3. 노래 다운로드

생성 완료 후, UUID로 노래를 다운로드할 수 있습니다.

**단일 노래 다운로드**: `POST /download`

| 파라미터 | 타입 | 필수 | 설명 |
|------|------|------|------|
| uuid | string | 예 | 노래 UUID (생성 결과 또는 Suno 페이지에서 확인) |
| format | string | 아니오 | 오디오 형식: `mp3`(무료) 또는 `wav`(유료 회원), 기본값 `mp3` |
| title | string | 아니오 | 파일명 제목 |
| outputDir | string | 아니오 | 출력 디렉토리, 기본값 `downloads/` |
| includeImage | boolean | 아니오 | 커버 이미지 함께 다운로드 여부, 기본값 `false` |

```bash
curl -X POST http://localhost:3456/download \
  -H "Content-Type: application/json" \
  -d '{
    "uuid": "abc123-def456-ghi789",
    "format": "mp3",
    "title": "내 노래",
    "includeImage": true
  }'
```

응답 예시:
```json
{
  "success": true,
  "file": "/path/to/downloads/내 노래.mp3",
  "image": "/path/to/downloads/내 노래.png"
}
```

**일괄 다운로드**: `POST /download/batch`

```bash
curl -X POST http://localhost:3456/download/batch \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "uuid": "uuid-1", "title": "노래 A" },
      { "uuid": "uuid-2", "title": "노래 B" }
    ],
    "format": "mp3",
    "concurrency": 3
  }'
```

| 파라미터 | 설명 |
|------|------|
| items | 노래 UUID 배열, 각 항목은 `uuid`를 포함해야 하며, 선택적으로 `title` 가능 |
| concurrency | 동시 다운로드 수, 기본값 3, 최대 10 |

**다운로드 대기열 사용** (대량 다운로드 백그라운드 처리):

```bash
# 1. 다운로드 대기열에 추가
curl -X POST http://localhost:3456/download/queue/add \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "uuid": "uuid-1", "title": "노래 A" },
      { "uuid": "uuid-2", "title": "노래 B" }
    ],
    "format": "mp3"
  }'

# 2. 다운로드 시작
curl -X POST http://localhost:3456/download/queue/start \
  -H "Content-Type: application/json" \
  -d '{ "concurrency": 3 }'

# 3. 다운로드 진행 상황 확인
curl http://localhost:3456/download/queue/status

# 4. 다운로드 중지
curl -X POST http://localhost:3456/download/queue/stop
```

##### 4. 기타 엔드포인트

| 엔드포인트 | 메서드 | 설명 |
|------|------|------|
| `/health` | GET | 헬스 체크 |
| `/status` | GET | 로그인 상태 및 서비스 상태 확인 |
| `/login` | POST | 로그인 페이지 열기 |
| `/close` | POST | 브라우저 닫기 |

#### 전체 워크플로우 예시

```bash
# 1. 서비스 시작
npm run start:http

# 2. 최초 로그인 (이미 로그인한 경우 생략 가능)
curl -X POST http://localhost:3456/login

# 3. 노래 일괄 추가
curl -X POST http://localhost:3456/batch/add \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "lyrics": "[Verse]\n봄바람이 언덕을 지나\n꽃들이 피어나", "title": "봄바람" },
      { "lyrics": "[Verse]\n여름의 바닷가\n햇살이 모래사장에", "title": "여름" },
      { "lyrics": "[Verse]\n가을 낙엽이 흩날리고\n황금빛이 길을 덮어", "title": "가을 낙엽" }
    ],
    "defaults": {
      "style": "pop, acoustic, guitar",
      "gender": "female"
    }
  }'

# 4. 일괄 생성 시작 (각 곡 간격 90초)
curl -X POST http://localhost:3456/batch/start \
  -H "Content-Type: application/json" \
  -d '{ "delaySeconds": 90 }'

# 5. 진행 상황 확인
curl http://localhost:3456/batch/status

# 6. 생성 완료 후 노래 다운로드 (반환된 UUID 사용)
curl -X POST http://localhost:3456/download/batch \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "uuid": "생성된 uuid-1", "title": "봄바람" },
      { "uuid": "생성된 uuid-2", "title": "여름" },
      { "uuid": "생성된 uuid-3", "title": "가을 낙엽" }
    ],
    "format": "mp3",
    "includeImage": true
  }'
```

#### 자주 사용하는 스타일 참고

| 스타일 조합 | 적용 시나리오 |
|---------|---------|
| `pop, upbeat, electronic` | 댄스 팝 |
| `ballad, emotional, piano` | 감성 발라드 |
| `rock, energetic, electric guitar` | 록 |
| `jazz, smooth, saxophone` | 재즈 |
| `folk, acoustic, guitar` | 포크 |
| `hip hop, rap, beat` | 랩 |
| `classical, orchestral, strings` | 클래식 오케스트라 |
| `electronic, synth, ambient` | 일렉트로닉 앰비언트 |

#### OpenClaw 플러그인 개발 (선택)

OpenClaw에 깊이 통합하려면 전용 플러그인을 개발할 수 있습니다:

1. `openclaw.plugin.json` 설정 파일 생성
2. `configSchema`로 플러그인 파라미터 정의
3. 플러그인에서 이 프로젝트의 HTTP API 호출

자세한 내용은 [OpenClaw 플러그인 문서](https://docs.openclaw.ai/zh-CN/tools) 참조

### 기타 MCP 클라이언트 (Goose, Continue, Zed 등)

MCP를 지원하는 모든 클라이언트는 다음 설정 형식을 사용하세요:

```json
{
  "mcpServers": {
    "suno-automation": {
      "command": "node",
      "args": ["clone한_프로젝트_실제_경로/src/index.js"],
      "env": {},
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

**참고**: `args`의 경로를 실제 설치 디렉토리로 변경하세요.

프로젝트의 `mcp-settings.json` 파일 내용을 MCP 클라이언트 설정에 직접 복사해도 됩니다.

## 디렉토리 구조

```
suno-automation-server/
├── package.json
├── config.js
├── mcp-settings.json    # MCP 설정 템플릿
├── src/
│   ├── index.js           # 진입점
│   ├── mcp-server.js      # MCP 서버
│   ├── http-server.js     # HTTP API
│   ├── browser.js         # 브라우저 관리
│   └── suno-automation.js # 핵심 로직
└── browser-data/          # 로그인 상태 저장
```