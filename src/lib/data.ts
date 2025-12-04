'use client';
import { Material } from './types';

// Function to determine status based on material code
export const getStatusFromCode = (code: string): 'سالم' | 'معیوب' => {
  const codeStr = String(code);
  if (codeStr.startsWith('M')) return 'سالم';
  if (codeStr.startsWith('N')) return 'معیوب';
  if (/^\d+$/.test(codeStr)) return 'سالم';
  return 'سالم'; // Default status
};

const getMaterialsFromStorage = (): Material[] => {
  if (typeof window === 'undefined') return [];
  const storedMaterials = localStorage.getItem('materials');
  const initialMaterials: Material[] = [
      {
        id: '1',
        materialCode: '100037151',
        description: 'FO D/C SM SC/SC 1CORE 2GUIDE OD 100M',
        status: getStatusFromCode('100037151'),
        partNumber: 'PN-001',
      },
      {
        id: '2',
        materialCode: 'M100037152',
        description: 'TOWER SECTION 20M',
        status: getStatusFromCode('M100037152'),
        partNumber: 'PN-002',
      },
      {
        id: '3',
        materialCode: 'N100037153',
        description: 'TURNBUCKLE 16MM - DEFECTIVE',
        status: getStatusFromCode('N100037153'),
        partNumber: 'PN-003',
      },
  ];

  if (!storedMaterials) {
     localStorage.setItem('materials', JSON.stringify(initialMaterials));
     return initialMaterials;
  }
  try {
    const parsed = JSON.parse(storedMaterials);
    // Basic validation to ensure it's an array
    if(Array.isArray(parsed)) {
      return parsed;
    }
    return initialMaterials;
  } catch (e) {
    return initialMaterials;
  }
};


// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getMaterials = async (): Promise<Material[]> => {
  await delay(50); // Simulate short delay for storage access
  return getMaterialsFromStorage();
};

export const addMaterials = async (newMaterials: Omit<Material, 'id' | 'status'>[]): Promise<Material[]> => {
  await delay(100);
  const currentMaterials = getMaterialsFromStorage();
  const materialsToAdd: Material[] = newMaterials.map((m, i) => ({
    ...m,
    id: `material-${Date.now()}-${i}`,
    status: getStatusFromCode(m.materialCode),
  }));
  const updatedMaterials = [...materialsToAdd, ...currentMaterials];
  localStorage.setItem('materials', JSON.stringify(updatedMaterials));
  return updatedMaterials;
}

export const deleteMaterial = async (id: string): Promise<boolean> => {
    await delay(100);
    let materials = getMaterialsFromStorage();
    const initialLength = materials.length;
    materials = materials.filter(m => m.id !== id);
    localStorage.setItem('materials', JSON.stringify(materials));
    return materials.length < initialLength;
}
