'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { usePlant } from '@/contexts/plant-context';

export function MainNav() {
  const pathname = usePathname();
  const { selectedPlantId } = usePlant();
  const isSantaFe = selectedPlantId === 'cl-santafe';

  return (
    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
      {selectedPlantId === 'br-guaiba' && (
        <Link
          href="/ast"
          className={cn(
            'rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground',
            pathname.startsWith('/ast')
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground'
          )}
        >
          AST
        </Link>
      )}
      <Link
        href="/pt"
        className={cn(
          'rounded-md px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground',
          pathname.startsWith('/pt')
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground'
        )}
      >
        PT
      </Link>
      <Link
        href="#"
        className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        Dashboard
      </Link>
      <Link
        href="#"
        className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        {isSantaFe ? 'Autorización de Acceso' : 'Autorização de Acesso'}
      </Link>
      <Link
        href="#"
        className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        {isSantaFe ? 'Consultar Capacitaciones' : 'Consultar Treinamentos'}
      </Link>
    </nav>
  );
}