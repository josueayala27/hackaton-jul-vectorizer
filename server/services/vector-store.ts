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
