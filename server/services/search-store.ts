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

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
}

function normalizeMetadata(
  metadata?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (!metadata || typeof metadata.engagement !== "object" || metadata.engagement === null) {
    return metadata;
  }

  const engagement = Object.fromEntries(
    Object.entries(metadata.engagement as Record<string, unknown>).map(([key, value]) => [
      key,
      toNumber(value),
    ]),
  );

  return { ...metadata, engagement };
}

export async function upsertDocument(
  indexName: string,
  id: string,
  content: Record<string, unknown>,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const index = getClient().index(indexName);
  await index.upsert([{ id, content, metadata: normalizeMetadata(metadata) }]);
}

export interface SearchDocResult {
  id: string;
  score: number;
  content: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface SearchOptions {
  filter?: string;
  reranking?: boolean;
  semanticWeight?: number;
  boostEngagement?: boolean;
}

const ENGAGEMENT_WEIGHT = 0.25;

function engagementRawScore(metadata?: Record<string, unknown>): number {
  const engagement = metadata?.engagement as Record<string, unknown> | undefined;
  if (!engagement) return 0;

  const likes = toNumber(engagement.likes);
  const shares = toNumber(engagement.shares);
  const bookmarks = toNumber(engagement.bookmarks);
  const comments = toNumber(engagement.comments);

  return likes + 2 * shares + 3 * bookmarks + comments;
}

function boostByEngagement(results: SearchDocResult[]): SearchDocResult[] {
  const rawScores = results.map((result) => engagementRawScore(result.metadata));
  const maxRawScore = Math.max(...rawScores, 0);

  return results
    .map((result, i) => {
      const engagementNorm =
        maxRawScore > 0 ? Math.log10(rawScores[i] + 1) / Math.log10(maxRawScore + 1) : 0;
      const score = (1 - ENGAGEMENT_WEIGHT) * result.score + ENGAGEMENT_WEIGHT * engagementNorm;
      return { ...result, score };
    })
    .sort((a, b) => b.score - a.score);
}

function stripTranscript(content: Record<string, unknown>): Record<string, unknown> {
  if (!("transcript" in content)) return content;
  const { transcript: _transcript, ...rest } = content;
  return rest;
}

export async function searchDocuments(
  indexName: string,
  query: string,
  limit: number,
  options: SearchOptions = {},
): Promise<SearchDocResult[]> {
  const { filter, reranking, semanticWeight, boostEngagement = true } = options;
  const index = getClient().index(indexName);
  const results = await index.search({ query, limit, filter, reranking, semanticWeight });

  const mapped = results.map((result) => ({
    id: String(result.id),
    score: result.score,
    content: stripTranscript(result.content as Record<string, unknown>),
    metadata: result.metadata as Record<string, unknown> | undefined,
  }));

  return boostEngagement ? boostByEngagement(mapped) : mapped;
}
