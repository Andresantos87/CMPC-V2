'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CMPCLogo } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Settings, RefreshCw, User, LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { MainNav } from '@/components/main-nav';
import { PlantSelector } from '@/components/plant-selector';
import { PlantProvider, usePlant } from '@/contexts/plant-context';
import { OrderProvider } from '@/contexts/order-context';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { MobileSheetNav } from '@/components/mobile-sheet-nav';

function Header() {
  const { selectedPlantId } = usePlant();
  const isSantaFe = selectedPlantId === 'cl-santafe';

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-40">
      {/* Desktop Nav */}
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold"
        >
          <CMPCLogo className="h-8 w-auto" />
          <span className="sr-only">CMPC</span>
        </Link>
        <PlantSelector />
        <MainNav />
      </nav>

      {/* Mobile Nav - Hamburger menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">{isSantaFe ? 'Abrir menú' : 'Abrir menu de navegação'}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
           <SheetTitle className="sr-only">Menu</SheetTitle>
           <SheetDescription className="sr-only">Navegação principal da aplicação</SheetDescription>
           <MobileSheetNav />
        </SheetContent>
      </Sheet>

      {/* Mobile Plant Selector - Centered */}
      <div className="flex w-full justify-center md:hidden">
         <PlantSelector />
      </div>

      {/* Right side icons */}
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Configurações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>{isSantaFe ? 'Gestión de Perfil' : 'Gestão de Perfil'}</DropdownMenuItem>
            <DropdownMenuItem>{isSantaFe ? 'Gestión de Usuario' : 'Gestão de Usuário'}</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/painel-administrativo">{isSantaFe ? 'Panel Administrativo' : 'Painel Administrativo'}</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Atualizar</span>
        </Button>
         <Button variant="ghost" size="icon" className="h-8 w-8">
          <User className="h-4 w-4" />
          <span className="sr-only">Usuário</span>
        </Button>
         <Button variant="ghost" size="icon" className="h-8 w-8">
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Sair</span>
        </Button>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen w-full flex-col font-body antialiased">
        <PlantProvider>
          <OrderProvider>
            <Header />
            <main className="flex flex-1 flex-col bg-muted/40 pb-16 md:pb-0">
              {children}
            </main>
            <MobileBottomNav />
          </OrderProvider>
        </PlantProvider>
        <Toaster />
      </body>
    </html>
  );
}