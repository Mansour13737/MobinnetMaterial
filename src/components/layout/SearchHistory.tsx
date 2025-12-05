'use client';

import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { History, Trash2 } from 'lucide-react';
import { useMaterialStore } from '@/store/material-store';
import { Separator } from '@/components/ui/separator';

export function SearchHistory() {
  const { searchHistory, clearSearchHistory } = useMaterialStore();
  
  const handleSelectTerm = (term: string) => {
    // This is a bit of a trick. We can't directly set the state of a different component.
    // Instead, we dispatch a custom event that the search input on the main page can listen for.
    window.dispatchEvent(new CustomEvent('set-search-term', { detail: term }));
    // Close the popover
    document.body.click();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white">
          <History className="mr-2 h-4 w-4" />
          تاریخچه جستجو
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">تاریخچه جستجو</h4>
            <p className="text-sm text-muted-foreground">
              آخرین عبارات جستجو شده شما.
            </p>
          </div>
          <Separator />
          {searchHistory.length > 0 ? (
            <div className="grid gap-2">
              {searchHistory.map((term, index) => (
                <div
                  key={`${term}-${index}`}
                  className="flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
                   onClick={() => handleSelectTerm(term)}
                >
                  <span className="text-sm">{term}</span>
                </div>
              ))}
              <Separator className="my-2" />
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={clearSearchHistory}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                پاک کردن تاریخچه
              </Button>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              تاریخچه جستجوی شما خالی است.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
