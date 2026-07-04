const OPENAI_EMBEDDINGS_URL = "https://api.openai.com/v1/embeddings";
const EMBEDDING_MODEL = "text-embedding-3-small";

export async function embedText(text: string): Promise<number[]> {
  const response = await fetch(OPENAI_EMBEDDINGS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI embeddings request failed: ${response.status}`);
  }

  const body = (await response.json()) as {
    data: { embedding: number[] }[];
  };

  return body.data[0].embedding;
}
