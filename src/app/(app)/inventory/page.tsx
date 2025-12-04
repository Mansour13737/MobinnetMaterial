import { getMaterials } from '@/lib/data';
import { InventoryPage } from '@/components/inventory/InventoryPage';
import { UserRoleProvider } from '@/components/layout/UserNav';

export const dynamic = 'force-dynamic';

export default async function Inventory() {
  const initialMaterials = await getMaterials();

  return (
    <UserRoleProvider>
      <InventoryPage initialMaterials={initialMaterials} />
    </UserRoleProvider>
  );
}
