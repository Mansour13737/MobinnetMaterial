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
        oldMaterialNumberMCI: 'OLD-MCI-001',
        newMaterialNumberMCI: 'NEW-MCI-001',
        otherOldMaterialNumber: 'OTHER-001'
      },
      {
        id: '2',
        materialCode: 'M100037152',
        description: 'TOWER SECTION 20M',
        status: getStatusFromCode('M100037152'),
        partNumber: 'PN-002',
        oldMaterialNumberMCI: 'OLD-MCI-002',
        newMaterialNumberMCI: 'NEW-MCI-002',
        otherOldMaterialNumber: 'OTHER-002'
      },
      {
        id: '3',
        materialCode: 'N100037153',
        description: 'TURNBUCKLE 16MM - DEFECTIVE',
        status: getStatusFromCode('N100037153'),
        partNumber: 'PN-003',
        oldMaterialNumberMCI: 'OLD-MCI-003',
        newMaterialNumberMCI: 'NEW-MCI-003',
        otherOldMaterialNumber: 'OTHER-003-DEF'
      },
  ];

  if (!storedMaterials) {
     localStorage.setItem('materials', JSON.stringify(initialMaterials));
     return initialMaterials;
  }
  try {
    return JSON.parse(storedMaterials);
  } catch (e) {
    return initialMaterials;
  }
};


// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getMaterials = async (): Promise<Material[]> => {
  await delay(100); // Simulate short delay for storage access
  return getMaterialsFromStorage();
};

export const addMaterials = async (newMaterials: Material[]): Promise<Material[]> => {
  await delay(200);
  const currentMaterials = getMaterialsFromStorage();
  const updatedMaterials = [...newMaterials, ...currentMaterials];
  localStorage.setItem('materials', JSON.stringify(updatedMaterials));
  return updatedMaterials;
}

export const deleteMaterial = async (id: string): Promise<boolean> => {
    await delay(400);
    let materials = getMaterialsFromStorage();
    const initialLength = materials.length;
    materials = materials.filter(m => m.id !== id);
    localStorage.setItem('materials', JSON.stringify(materials));
    return materials.length < initialLength;
}
