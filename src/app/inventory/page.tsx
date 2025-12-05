'use client';
import React, { useState, useTransition, useMemo, useRef, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Download, Search, Upload, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { InventoryTable } from '@/app/inventory/InventoryTable';
import type { Material } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ExcelReader } from '@/app/inventory/ExcelReader';
import { AddMaterialForm } from '@/app/inventory/AddMaterialForm';
import { useMaterialStore } from '@/store/material-store';

const ITEMS_PER_PAGE = 10;

export default function InventoryPage() {
  const { 
    materials, 
    addMaterials, 
    deleteMaterial, 
    isHydrated
  } = useMaterialStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, startSubmittingTransition] = useTransition();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { toast } = useToast();
  const fileInputRef = useRef<{ click: () => void }>(null);
  
  const handleSearchSubmit = (term: string) => {
    // This function is now a placeholder if we need to add back search-related logic,
    // like adding to a search history. For now, it does nothing as filtering is live.
  };
  
  const filteredMaterials = useMemo(() => {
    let results = materials;
    if (searchTerm.trim()) {
      const lowercasedTerm = searchTerm.toLowerCase();
      return results.filter(material =>
        material.description.toLowerCase().includes(lowercasedTerm) ||
        material.materialCode.toLowerCase().includes(lowercasedTerm) ||
        (material.partNumber && material.partNumber.toLowerCase().includes(lowercasedTerm))
      );
    }
    return results;
  }, [materials, searchTerm]);
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileProcessed = (newMaterialsData: Omit<Material, 'id' | 'status'>[]) => {
    startSubmittingTransition(() => {
      try {
        addMaterials(newMaterialsData);
        toast({
          title: 'ایمپورت موفق',
          description: `${newMaterialsData.length} آیتم جدید با موفقیت از فایل اکسل ایمپورت شد.`,
        });
      } catch (error) {
         toast({
          variant: 'destructive',
          title: 'خطا در ایمپورت',
          description: 'فرایند ذخیره داده‌های ایمپورت شده با مشکل مواجه شد.',
        });
      }
    });
  }

  const handleAddMaterial = (newMaterialData: Omit<Material, 'id' | 'status'>) => {
     startSubmittingTransition(() => {
       try {
        addMaterials([newMaterialData]);
        toast({
          title: 'افزودن موفق',
          description: `متریال "${newMaterialData.description}" با موفقیت اضافه شد.`,
        });
        setAddModalOpen(false);
       } catch (error) {
         toast({
            variant: 'destructive',
            title: 'خطا در افزودن متریال',
            description: 'فرایند ذخیره داده‌ها با مشکل مواجه شد.',
          });
       }
     });
  }

  const handleExport = (format: 'Excel' | 'PDF') => {
    toast({
        title: 'در حال آماده‌سازی خروجی',
        description: `خروجی ${format} به زودی آماده دانلود خواهد بود.`,
    });
  }

  const handleDelete = (id: string) => {
    deleteMaterial(id);
    toast({
        title: 'حذف موفق',
        description: 'آیتم با موفقیت حذف شد.',
    });
  }
  
  const totalPages = Math.ceil(filteredMaterials.length / ITEMS_PER_PAGE);

  const paginatedMaterials = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredMaterials.slice(startIndex, endIndex);
  }, [filteredMaterials, currentPage]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
  if (!isHydrated) {
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


  return (
    <div className="space-y-6">
      <PageHeader
        title="لیست متریال"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => setAddModalOpen(true)}>
                <Plus className="ml-2 h-4 w-4" />
                افزودن متریال
            </Button>
            <Button onClick={() => handleExport('Excel')}>
              <Download className="ml-2 h-4 w-4" />
              خروجی Excel
            </Button>
            <Button onClick={handleImportClick} disabled={isSubmitting}>
              {isSubmitting ? 'در حال پردازش...' : <><Upload className="ml-2 h-4 w-4" /> ایمپورت از Excel</>}
            </Button>
            <ExcelReader ref={fileInputRef} onFileProcessed={handleFileProcessed} />
            <AddMaterialForm 
              isOpen={isAddModalOpen} 
              onOpenChange={setAddModalOpen} 
              onAddMaterial={handleAddMaterial}
              isSubmitting={isSubmitting}
            />
          </div>
        }
      />

      <div className="rounded-lg border bg-card p-4 shadow-sm space-y-4">
        <form onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(searchTerm); }}>
          <div className="relative flex-grow">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="جستجو در کد، شرح یا پارت نامبر..."
              className="w-full rounded-lg bg-background pr-10 h-12 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
      </div>

      <InventoryTable
        materials={paginatedMaterials}
        hasSearchResults={searchTerm.trim().length > 0 && filteredMaterials.length === 0}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onDelete={handleDelete}
      />
    </div>
  );
}
