import React from 'react';
import { getMaterialById } from '@/lib/data';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { ArrowRight, Edit } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns-jalali';
import { SimilarSuggestions } from '@/components/inventory/SimilarSuggestions';

export default async function MaterialDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const material = await getMaterialById(params.id);

  if (!material) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={material.name}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/inventory">
                <ArrowRight className="ml-2 h-4 w-4" />
                بازگشت به لیست
              </Link>
            </Button>
            <Button>
              <Edit className="ml-2 h-4 w-4" />
              ویرایش
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>مشخصات اصلی</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">نام متریال</p>
                            <p className="font-medium">{material.name}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">دسته بندی</p>
                            <p className="font-medium">{material.category}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">نوع</p>
                            <p className="font-medium">{material.type}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">آخرین بروزرسانی</p>
                            <p className="font-medium">{format(new Date(material.lastUpdated), 'PPPP')}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>کدها و وضعیت</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">کد سالم</p>
                            <p className="font-medium font-code">{material.healthyCode}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">کد معیوب</p>
                            <p className="font-medium font-code">{material.defectiveCode}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">وضعیت</p>
                            <Badge
                                variant={
                                    material.status === 'سالم' ? 'default' : 'destructive'
                                }
                                className={material.status === 'سالم' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700' : ''}
                                >
                                {material.status}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-muted-foreground">تعداد موجودی</p>
                            <p className="font-bold text-lg">{material.quantity.toLocaleString('fa-IR')}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
          <SimilarSuggestions material={material} />
        </div>
      </div>
    </div>
  );
}
