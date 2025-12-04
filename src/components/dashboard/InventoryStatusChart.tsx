'use client';

import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Pie, PieChart, Cell } from 'recharts';

interface InventoryStatusChartProps {
  data: {
    healthyItems: number;
    defectiveItems: number;
  };
}

const chartData = (data: InventoryStatusChartProps['data']) => [
  { name: 'سالم', value: data.healthyItems, fill: 'hsl(var(--chart-1))' },
  { name: 'معیوب', value: data.defectiveItems, fill: 'hsl(var(--destructive))' },
];

const chartConfig = {
  value: {
    label: 'تعداد',
  },
  سالم: {
    label: 'سالم',
    color: 'hsl(var(--chart-1))',
  },
  معیوب: {
    label: 'معیوب',
    color: 'hsl(var(--destructive))',
  },
};

export function InventoryStatusChart({ data }: InventoryStatusChartProps) {
  const preparedData = chartData(data);
  return (
    <div className="h-[250px]">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={preparedData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            strokeWidth={5}
          >
            {preparedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <ChartLegend
            content={<ChartLegendContent nameKey="name" />}
            className="-translate-y-[2rem] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
}
