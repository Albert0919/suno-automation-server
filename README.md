# Suno Automation Server

[English](README.md) | [中文](README_CN.md) | [日本語](README_JA.md) | [한국어](README_KO.md)

A local automation service for Suno AI music generation. Supports both MCP and HTTP API modes.

---

## Generate Songs with One Sentence

**Simplest usage**: In Claude Code, just say:

```
Help me generate a pop song about spring
```

Or:

```
Generate a sad ballad about heartbreak
```

Claude will automatically call this tool, **generate the song and download it to the `downloads/` folder**.

That's all you need! No commands to memorize, no technical knowledge required.

---

## Quick Start (3 Steps)

### 1. Install

```bash
cd suno-automation-server
npm install
npx playwright install chromium
```

### 2. Configure MCP (Enable Claude Code Integration)

Add the following to `~/.claude/settings.json` or `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "suno-automation": {
      "command": "node",
      "args": ["your-actual-path/src/index.js"]
    }
  }
}
```

**Quick path retrieval**: Run in the project directory:

```bash
echo $(pwd)/src/index.js
```

Copy the output path to `args`.

### 3. Login to Suno (First Time)

```bash
npm run login
```

A browser will open for you to manually login to Suno. The login state will be automatically saved.

**Done!** Now just tell Claude what song you want to generate.

---

## Usage Examples

Just tell Claude directly:

| What You Say | What Claude Does |
|---------|---------------|
| "Generate a birthday song" | Automatically writes lyrics, picks style, generates and downloads |
| "Make a rock song about freedom" | Generates a rock style song |
| "Write an instrumental piece for background music" | Generates instrumental music (no vocals) |
| "Batch generate 5 songs in different styles" | Automatically generates multiple songs and downloads |

---

## Batch Generate Songs

**Generate multiple songs**: Just tell Claude:

```
Help me batch generate 3 songs:
1. A pop song about spring
2. A rock song about summer
3. A folk song about autumn
```

Or:

```
Generate 5 ballads with different emotions: joy, anger, sadness, and happiness
```

Claude will automatically add to queue, start generation, and download to `downloads/` folder.

---

## Batch Generate and Download

**Complete generation and download in one go**: Just tell Claude:

```
Help me batch generate and download 3 songs:
1. Birthday song, upbeat pop style
2. Graduation song, sentimental folk style
3. Wedding blessing song, romantic ballad style
```

Claude will:
1. Automatically generate each song
2. Wait for generation to complete
3. Automatically download all songs to `downloads/` folder

---

## All Usage Combinations

| Usage | Example | Description |
|-----|-------------|------|
| Single generation | "Generate a song about spring" | Auto write lyrics, pick style, generate |
| Single + download | "Generate and download a birthday song" | Auto download after generation |
| Batch generation | "Batch generate 5 songs in different styles" | Auto queue generation |
| Batch + download | "Batch generate and download 3 songs" | Auto download after batch generation |
| Instrumental | "Generate a piano background music" | No lyrics instrumental |
| Specify style | "Generate a rock song" | Specify music genre |
| Specify vocals | "Generate a female vocal ballad" | Male/female voice optional |

---

## Common Music Styles

You can say styles in Chinese, Claude will automatically convert:

| Chinese | English |
|-----|------|
| 流行/欢快 | pop, upbeat |
| 抒情/慢歌 | ballad, emotional, piano |
| 摇滚 | rock, energetic |
| 爵士 | jazz, smooth |
| 民谣 | folk, acoustic |
| 说唱 | hip hop, rap |
| 电子 | electronic, synth |
| 古风 | chinese traditional, guzheng |

---

## Installation (Technical Users)

```bash
cd suno-automation-server
npm install
npx playwright install chromium  # First time requires browser installation
```

## Usage

### 1. First Login

```bash
npm run login
# or
node src/index.js --login
```

Opens browser for manual Suno login. Login state is saved to `browser-data/` directory.

### 2. Start Service

**MCP Mode (Default, for Claude Code):**

```bash
npm start
# or
node src/index.js --mcp
```

**HTTP Mode (General API):**

```bash
npm run start:http
# or
node src/index.js --http
```

Service runs at `http://localhost:3456`

## API

### HTTP API

#### Single Song

| Endpoint | Method | Description |
|------|------|------|
| `/generate` | POST | Generate song |
| `/status` | GET | Check status |
| `/login` | POST | Open login page |
| `/close` | POST | Close browser |
| `/health` | GET | Health check |

**Generate Song Example:**

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

#### Batch Generation

| Endpoint | Method | Description |
|------|------|------|
| `/batch/add` | POST | Add songs to queue |
| `/batch/status` | GET | Get queue status |
| `/batch/start` | POST | Start batch processing |
| `/batch/stop` | POST | Stop batch processing |
| `/batch/clear` | POST | Clear queue |

**Batch Generation Example:**

```bash
# 1. Add songs to queue
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

# 2. Start batch processing (optionally specify delay seconds)
curl -X POST http://localhost:3456/batch/start \
  -H "Content-Type: application/json" \
  -d '{ "delaySeconds": 60 }'

# 3. Check status
curl http://localhost:3456/batch/status

# 4. Stop (optional)
curl -X POST http://localhost:3456/batch/stop

# 5. Clear queue (optional)
curl -X POST http://localhost:3456/batch/clear
```

#### Download Songs

| Endpoint | Method | Description |
|------|------|------|
| `/download` | POST | Download single song (by UUID) |
| `/download/batch` | POST | Batch download multiple songs |
| `/download/queue/add` | POST | Add to download queue |
| `/download/queue/status` | GET | Get download queue status |
| `/download/queue/start` | POST | Start download queue processing |
| `/download/queue/stop` | POST | Stop download queue processing |
| `/download/queue/clear` | POST | Clear download queue |

**Download Single Song:**

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

**Batch Download:**

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

**Using Download Queue:**

```bash
# 1. Add to download queue
curl -X POST http://localhost:3456/download/queue/add \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "uuid": "uuid-1", "title": "Song 1" },
      { "uuid": "uuid-2", "title": "Song 2" }
    ],
    "format": "mp3"
  }'

# 2. Start download
curl -X POST http://localhost:3456/download/queue/start \
  -H "Content-Type: application/json" \
  -d '{ "concurrency": 3 }'

# 3. Check status
curl http://localhost:3456/download/queue/status
```

### MCP Tools

Claude Code can directly call the following tools:

#### Single Song
- `suno_generate` - Generate song (pass lyrics, style, title)
- `suno_status` - Check current status
- `suno_login` - Open login page

#### Batch Generation
- `suno_batch_add` - Add multiple songs to queue
- `suno_batch_status` - Get queue status
- `suno_batch_start` - Start batch processing (can specify delay seconds)
- `suno_batch_stop` - Stop batch processing
- `suno_batch_clear` - Clear queue

#### Download Songs
- `suno_download` - Download single song (by UUID)
- `suno_download_batch` - Batch download multiple songs
- `suno_download_queue_add` - Add to download queue
- `suno_download_queue_status` - Get download queue status
- `suno_download_queue_start` - Start download queue processing
- `suno_download_queue_stop` - Stop download queue processing
- `suno_download_queue_clear` - Clear download queue

## Configuration

Edit `config.js` to modify:

- Port number (default 3456)
- Browser settings
- Timeout duration
- Batch delay (default 60 seconds)

## MCP Client Configuration

Compatible with Claude Desktop, Cursor, Windsurf, OpenAI Codex CLI and other MCP clients.

### Claude Desktop

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "suno-automation": {
      "command": "node",
      "args": ["your-actual-path/src/index.js"],
      "env": {}
    }
  }
}
```

### Cursor

Settings → MCP Servers or `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "suno-automation": {
      "command": "node",
      "args": ["your-actual-path/src/index.js"],
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
      "args": ["your-actual-path/src/index.js"],
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
      "args": ["your-actual-path/src/index.js"],
      "env": {}
    }
  }
}
```

### OpenClaw

OpenClaw uses its own plugin system and doesn't support standard MCP protocol configuration. Recommended to use **HTTP API mode** for integration.

#### Quick Start

**Step 1: Start HTTP Service**

```bash
cd /your-cloned-project-path/suno-automation-server
npm run start:http
# Service runs at http://localhost:3456
```

**Step 2: First Suno Login**

```bash
# Open browser for login
curl -X POST http://localhost:3456/login
```

Complete Suno login in the browser, login state will be automatically saved.

**Step 3: Verify Service Status**

```bash
curl http://localhost:3456/status
```

Response example:
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

#### API Details

##### 1. Generate Song

**Endpoint**: `POST /generate`

| Parameter | Type | Required | Description |
|------|------|------|------|
| lyrics | string | yes | Lyrics content, supports structure markers `[Verse]`, `[Chorus]` etc. |
| style | string | yes | Music style, multiple separated by commas, e.g. `pop, upbeat, electronic` |
| title | string | no | Song title |
| autoCreate | boolean | no | Whether to auto-click create button, default `true` |
| gender | string | no | Vocal gender: `male` or `female` |
| styleInfluence | number | no | Style influence 0-100, default 50 |
| weirdness | number | no | Creativity level 0-100, default 50 |
| instrumental | boolean | no | Whether instrumental only, default `false` |

```bash
curl -X POST http://localhost:3456/generate \
  -H "Content-Type: application/json" \
  -d '{
    "lyrics": "[Verse]\nBrightest star in the night sky\nCan you hear me\n[Chorus]\nI pray for a transparent heart",
    "style": "pop, ballad, emotional, piano",
    "title": "Brightest Star",
    "gender": "male",
    "autoCreate": true
  }'
```

Response example:
```json
{
  "success": true,
  "message": "Song generation started",
  "data": {
    "title": "Brightest Star",
    "style": "pop, ballad, emotional, piano"
  }
}
```

##### 2. Batch Generate Songs

Suitable for generating multiple songs at once, supports shared default configuration.

**Add to Queue**: `POST /batch/add`

```bash
curl -X POST http://localhost:3456/batch/add \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "lyrics": "[Verse]\nFirst song lyrics", "title": "Song One" },
      { "lyrics": "[Verse]\nSecond song lyrics", "title": "Song Two" },
      { "lyrics": "[Verse]\nThird song lyrics", "title": "Song Three", "style": "jazz, smooth" }
    ],
    "defaults": {
      "style": "pop, upbeat",
      "gender": "female",
      "autoCreate": true
    }
  }'
```

| Parameter | Description |
|------|------|
| items | Song array, each item requires `lyrics` (required), optional `title`, `style` (overrides default) |
| defaults | Shared default config, all songs will use unless individually overridden |

**View Queue Status**: `GET /batch/status`

```bash
curl http://localhost:3456/batch/status
```

Response example:
```json
{
  "success": true,
  "pending": 2,
  "completed": 1,
  "failed": 0,
  "total": 3,
  "running": true,
  "results": [
    { "title": "Song One", "success": true, "uuid": "xxx-xxx-xxx" }
  ]
}
```

**Start Batch Processing**: `POST /batch/start`

```bash
curl -X POST http://localhost:3456/batch/start \
  -H "Content-Type: application/json" \
  -d '{ "delaySeconds": 90 }'
```

| Parameter | Description |
|------|------|
| delaySeconds | Interval seconds between songs, default 60, range 5-300 |

**Stop Batch Processing**: `POST /batch/stop`

```bash
curl -X POST http://localhost:3456/batch/stop
```

**Clear Queue**: `POST /batch/clear`

```bash
curl -X POST http://localhost:3456/batch/clear
```

##### 3. Download Songs

After generation completes, you can download songs via UUID.

**Download Single Song**: `POST /download`

| Parameter | Type | Required | Description |
|------|------|------|------|
| uuid | string | yes | Song UUID (get from generation result or Suno page) |
| format | string | no | Audio format: `mp3` (free) or `wav` (requires subscription), default `mp3` |
| title | string | no | Filename title |
| outputDir | string | no | Output directory, default `downloads/` |
| includeImage | boolean | no | Whether to also download cover image, default `false` |

```bash
curl -X POST http://localhost:3456/download \
  -H "Content-Type: application/json" \
  -d '{
    "uuid": "abc123-def456-ghi789",
    "format": "mp3",
    "title": "My Song",
    "includeImage": true
  }'
```

Response example:
```json
{
  "success": true,
  "file": "/path/to/downloads/My Song.mp3",
  "image": "/path/to/downloads/My Song.png"
}
```

**Batch Download**: `POST /download/batch`

```bash
curl -X POST http://localhost:3456/download/batch \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "uuid": "uuid-1", "title": "Song A" },
      { "uuid": "uuid-2", "title": "Song B" }
    ],
    "format": "mp3",
    "concurrency": 3
  }'
```

| Parameter | Description |
|------|------|
| items | Song UUID array, each item requires `uuid`, optional `title` |
| concurrency | Concurrent downloads, default 3, max 10 |

**Using Download Queue** (background processing for large batch downloads):

```bash
# 1. Add to download queue
curl -X POST http://localhost:3456/download/queue/add \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "uuid": "uuid-1", "title": "Song A" },
      { "uuid": "uuid-2", "title": "Song B" }
    ],
    "format": "mp3"
  }'

# 2. Start download
curl -X POST http://localhost:3456/download/queue/start \
  -H "Content-Type: application/json" \
  -d '{ "concurrency": 3 }'

# 3. Check download progress
curl http://localhost:3456/download/queue/status

# 4. Stop download
curl -X POST http://localhost:3456/download/queue/stop
```

##### 4. Other Endpoints

| Endpoint | Method | Description |
|------|------|------|
| `/health` | GET | Health check |
| `/status` | GET | View login status and service status |
| `/login` | POST | Open login page |
| `/close` | POST | Close browser |

#### Complete Workflow Example

```bash
# 1. Start service
npm run start:http

# 2. First login (skip if already logged in)
curl -X POST http://localhost:3456/login

# 3. Batch add songs
curl -X POST http://localhost:3456/batch/add \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "lyrics": "[Verse]\nSpring breeze blows over the hills\nFlowers bloom everywhere", "title": "Spring Breeze" },
      { "lyrics": "[Verse]\nSummer beach\nSunlight on the sand", "title": "Summer Days" },
      { "lyrics": "[Verse]\nAutumn leaves fall with wind\nGold covers the path", "title": "Autumn Leaves" }
    ],
    "defaults": {
      "style": "pop, acoustic, guitar",
      "gender": "female"
    }
  }'

# 4. Start batch generation (90 seconds between each)
curl -X POST http://localhost:3456/batch/start \
  -H "Content-Type: application/json" \
  -d '{ "delaySeconds": 90 }'

# 5. Check progress
curl http://localhost:3456/batch/status

# 6. Download songs after generation completes (use returned UUIDs)
curl -X POST http://localhost:3456/download/batch \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "uuid": "generated-uuid-1", "title": "Spring Breeze" },
      { "uuid": "generated-uuid-2", "title": "Summer Days" },
      { "uuid": "generated-uuid-3", "title": "Autumn Leaves" }
    ],
    "format": "mp3",
    "includeImage": true
  }'
```

#### Common Style Reference

| Style Combination | Use Case |
|---------|---------|
| `pop, upbeat, electronic` | Pop dance |
| `ballad, emotional, piano` | Sentimental ballad |
| `rock, energetic, electric guitar` | Rock |
| `jazz, smooth, saxophone` | Jazz |
| `folk, acoustic, guitar` | Folk |
| `hip hop, rap, beat` | Hip hop/Rap |
| `classical, orchestral, strings` | Classical orchestral |
| `electronic, synth, ambient` | Electronic ambient |

#### Developing OpenClaw Plugins (Optional)

For deep integration with OpenClaw, you can develop a dedicated plugin:

1. Create `openclaw.plugin.json` configuration file
2. Define `configSchema` to describe plugin parameters
3. Call this project's HTTP API from the plugin

See [OpenClaw Plugin Documentation](https://docs.openclaw.ai/en-US/tools)

### Other MCP Clients (Goose, Continue, Zed, etc.)

For any MCP-compatible client, use the following configuration format:

```json
{
  "mcpServers": {
    "suno-automation": {
      "command": "node",
      "args": ["your-cloned-project-path/src/index.js"],
      "env": {},
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

**Note**: Replace the path in `args` with your actual installation directory.

You can also directly copy the content from `mcp-settings.json` in the project to your MCP client configuration.

## Directory Structure

```
suno-automation-server/
├── package.json
├── config.js
├── mcp-settings.json    # MCP config template
├── src/
│   ├── index.js           # Entry
│   ├── mcp-server.js      # MCP service
│   ├── http-server.js     # HTTP API
│   ├── browser.js         # Browser management
│   └── suno-automation.js # Core logic
└── browser-data/          # Login state storage
```