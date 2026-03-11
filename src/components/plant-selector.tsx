'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { usePlant } from '@/contexts/plant-context';

type Plant = {
  id: string;
  name: string;
};

const plants: Plant[] = [
  { id: 'br-guaiba', name: 'Brasil - Guaíba' },
  { id: 'cl-santafe', name: 'Chile - Santa Fé' },
];

export function PlantSelector() {
  const { selectedPlantId, setSelectedPlantId } = usePlant();
  const selectedPlant = plants.find((p) => p.id === selectedPlantId) || plants[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <span>{selectedPlant.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={selectedPlantId}
          onValueChange={setSelectedPlantId}
        >
          {plants.map((plant) => (
            <DropdownMenuRadioItem key={plant.id} value={plant.id}>
              {plant.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
