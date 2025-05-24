import { createTool } from "@mastra/core";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const textToTs = createTool({
  id: "text-to-ts",
  description: "Convert natural language instructions into TypeScript code",
  inputSchema: z.object({
    prompt: z
      .string()
      .describe("Natural language description of desired TypeScript code"),
  }),
  outputSchema: z.object({
    code: z.string().describe("Generated TypeScript code"),
  }),
  execute: async ({ input }) => {
    const { prompt } = input;

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
