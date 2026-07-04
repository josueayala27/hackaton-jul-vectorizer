import { Search } from "@upstash/search";

let client: Search | undefined;

function getClient(): Search {
  if (!client) {
    client = new Search({
      url: process.env.UPSTASH_SEARCH_REST_URL,
      token: process.env.UPSTASH_SEARCH_REST_TOKEN,
    });
  }
  return client;
}

export async function upsertDocument(
  indexName: string,
  id: string,
  content: Record<string, unknown>,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const index = getClient().index(indexName);
  await index.upsert([{ id, content, metadata }]);
}

export interface SearchDocResult {
  id: string;
  score: number;
  content: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export async function searchDocuments(
  indexName: string,
  query: string,
  limit: number,
  filter?: string,
): Promise<SearchDocResult[]> {
  const index = getClient().index(indexName);
  const results = await index.search({ query, limit, filter });

  return results.map((result) => ({
    id: String(result.id),
    score: result.score,
    content: result.content as Record<string, unknown>,
    metadata: result.metadata as Record<string, unknown> | undefined,
  }));
}
