'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { UserNav } from './UserNav';

const MobinnetLogo = () => (
  <svg
    width="100"
    height="32"
    viewBox="0 0 133 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-white"
  >
    <path
      d="M101.442 23.3917L101.442 8.53271H105.155L105.155 23.3917H101.442Z"
      fill="currentColor"
    />
    <path
      d="M117.973 23.3917L117.973 8.53271H121.686L121.686 23.3917H117.973Z"
      fill="currentColor"
    />
    <path
      d="M107.568 15.7031H115.56V19.6405H107.568V15.7031Z"
      fill="currentColor"
    />
    <path
      d="M132.842 8.53271L126.786 8.53271L126.786 23.3917H123.073L123.073 8.53271L117.017 8.53271L117.017 4.75781L132.842 4.75781V8.53271Z"
      fill="currentColor"
    />
    <path
      d="M87.3516 23.3917L91.4397 23.3917L91.4397 12.3076C91.4397 10.9785 91.8154 10.314 92.5667 10.314C93.292 10.314 93.6416 10.9526 93.6416 12.2558L93.6416 23.3917L97.7297 23.3917L97.7297 11.586C97.7297 8.55859 95.8233 6.94043 93.0035 6.94043C91.4397 6.94043 90.1645 7.60498 89.2846 8.82812L89.2846 7.19922L85.4965 7.19922L85.4965 23.3917L87.3516 23.3917Z"
      fill="currentColor"
    />
    <path
      d="M74.9609 7.19922L74.9609 23.3917H78.8856L78.8856 16.3262H79.014L83.0215 23.3917H86.0489L81.2587 15.05L85.625 7.19922H82.4931L79.4657 13.5674H79.3373L79.3373 7.19922H74.9609Z"
      fill="currentColor"
    />
    <path
      d="M62.0645 7.19922L62.0645 23.3917H72.4172V19.6168H65.7773V7.19922H62.0645Z"
      fill="currentColor"
    />
    <path
      d="M48.7754 7.19922L48.7754 23.3917H58.9427V19.6168H52.4883V14.544H57.8742V10.7691H52.4883V7.19922H48.7754Z"
      fill="currentColor"
    />
    <path
      d="M31.3965 7.19922V23.3917H46.1025V19.5909H35.1094V7.19922H31.3965Z"
      fill="currentColor"
    />
    <path
      d="M17.8488 23.3917L21.9369 23.3917L21.9369 12.3076C21.9369 10.9785 22.3126 10.314 23.0639 10.314C23.7892 10.314 24.1388 10.9526 24.1388 12.2558L24.1388 23.3917L28.2269 23.3917L28.2269 11.586C28.2269 8.55859 26.3205 6.94043 23.5007 6.94043C21.9369 6.94043 20.6617 7.60498 19.7818 8.82812L19.7818 7.19922L15.9937 7.19922L15.9937 23.3917L17.8488 23Z"
      fill="currentColor"
    />
    <path
      d="M22.8776 2.37891C22.8776 3.65413 21.8335 4.69824 20.5583 4.69824C19.2831 4.69824 18.239 3.65413 18.239 2.37891C18.239 1.10368 19.2831 0.0595703 20.5583 0.0595703C21.8335 0.0595703 22.8776 1.10368 22.8776 2.37891Z"
      fill="#00A2E1"
    />
    <path
      d="M56.8856 2.37891C56.8856 3.65413 55.8415 4.69824 54.5663 4.69824C53.2911 4.69824 52.247 3.65413 52.247 2.37891C52.247 1.10368 53.2911 0.0595703 54.5663 0.0595703C55.8415 0.0595703 56.8856 1.10368 56.8856 2.37891Z"
      fill="#00A2E1"
    />
    <path
      d="M95.602 2.37891C95.602 3.65413 94.5579 4.69824 93.2827 4.69824C92.0075 4.69824 90.9634 3.65413 90.9634 2.37891C90.9634 1.10368 92.0075 0.0595703 93.2827 0.0595703C94.5579 0.0595703 95.602 1.10368 95.602 2.37891Z"
      fill="#00A2E1"
    />
    <path
      d="M12.285 23.3917H8.57227V7.19922H-3.8147e-06L-5.09317e-06 3.42432L16.0204 3.42432L16.0204 7.19922H12.285V23.3917Z"
      fill="currentColor"
    />
  </svg>
);

export function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-[#4A0082] px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Link href="/inventory" className="flex items-center gap-2">
           <MobinnetLogo />
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px]">
              <div className="flex flex-col gap-4 p-4">
                <Link href="/inventory" className="mb-4 flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                   <MobinnetLogo />
                </Link>
                {/* Mobile navigation can be added here if needed in the future */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <UserNav />
      </div>
    </header>
  );
}
