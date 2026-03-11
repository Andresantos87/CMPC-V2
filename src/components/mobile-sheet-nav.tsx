'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { usePlant } from '@/contexts/plant-context';
import { CMPCLogo } from '@/components/icons';

export function MobileSheetNav() {
  const { selectedPlantId } = usePlant();
  const pathname = usePathname();

  return (
    <nav className="grid gap-4 text-lg font-medium">
      <Link
        href="#"
        className="flex items-center gap-2 text-lg font-semibold mb-4"
      >
        <CMPCLogo className="h-8 w-auto" />
        <span className="font-bold">CMPC</span>
      </Link>
      {selectedPlantId === 'br-guaiba' && (
        <Link
          href="/ast"
          className={cn(
            'flex items-center gap-4 rounded-xl px-3 py-2',
            pathname.startsWith('/ast')
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          AST
        </Link>
      )}
      <Link
        href="/pt"
        className={cn(
          'flex items-center gap-4 rounded-xl px-3 py-2',
          pathname.startsWith('/pt')
            ? 'bg-muted text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        PT
      </Link>
      <Link
        href="#"
        className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
      >
        Dashboard
      </Link>
      <Link
        href="#"
        className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
      >
        Autorização de Acesso
      </Link>
      <Link
        href="#"
        className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
      >
        Consultar Treinamentos
      </Link>
    </nav>
  );
}
