'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

type PlantContextType = {
  selectedPlantId: string;
  setSelectedPlantId: (id: string) => void;
};

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export function PlantProvider({ children }: { children: ReactNode }) {
  const [selectedPlantId, setSelectedPlantId] = useState('br-guaiba');

  return (
    <PlantContext.Provider value={{ selectedPlantId, setSelectedPlantId }}>
      {children}
    </PlantContext.Provider>
  );
}

export function usePlant() {
  const context = useContext(PlantContext);
  if (context === undefined) {
    throw new Error('usePlant must be used within a PlantProvider');
  }
  return context;
}
