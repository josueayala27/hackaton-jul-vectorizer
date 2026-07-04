import OpenAI from "openai";
import process from "node:process";

export async function embedText(text: string): Promise<number[]> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const embedding = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });

  console.log(embedding);

  return embedding.data[0].embedding;
}
