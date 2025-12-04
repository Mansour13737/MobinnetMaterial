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
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Material } from '@/lib/types';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { useUserRole } from '../layout/UserNav';
import { useToast } from '@/hooks/use-toast';
import { deleteMaterial } from '@/lib/data';

export function InventoryTable({ materials, hasSearchResults }: { materials: Material[], hasSearchResults: boolean }) {
  const { role } = useUserRole();
  const canEdit = role === 'مدیر' || role === 'انباردار';
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این آیتم اطمینان دارید؟ این عمل غیرقابل بازگشت است.')) return;
    
    const result = await deleteMaterial(id);
    if(result) {
        toast({ title: 'موفقیت', description: 'آیتم با موفقیت حذف شد.' });
        window.location.reload();
    } else {
        toast({ variant: 'destructive', title: 'خطا', description: 'حذف آیتم با مشکل مواجه شد.' });
    }
  };


  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>کد متریال</TableHead>
              <TableHead>شرح متریال</TableHead>
              <TableHead>واحد</TableHead>
              <TableHead className="text-center">وضعیت</TableHead>
              {canEdit && <TableHead className="text-left">عملیات</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.length > 0 ? (
              materials.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium font-code">{item.materialCode}</TableCell>
                  <TableCell>{item.description}</TableCell>
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
                   {canEdit && (
                    <TableCell className="text-left">
                       <div className="flex items-center justify-end gap-2">
                         <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={canEdit ? 5 : 4} className="h-24 text-center">
                  {hasSearchResults ? 'هیچ نتیجه‌ای برای جستجوی شما یافت نشد.' : 'هیچ آیتمی ثبت نشده است.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
