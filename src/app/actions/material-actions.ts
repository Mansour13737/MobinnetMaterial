'use server';

import { intelligentMaterialSearch, IntelligentMaterialSearchInput, IntelligentMaterialSearchOutput } from "@/ai/flows/intelligent-material-search";

export async function searchMaterialsAction(input: IntelligentMaterialSearchInput): Promise<IntelligentMaterialSearchOutput> {
    return await intelligentMaterialSearch(input);
}
