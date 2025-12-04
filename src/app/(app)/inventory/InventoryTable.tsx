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
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { buttonVariants } from "@/components/ui/button"

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

  const handleDelete = (id: string) => {
    onDelete(id);
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
              <TableHead>No.</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Material description</TableHead>
              <TableHead>Part Number</TableHead>
              <TableHead className="text-center">وضعیت</TableHead>
              <TableHead className="text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.length > 0 ? (
              materials.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{((currentPage - 1) * 10) + index + 1}</TableCell>
                  <TableCell className="font-medium font-code">{item.materialCode}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.partNumber}</TableCell>
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>آیا از حذف این آیتم اطمینان دارید؟</AlertDialogTitle>
                            <AlertDialogDescription>
                              این عمل غیرقابل بازگشت است و اطلاعات این متریال برای همیشه حذف خواهد شد.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>لغو</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item.id)} className={buttonVariants({ variant: "destructive" })}>
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                     </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
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
                 <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePreviousPage(); }} disabled={currentPage === 1}/>
               </PaginationItem>
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            onPageChange(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  if (
                    (page === currentPage - 2 && currentPage > 3) ||
                    (page === currentPage + 2 && currentPage < totalPages - 2)
                  ) {
                    return <PaginationEllipsis key={page} />;
                  }
                  return null;
                })}
               <PaginationItem>
                 <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handleNextPage(); }} disabled={currentPage === totalPages}/>
               </PaginationItem>
             </PaginationContent>
           </Pagination>
        </CardFooter>
      )}
    </Card>
  );
}
