'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { List, TowerControl } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      href: '/inventory',
      label: 'لیست متریال',
      icon: List,
    },
  ];

  return (
    <Sidebar side="right" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
           <TowerControl className="h-8 w-8 text-primary" />
           <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
             Material List
           </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                as={Link}
                href={item.href}
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
                className={cn(
                  'justify-start',
                  'group-data-[collapsible=icon]:justify-center'
                )}
              >
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
