// src/tools/textToTs.ts
import { createTool, ToolExecutionContext } from "@mastra/core"; 
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const textToTsInputSchema = z.object({
  prompt: z
    .string()
    .describe("Natural language description of desired TypeScript code"),
});
// inputSchemaから型を推論
type TextToTsInput = z.infer<typeof textToTsInputSchema>;

// ToolExecutionContextを拡張してinputプロパティを明示的に定義
interface MyTextToTsExecutionContext extends ToolExecutionContext<typeof textToTsInputSchema> {
  input: z.infer<typeof textToTsInputSchema>;
}

export const textToTs = createTool({
  id: "text-to-ts",
  description: "Convert natural language instructions into TypeScript code",
  inputSchema: textToTsInputSchema,
  outputSchema: z.object({
    code: z.string().describe("Generated TypeScript code"),
  }),
  // execute 関数のシグネチャをMastraの期待に合わせる
  execute: async (context: ToolExecutionContext<typeof textToTsInputSchema>) => {
    // contextを拡張インターフェースにアサート
    const ctx = context as MyTextToTsExecutionContext;
    const { prompt } = ctx.input;

    const system =
      "You are an expert TypeScript developer. Return only valid TypeScript code, no markdown fences, no explanations.";

    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });

    const code = chat.choices[0]?.message.content?.trim() || "";

    return { code };
  },
});
