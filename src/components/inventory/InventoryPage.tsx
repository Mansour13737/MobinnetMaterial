'use client';
import React, { useState, useTransition, useMemo, useRef, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Download, Search, Upload, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { InventoryTable } from './InventoryTable';
import type { Material } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { intelligentMaterialSearch } from '@/ai/flows/intelligent-material-search';
import { addMaterials, getStatusFromCode, getMaterials, deleteMaterial } from '@/lib/data';
import { Skeleton } from '../ui/skeleton';
import { ExcelReader } from './ExcelReader';
import { AddMaterialForm } from './AddMaterialForm';

const ITEMS_PER_PAGE = 10;

export function InventoryPage({
  initialMaterials,
}: {
  initialMaterials: Material[];
}) {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [searchResults, setSearchResults] = useState<Material[] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, startSearchTransition] = useTransition();
  const [isSubmitting, startSubmittingTransition] = useTransition();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const fileInputRef = useRef<any>(null);

  useEffect(() => {
    // On component mount, load materials from localStorage
    const loadMaterials = async () => {
      const storedMaterials = await getMaterials();
      setMaterials(storedMaterials);
    };
    loadMaterials();
  }, []);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    if (!searchTerm.trim()) {
      setSearchResults(null);
      return;
    }

    startSearchTransition(async () => {
      try {
        const result = await intelligentMaterialSearch({ searchTerm });
        const allMaterials = await getMaterials();
        // The AI returns a list of matching description strings.
        // We filter the full material list to find the corresponding material objects.
        const foundMaterials = allMaterials.filter(m => 
          result.results.some(res => m.description.toLowerCase() === res.toLowerCase())
        );
        setSearchResults(foundMaterials);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'خطا در جستجو',
          description: 'جستجوی هوشمند با مشکل مواجه شد.',
        });
        console.error(error);
      }
    });
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileProcessed = (newMaterialsData: Omit<Material, 'id' | 'status'>[]) => {
    startSubmittingTransition(async () => {
      try {
        const newMaterials: Material[] = newMaterialsData.map((item, index) => ({
          ...item,
          id: `imported-${Date.now()}-${index}`,
          status: getStatusFromCode(item.materialCode),
        }));

        await addMaterials(newMaterials);
        const allMaterials = await getMaterials();
        setMaterials(allMaterials);
        toast({
          title: 'ایمپورت موفق',
          description: `${newMaterials.length} آیتم جدید با موفقیت از فایل اکسل ایمپورت شد.`,
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
     startSubmittingTransition(async () => {
       try {
        const newMaterial: Material = {
          ...newMaterialData,
          id: `manual-${Date.now()}`,
          status: getStatusFromCode(newMaterialData.materialCode),
        };
        await addMaterials([newMaterial]);
        const allMaterials = await getMaterials();
        setMaterials(allMaterials);
        toast({
          title: 'افزودن موفق',
          description: `متریال "${newMaterial.description}" با موفقیت اضافه شد.`,
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

  const handleDelete = async (id: string) => {
    await deleteMaterial(id);
    const updatedMaterials = await getMaterials();
    setMaterials(updatedMaterials);
    if (searchResults) {
      setSearchResults(prev => prev!.filter(m => m.id !== id));
    }
  }

  const currentMaterials = searchResults !== null ? searchResults : materials;
  const totalPages = Math.ceil(currentMaterials.length / ITEMS_PER_PAGE);

  const paginatedMaterials = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return currentMaterials.slice(startIndex, endIndex);
  }, [currentMaterials, currentPage]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="لیست متریال"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setAddModalOpen(true)}>
                <Plus className="ml-2 h-4 w-4" />
                افزودن متریال جدید
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

      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-grow">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="جستجوی هوشمند در شرح متریال..."
              className="w-full rounded-lg bg-background pr-10 h-12 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit" size="lg" disabled={isSearching}>
            {isSearching ? 'در حال جستجو...' : 'پیدا کن'}
          </Button>
        </form>
      </div>

      {isSearching ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <InventoryTable
          materials={paginatedMaterials}
          hasSearchResults={searchResults !== null}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
