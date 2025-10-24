# Vercel デプロイメントガイド

このドキュメントでは、MastraアプリケーションをVercelにデプロイし、Basic認証で保護する方法を説明します。

## 📋 前提条件

- [Vercel](https://vercel.com/) アカウント
- [OpenAI API キー](https://platform.openai.com/api-keys)
- Node.js 20.9.0 以上
- pnpm パッケージマネージャー

## 🔐 Basic認証について

このプロジェクトには、Vercelデプロイメントを不正アクセスから保護するためのBasic認証が実装されています。

### なぜ認証が必要か？

1. **OpenAI APIキーの保護** - 誰でもアクセスできる状態だと、あなたのAPIクレジットが消費されます
2. **ボット攻撃の防止** - 自動化された攻撃から保護します
3. **データの機密性** - Observabilityデータやリクエスト/レスポンスを保護します

## 🚀 デプロイ手順

### 1. リポジトリをVercelにインポート

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. "Add New Project" をクリック
3. GitHubリポジトリを選択してインポート

### 2. 環境変数を設定

Vercelのプロジェクト設定で、以下の環境変数を設定してください：

#### 必須の環境変数

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `OPENAI_API_KEY` | OpenAI APIキー | `sk-proj-...` |
| `BASIC_AUTH_USER` | Basic認証のユーザー名 | `admin` |
| `BASIC_AUTH_PASSWORD` | Basic認証のパスワード | `secure-password-123` |

#### 設定方法

1. Vercel Dashboard でプロジェクトを選択
2. "Settings" タブに移動
3. "Environment Variables" セクションを開く
4. 上記の変数を追加
   - **Environment**: `Production`, `Preview`, `Development` すべてにチェック
   - **Value**: 実際の値を入力

#### 🔒 セキュリティのベストプラクティス

- **強力なパスワードを使用**: 最低12文字以上、英数字と記号を組み合わせる
- **定期的な変更**: パスワードを定期的に更新する
- **共有しない**: 認証情報を公開リポジトリやSlackなどに投稿しない
- **環境ごとに分ける**: Production と Preview で異なる認証情報を使用する

### 3. デプロイを実行

環境変数を設定したら、"Deploy" ボタンをクリックしてデプロイを開始します。

Mastraのビルドプロセスが自動的に実行され、数分でデプロイが完了します。

## 🧪 デプロイ後の確認

### Basic認証のテスト

デプロイが完了したら、以下の方法で認証をテストできます：

#### 1. ブラウザでアクセス

1. デプロイされたURLにアクセス
2. Basic認証のダイアログが表示される
3. 設定したユーザー名とパスワードを入力
4. 認証が成功すると、アプリケーションにアクセスできる

#### 2. curlコマンドでテスト

```bash
# 認証なし（401 Unauthorized が返される）
curl https://your-deployment.vercel.app/api/agents

# 認証あり
curl -u admin:your-password https://your-deployment.vercel.app/api/agents
```

#### 3. Postmanでテスト

1. Postmanで新しいリクエストを作成
2. "Authorization" タブを選択
3. Type: "Basic Auth" を選択
4. Username と Password を入力
5. リクエストを送信

## 📁 プロジェクト構成

```
mastra-demo/
├── api/
│   └── auth-middleware.ts    # Basic認証のミドルウェア実装
├── src/
│   └── mastra/
│       ├── index.ts           # Mastra設定
│       ├── agents/            # AIエージェント
│       ├── workflows/         # ワークフロー定義
│       ├── tools/             # カスタムツール
│       └── scorers/           # 評価スコアラー
├── .env.example               # 環境変数のテンプレート
├── vercel.json                # Vercel設定
└── package.json
```

## 🛠️ ローカル開発

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 環境変数の設定

```bash
# .env.example をコピー
cp .env.example .env

# .env ファイルを編集して、実際の値を設定
```

### 3. 開発サーバーの起動

```bash
pnpm dev
```

**注意**: ローカル開発では、Basic認証は無効化されます（環境変数が未設定の場合）。

## 🔧 カスタマイズ

### 認証を特定のルートのみに適用

`api/auth-middleware.ts` の `withBasicAuth` 関数を使って、特定のエンドポイントのみを保護できます：

```typescript
import { withBasicAuth } from './api/auth-middleware';

// 保護されたエンドポイント
export default withBasicAuth(async (req, res) => {
  res.json({ data: 'Protected data' });
});
```

### vercel.json のカスタマイズ

`vercel.json` を編集して、以下をカスタマイズできます：

- ビルドコマンド
- 環境変数の説明
- セキュリティヘッダー
- ルーティング設定

## 🐛 トラブルシューティング

### デプロイが失敗する

- **環境変数が未設定**: すべての必須環境変数が設定されているか確認
- **ビルドエラー**: ログを確認して、依存関係の問題がないか確認

### 認証が動作しない

- **環境変数の確認**: Vercel Dashboard で環境変数が正しく設定されているか確認
- **再デプロイ**: 環境変数を変更したら、再デプロイが必要

### OpenAI APIエラー

- **APIキーの確認**: OpenAI APIキーが有効で、クレジットが残っているか確認
- **レート制限**: OpenAIのレート制限に達していないか確認

## 📚 参考リンク

- [Mastra Documentation](https://mastra.ai/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## 🤝 サポート

問題が発生した場合は、以下を確認してください：

1. Vercelのデプロイログ
2. ブラウザのコンソールログ
3. 環境変数の設定

それでも解決しない場合は、Issueを作成してください。
