'use server';

import type { Material } from '@/lib/types';
import { classifyMaterial } from '@/ai/flows/classify-material-flow';

/**
 * Classifies a list of materials based on their description and returns the updated list.
 * @param materials - An array of Material objects to classify.
 * @returns A promise that resolves to an array of classified materials.
 */
export async function classifyMaterialsAction(materials: Material[]): Promise<Material[]> {
  const classifiedMaterials = await Promise.all(
    materials.map(async (material) => {
      const location = await classifyMaterial(material);
      return { ...material, location };
    })
  );
  return classifiedMaterials;
}
