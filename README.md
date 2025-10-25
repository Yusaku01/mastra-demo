# Mastra Weather Agent Demo

このプロジェクトは、[Mastraフレームワーク](https://mastra.ai/)を使用したAIエージェントのデモアプリケーションです。天気情報を取得し、その天気に基づいたアクティビティを提案します。

## 🌟 主な機能

- **Weather Agent**: GPT-4o-miniを使用したインテリジェントな天気アシスタント
- **Weather Tool**: Open-Meteo APIを使用したリアルタイム天気データ取得
- **Weather Workflow**: 天気取得とアクティビティ提案の2ステップワークフロー
- **AI評価スコアラー**: レスポンス品質を自動評価
- **Vercel デプロイ対応**: ワンクリックでVercelにデプロイ可能
- **Basic認証**: デプロイメントを保護するセキュリティ機能

## 🏗️ プロジェクト構成

```
src/mastra/
├── index.ts              # Mastraインスタンス設定
├── agents/
│   └── weather-agent.ts  # 天気アシスタントエージェント
├── workflows/
│   └── weather-workflow.ts  # 天気ワークフロー定義
├── tools/
│   └── weather-tool.ts   # 天気データ取得ツール
└── scorers/
    └── weather-scorer.ts # AI評価スコアラー
```

## 🚀 クイックスタート

### 前提条件

- Node.js 20.9.0 以上
- pnpm パッケージマネージャー
- OpenAI APIキー

### インストール

```bash
# 依存関係のインストール
pnpm install

# 環境変数の設定
cp .env.example .env
# .env ファイルを編集して、OPENAI_API_KEYを設定
```

### 開発サーバーの起動

```bash
pnpm dev
```

### ビルド

```bash
pnpm build
```

### プロダクション実行

```bash
pnpm start
```

## 📦 使用技術

- **[Mastra](https://mastra.ai/)** - AIエージェントフレームワーク
- **[OpenAI GPT-4o-mini](https://openai.com/)** - 言語モデル
- **[Open-Meteo API](https://open-meteo.com/)** - 天気データAPI
- **TypeScript** - 型安全な開発
- **Vercel** - デプロイメントプラットフォーム

## 🔐 Vercelへのデプロイ

このプロジェクトにはBasic認証が実装されており、Vercelにデプロイすると全エンドポイントが保護されます。

デプロイの要点:

1. 環境変数をVercelのProject Settingsで設定する
   - `OPENAI_API_KEY`
   - `BASIC_AUTH_USER`（例: dev=mastra-demo-dev / stg=mastra-demo-stg / prod=mastra-demo-pro）
   - `BASIC_AUTH_PASSWORD`（例: @fnileak;c）
2. vercel.json のコマンドは pnpm に統一済み（install/build/dev）。
3. デプロイ後、認証を確認する
   - 認証なし: `curl -i https://<your-app>.vercel.app/api/agents` → 401
   - 認証あり: `curl -u <user>:'<pass>' https://<your-app>.vercel.app/api/agents` → 200

## 🛠️ 開発

### 環境変数

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `OPENAI_API_KEY` | OpenAI APIキー | ✅ |
| `BASIC_AUTH_USER` | Basic認証のユーザー名 | ⚠️ (本番環境) |
| `BASIC_AUTH_PASSWORD` | Basic認証のパスワード | ⚠️ (本番環境) |

### スクリプト

- `pnpm dev` - 開発サーバー起動
- `pnpm build` - プロダクションビルド
- `pnpm start` - プロダクション実行

## 📝 API エンドポイント

Mastraは自動的に以下のエンドポイントを生成します：

- `/api/agents/weatherAgent` - Weather Agentエンドポイント
- `/api/workflows/weatherWorkflow` - Weather Workflowエンドポイント
- `/api/tools/weatherTool` - Weather Toolエンドポイント

**注意**: すべてのエンドポイントはBasic認証で保護されています（Vercelデプロイ時）。

## 🧪 Weather Agent の使い方

### 例: 天気を尋ねる

```bash
curl -X POST https://your-deployment.vercel.app/api/agents/weatherAgent \
  -u admin:your-password \
  -H "Content-Type: application/json" \
  -d '{
    "message": "東京の天気を教えて"
  }'
```

### 例: Weather Workflowを実行

```bash
curl -X POST https://your-deployment.vercel.app/api/workflows/weatherWorkflow \
  -u admin:your-password \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Tokyo"
  }'
```

## 🔧 カスタマイズ

### 新しいツールを追加

```typescript
// src/mastra/tools/your-tool.ts
import { z } from 'zod';
import { ToolApi } from '@mastra/core';

export const yourTool = new ToolApi({
  id: 'your-tool',
  description: 'Your tool description',
  inputSchema: z.object({
    // Define your input schema
  }),
  execute: async ({ context }) => {
    // Implement your tool logic
  },
});
```

### 新しいエージェントを追加

```typescript
// src/mastra/agents/your-agent.ts
import { Agent } from '@mastra/core';

export const yourAgent = new Agent({
  name: 'Your Agent',
  model: {
    provider: 'openai',
    name: 'gpt-4o-mini',
  },
  instructions: 'Your agent instructions',
  // Add tools as needed
});
```

## 📚 参考資料

- [Mastra Documentation](https://mastra.ai/docs)
- [Mastra GitHub](https://github.com/mastra-ai/mastra)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

## 🤝 貢献

プルリクエストを歓迎します！大きな変更を加える場合は、まずIssueを開いて変更内容を議論してください。

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🆘 サポート

問題が発生した場合は、以下を確認してください：

1. [Mastra Docs](https://mastra.ai/docs)
2. [Vercel Docs](https://vercel.com/docs)
3. Issue - 問題を報告

---

Made with [Mastra](https://mastra.ai/) 🚀
