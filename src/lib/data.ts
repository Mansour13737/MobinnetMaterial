import { Material } from './types';

// Function to determine status based on material code
const getStatusFromCode = (code: string): 'سالم' | 'معیوب' => {
  const codeStr = String(code);
  if (codeStr.startsWith('M')) return 'سالم';
  if (codeStr.startsWith('N')) return 'معیوب';
  if (/^\d+$/.test(codeStr)) return 'سالم';
  return 'سالم'; // Default status
};


let materials: Material[] = [
  {
    id: '1',
    materialCode: '100037151',
    description: 'FO D/C SM SC/SC 1CORE 2GUIDE OD 100M',
    baseUnit: 'PC',
    status: getStatusFromCode('100037151'),
  },
  {
    id: '2',
    materialCode: 'M100037152',
    description: 'TOWER SECTION 20M',
    baseUnit: 'EA',
    status: getStatusFromCode('M100037152'),
  },
  {
    id: '3',
    materialCode: 'N100037153',
    description: 'TURNBUCKLE 16MM - DEFECTIVE',
    baseUnit: 'PC',
    status: getStatusFromCode('N100037153'),
  },
];

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getMaterials = async (): Promise<Material[]> => {
  await delay(500);
  return materials;
};

export const importFromExcel = async () => {
    // This is a simulation. In a real app, you'd parse an Excel file.
    await delay(1500);
    const newItems: Material[] = Array.from({ length: 10 }).map((_, i) => {
        const materialCode = `M${Date.now() + i}`;
        return {
            id: `imported-${Date.now()}-${i}`,
            materialCode: materialCode,
            description: `آیتم ایمپورتی ${i + 1}`,
            baseUnit: 'PC',
            status: getStatusFromCode(materialCode),
        }
    });
    materials = [...newItems, ...materials];
    return newItems.length;
}

export const deleteMaterial = async (id: string): Promise<boolean> => {
    await delay(400);
    const initialLength = materials.length;
    materials = materials.filter(m => m.id !== id);
    return materials.length < initialLength;
}
