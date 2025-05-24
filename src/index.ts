import "dotenv/config";
import { textToTs } from "./tools/textToTs";

// コマンドライン引数からプロンプトを取得
const prompt = process.argv[2];

if (!prompt) {
  console.error("エラー: プロンプト（自然言語の説明）をコマンドライン引数で指定してください。");
  console.error("例: pnpm start \"配列の最大値を求める関数\"");
  process.exit(1);
}

(async () => {
  try {
    const { code } = await textToTs.execute({ input: { prompt } } as any);
    console.log("Generated TypeScript:\n" + code);
  } catch (err) {
    console.error("生成中にエラーが発生しました:", err);
    process.exit(1);
  }
})();
