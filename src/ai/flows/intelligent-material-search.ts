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
    .describe('A list of material descriptions that match the search term.'),
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
  prompt: `You are an AI assistant specialized in searching for materials in a list based on user queries.

  The user will provide a search term, and you should return a list of keywords or phrases from the material description that closely match the search term. Consider potential typos, vague descriptions, and similar items.

  Search Term: {{{searchTerm}}}

  Return the keywords found in the material descriptions.
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
