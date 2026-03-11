'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { usePlant } from '@/contexts/plant-context';
import { FileText, LayoutDashboard, Home, GraduationCap } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { selectedPlantId } = usePlant();
  const isSantaFe = selectedPlantId === 'cl-santafe';

  const navItems = [
    { href: '/', label: isSantaFe ? 'Inicio' : 'Início', icon: Home },
    ...(selectedPlantId === 'br-guaiba' ? [{ href: '/ast', label: 'AST', icon: FileText }] : []),
    { href: '/pt', label: 'PT', icon: FileText },
    { href: '#', label: 'Dashboard', icon: LayoutDashboard },
    { href: '#', label: isSantaFe ? 'Capacitaciones' : 'Treinamentos', icon: GraduationCap },
  ];

  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border md:hidden">
      <div className="grid h-full mx-auto" style={{ gridTemplateColumns: `repeat(${navItems.length}, 1fr)`}}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = (item.href === '/' && pathname === '/') || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'inline-flex flex-col items-center justify-center px-1 pt-1 text-center hover:bg-accent group',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-[11px] font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}