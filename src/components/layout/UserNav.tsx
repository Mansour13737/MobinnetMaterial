'use client';

import React, { useState, createContext, useContext } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserRole } from '@/lib/types';
import { Building, Check, ChevronDown, LogOut, User } from 'lucide-react';

const UserRoleContext = createContext<{
  role: UserRole;
  setRole: React.Dispatch<React.SetStateAction<UserRole>>;
}>({
  role: 'مشاهده‌گر',
  setRole: () => {},
});

export const UserRoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<UserRole>('مشاهده‌گر');
  return (
    <UserRoleContext.Provider value={{ role, setRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => useContext(UserRoleContext);

export function UserNav() {
  const { role, setRole } = useUserRole();

  const handleRoleChange = (value: string) => {
    setRole(value as UserRole);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative flex h-10 items-center gap-2">
            <Avatar className="h-8 w-8">
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="کاربر" />
                <AvatarFallback>
                    <User />
                </AvatarFallback>
            </Avatar>
            <div className="hidden flex-col items-start text-right md:flex">
                <span className="text-sm font-medium">کاربر سیستم</span>
                <span className="text-xs text-muted-foreground">{role}</span>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">کاربر سیستم</p>
            <p className="text-xs leading-none text-muted-foreground">
              user@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={role} onValueChange={handleRoleChange}>
            <DropdownMenuLabel>سطح دسترسی</DropdownMenuLabel>
            <DropdownMenuRadioItem value="مدیر">
                <User className="mr-2 h-4 w-4" />
                <span>مدیر</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="انباردار">
                <Building className="mr-2 h-4 w-4" />
                <span>انباردار</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="مشاهده‌گر">
                <Check className="mr-2 h-4 w-4" />
                <span>مشاهده‌گر</span>
            </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>خروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
