import { Material } from './types';

let materials: Material[] = [
  {
    id: '1',
    name: 'پیچ و مهره ۱۲ گالوانیزه',
    type: 'اتصالات',
    category: 'پیچ و مهره',
    healthyCode: 'HW-BLT-12-G-H',
    defectiveCode: 'HW-BLT-12-G-D',
    status: 'سالم',
    quantity: 1500,
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'سکشن تبدیلی ۲۰ متری',
    type: 'بدنه دکل',
    category: 'سکشن',
    healthyCode: 'TWR-SEC-20-C-H',
    defectiveCode: 'TWR-SEC-20-C-D',
    status: 'سالم',
    quantity: 45,
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: 'مهارکش ۱۶',
    type: 'مهار',
    category: 'اتصالات مهار',
    healthyCode: 'GUY-TNB-16-H',
    defectiveCode: 'GUY-TNB-16-D',
    status: 'سالم',
    quantity: 320,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'کابل مهار نمره ۸',
    type: 'مهار',
    category: 'کابل',
    healthyCode: 'GUY-CBL-08-H',
    defectiveCode: 'GUY-CBL-08-D',
    status: 'سالم',
    quantity: 800, // in meters
    lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    name: 'پلیت پایه دکل',
    type: 'فونداسیون',
    category: 'پلیت',
    healthyCode: 'FND-PLT-BS-H',
    defectiveCode: 'FND-PLT-BS-D',
    status: 'معیوب',
    quantity: 12,
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    name: 'چراغ دکل LED',
    type: 'تجهیزات جانبی',
    category: 'روشنایی',
    healthyCode: 'ACC-LGT-LED-H',
    defectiveCode: 'ACC-LGT-LED-D',
    status: 'سالم',
    quantity: 88,
    lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
    {
    id: '7',
    name: 'سکشن پایه ۱۲ متری',
    type: 'بدنه دکل',
    category: 'سکشن',
    healthyCode: 'TWR-SEC-12-B-H',
    defectiveCode: 'TWR-SEC-12-B-D',
    status: 'سالم',
    quantity: 8,
    lastUpdated: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    name: 'گوشواره ۱۶',
    type: 'مهار',
    category: 'اتصالات مهار',
    healthyCode: 'GUY-THB-16-H',
    defectiveCode: 'GUY-THB-16-D',
    status: 'سالم',
    quantity: 600,
    lastUpdated: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '9',
    name: 'انکربولت فونداسیون',
    type: 'فونداسیون',
    category: 'انکربولت',
    healthyCode: 'FND-ANC-BLT-H',
    defectiveCode: 'FND-ANC-BLT-D',
    status: 'معیوب',
    quantity: 5,
    lastUpdated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getMaterials = async (): Promise<Material[]> => {
  await delay(500);
  return materials;
};

export const getMaterialById = async (id: string): Promise<Material | undefined> => {
  await delay(300);
  return materials.find(m => m.id === id);
};

export const addMaterial = async (item: Omit<Material, 'id' | 'lastUpdated'>): Promise<Material> => {
  await delay(400);
  const newItem: Material = {
    ...item,
    id: String(Date.now()),
    lastUpdated: new Date().toISOString(),
  };
  materials = [newItem, ...materials];
  return newItem;
};

export const updateMaterial = async (id: string, updateData: Partial<Omit<Material, 'id'>>): Promise<Material | null> => {
  await delay(400);
  const materialIndex = materials.findIndex(m => m.id === id);
  if (materialIndex === -1) {
    return null;
  }
  const updatedMaterial = {
    ...materials[materialIndex],
    ...updateData,
    lastUpdated: new Date().toISOString(),
  };
  materials[materialIndex] = updatedMaterial;
  return updatedMaterial;
};

export const deleteMaterial = async (id: string): Promise<boolean> => {
    await delay(400);
    const initialLength = materials.length;
    materials = materials.filter(m => m.id !== id);
    return materials.length < initialLength;
}

export const importFromExcel = async () => {
    // This is a simulation. In a real app, you'd parse an Excel file.
    await delay(1500);
    const newItems: Material[] = Array.from({ length: 10 }).map((_, i) => ({
        id: `imported-${Date.now()}-${i}`,
        name: `آیتم ایمپورتی ${i + 1}`,
        type: 'ایمپورت شده',
        category: 'عمومی',
        healthyCode: `IMP-H-${i}`,
        defectiveCode: `IMP-D-${i}`,
        status: Math.random() > 0.2 ? 'سالم' : 'معیوب',
        quantity: Math.floor(Math.random() * 500),
        lastUpdated: new Date().toISOString(),
    }));
    materials = [...newItems, ...materials];
    return newItems.length;
}

// Helper for dashboard
export const getInventoryStats = async () => {
  await delay(200);
  const totalItems = materials.length;
  const healthyItems = materials.filter(m => m.status === 'سالم').length;
  const defectiveItems = totalItems - healthyItems;
  const criticalStockItems = materials.filter(m => m.quantity < 10);
  return { totalItems, healthyItems, defectiveItems, criticalStockItems };
};

// Helper for dashboard chart
export const getMonthlyConsumption = async () => {
  await delay(600);
  // Mock data for the last 6 months
  const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'];
  return months.map(month => ({
    name: month,
    consumption: Math.floor(Math.random() * (500 - 100 + 1)) + 100
  }));
};
