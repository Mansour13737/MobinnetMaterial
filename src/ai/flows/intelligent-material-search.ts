'use server';

/**
 * @fileOverview AI-powered material search flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentMaterialSearchInputSchema = z.object({
  searchTerm: z
    .string()
    .describe('The search term provided by the user to find materials based on their description.'),
});

const IntelligentMaterialSearchOutputSchema = z.object({
  results: z
    .array(z.string())
    .describe('A list of material descriptions that semantically match the search term.'),
});

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

export async function intelligentMaterialSearch(
  input: z.infer<typeof IntelligentMaterialSearchInputSchema>
): Promise<z.infer<typeof IntelligentMaterialSearchOutputSchema>> {
  return intelligentMaterialSearchFlow(input);
}
