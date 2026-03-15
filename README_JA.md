# Suno Automation Server

[English](README.md) | [中文](README_CN.md) | [日本語](README_JA.md) | [한국어](README_KO.md)

Suno AI 音楽生成用のローカル自動化サーバー。MCP と HTTP API の 2 つのモードに対応しています。

---

## 一言で楽曲を生成

**最も簡単な使い方**：Claude Code で、次のように言うだけ：

```
春をテーマにしたポップスを生成して
```

または：

```
失恋をテーマにした切ないバラードを生成して
```

Claude が自動的にこのツールを呼び出し、**自動的に楽曲を生成して `downloads/` フォルダにダウンロードします**。

これだけで OK！コマンドを覚える必要も、技術的な知識も不要です。

---

## クイックスタート（3ステップ）

### 1. インストール

```bash
cd suno-automation-server
npm install
npx playwright install chromium
```

### 2. MCP の設定（Claude Code から呼び出せるようにする）

以下の内容を `~/.claude/settings.json` またはプロジェクトルートの `.mcp.json` に追加：

```json
{
  "mcpServers": {
    "suno-automation": {
      "command": "node",
      "args": ["ここに実際のパス/src/index.js"]
    }
  }
}
```

**パスを素早く取得**：プロジェクトディレクトリで以下を実行：

```bash
echo $(pwd)/src/index.js
```

出力されたパスを `args` に入力してください。

### 3. Suno にログイン（初回のみ）

```bash
npm run login
```

ブラウザが開くので、手動で Suno にログインします。ログイン状態は自動的に保存されます。

**完了！** あとは Claude に生成したい楽曲を伝えるだけです。

---

## 使用例

Claude に直接伝えるだけ：

| あなたの言葉 | Claude がすること |
|---------|---------------|
| "誕生日おめでとうの歌を生成して" | 自動で歌詞を書き、スタイルを選択、生成してダウンロード |
| "自由をテーマにしたロック曲を作って" | ロックスタイルの楽曲を生成 |
| "BGM向けのインストゥルメンタル曲を書いて" | インストゥルメンタル（ボーカルなし）を生成 |
| "異なるスタイルの曲を5曲まとめて生成して" | 複数曲を自動生成してダウンロード |

---

## 楽曲の一括生成

**複数の楽曲を一括生成**：Claude に直接伝えるだけ：

```
3曲まとめて生成して：
1. 春をテーマにしたポップス
2. 夏をテーマにしたロック
3. 秋をテーマにしたフォーク
```

または：

```
喜・怒・哀・楽をテーマにした、異なる感情のバラードを5曲生成して
```

Claude が自動的にキューに追加、生成を開始、`downloads/` フォルダにダウンロードします。

---

## 一括生成＆ダウンロード

**生成とダウンロードを一気に完了**：Claude に直接伝えるだけ：

```
3曲まとめて生成してダウンロードして：
1. 誕生日おめでとうの歌、明るいポップススタイル
2. 卒業記念ソング、切ないフォークスタイル
3. 結婚式の祝福ソング、ロマンチックなバラードスタイル
```

Claude が：
1. 各楽曲を自動的に生成
2. 生成完了を待機
3. すべての楽曲を `downloads/` フォルダに自動ダウンロード

---

## すべての使い方

| 使い方 | あなたの言葉の例 | 説明 |
|-----|-------------|------|
| 単曲生成 | "春をテーマにした曲を生成して" | 自動で歌詞作成、スタイル選択、生成 |
| 単曲＋ダウンロード | "誕生日の歌を生成してダウンロードして" | 生成後、自動でダウンロード |
| 一括生成 | "異なるスタイルの曲を5曲まとめて生成して" | 自動でキューグループ生成 |
| 一括＋ダウンロード | "3曲まとめて生成してダウンロードして" | 一括生成後、自動でダウンロード |
| インストゥルメンタル | "ピアノのBGMを生成して" | 歌詞なしのインストゥルメンタル |
| スタイル指定 | "ロックスタイルの曲を生成して" | 音楽ジャンルを指定 |
| ボーカル指定 | "女性ボーカルのバラードを生成して" | 男性/女性を選択可能 |

---

## よく使う音楽スタイル

日本語でスタイルを言っても OK、Claude が自動的に変換します：

| 日本語 | 英語 |
|-----|------|
| ポップス/明るい | pop, upbeat |
| バラード/スローバラード | ballad, emotional, piano |
| ロック | rock, energetic |
| ジャズ | jazz, smooth |
| フォーク | folk, acoustic |
| ラップ | hip hop, rap |
| エレクトロ | electronic, synth |
| 和風 | chinese traditional, guzheng |

---

## 非技術ユーザー向けの詳細説明

### このツールとは？

これは**AI 音楽を自動生成**するのを助ける小さなツールです。以下のことができます：
- 🎤 歌詞の記入、音楽スタイルの選択を自動化
- 🎼 ワンクリックで楽曲生成
- 📥 生成された音楽ファイルを自動ダウンロード
- 🔄 複数の楽曲を一括生成（例：一度に 10 曲）

### 必要なものは？

1. **パソコン**（Mac でも Windows でも OK）
2. **Node.js のインストール**（無料ソフト、nodejs.org からダウンロードしてインストール）
3. **Suno アカウント**（suno.com で登録、無料アカウントは月 50 曲の枠あり）

### ステップ 1：ソフトウェアのインストール

「ターミナル」を開いて（Mac は Command+スペースで「ターミナル」、Windows は Win+R で「cmd」）、以下のコマンドを順に入力：

```
cd /あなたがcloneしたプロジェクトパス/suno-automation-server
npm install
npx playwright install chromium
```

インストール完了まで数分かかる場合があります。

### ステップ 2：Suno アカウントにログイン

ターミナルで以下を入力：

```
npm run login
```

ブラウザが自動的に開くので、手動で Suno アカウントにログインします。ログイン成功後、ブラウザを閉じるだけで OK。以降、ログインは不要です。

### ステップ 3：サービスの起動

ターミナルで以下を入力：

```
npm run start:http
```

"Server running at http://127.0.0.1:3456" と表示されたら起動成功です。

**注意**：このターミナルウィンドウは開いたままにしてください、閉じないでください。

### ステップ 4：最初の 1 曲を生成

別のターミナルウィンドウ（またはタブ）を開き、以下のコマンドで楽曲を生成：

```
curl -X POST http://localhost:3456/generate \
  -H "Content-Type: application/json" \
  -d '{"lyrics": "[Verse]\n今日はいい天気\n太陽が眩しい\n[Chorus]\n一緒に歌おう", "style": "pop, happy, upbeat", "title": "楽しい一日"}'
```

約 1〜2 分待つと、楽曲が自動的に生成されます！

### コマンドの解説（わからなくても OK、そのままコピーして使って）

上のコマンドで：
- `"lyrics"` の後ろが歌詞、`\n` は改行、`[Verse]` と `[Chorus]` は曲の構造マーク
- `"style"` の後ろが音楽スタイル、英語のカンマで区切る。例：`pop` ポップス、`rock` ロック、`jazz` ジャズ
- `"title"` の後ろが曲名

### よく使う音楽スタイル参考

| 日本語スタイル | 英語表記 |
|---------|---------|
| ポップス | pop |
| バラード/スローバラード | ballad |
| ロック | rock |
| ジャズ | jazz |
| エレクトロ | electronic |
| フォーク | folk |
| ラップ | hip hop, rap |
| 和風 | chinese traditional, guzheng |
| ピアノ伴奏 | piano, acoustic |
| 明るい | upbeat, happy |
| 切ない | sad, emotional |

### 複数の楽曲を一括生成

たくさんの歌詞を生成したい場合、一括機能が使えます：

**ステップ 1**：テキストファイルを用意し、以下のフォーマットですべての曲を書く：

```
[
  {"lyrics": "[Verse]\n1曲目の歌詞", "title": "曲名 1"},
  {"lyrics": "[Verse]\n2曲目の歌詞", "title": "曲名 2"},
  {"lyrics": "[Verse]\n3曲目の歌詞", "title": "曲名 3"}
]
```

**ステップ 2**：キューに追加：

```
curl -X POST http://localhost:3456/batch/add \
  -H "Content-Type: application/json" \
  -d '{"items": [{"lyrics": "[Verse]\n1曲目の歌詞", "title": "曲 1"}, {"lyrics": "[Verse]\n2曲目の歌詞", "title": "曲 2"}], "defaults": {"style": "pop, ballad"}}'
```

**ステップ 3**：生成開始：

```
curl -X POST http://localhost:3456/batch/start
```

システムが自動的に 1 曲ずつ生成します。各曲の間隔は約 60 秒です。

### 生成された楽曲をダウンロード

楽曲生成後、曲の UUID（一意の識別番号）を知る必要があります。Suno サイトの曲のページ URL で確認できます。

ダウンロードコマンド：

```
curl -X POST http://localhost:3456/download \
  -H "Content-Type: application/json" \
  -d '{"uuid": "あなたの曲のUUID", "title": "曲名"}'
```

ダウンロードしたファイルは `downloads` フォルダに保存されます。

### よくある質問

**Q: 「ポートが使用中」と表示されたら？**
A: サービスがすでに実行中です。再度起動する必要はありません。そのまま使ってください。

**Q: 生成に失敗したら？**
A: Suno アカウントにログインしているか確認し、アカウントに残り枠があるか確認してください。

**Q: 歌詞の中の特殊記号はどう書く？**
A: 改行は `\n`、ダブルクォートは `\"`、他の記号はそのまま書いて OK です。

**Q: インストゥルメンタルは生成できる？**
A: できます！コマンドに `"instrumental": true` を追加してください。

---

## インストール（技術ユーザー向け）

```bash
cd suno-automation-server
npm install
npx playwright install chromium  # 初回はブラウザのインストールが必要
```

## 使用方法

### 1. 初回ログイン

```bash
npm run login
# または
node src/index.js --login
```

ブラウザが開くので、手動で Suno にログインします。ログイン状態は `browser-data/` ディレクトリに自動保存されます。

### 2. サービスの起動

**MCP モード（デフォルト、Claude Code 用）：**

```bash
npm start
# または
node src/index.js --mcp
```

**HTTP モード（汎用 API）：**

```bash
npm run start:http
# または
node src/index.js --http
```

サービスは `http://localhost:3456` で実行されます。

## API

### HTTP API

#### 単曲

| エンドポイント | メソッド | 説明 |
|------|------|------|
| `/generate` | POST | 楽曲を生成 |
| `/status` | GET | ステータスを確認 |
| `/login` | POST | ログインページを開く |
| `/close` | POST | ブラウザを閉じる |
| `/health` | GET | ヘルスチェック |

**楽曲生成例：**

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

#### 一括生成

| エンドポイント | メソッド | 説明 |
|------|------|------|
| `/batch/add` | POST | 楽曲をキューに追加 |
| `/batch/status` | GET | キューの状態を取得 |
| `/batch/start` | POST | 一括処理を開始 |
| `/batch/stop` | POST | 一括処理を停止 |
| `/batch/clear` | POST | キューをクリア |

**一括生成例：**

```bash
# 1. 楽曲をキューに追加
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

# 2. 一括処理を開始（遅延秒数を指定可能）
curl -X POST http://localhost:3456/batch/start \
  -H "Content-Type: application/json" \
  -d '{ "delaySeconds": 60 }'

# 3. ステータスを確認
curl http://localhost:3456/batch/status

# 4. 停止（オプション）
curl -X POST http://localhost:3456/batch/stop

# 5. キューをクリア（オプション）
curl -X POST http://localhost:3456/batch/clear
```

#### 楽曲のダウンロード

| エンドポイント | メソッド | 説明 |
|------|------|------|
| `/download` | POST | 単曲をダウンロード（UUID 経由） |
| `/download/batch` | POST | 複数曲を一括ダウンロード |
| `/download/queue/add` | POST | ダウンロードキューに追加 |
| `/download/queue/status` | GET | ダウンロードキューの状態を取得 |
| `/download/queue/start` | POST | ダウンロードキューの処理を開始 |
| `/download/queue/stop` | POST | ダウンロードキューの処理を停止 |
| `/download/queue/clear` | POST | ダウンロードキューをクリア |

**単曲ダウンロード：**

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

**一括ダウンロード：**

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

**ダウンロードキューの使用：**

```bash
# 1. ダウンロードキューに追加
curl -X POST http://localhost:3456/download/queue/add \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "uuid": "uuid-1", "title": "Song 1" },
      { "uuid": "uuid-2", "title": "Song 2" }
    ],
    "format": "mp3"
  }'

# 2. ダウンロード開始
curl -X POST http://localhost:3456/download/queue/start \
  -H "Content-Type: application/json" \
  -d '{ "concurrency": 3 }'

# 3. ステータスを確認
curl http://localhost:3456/download/queue/status
```

### MCP Tools

Claude Code から直接以下のツールを呼び出せます：

#### 単曲
- `suno_generate` - 楽曲を生成（歌詞、スタイル、タイトルを渡す）
- `suno_status` - 現在の状態を確認
- `suno_login` - ログインページを開く

#### 一括生成
- `suno_batch_add` - 複数の楽曲をキューに追加
- `suno_batch_status` - キューの状態を取得
- `suno_batch_start` - 一括処理を開始（遅延秒数を指定可能）
- `suno_batch_stop` - 一括処理を停止
- `suno_batch_clear` - キューをクリア

#### 楽曲のダウンロード
- `suno_download` - 単曲をダウンロード（UUID 経由）
- `suno_download_batch` - 複数曲を一括ダウンロード
- `suno_download_queue_add` - ダウンロードキューに追加
- `suno_download_queue_status` - ダウンロードキューの状態を取得
- `suno_download_queue_start` - ダウンロードキューの処理を開始
- `suno_download_queue_stop` - ダウンロードキューの処理を停止
- `suno_download_queue_clear` - ダウンロードキューをクリア

## 設定

`config.js` を編集して変更：

- ポート番号（デフォルト 3456）
- ブラウザ設定
- タイムアウト時間
- 一括遅延（デフォルト 60 秒）

## MCP クライアント設定

Claude Desktop、Cursor、Windsurf、OpenAI Codex CLI などの MCP クライアントに対応。

### Claude Desktop

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "suno-automation": {
      "command": "node",
      "args": ["ここにあなたの実際のパス/src/index.js"],
      "env": {}
    }
  }
}
```

### Cursor

Settings → MCP Servers または `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "suno-automation": {
      "command": "node",
      "args": ["ここにあなたの実際のパス/src/index.js"],
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
      "args": ["ここにあなたの実際のパス/src/index.js"],
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
      "args": ["ここにあなたの実際のパス/src/index.js"],
      "env": {}
    }
  }
}
```

### OpenClaw

OpenClaw は独自のプラグインシステムを使用しており、標準的な MCP プロトコル設定には対応していません。**HTTP API モード**を使用した統合をお勧めします。

#### クイックスタート

**ステップ 1：HTTP サービスの起動**

```bash
cd /あなたがcloneしたプロジェクトパス/suno-automation-server
npm run start:http
# サービスは http://localhost:3456 で実行されます
```

**ステップ 2：Suno に初回ログイン**

```bash
# ブラウザを開いてログイン
curl -X POST http://localhost:3456/login
```

開いたブラウザで Suno のログインを完了すると、ログイン状態が自動的に保存されます。

**ステップ 3：サービス状態の確認**

```bash
curl http://localhost:3456/status
```

レスポンス例：
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

#### API 詳細説明

##### 1. 楽曲の生成

**エンドポイント**: `POST /generate`

| パラメータ | 型 | 必須 | 説明 |
|------|------|------|------|
| lyrics | string | はい | 歌詞内容。構造マーク `[Verse]`、`[Chorus]` などをサポート |
| style | string | はい | 音楽スタイル。複数はカンマ区切り。例：`pop, upbeat, electronic` |
| title | string | いいえ | 曲のタイトル |
| autoCreate | boolean | いいえ | 作成ボタンを自動でクリックするか。デフォルト `true` |
| gender | string | いいえ | ボーカルの性別：`male` または `female` |
| styleInfluence | number | いいえ | スタイルの影響度 0-100、デフォルト 50 |
| weirdness | number | いいえ | クリエイティビティ 0-100、デフォルト 50 |
| instrumental | boolean | いいえ | インストゥルメンタルかどうか、デフォルト `false` |

```bash
curl -X POST http://localhost:3456/generate \
  -H "Content-Type: application/json" \
  -d '{
    "lyrics": "[Verse]\n夜空で一番明るい星\n聞こえるかな\n[Chorus]\n透き通った心を持ちたいと願っている",
    "style": "pop, ballad, emotional, piano",
    "title": "夜空で一番明るい星",
    "gender": "male",
    "autoCreate": true
  }'
```

レスポンス例：
```json
{
  "success": true,
  "message": "Song generation started",
  "data": {
    "title": "夜空で一番明るい星",
    "style": "pop, ballad, emotional, piano"
  }
}
```

##### 2. 楽曲の一括生成

一度に複数の楽曲を生成する場合、共有デフォルト設定をサポートします。

**キューに追加**: `POST /batch/add`

```bash
curl -X POST http://localhost:3456/batch/add \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "lyrics": "[Verse]\n1曲目の歌詞", "title": "曲 1" },
      { "lyrics": "[Verse]\n2曲目の歌詞", "title": "曲 2" },
      { "lyrics": "[Verse]\n3曲目の歌詞", "title": "曲 3", "style": "jazz, smooth" }
    ],
    "defaults": {
      "style": "pop, upbeat",
      "gender": "female",
      "autoCreate": true
    }
  }'
```

| パラメータ | 説明 |
|------|------|
| items | 楽曲の配列。各項目に `lyrics`（必須）、オプションで `title`、`style`（デフォルト値を上書き）を含む |
| defaults | 共有デフォルト設定。すべての曲に適用（個別に上書きされない限り） |

**キューの状態を確認**: `GET /batch/status`

```bash
curl http://localhost:3456/batch/status
```

レスポンス例：
```json
{
  "success": true,
  "pending": 2,
  "completed": 1,
  "failed": 0,
  "total": 3,
  "running": true,
  "results": [
    { "title": "曲 1", "success": true, "uuid": "xxx-xxx-xxx" }
  ]
}
```

**一括処理を開始**: `POST /batch/start`

```bash
curl -X POST http://localhost:3456/batch/start \
  -H "Content-Type: application/json" \
  -d '{ "delaySeconds": 90 }'
```

| パラメータ | 説明 |
|------|------|
| delaySeconds | 各曲の間隔秒数。デフォルト 60、範囲 5-300 |

**一括処理を停止**: `POST /batch/stop`

```bash
curl -X POST http://localhost:3456/batch/stop
```

**キューをクリア**: `POST /batch/clear`

```bash
curl -X POST http://localhost:3456/batch/clear
```

##### 3. 楽曲のダウンロード

生成完了後、UUID 経由で楽曲をダウンロードできます。

**単曲ダウンロード**: `POST /download`

| パラメータ | 型 | 必須 | 説明 |
|------|------|------|------|
| uuid | string | はい | 曲の UUID（生成結果または Suno ページから取得） |
| format | string | いいえ | 音声フォーマット：`mp3`（無料）または `wav`（要会員）、デフォルト `mp3` |
| title | string | いいえ | ファイル名のタイトル |
| outputDir | string | いいえ | 出力ディレクトリ、デフォルト `downloads/` |
| includeImage | boolean | いいえ | カバー画像も同時にダウンロードするか、デフォルト `false` |

```bash
curl -X POST http://localhost:3456/download \
  -H "Content-Type: application/json" \
  -d '{
    "uuid": "abc123-def456-ghi789",
    "format": "mp3",
    "title": "私の曲",
    "includeImage": true
  }'
```

レスポンス例：
```json
{
  "success": true,
  "file": "/path/to/downloads/私の曲.mp3",
  "image": "/path/to/downloads/私の曲.png"
}
```

**一括ダウンロード**: `POST /download/batch`

```bash
curl -X POST http://localhost:3456/download/batch \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "uuid": "uuid-1", "title": "曲 A" },
      { "uuid": "uuid-2", "title": "曲 B" }
    ],
    "format": "mp3",
    "concurrency": 3
  }'
```

| パラメータ | 説明 |
|------|------|
| items | 曲の UUID 配列。各項目に `uuid` が必須、`title` はオプション |
| concurrency | 同時ダウンロード数、デフォルト 3、最大 10 |

**ダウンロードキューを使用**（大量ダウンロードをバックグラウンドで処理）：

```bash
# 1. ダウンロードキューに追加
curl -X POST http://localhost:3456/download/queue/add \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "uuid": "uuid-1", "title": "曲 A" },
      { "uuid": "uuid-2", "title": "曲 B" }
    ],
    "format": "mp3"
  }'

# 2. ダウンロード開始
curl -X POST http://localhost:3456/download/queue/start \
  -H "Content-Type: application/json" \
  -d '{ "concurrency": 3 }'

# 3. ダウンロード進捗を確認
curl http://localhost:3456/download/queue/status

# 4. ダウンロード停止
curl -X POST http://localhost:3456/download/queue/stop
```

##### 4. その他のエンドポイント

| エンドポイント | メソッド | 説明 |
|------|------|------|
| `/health` | GET | ヘルスチェック |
| `/status` | GET | ログイン状態とサービス状態を確認 |
| `/login` | POST | ログインページを開く |
| `/close` | POST | ブラウザを閉じる |

#### 完全なワークフロー例

```bash
# 1. サービス起動
npm run start:http

# 2. 初回ログイン（既にログイン済みならスキップ可）
curl -X POST http://localhost:3456/login

# 3. 楽曲を一括追加
curl -X POST http://localhost:3456/batch/add \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "lyrics": "[Verse]\n春風が丘を吹き抜け\n花が競って咲く", "title": "春風" },
      { "lyrics": "[Verse]\n夏の海辺\n日差しが砂浜に降り注ぐ", "title": "夏日" },
      { "lyrics": "[Verse]\n秋の葉が風に舞い\n金色が道を覆う", "title": "秋葉" }
    ],
    "defaults": {
      "style": "pop, acoustic, guitar",
      "gender": "female"
    }
  }'

# 4. 一括生成開始（各曲 90 秒間隔）
curl -X POST http://localhost:3456/batch/start \
  -H "Content-Type: application/json" \
  -d '{ "delaySeconds": 90 }'

# 5. 進捗確認
curl http://localhost:3456/batch/status

# 6. 生成完了後、楽曲をダウンロード（返された UUID を使用）
curl -X POST http://localhost:3456/download/batch \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      { "uuid": "生成されたuuid-1", "title": "春風" },
      { "uuid": "生成されたuuid-2", "title": "夏日" },
      { "uuid": "生成されたuuid-3", "title": "秋葉" }
    ],
    "format": "mp3",
    "includeImage": true
  }'
```

#### よく使うスタイル参考

| スタイルの組み合わせ | 適用シーン |
|---------|---------|
| `pop, upbeat, electronic` | ダンスポップ |
| `ballad, emotional, piano` | スローバラード |
| `rock, energetic, electric guitar` | ロック |
| `jazz, smooth, saxophone` | ジャズ |
| `folk, acoustic, guitar` | フォーク |
| `hip hop, rap, beat` | ラップ |
| `classical, orchestral, strings` | クラシックオーケストラ |
| `electronic, synth, ambient` | エレクトロニックアンビエント |

#### OpenClaw プラグインの開発（オプション）

OpenClaw に深く統合したい場合、専用プラグインを開発できます：

1. `openclaw.plugin.json` 設定ファイルを作成
2. `configSchema` でプラグインパラメータを定義
3. プラグイン内から本プロジェクトの HTTP API を呼び出し

詳細は [OpenClaw プラグインドキュメント](https://docs.openclaw.ai/zh-CN/tools) を参照

### その他の MCP クライアント (Goose, Continue, Zed など)

MCP 対応のクライアントなら、以下の設定フォーマットを使用：

```json
{
  "mcpServers": {
    "suno-automation": {
      "command": "node",
      "args": ["あなたがcloneしたプロジェクトの実際のパス/src/index.js"],
      "env": {},
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

**注意**: `args` のパスを実際のインストールディレクトリに置き換えてください。

プロジェクト内の `mcp-settings.json` ファイルの内容を MCP クライアントの設定に直接コピーすることもできます。

## ディレクトリ構成

```
suno-automation-server/
├── package.json
├── config.js
├── mcp-settings.json    # MCP 設定テンプレート
├── src/
│   ├── index.js           # エントリーポイント
│   ├── mcp-server.js      # MCP サービス
│   ├── http-server.js     # HTTP API
│   ├── browser.js         # ブラウザ管理
│   └── suno-automation.js # コアロジック
└── browser-data/          # ログイン状態の保存
```