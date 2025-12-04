'use server';
/**
 * @fileOverview Implements an AI-powered semantic search for telecom materials using embeddings.
 *
 * - intelligentMaterialSearch: The main flow function.
 * - IntelligentMaterialSearchInput: Input type for the search.
 * - IntelligentMaterialSearchOutput: Output type for the search.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Material } from '@/lib/types';
import { distance } from 'ml-distance';
import { embed, embedMany } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Helper schema for the structured query interpretation
const InterpretedQuerySchema = z.object({
  keywords: z.array(z.string()).describe('Clean, normalized keywords from the query.'),
  materialTypes: z.array(z.string()).optional().describe('Specific material types mentioned.'),
  conditions: z.array(z.string()).optional().describe('Material conditions like "healthy" or "damaged".'),
  extra: z.string().optional().describe('Additional context or likely user intent.'),
});

const IntelligentMaterialSearchInputSchema = z.object({
  searchQuery: z.string().describe("The user's search query."),
  materials: z.array(z.object({
    id: z.string(),
    materialCode: z.string(),
    description: z.string(),
    partNumber: z.string().optional(),
    status: z.enum(['سالم', 'معیوب']),
  })).describe('The complete list of materials to search through.'),
});

const IntelligentMaterialSearchOutputSchema = z.array(z.object({
  id: z.string(),
  materialCode: z.string(),
  description: z.string(),
  partNumber: z.string().optional(),
  status: z.enum(['سالم', 'معیوب']),
}));

export type IntelligentMaterialSearchInput = z.infer<typeof IntelligentMaterialSearchInputSchema>;
export type IntelligentMaterialSearchOutput = z.infer<typeof IntelligentMaterialSearchOutputSchema>;

// 1. Prompt to interpret the user's raw query into a structured format
const interpretQueryPrompt = ai.definePrompt({
  name: 'interpretMaterialQuery',
  input: { schema: z.object({ searchQuery: z.string() }) },
  output: { schema: InterpretedQuerySchema },
  prompt: `You are an expert material and inventory analyzer for telecommunication towers.
Your task is to take a user search query and convert it into a clean, normalized keyword set that describes what the user is looking for.

Rules:
- Understand the intent, even if the query is vague.
- Extract the essential technical meaning.
- Remove unnecessary words.
- If the query is related to telecom tower materials, normalize names (e.g., "چوپوقی" should be interpreted as gooseneck pipe or a related item).
- Return JSON format.

User query: "{{searchQuery}}"`,
});


// Helper to convert cosine distance to cosine similarity
function cosineSimilarity(x: number[], y: number[]): number {
  // cosine distance is 1 - cosine similarity
  // ml-distance's cosine function returns the cosine distance
  return 1 - distance.cosine(x, y);
}


// The main flow for semantic search
const intelligentMaterialSearchFlow = ai.defineFlow(
  {
    name: 'intelligentMaterialSearchFlow',
    inputSchema: IntelligentMaterialSearchInputSchema,
    outputSchema: IntelligentMaterialSearchOutputSchema,
  },
  async (input) => {
    if (!input.searchQuery || input.materials.length === 0) {
      return [];
    }

    // A. Interpret the user's query to get structured keywords
    const interpretedQueryResponse = await interpretQueryPrompt({ searchQuery: input.searchQuery });
    const interpretedQuery = interpretedQueryResponse.output;
    if (!interpretedQuery?.keywords.length) {
      return []; // No keywords extracted, no results
    }

    const queryText = interpretedQuery.keywords.join(' ');
    const embeddingModel = googleAI.model('text-embedding-004');

    // B. Generate embedding for the interpreted user query
    const queryEmbedding = await embed({
      model: embeddingModel,
      content: queryText,
    });

    // C. Generate embeddings for all material items
    // We combine description and material code for a richer context.
    const materialContents = input.materials.map(
      (m) => `${m.description} (Code: ${m.materialCode})`
    );

    const { embeddings: itemEmbeddings } = await embedMany({
      model: embeddingModel,
      content: materialContents,
    });


    // D. Calculate cosine similarity and filter results
    const SIMILARITY_THRESHOLD = 0.7; // Threshold for a good match
    const similarMaterials: Material[] = [];

    itemEmbeddings.forEach((itemEmbedding, index) => {
      const similarity = cosineSimilarity(queryEmbedding, itemEmbedding);
      if (similarity >= SIMILARITY_THRESHOLD) {
        similarMaterials.push(input.materials[index]);
      }
    });

    return similarMaterials;
  }
);

/**
 * Executes the semantic search flow.
 * This is the primary function to be called from server actions.
 */
export async function intelligentMaterialSearch(input: IntelligentMaterialSearchInput): Promise<IntelligentMaterialSearchOutput> {
  return await intelligentMaterialSearchFlow(input);
}
