import { getMaterials } from '@/lib/data';
import { InventoryPage } from '@/components/inventory/InventoryPage';

export const dynamic = 'force-dynamic';

export default async function Inventory() {
  const initialMaterials = await getMaterials();

  return <InventoryPage initialMaterials={initialMaterials} />;
}
