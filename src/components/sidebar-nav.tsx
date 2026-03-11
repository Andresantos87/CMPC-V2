'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { FilePlus2, List } from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  {
    href: '/permits/create',
    label: 'Criar planejamento',
    icon: FilePlus2,
  },
  {
    href: '/permits',
    label: 'Consultar liberações',
    icon: List,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={
              item.href === '/permits'
                ? pathname === item.href
                : pathname.startsWith(item.href)
            }
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
