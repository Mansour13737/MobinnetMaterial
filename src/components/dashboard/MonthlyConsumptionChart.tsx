'use client';
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

interface MonthlyConsumptionChartProps {
  data: { name: string; consumption: number }[];
}

const chartConfig = {
  consumption: {
    label: 'مصرف',
    color: 'hsl(var(--primary))',
  },
};

export function MonthlyConsumptionChart({ data }: MonthlyConsumptionChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar
          dataKey="consumption"
          fill="var(--color-consumption)"
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  );
}
