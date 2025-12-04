'use client';
import React from 'react';
import Link from 'next/link';
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
import { format } from 'date-fns-jalali';
import { Button } from '../ui/button';
import { Edit, Trash2 } from 'lucide-react';
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
              <TableHead>نام متریال</TableHead>
              <TableHead>دسته‌بندی</TableHead>
              <TableHead>کد سالم</TableHead>
              <TableHead className="text-center">تعداد</TableHead>
              <TableHead className="text-center">وضعیت</TableHead>
              <TableHead>آخرین بروزرسانی</TableHead>
              {canEdit && <TableHead className="text-left">عملیات</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.length > 0 ? (
              materials.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <Link href={`/inventory/${item.id}`} className="hover:text-primary hover:underline">
                      {item.name}
                    </Link>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="font-code">{item.healthyCode}</TableCell>
                  <TableCell className="text-center font-medium">{item.quantity.toLocaleString('fa-IR')}</TableCell>
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
                  <TableCell>{format(new Date(item.lastUpdated), 'yyyy/MM/dd')}</TableCell>
                   {canEdit && (
                    <TableCell className="text-left">
                       <div className="flex items-center justify-end gap-2">
                         <Button variant="ghost" size="icon" asChild>
                           <Link href={`/inventory/${item.id}?edit=true`}>
                              <Edit className="h-4 w-4" />
                           </Link>
                         </Button>
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
                <TableCell colSpan={canEdit ? 7 : 6} className="h-24 text-center">
                  {hasSearchResults ? 'هیچ نتیجه‌ای برای جستجوی شما یافت نشد.' : 'هیچ آیتمی در موجودی ثبت نشده است.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
