'use server';

/**
 * @fileOverview AI-powered material search flow.
 *
 * - intelligentMaterialSearch - A function that performs intelligent material search.
 * - IntelligentMaterialSearchInput - The input type for the intelligentMaterialSearch function.
 * - IntelligentMaterialSearchOutput - The return type for the intelligentMaterialSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentMaterialSearchInputSchema = z.object({
  searchTerm: z
    .string()
    .describe('The search term provided by the user to find materials based on their description.'),
});
export type IntelligentMaterialSearchInput = z.infer<
  typeof IntelligentMaterialSearchInputSchema
>;

const IntelligentMaterialSearchOutputSchema = z.object({
  results: z
    .array(z.string())
    .describe('A list of material descriptions that semantically match the search term.'),
});
export type IntelligentMaterialSearchOutput = z.infer<
  typeof IntelligentMaterialSearchOutputSchema
>;

export async function intelligentMaterialSearch(
  input: IntelligentMaterialSearchInput
): Promise<IntelligentMaterialSearchOutput> {
  return intelligentMaterialSearchFlow(input);
}

const intelligentMaterialSearchPrompt = ai.definePrompt({
  name: 'intelligentMaterialSearchPrompt',
  input: {schema: IntelligentMaterialSearchInputSchema},
  output: {schema: IntelligentMaterialSearchOutputSchema},
  prompt: `You are an AI assistant that excels at semantic search. Your task is to find the most relevant material descriptions from a provided list based on a user's search query.

Consider synonyms, related concepts, and user intent, not just keyword matching.

Search Term: {{{searchTerm}}}

Return a list of the full, original material descriptions that are the most relevant matches.
  `,
});

const intelligentMaterialSearchFlow = ai.defineFlow(
  {
    name: 'intelligentMaterialSearchFlow',
    inputSchema: IntelligentMaterialSearchInputSchema,
    outputSchema: IntelligentMaterialSearchOutputSchema,
  },
  async input => {
    const {output} = await intelligentMaterialSearchPrompt(input);
    return output!;
  }
);
