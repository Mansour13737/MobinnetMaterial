'use client';
import { useState, useEffect } from 'react';
import { getMaterials } from '@/lib/data';
import { InventoryPage } from '@/components/inventory/InventoryPage';
import { Material } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Inventory() {
  const [initialMaterials, setInitialMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      const materials = await getMaterials();
      setInitialMaterials(materials);
      setLoading(false);
    };
    fetchMaterials();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
         <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-36" />
            </div>
          </div>
          <Skeleton className="h-16 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
      </div>
    );
  }

  return <InventoryPage initialMaterials={initialMaterials} />;
}
