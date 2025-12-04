'use server';
import { intelligentMaterialSearch } from '@/ai/flows/intelligent-material-search';
import { z } from 'zod';

const IntelligentMaterialSearchInputSchema = z.object({
  searchTerm: z.string(),
});

export async function searchMaterialsAction(
  input: z.infer<typeof IntelligentMaterialSearchInputSchema>
) {
  return await intelligentMaterialSearch(input);
}
