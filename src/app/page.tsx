'use client';

import { CMPCLogo } from "@/components/icons";
import { usePlant } from "@/contexts/plant-context";

export default function Home() {
  const { selectedPlantId } = usePlant();
  const isSantaFe = selectedPlantId === 'cl-santafe';

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <CMPCLogo className="h-24 w-auto text-primary" />
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold tracking-tight">
              {isSantaFe ? 'Bienvenido, Andre Santos' : 'Bem-vindo, Andre Santos'}
            </h1>
            <p className="text-muted-foreground">
              {isSantaFe ? 'CMPC Gestión de AST y PT' : 'CMPC Gestão de AST e PT'}
            </p>
          </div>
          <footer className="mt-8 text-xs text-muted-foreground">
            <p>© Centro de Inovação SESI - Sistemas de Gestão em SST - 2025 - Versão 2.17.1</p>
          </footer>
        </div>
      </div>
    </div>
  );
}