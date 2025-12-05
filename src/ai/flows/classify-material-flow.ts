'use server';
/**
 * @fileOverview A material classification AI agent.
 *
 * - classifyMaterial: A function that handles the material classification process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Material } from '@/lib/types';
import { googleAI } from '@genkit-ai/google-genai';

const MaterialLocationSchema = z.enum(['بالای دکل', 'داخل رک', 'پایین رک']);
type MaterialLocation = z.infer<typeof MaterialLocationSchema>;


const classificationPrompt = ai.definePrompt({
  name: 'materialClassificationPrompt',
  input: {
    schema: z.object({
      description: z.string(),
      materialCode: z.string(),
      partNumber: z.string().optional(),
    }),
  },
  output: {
    schema: MaterialLocationSchema,
  },
  prompt: `You are an expert telecom inventory analyst. Your task is to determine the most likely location of a given material based on its description.

The possible locations are:
- "بالای دکل" (Top of the tower): Items like antennas, RRUs, tower sections, guy wires, ODU, etc.
- "داخل رک" (Inside the rack): Items like IDUs, modems, routers, switches, patch panels, power supplies, rectifiers.
- "پایین رک" (Bottom of the rack): Items like batteries, heavy power equipment, grounding bars.

Analyze the material description below and decide which of the three locations is the most appropriate. Return only the name of the location.

Material Description: {{{description}}}
Material Code: {{{materialCode}}}
Part Number: {{{partNumber}}}
`,
  config: {
    model: googleAI.model('gemini-pro'),
    temperature: 0.1,
  },
});

export const classifyMaterialFlow = ai.defineFlow(
  {
    name: 'classifyMaterialFlow',
    inputSchema: z.custom<Material>(),
    outputSchema: MaterialLocationSchema,
  },
  async (material) => {
    const { output } = await classificationPrompt({
        description: material.description,
        materialCode: material.materialCode,
        partNumber: material.partNumber
    });
    return output || 'داخل رک'; // Default fallback
  }
);


export async function classifyMaterial(material: Material): Promise<MaterialLocation> {
    return classifyMaterialFlow(material);
}
