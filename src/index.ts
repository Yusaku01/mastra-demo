import "dotenv/config"; // .env ファイルを読み込むために追加
import { textToTs } from "./tools/textToTs";

// コマンドライン引数からプロンプトを取得
const prompt = process.argv[2];

if (!prompt) {
  console.error("エラー: プロンプト（自然言語の説明）をコマンドライン引数で指定してください。");
  console.error("例: pnpm start \"配列の最大値を求める関数\"");
  process.exit(1);
}

async function main() {
  try {
    const executionInput = { input: { prompt } };

    // CLIからの直接実行のため、as any を使用
    const result = await textToTs.execute(executionInput as any);

    if (result && result.code) {
      console.log("Generated TypeScript code:");
      console.log(result.code);
    } else {
      console.error("Failed to generate TypeScript code. No result or code property found.");
    }
  } catch (error) {
    console.error("Error generating TypeScript code:", error);
    process.exit(1);
  }
}

main();
