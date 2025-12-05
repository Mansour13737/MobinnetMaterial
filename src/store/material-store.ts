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
  searchHistory: string[];
  isHydrated: boolean;
  setMaterials: (materials: Material[]) => void;
  addMaterials: (newMaterials: Omit<Material, 'id' | 'status'>[]) => void;
  deleteMaterial: (id: string) => void;
  addSearchTerm: (term: string) => void;
  clearSearchHistory: () => void;
  setHydrated: () => void;
};

export const useMaterialStore = create<MaterialState>()(
  persist(
    (set) => ({
      materials: [],
      searchHistory: [],
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
      addSearchTerm: (term) =>
        set((state) => {
          const newHistory = [term, ...state.searchHistory.filter(t => t !== term)].slice(0, 10);
          return { searchHistory: newHistory };
        }),
      clearSearchHistory: () => set({ searchHistory: [] }),
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
const useBoundStore = (selector: (state: MaterialState) => any) => {
    const store = useMaterialStore(selector);
    const [isHydrated, setIsHydrated] = React.useState(false);
    React.useEffect(() => {
        setIsHydrated(true);
    }, []);
    return isHydrated ? store : selector(useMaterialStore.getState());
};


// Custom hook to listen for search term events
export const useSearchTermHandler = (
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
) => {
  useEffect(() => {
    const handleSetSearchTerm = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setSearchTerm(customEvent.detail);
    };

    window.addEventListener('set-search-term', handleSetSearchTerm);
    return () => {
      window.removeEventListener('set-search-term', handleSetSearchTerm);
    };
  }, [setSearchTerm]);
};


useMaterialStore.getState().setHydrated();
