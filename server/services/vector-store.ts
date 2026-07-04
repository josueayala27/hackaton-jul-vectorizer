import { Index } from "@upstash/vector";

let index: Index | undefined;

function getIndex(): Index {
  if (!index) {
    index = new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN,
    });
  }
  return index;
}

export async function upsertVector(
  id: string,
  vector: number[],
  metadata: Record<string, unknown>
): Promise<void> {
  await getIndex().upsert({ id, vector, metadata });
}

export interface VectorQueryResult {
  id: string;
  score: number;
  metadata?: Record<string, unknown>;
}

export async function queryVector(
  vector: number[],
  topK: number
): Promise<VectorQueryResult[]> {
  const results = await getIndex().query({
    vector,
    topK,
    includeMetadata: true,
  });

  return results.map((result) => ({
    id: String(result.id),
    score: result.score,
    metadata: result.metadata as Record<string, unknown> | undefined,
  }));
}
