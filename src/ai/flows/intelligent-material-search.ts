'use server';
/**
 * @fileOverview A flow for performing intelligent, semantic search over telecom materials.
 *
 * - intelligentMaterialSearch - A function that handles the material search process.
 * - IntelligentMaterialSearchInput - The input type for the function.
 * - IntelligentMaterialSearchOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Material } from '@/lib/types';

const IntelligentMaterialSearchInputSchema = z.object({
  searchQuery: z.string().describe('The user\'s search query, which could be a technical term, a colloquialism, or a partial description.'),
  materials: z.array(z.object({
    id: z.string(),
    materialCode: z.string(),
    description: z.string(),
    partNumber: z.string().optional(),
    status: z.enum(['سالم', 'معیوب']),
  })).describe('The complete list of materials to search through.'),
});

// The output is an array of the full material objects that are deemed relevant.
const IntelligentMaterialSearchOutputSchema = z.array(z.object({
    id: z.string(),
    materialCode: z.string(),
    description: z.string(),
    partNumber: z.string().optional(),
    status: z.enum(['سالم', 'معیوب']),
}));

export type IntelligentMaterialSearchInput = z.infer<typeof IntelligentMaterialSearchInputSchema>;
export type IntelligentMaterialSearchOutput = z.infer<typeof IntelligentMaterialSearchOutputSchema>;

const intelligentMaterialSearchPrompt = ai.definePrompt({
  name: 'intelligentMaterialSearchPrompt',
  input: { schema: IntelligentMaterialSearchInputSchema },
  output: { schema: IntelligentMaterialSearchOutputSchema },
  prompt: `You are an expert assistant for a telecommunications tower materials inventory. Your task is to perform an intelligent, semantic search.

You understand technical terms, part numbers, and even colloquial or slang terms (like "چوپوقی" for a gooseneck pipe).

The user has provided a search query: "{{searchQuery}}"

Here is the list of all available materials:
{{#each materials}}
- ID: {{id}}, Code: {{materialCode}}, Description: "{{description}}", Part Number: {{partNumber}}
{{/each}}

Based on the user's search query, identify the most relevant materials from the list. The result should be an array of the full material objects that match. A match can be based on the material code, description, part number, or a semantic understanding of the query.

Return an array of the complete, original material objects that are the best matches. If no relevant materials are found, return an empty array.
`,
});

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
    const { output } = await intelligentMaterialSearchPrompt(input);
    return output || [];
  }
);


export async function intelligentMaterialSearch(input: Intelligent-MaterialSearchInput): Promise<IntelligentMaterialSearchOutput> {
  return await intelligentMaterialSearchFlow(input);
}
