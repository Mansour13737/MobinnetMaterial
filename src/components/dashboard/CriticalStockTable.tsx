import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Material } from '@/lib/types';

interface CriticalStockTableProps {
  items: Material[];
}

export function CriticalStockTable({ items }: CriticalStockTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>هشدار موجودی بحرانی</CardTitle>
        <CardDescription>
          لیست آیتم‌هایی که موجودی آنها کمتر از ۱۰ عدد است.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام متریال</TableHead>
              <TableHead>دسته بندی</TableHead>
              <TableHead className="text-center">وضعیت</TableHead>
              <TableHead className="text-center">تعداد باقی‌مانده</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                   <TableCell className="text-center">
                    <Badge
                      variant={
                        item.status === 'سالم' ? 'default' : 'destructive'
                      }
                      className={item.status === 'سالم' ? 'bg-green-500' : ''}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-bold text-destructive">
                    {item.quantity.toLocaleString('fa-IR')}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  هیچ آیتمی در وضعیت بحرانی قرار ندارد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
