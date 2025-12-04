'use client';
import React, { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import type { Material } from '@/lib/types';
import {
  SuggestSimilarMaterialOutput,
  suggestSimilarMaterial,
} from '@/ai/flows/suggest-similar-material';
import { useToast } from '../ui/use-toast';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';

export function SimilarSuggestions({ material }: { material: Material }) {
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] =
    useState<SuggestSimilarMaterialOutput['suggestions']>();
  const { toast } = useToast();

  const handleSuggest = () => {
    startTransition(async () => {
      try {
        const result = await suggestSimilarMaterial({
          name: material.name,
          type: material.type,
          code: material.healthyCode,
          category: material.category,
          status: material.status,
        });
        setSuggestions(result.suggestions);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'خطا',
          description: 'دریافت پیشنهادات مشابه با مشکل مواجه شد.',
        });
      }
    });
  };

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>پیشنهادات هوشمند</CardTitle>
        <CardDescription>
          آیتم‌های مشابه بر اساس هوش مصنوعی
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!suggestions && !isPending && (
          <div className="flex flex-col items-center justify-center text-center p-4 border-2 border-dashed rounded-lg">
             <Lightbulb className="w-10 h-10 text-muted-foreground mb-2"/>
             <p className="text-sm text-muted-foreground mb-4">برای یافتن آیتم‌های مشابهی که ممکن است در انبار موجود باشند، کلیک کنید.</p>
            <Button onClick={handleSuggest}>دریافت پیشنهادات</Button>
          </div>
        )}
        
        {isPending && (
            <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
        )}

        {suggestions && (
          <div className="space-y-3">
            {suggestions.map((item, index) => (
              <div key={index} className="border rounded-md p-3 text-sm hover:bg-muted/50 transition-colors">
                 <div className="flex justify-between items-start">
                    <p className="font-medium">{item.name}</p>
                    <Badge variant="secondary" className="font-code">{Math.round(item.similarityScore * 100)}%</Badge>
                 </div>
                 <p className="text-muted-foreground font-code text-xs">{item.code}</p>
              </div>
            ))}
             <Button variant="outline" className="w-full" onClick={handleSuggest} disabled={isPending}>
                دریافت مجدد
             </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
