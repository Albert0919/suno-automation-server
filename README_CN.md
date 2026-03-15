# Suno Automation Server

[![English](https://img.shields.io/badge/English-English-blue?style=flat-square)](README.md)
[![中文](https://img.shields.io/badge/中文-Chinese-red?style=flat-square)](README_CN.md)
[![日本語](https://img.shields.io/badge/日本語-Japanese-green?style=flat-square)](README_JA.md)
[![한국어](https://img.shields.io/badge/한국어-Korean-yellow?style=flat-square)](README_KO.md)

本地自动化服务，用于 Suno AI 音乐生成。支持 MCP 和 HTTP API 两种模式。

---

## 一句话生成歌曲

**最简单的用法**：在 Claude Code 中，直接说：

```
帮我生成一首关于春天的流行歌曲
```

或者：

```
生成一首伤感抒情歌，歌词写失恋
```

Claude 会自动调用本工具，**自动生成歌曲并下载到 `downloads/` 文件夹**。

这就是你需要的全部！不需要记命令，不需要懂技术。

---

## 快速开始（3 步）

### 1. 安装

```bash
cd suno-automation-server
npm install
npx playwright install chromium
```

### 2. 配置 MCP（让 Claude Code 能调用）

把下面内容加到 `~/.claude/settings.json` 或项目根目录的 `.mcp.json`：

```json
{
  "mcpServers": {
    "suno-automation": {
      "command": "node",
      "args": ["这里填你实际的路径/src/index.js"]
    }
  }
}
```

**快速获取路径**：在项目目录下运行：

```bash
echo $(pwd)/src/index.js
```

把输出的路径填到 `args` 里即可。

### 3. 登录 Suno（首次）

```bash
npm run login
```

浏览器会打开，手动登录 Suno。登录状态会自动保存。

**完成！** 现在直接对 Claude 说你想生成什么歌就行了。

---

## 使用示例

直接对 Claude 说：

| 你说的话 | Claude 会做什么 |
|---------|---------------|
| "生成一首生日快乐歌" | 自动写歌词、选风格、生成并下载 |
| "帮我做一首摇滚风格的歌曲，主题是自由" | 生成摇滚风格的歌曲 |
| "写一首纯音乐，适合做背景音乐" | 生成纯音乐（无人声） |
| "批量生成 5 首不同风格的歌" | 自动生成多首并下载 |

---

## 批量生成歌曲

**批量生成多首歌**：直接对 Claude 说：

```
帮我批量生成 3 首歌：
1. 关于春天的流行歌
2. 关于夏天的摇滚歌
3. 关于秋天的民谣
```

或者：

```
生成 5 首不同情绪的抒情歌，主题分别是喜怒哀乐
```

Claude 会自动添加到队列、开始生成、并下载到 `downloads/` 文件夹。

---

## 批量生成并下载

**一次性完成生成和下载**：直接对 Claude 说：

```
帮我批量生成并下载 3 首歌：
1. 生日快乐歌，欢快流行风格
2. 毕业纪念歌，感伤民谣风格
3. 婚礼祝福歌，浪漫抒情风格
```

Claude 会：
1. 自动生成每首歌曲
2. 等待生成完成
3. 自动下载所有歌曲到 `downloads/` 文件夹

---

## 所有用法组合

| 用法 | 你说的话示例 | 说明 |
|-----|-------------|------|
| 单首生成 | "生成一首关于春天的歌" | 自动写词、选风格、生成 |
| 单首+下载 | "生成并下载一首生日歌" | 生成后自动下载 |
| 批量生成 | "批量生成 5 首不同风格的歌" | 自动队列生成 |
| 批量+下载 | "批量生成并下载 3 首歌" | 批量生成后自动下载 |
| 纯音乐 | "生成一首钢琴背景音乐" | 无歌词纯音乐 |
| 指定风格 | "生成一首摇滚风格的歌" | 指定音乐类型 |
| 指定人声 | "生成一首女声的抒情歌" | 男声/女声可选 |

---

## 常用音乐风格

直接说中文风格也行，Claude 会自动转换：

| 中文 | 英文 |
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

## 给非技术用户的详细说明

### 这个工具是什么？

这是一个帮助你**自动生成 AI 音乐**的小工具。它可以：
- 🎤 自动帮你填写歌词、选择音乐风格
- 🎼 一键生成歌曲
- 📥 自动下载生成的音乐文件
- 🔄 批量生成多首歌曲（比如一次性生成 10 首）

### 你需要准备什么？

1. **一台电脑**（Mac 或 Windows 都可以）
2. **安装 Node.js**（这是一个免费软件，去 nodejs.org 下载安装即可）
3. **一个 Suno 账号**（去 suno.com 注册，免费账号每月有 50 首歌的额度）

### 第一步：安装软件

打开"终端"（Mac 按 Command+空格，输入"终端"；Windows 按 Win+R，输入"cmd"），然后依次输入以下命令：

```
cd /你clone的项目路径/suno-automation-server
npm install
npx playwright install chromium
```

等待安装完成，可能需要几分钟。

### 第二步：登录 Suno 账号

在终端输入：

```
npm run login
```

这会自动打开浏览器，你手动登录你的 Suno 账号。登录成功后，关闭浏览器即可。以后都不用再登录了。

### 第三步：启动服务

在终端输入：

```
npm run start:http
```

看到 "Server running at http://127.0.0.1:3456" 就说明启动成功了。

**注意**：这个终端窗口要保持开着，不要关闭。

### 第四步：生成你的第一首歌

打开另一个终端窗口（或标签页），输入下面的命令来生成歌曲：

```
curl -X POST http://localhost:3456/generate \
  -H "Content-Type: application/json" \
  -d '{"lyrics": "[Verse]\n今天天气真好\n阳光明媚\n[Chorus]\n我们一起唱歌吧", "style": "pop, happy, upbeat", "title": "快乐的一天"}'
```

等待大约 1-2 分钟，歌曲就会自动生成！

### 命令解释（看不懂没关系，照抄就行）

上面的命令里：
- `"lyrics"` 后面是歌词，`\n` 表示换行，`[Verse]` 和 `[Chorus]` 是歌曲结构标记
- `"style"` 后面是音乐风格，用英文逗号分隔，比如 `pop` 流行、`rock` 摇滚、`jazz` 爵士
- `"title"` 后面是歌曲名称

### 常用音乐风格参考

| 中文风格 | 英文写法 |
|---------|---------|
| 流行 | pop |
| 抒情/慢歌 | ballad |
| 摇滚 | rock |
| 爵士 | jazz |
| 电子 | electronic |
| 民谣 | folk |
| 说唱 | hip hop, rap |
| 古风 | chinese traditional, guzheng |
| 钢琴伴奏 | piano, acoustic |
| 欢快 | upbeat, happy |
| 伤感 | sad, emotional |

### 批量生成多首歌曲

如果你有很多歌词想生成，可以用批量功能：

**第一步**：准备一个文本文件，按下面的格式写好所有歌曲：

```
[
  {"lyrics": "[Verse]\n第一首歌的歌词", "title": "歌名一"},
  {"lyrics": "[Verse]\n第二首歌的歌词", "title": "歌名二"},
  {"lyrics": "[Verse]\n第三首歌的歌词", "title": "歌名三"}
]
```

**第二步**：添加到队列：

```
curl -X POST http://localhost:3456/batch/add \
  -H "Content-Type: application/json" \
  -d '{"items": [{"lyrics": "[Verse]\n第一首歌歌词", "title": "歌一"}, {"lyrics": "[Verse]\n第二首歌歌词", "title": "歌二"}], "defaults": {"style": "pop, ballad"}}'
```

**第三步**：开始生成：

```
curl -X POST http://localhost:3456/batch/start
```

系统会自动一首一首生成，每首之间间隔约 60 秒。

### 下载生成的歌曲

歌曲生成后，你需要知道歌曲的 UUID（一个唯一的编号）才能下载。你可以在 Suno 网站的歌曲页面 URL 中找到它。

下载命令：

```
curl -X POST http://localhost:3456/download \
  -H "Content-Type: application/json" \
  -d '{"uuid": "你的歌曲UUID", "title": "歌曲名称"}'
```

下载的文件会保存在 `downloads` 文件夹里。

### 常见问题

**Q: 提示"端口被占用"怎么办？**
A: 说明服务已经在运行了，不需要再启动。直接用就行。

**Q: 生成失败怎么办？**
A: 检查一下是否登录了 Suno 账号，再检查一下账号是否有剩余额度。

**Q: 歌词里的特殊符号怎么写？**
A: 换行用 `\n`，双引号用 `\"`，其他符号正常写就行。

**Q: 可以生成纯音乐吗？**
A: 可以！在命令里加上 `"instrumental": true` 就行。

---

## 安装（技术用户）

```bash
cd suno-automation-server
npm install
npx playwright install chromium  # 首次需要安装浏览器
```

## 使用

### 1. 首次登录

```bash
npm run login
# 或
node src/index.js --login
```

会打开浏览器，手动登录 Suno。登录状态会自动保存到 `browser-data/` 目录。

### 2. 启动服务

**MCP 模式（默认，用于 Claude Code）：**

```bash
npm start
# 或
node src/index.js --mcp
```

**HTTP 模式（通用 API）：**

```bash
npm run start:http
# 或
node src/index.js --http
```

服务运行在 `http://localhost:3456`

## API

### HTTP API

#### 单首歌曲

| 端点 | 方法 | 说明 |
|------|------|------|
| `/generate` | POST | 生成歌曲 |
| `/status` | GET | 检查状态 |
| `/login` | POST | 打开登录页面 |
| `/close` | POST | 关闭浏览器 |
| `/health` | GET | 健康检查 |

**生成歌曲示例：**

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

#### 批量生成

| 端点 | 方法 | 说明 |
|------|------|------|
| `/batch/add` | POST | 添加歌曲到队列 |
| `/batch/status` | GET | 获取队列状态 |
| `/batch/start` | POST | 开始批量处理 |
| `/batch/stop` | POST | 停止批量处理 |
| `/batch/clear` | POST | 清空队列 |

**批量生成示例：**

```bash
# 1. 添加歌曲到队列
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

# 2. 开始批量处理（可选指定延迟秒数）
curl -X POST http://localhost:3456/batch/start \
  -H "Content-Type: application/json" \
  -d '{ "delaySeconds": 60 }'

# 3. 查看状态
curl http://localhost:3456/batch/status

# 4. 停止（可选）
curl -X POST http://localhost:3456/batch/stop

# 5. 清空队列（可选）
curl -X POST http://localhost:3456/batch/clear
```

#### 下载歌曲

| 端点 | 方法 | 说明 |
|------|------|------|
| `/download` | POST | 下载单首歌曲（通过UUID） |
| `/download/batch` | POST | 批量下载多首歌曲 |
| `/download/queue/add` | POST | 添加到下载队列 |
| `/download/queue/status` | GET | 获取下载队列状态 |
| `/download/queue/start` | POST | 开始下载队列处理 |
| `/download/queue/stop` | POST | 停止下载队列处理 |
| `/download/queue/clear` | POST | 清空下载队列 |

**下载单首歌曲：**

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

**批量下载：**

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

**使用下载队列：**

```bash
# 1. 添加到下载队列
curl -X POST http://localhost:3456/download/queue/add \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "uuid": "uuid-1", "title": "Song 1" },
      { "uuid": "uuid-2", "title": "Song 2" }
    ],
    "format": "mp3"
  }'

# 2. 开始下载
curl -X POST http://localhost:3456/download/queue/start \
  -H "Content-Type: application/json" \
  -d '{ "concurrency": 3 }'

# 3. 查看状态
curl http://localhost:3456/download/queue/status
```

### MCP Tools

Claude Code 可以直接调用以下工具：

#### 单首歌曲
- `suno_generate` - 生成歌曲（传入歌词、风格、标题）
- `suno_status` - 检查当前状态
- `suno_login` - 打开登录页面

#### 批量生成
- `suno_batch_add` - 添加多首歌曲到队列
- `suno_batch_status` - 获取队列状态
- `suno_batch_start` - 开始批量处理（可指定延迟秒数）
- `suno_batch_stop` - 停止批量处理
- `suno_batch_clear` - 清空队列

#### 下载歌曲
- `suno_download` - 下载单首歌曲（通过UUID）
- `suno_download_batch` - 批量下载多首歌曲
- `suno_download_queue_add` - 添加到下载队列
- `suno_download_queue_status` - 获取下载队列状态
- `suno_download_queue_start` - 开始下载队列处理
- `suno_download_queue_stop` - 停止下载队列处理
- `suno_download_queue_clear` - 清空下载队列

## 配置

编辑 `config.js` 修改：

- 端口号（默认 3456）
- 浏览器设置
- 超时时间
- 批量延迟（默认 60 秒）

## MCP 客户端配置

兼容 Claude Desktop、Cursor、Windsurf、OpenAI Codex CLI 等 MCP 客户端。

### Claude Desktop

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "suno-automation": {
      "command": "node",
      "args": ["这里填你的实际路径/src/index.js"],
      "env": {}
    }
  }
}
```

### Cursor

Settings → MCP Servers 或 `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "suno-automation": {
      "command": "node",
      "args": ["这里填你的实际路径/src/index.js"],
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
      "args": ["这里填你的实际路径/src/index.js"],
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
      "args": ["这里填你的实际路径/src/index.js"],
      "env": {}
    }
  }
}
```

### OpenClaw

OpenClaw 使用自己的插件系统，不支持标准的 MCP 协议配置。推荐使用 **HTTP API 模式** 进行集成。

#### 快速开始

**步骤 1：启动 HTTP 服务**

```bash
cd /你clone的项目路径/suno-automation-server
npm run start:http
# 服务运行在 http://localhost:3456
```

**步骤 2：首次登录 Suno**

```bash
# 打开浏览器进行登录
curl -X POST http://localhost:3456/login
```

在弹出的浏览器中完成 Suno 登录，登录状态会自动保存。

**步骤 3：验证服务状态**

```bash
curl http://localhost:3456/status
```

响应示例：
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

#### API 详细说明

##### 1. 生成歌曲

**端点**: `POST /generate`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| lyrics | string | 是 | 歌词内容，支持结构标记 `[Verse]`、`[Chorus]` 等 |
| style | string | 是 | 音乐风格，多个用逗号分隔，如 `pop, upbeat, electronic` |
| title | string | 否 | 歌曲标题 |
| autoCreate | boolean | 否 | 是否自动点击创建按钮，默认 `true` |
| gender | string | 否 | 人声性别：`male` 或 `female` |
| styleInfluence | number | 否 | 风格影响力 0-100，默认 50 |
| weirdness | number | 否 | 创意度 0-100，默认 50 |
| instrumental | boolean | 否 | 是否为纯音乐，默认 `false` |

```bash
curl -X POST http://localhost:3456/generate \
  -H "Content-Type: application/json" \
  -d '{
    "lyrics": "[Verse]\n夜空中最亮的星\n能否听清\n[Chorus]\n我祈祷拥有一颗透明的心灵",
    "style": "pop, ballad, emotional, piano",
    "title": "夜空中最亮的星",
    "gender": "male",
    "autoCreate": true
  }'
```

响应示例：
```json
{
  "success": true,
  "message": "Song generation started",
  "data": {
    "title": "夜空中最亮的星",
    "style": "pop, ballad, emotional, piano"
  }
}
```

##### 2. 批量生成歌曲

适用于一次生成多首歌曲，支持共享默认配置。

**添加到队列**: `POST /batch/add`

```bash
curl -X POST http://localhost:3456/batch/add \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "lyrics": "[Verse]\n第一首歌歌词", "title": "歌曲一" },
      { "lyrics": "[Verse]\n第二首歌歌词", "title": "歌曲二" },
      { "lyrics": "[Verse]\n第三首歌歌词", "title": "歌曲三", "style": "jazz, smooth" }
    ],
    "defaults": {
      "style": "pop, upbeat",
      "gender": "female",
      "autoCreate": true
    }
  }'
```

| 参数 | 说明 |
|------|------|
| items | 歌曲数组，每项需包含 `lyrics`（必填），可选 `title`、`style`（覆盖默认值） |
| defaults | 共享默认配置，所有歌曲都会使用，除非单独覆盖 |

**查看队列状态**: `GET /batch/status`

```bash
curl http://localhost:3456/batch/status
```

响应示例：
```json
{
  "success": true,
  "pending": 2,
  "completed": 1,
  "failed": 0,
  "total": 3,
  "running": true,
  "results": [
    { "title": "歌曲一", "success": true, "uuid": "xxx-xxx-xxx" }
  ]
}
```

**开始批量处理**: `POST /batch/start`

```bash
curl -X POST http://localhost:3456/batch/start \
  -H "Content-Type: application/json" \
  -d '{ "delaySeconds": 90 }'
```

| 参数 | 说明 |
|------|------|
| delaySeconds | 每首歌之间的间隔秒数，默认 60，范围 5-300 |

**停止批量处理**: `POST /batch/stop`

```bash
curl -X POST http://localhost:3456/batch/stop
```

**清空队列**: `POST /batch/clear`

```bash
curl -X POST http://localhost:3456/batch/clear
```

##### 3. 下载歌曲

生成完成后，可通过 UUID 下载歌曲。

**下载单首歌曲**: `POST /download`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| uuid | string | 是 | 歌曲 UUID（从生成结果或 Suno 页面获取） |
| format | string | 否 | 音频格式：`mp3`（免费）或 `wav`（需会员），默认 `mp3` |
| title | string | 否 | 文件名标题 |
| outputDir | string | 否 | 输出目录，默认 `downloads/` |
| includeImage | boolean | 否 | 是否同时下载封面图，默认 `false` |

```bash
curl -X POST http://localhost:3456/download \
  -H "Content-Type: application/json" \
  -d '{
    "uuid": "abc123-def456-ghi789",
    "format": "mp3",
    "title": "我的歌曲",
    "includeImage": true
  }'
```

响应示例：
```json
{
  "success": true,
  "file": "/path/to/downloads/我的歌曲.mp3",
  "image": "/path/to/downloads/我的歌曲.png"
}
```

**批量下载**: `POST /download/batch`

```bash
curl -X POST http://localhost:3456/download/batch \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "uuid": "uuid-1", "title": "歌曲A" },
      { "uuid": "uuid-2", "title": "歌曲B" }
    ],
    "format": "mp3",
    "concurrency": 3
  }'
```

| 参数 | 说明 |
|------|------|
| items | 歌曲 UUID 数组，每项需包含 `uuid`，可选 `title` |
| concurrency | 并发下载数，默认 3，最大 10 |

**使用下载队列**（后台处理大批量下载）：

```bash
# 1. 添加到下载队列
curl -X POST http://localhost:3456/download/queue/add \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "uuid": "uuid-1", "title": "歌曲A" },
      { "uuid": "uuid-2", "title": "歌曲B" }
    ],
    "format": "mp3"
  }'

# 2. 开始下载
curl -X POST http://localhost:3456/download/queue/start \
  -H "Content-Type: application/json" \
  -d '{ "concurrency": 3 }'

# 3. 查看下载进度
curl http://localhost:3456/download/queue/status

# 4. 停止下载
curl -X POST http://localhost:3456/download/queue/stop
```

##### 4. 其他端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/health` | GET | 健康检查 |
| `/status` | GET | 查看登录状态和服务状态 |
| `/login` | POST | 打开登录页面 |
| `/close` | POST | 关闭浏览器 |

#### 完整工作流程示例

```bash
# 1. 启动服务
npm run start:http

# 2. 首次登录（如已登录可跳过）
curl -X POST http://localhost:3456/login

# 3. 批量添加歌曲
curl -X POST http://localhost:3456/batch/add \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "lyrics": "[Verse]\n春风吹过山岗\n花儿竞相开放", "title": "春风" },
      { "lyrics": "[Verse]\n夏天的海边\n阳光洒满沙滩", "title": "夏日" },
      { "lyrics": "[Verse]\n秋叶随风飘落\n金黄铺满小路", "title": "秋叶" }
    ],
    "defaults": {
      "style": "pop, acoustic, guitar",
      "gender": "female"
    }
  }'

# 4. 开始批量生成（每首间隔 90 秒）
curl -X POST http://localhost:3456/batch/start \
  -H "Content-Type: application/json" \
  -d '{ "delaySeconds": 90 }'

# 5. 查看进度
curl http://localhost:3456/batch/status

# 6. 生成完成后下载歌曲（使用返回的 UUID）
curl -X POST http://localhost:3456/download/batch \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "uuid": "生成的uuid-1", "title": "春风" },
      { "uuid": "生成的uuid-2", "title": "夏日" },
      { "uuid": "生成的uuid-3", "title": "秋叶" }
    ],
    "format": "mp3",
    "includeImage": true
  }'
```

#### 常见风格参考

| 风格组合 | 适用场景 |
|---------|---------|
| `pop, upbeat, electronic` | 流行舞曲 |
| `ballad, emotional, piano` | 抒情慢歌 |
| `rock, energetic, electric guitar` | 摇滚 |
| `jazz, smooth, saxophone` | 爵士 |
| `folk, acoustic, guitar` | 民谣 |
| `hip hop, rap, beat` | 说唱 |
| `classical, orchestral, strings` | 古典管弦 |
| `electronic, synth, ambient` | 电子氛围 |

#### 开发 OpenClaw 插件（可选）

如需深度集成到 OpenClaw，可以开发专用插件：

1. 创建 `openclaw.plugin.json` 配置文件
2. 定义 `configSchema` 描述插件参数
3. 在插件中调用本项目的 HTTP API

详见 [OpenClaw 插件文档](https://docs.openclaw.ai/zh-CN/tools)

### 其他 MCP 客户端 (Goose, Continue, Zed 等)

对于任何支持 MCP 的客户端，使用以下配置格式：

```json
{
  "mcpServers": {
    "suno-automation": {
      "command": "node",
      "args": ["你clone的项目实际路径/src/index.js"],
      "env": {},
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

**注意**: 将 `args` 中的路径替换为你的实际安装目录。

也可以直接复制项目中的 `mcp-settings.json` 文件内容到你的 MCP 客户端配置中。

## 目录结构

```
suno-automation-server/
├── package.json
├── config.js
├── mcp-settings.json    # MCP 配置模板
├── src/
│   ├── index.js           # 入口
│   ├── mcp-server.js      # MCP 服务
│   ├── http-server.js     # HTTP API
│   ├── browser.js         # 浏览器管理
│   └── suno-automation.js # 核心逻辑
└── browser-data/          # 登录状态存储
```