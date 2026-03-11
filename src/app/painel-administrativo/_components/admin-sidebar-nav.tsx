'use client';

import {
  AlertTriangle,
  Blocks,
  Box,
  ChevronDown,
  ChevronRight,
  Construction,
  HardHat,
  Home,
  FileText,
  FlaskConical,
  LifeBuoy,
  Lock,
  RectangleEllipsis,
  ShieldCheck,
  ShowerHead,
  Siren,
  Wrench,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const menuConfig = [
  {
    title: 'GERAL',
    items: [
      { href: '#', label: 'EPCs', icon: HardHat },
      { href: '#', label: 'EPIs', icon: ShieldCheck },
      { href: '#', label: 'Ferramentas Dedicadas', icon: Wrench },
      { href: '#', label: 'Procedimentos Aplicáveis', icon: FileText },
      { href: '#', label: 'Riscos', icon: AlertTriangle },
      { href: '#', label: 'Treinamentos/NRs', icon: Construction },
    ],
  },
  {
    title: 'APR',
    items: [
      { href: '#', label: 'Consequências', icon: Siren },
      { href: '#', label: 'Medidas Preventivas', icon: LifeBuoy },
    ],
  },
  {
    title: 'PT',
    items: [
      { href: '#', label: 'Atividades Críticas', icon: Zap },
      { href: '#', label: 'Caixa de Bloqueio', icon: Lock },
      { href: '#', label: 'Chuveiros de Emergência', icon: ShowerHead },
      { href: '#', label: 'Espaço Confinado', icon: Box },
    ],
  },
];

export function AdminSidebarNav() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    GERAL: true,
    APR: true,
    PT: true,
  });

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="w-64 border-r bg-gray-50/20">
      <ScrollArea className="h-full">
        <div className="p-4">
          <nav className="space-y-4">
            {menuConfig.map((section) => (
              <div key={section.title}>
                <Button
                  variant="ghost"
                  className="w-full justify-between px-2 text-xs font-semibold uppercase text-muted-foreground"
                  onClick={() => toggleSection(section.title)}
                >
                  {section.title}
                  {openSections[section.title] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                {openSections[section.title] && (
                  <div className="mt-2 space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900',
                          pathname === item.href && 'bg-gray-200 text-gray-900'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </ScrollArea>
    </aside>
  );
}
