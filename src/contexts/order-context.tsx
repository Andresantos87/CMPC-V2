'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

type OrderDataType = {
  os: string;
  tag: string;
  area: string;
  equipamento: string;
  operacoes: string[];
  dataProgramada: string;
};

type OrderContextType = {
  orderData: OrderDataType | null;
  setOrderData: (data: OrderDataType) => void;
  clearOrderData: () => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orderData, setOrderData] = useState<OrderDataType | null>(null);

  const clearOrderData = () => {
    setOrderData(null);
  };

  return (
    <OrderContext.Provider value={{ orderData, setOrderData, clearOrderData }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
