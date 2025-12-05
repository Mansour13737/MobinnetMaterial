'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-[#4A0082] px-4 text-white md:px-6">
      <div className="flex items-center gap-4">
        <Link href="/inventory" className="flex items-center gap-2 text-lg font-bold">
           Mobin-Net Materials
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:block">
            <span className="font-medium">مبین نت</span>
        </div>
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] bg-[#4A0082] text-white">
              <div className="flex flex-col gap-4 p-4">
                <Link href="/inventory" className="mb-4 flex items-center gap-2 text-lg font-bold" onClick={() => setIsMobileMenuOpen(false)}>
                   Mobin-Net Materials
                </Link>
                <div className="border-t border-white/20 pt-4">
                     <span className="font-medium">مبین نت</span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
