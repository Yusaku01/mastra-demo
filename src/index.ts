import "dotenv/config";
import { textToTs } from "./tools/textToTs";

(async () => {
  // as any で型エラーを一時的に回避
  const { code } = await textToTs.execute({
    input: { prompt: "配列の最大値を求める関数" },
  } as any);
  console.log("Generated TypeScript:\n", code);
})();
