'use client';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Material } from '@/lib/types';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deleteMaterial } from '@/lib/data';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function InventoryTable({
  materials,
  hasSearchResults,
  currentPage,
  totalPages,
  onPageChange,
  onDelete
}: {
  materials: Material[],
  hasSearchResults: boolean,
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void,
  onDelete: (id: string) => void
}) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این آیتم اطمینان دارید؟ این عمل غیرقابل بازگشت است.')) return;
    
    const result = await deleteMaterial(id);
    if(result) {
        toast({ title: 'موفقیت', description: 'آیتم با موفقیت حذف شد.' });
        onDelete(id);
    } else {
        toast({ variant: 'destructive', title: 'خطا', description: 'حذف آیتم با مشکل مواجه شد.' });
    }
  };

  const handlePreviousPage = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };

  const handleNextPage = () => {
    onPageChange(Math.min(totalPages, currentPage + 1));
  };


  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>کد متریال</TableHead>
              <TableHead>شرح متریال</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Technical Identifier</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>واحد</TableHead>
              <TableHead className="text-center">وضعیت</TableHead>
              <TableHead className="text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.length > 0 ? (
              materials.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium font-code">{item.materialCode}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.designation}</TableCell>
                  <TableCell>{item.technicalIdentifier}</TableCell>
                  <TableCell>{item.version}</TableCell>
                  <TableCell>{item.baseUnit}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        item.status === 'سالم' ? 'default' : 'destructive'
                      }
                      className={item.status === 'سالم' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700' : ''}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">
                     <div className="flex items-center justify-end gap-2">
                       <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                       </Button>
                     </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  {hasSearchResults ? 'هیچ نتیجه‌ای برای جستجوی شما یافت نشد.' : 'هیچ آیتمی ثبت نشده است.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      {totalPages > 1 && (
        <CardFooter className="flex items-center justify-between pt-6">
           <div className="text-sm text-muted-foreground">
             صفحه {currentPage} از {totalPages}
           </div>
           <Pagination className="mx-0 w-auto">
             <PaginationContent>
               <PaginationItem>
                 <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePreviousPage(); }} />
               </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
               <PaginationItem>
                 <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handleNextPage(); }}/>
               </PaginationItem>
             </PaginationContent>
           </Pagination>
        </CardFooter>
      )}
    </Card>
  );
}
