'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Material } from '@/lib/types';

// Function to determine status based on material code
const getStatusFromCode = (code: string): 'سالم' | 'معیوب' => {
  const codeStr = String(code);
  if (codeStr.startsWith('M')) return 'سالم';
  if (codeStr.startsWith('N')) return 'معیوب';
  if (/^\d+$/.test(codeStr)) return 'سالم';
  return 'سالم'; // Default status
};

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

type MaterialState = {
  materials: Material[];
  isHydrated: boolean;
  setMaterials: (materials: Material[]) => void;
  addMaterials: (newMaterials: Omit<Material, 'id' | 'status'>[]) => void;
  deleteMaterial: (id: string) => void;
  setHydrated: () => void;
};

export const useMaterialStore = create<MaterialState>()(
  persist(
    (set) => ({
      materials: [],
      isHydrated: false,
      setHydrated: () => set({ isHydrated: true }),
      setMaterials: (materials) => set({ materials }),
      addMaterials: (newMaterials) =>
        set((state) => {
          const materialsToAdd: Material[] = newMaterials.map((m, i) => ({
            ...m,
            id: `material-${Date.now()}-${i}`,
            status: getStatusFromCode(m.materialCode),
          }));
          return { materials: [...materialsToAdd, ...state.materials] };
        }),
      deleteMaterial: (id) =>
        set((state) => ({
          materials: state.materials.filter((m) => m.id !== id),
        })),
    }),
    {
      name: 'material-storage', 
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
            // Set initial data only if storage is empty
            if (state.materials.length === 0) {
                state.materials = initialMaterials;
            }
            state.setHydrated();
        }
      },
    }
  )
);

// This is a bit of a workaround to ensure the store is hydrated before rendering on the client
// It prevents mismatched UI between server and client.
useMaterialStore.getState().setHydrated();
