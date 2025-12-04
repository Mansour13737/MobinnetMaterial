'use client';
import React, { useState, useTransition } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Download, Plus, Search, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { InventoryTable } from './InventoryTable';
import type { Material } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { intelligentMaterialSearch } from '@/ai/flows/intelligent-material-search';
import { useUserRole } from '@/components/layout/UserNav';
import { importFromExcel as importAction } from '@/lib/data';
import { Skeleton } from '../ui/skeleton';

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
  const { toast } = useToast();
  const { role } = useUserRole();

  const canEdit = role === 'مدیر' || role === 'انباردار';

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults(null);
      setMaterials(initialMaterials); // Reset to full list
      return;
    }

    startSearchTransition(async () => {
      try {
        const result = await intelligentMaterialSearch({ searchTerm });
        // This is a simulation. We filter the existing materials based on the AI result descriptions.
        const foundMaterials = initialMaterials.filter(m => 
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
  
  const handleImport = () => {
    startImportTransition(async () => {
      try {
        const count = await importAction();
        toast({
            title: 'ایمپورت موفق',
            description: `${count} آیتم جدید با موفقیت از فایل اکسل ایمپورت شد.`,
        });
        // This is a placeholder for refetching data.
        // In a real app, you would invalidate a query cache or refetch.
        window.location.reload();
      } catch (error) {
         toast({
          variant: 'destructive',
          title: 'خطا در ایمپورت',
          description: 'فرایند ایمپورت با مشکل مواجه شد.',
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

  const displayedMaterials = searchResults !== null ? searchResults : materials;

  return (
    <div className="space-y-6">
      <PageHeader
        title="لیست متریال"
        actions={
          canEdit && (
            <div className="flex gap-2">
              <Button onClick={() => handleExport('Excel')}>
                <Download className="ml-2 h-4 w-4" />
                خروجی Excel
              </Button>
              <Button onClick={handleImport} disabled={isImporting}>
                {isImporting ? 'در حال پردازش...' : <><Upload className="ml-2 h-4 w-4" /> ایمپورت از Excel</>}
              </Button>
            </div>
          )
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
          materials={displayedMaterials}
          hasSearchResults={searchResults !== null}
        />
      )}
    </div>
  );
}
