'use client';
import React, { useState, useTransition, useMemo, useRef } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Download, Search, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { InventoryTable } from './InventoryTable';
import type { Material } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { intelligentMaterialSearch } from '@/ai/flows/intelligent-material-search';
import { addMaterials } from '@/lib/data';
import { Skeleton } from '../ui/skeleton';
import { ExcelReader } from './ExcelReader';

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
  const [isImporting, startImportTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    if (!searchTerm.trim()) {
      setSearchResults(null);
      setMaterials(initialMaterials); // Reset to full list
      return;
    }

    startSearchTransition(async () => {
      try {
        const result = await intelligentMaterialSearch({ searchTerm });
        const allMaterials = [...initialMaterials, ...materials.filter(m => !initialMaterials.find(im => im.id === m.id))];
        const foundMaterials = allMaterials.filter(m => 
          result.results.some(res => m.description.toLowerCase().includes(res.toLowerCase()))
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

  const handleFileProcessed = (newMaterials: Material[]) => {
    startImportTransition(async () => {
      try {
        await addMaterials(newMaterials);
        setMaterials(prev => [...newMaterials, ...prev]);
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

  const handleExport = (format: 'Excel' | 'PDF') => {
    toast({
        title: 'در حال آماده‌سازی خروجی',
        description: `خروجی ${format} به زودی آماده دانلود خواهد بود.`,
    });
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
            <Button onClick={() => handleExport('Excel')}>
              <Download className="ml-2 h-4 w-4" />
              خروجی Excel
            </Button>
            <Button onClick={handleImportClick} disabled={isImporting}>
              {isImporting ? 'در حال پردازش...' : <><Upload className="ml-2 h-4 w-4" /> ایمپورت از Excel</>}
            </Button>
            <ExcelReader ref={fileInputRef} onFileProcessed={handleFileProcessed} />
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
        />
      )}
    </div>
  );
}
