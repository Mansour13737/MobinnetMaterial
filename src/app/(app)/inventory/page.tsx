'use client';
import { InventoryPage } from '@/components/inventory/InventoryPage';

export default function Inventory() {
  // All logic is now moved to InventoryPage to better handle client-side state with Zustand
  return <InventoryPage />;
}
