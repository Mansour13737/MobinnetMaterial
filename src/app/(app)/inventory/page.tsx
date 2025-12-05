'use client';
import React, { useState, useTransition, useMemo, useRef, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Download, Search, Upload, Plus, BrainCircuit, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { InventoryTable } from '@/app/(app)/inventory/InventoryTable';
import type { Material } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ExcelReader } from '@/app/(app)/inventory/ExcelReader';
import { AddMaterialForm } from '@/app/(app)/inventory/AddMaterialForm';
import { useMaterialStore } from '@/store/material-store';
import { classifyMaterialsAction } from '@/app/actions/material-actions';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ITEMS_PER_PAGE = 10;

type FilterType = 'all' | 'بالای دکل' | 'داخل رک' | 'پایین رک';


export default function InventoryPage() {
  const { 
    materials, 
    addMaterials, 
    deleteMaterial, 
    setMaterials,
    isHydrated 
  } = useMaterialStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, startSubmittingTransition] = useTransition();
  const [isClassifying, startClassifyingTransition] = useTransition();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  
  const { toast } = useToast();
  const fileInputRef = useRef<{ click: () => void }>(null);
  
  const unclassifiedCount = useMemo(() => materials.filter(m => !m.location).length, [materials]);
  
  const filteredMaterials = useMemo(() => {
    let results = materials;
    if (activeFilter !== 'all') {
      results = results.filter(m => m.location === activeFilter);
    }
    if (searchTerm.trim()) {
      const lowercasedTerm = searchTerm.toLowerCase();
      return results.filter(material =>
        material.description.toLowerCase().includes(lowercasedTerm) ||
        material.materialCode.toLowerCase().includes(lowercasedTerm) ||
        (material.partNumber && material.partNumber.toLowerCase().includes(lowercasedTerm))
      );
    }
    return results;
  }, [materials, searchTerm, activeFilter]);
  
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
  
  const handleClassify = () => {
    const unclassifiedMaterials = materials.filter(m => !m.location);
    if (unclassifiedMaterials.length === 0) {
      toast({
        title: 'همه آیتم‌ها دسته‌بندی شده‌اند',
        description: 'نیازی به تحلیل مجدد نیست.',
      });
      return;
    }

    startClassifyingTransition(async () => {
      try {
        const classified = await classifyMaterialsAction(unclassifiedMaterials);
        const updatedMaterials = materials.map(original => {
          const found = classified.find(c => c.id === original.id);
          return found ? { ...original, location: found.location } : original;
        });
        setMaterials(updatedMaterials);
        toast({
          title: 'تحلیل و دسته‌بندی موفق',
          description: `${classified.length} آیتم با موفقیت دسته‌بندی شد.`,
        });
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'خطا در دسته‌بندی',
          description: 'مشکلی در ارتباط با سرویس هوش مصنوعی پیش آمد.',
        });
      }
    });
  };


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

  // Reset to page 1 when search term or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter]);
  
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
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {/* The button is wrapped in a span to allow the tooltip to show even when disabled */}
                        <span tabIndex={0}>
                            <Button variant="outline" onClick={handleClassify} disabled={isClassifying || unclassifiedCount === 0}>
                              {isClassifying ? (
                                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                              ) : (
                                <BrainCircuit className="ml-2 h-4 w-4" />
                              )}
                              تحلیل و دسته‌بندی
                            </Button>
                        </span>
                    </TooltipTrigger>
                    {unclassifiedCount === 0 && (
                       <TooltipContent>
                         <p>همه آیتم‌ها دسته‌بندی شده‌اند</p>
                       </TooltipContent>
                    )}
                </Tooltip>
             </TooltipProvider>

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
        <div className="flex gap-4">
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
        </div>
         <div className="flex items-center gap-2">
            <Badge className="text-sm py-1">فیلتر مکان:</Badge>
            <Button variant={activeFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setActiveFilter('all')}>همه</Button>
            <Button variant={activeFilter === 'بالای دکل' ? 'default' : 'outline'} size="sm" onClick={() => setActiveFilter('بالای دکل')}>بالای دکل</Button>
            <Button variant={activeFilter === 'داخل رک' ? 'default' : 'outline'} size="sm" onClick={() => setActiveFilter('داخل رک')}>داخل رک</Button>
            <Button variant={activeFilter === 'پایین رک' ? 'default' : 'outline'} size="sm" onClick={() => setActiveFilter('پایین رک')}>پایین رک</Button>
        </div>
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
