import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { InventoryStatusChart } from '@/components/dashboard/InventoryStatusChart';
import { CriticalStockTable } from '@/components/dashboard/CriticalStockTable';
import { getInventoryStats, getMonthlyConsumption } from '@/lib/data';
import { Boxes, CheckCircle, Package, XCircle } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MonthlyConsumptionChart } from '@/components/dashboard/MonthlyConsumptionChart';

export default async function DashboardPage() {
  const stats = await getInventoryStats();
  const consumptionData = await getMonthlyConsumption();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="داشبورد مدیریتی" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="تعداد کل آیتم‌ها"
          value={stats.totalItems.toLocaleString('fa-IR')}
          icon={<Package className="h-6 w-6 text-muted-foreground" />}
          description="مجموع آیتم‌های ثبت شده"
        />
        <StatCard
          title="آیتم‌های سالم"
          value={stats.healthyItems.toLocaleString('fa-IR')}
          icon={<CheckCircle className="h-6 w-6 text-green-500" />}
          description="موجودی آماده استفاده"
        />
        <StatCard
          title="آیتم‌های معیوب"
          value={stats.defectiveItems.toLocaleString('fa-IR')}
          icon={<XCircle className="h-6 w-6 text-red-500" />}
          description="نیاز به بررسی یا تعمیر"
        />
         <StatCard
          title="موجودی بحرانی"
          value={stats.criticalStockItems.length.toLocaleString('fa-IR')}
          icon={<Boxes className="h-6 w-6 text-yellow-500" />}
          description="آیتم‌های با موجودی کم"
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>وضعیت موجودی</CardTitle>
            <CardDescription>نمودار تفکیک آیتم‌های سالم و معیوب</CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryStatusChart data={stats} />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>گزارش مصرف ماهانه</CardTitle>
            <CardDescription>مصرف متریال در ۶ ماه گذشته</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyConsumptionChart data={consumptionData} />
          </CardContent>
        </Card>
      </div>
      <CriticalStockTable items={stats.criticalStockItems} />
    </div>
  );
}
