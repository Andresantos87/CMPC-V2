'use client';

import { PermitForm } from '@/components/permit-form';
import { usePlant } from '@/contexts/plant-context';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { getPermitById } from '@/lib/data';
import { Permit } from '@/lib/definitions';
import { Loader2 } from 'lucide-react';

function CreatePermitPageContent() {
  const { selectedPlantId } = usePlant();
  const isSantaFe = selectedPlantId === 'cl-santafe';
  const searchParams = useSearchParams();
  const cloneFromId = searchParams.get('cloneFrom');
  const [permitToClone, setPermitToClone] = React.useState<Permit | undefined>(undefined);
  const [loading, setLoading] = React.useState(!!cloneFromId);

  React.useEffect(() => {
    if (cloneFromId) {
      setLoading(true);
      getPermitById(cloneFromId).then(permit => {
        if (permit) {
          const clonedData = { ...permit };
          // @ts-ignore
          delete clonedData.id;
          delete clonedData.ptNumero;
          delete clonedData.createdAt;
          clonedData.status = 'Pendente';
          if (clonedData.title) {
            clonedData.title = `(Clone) ${clonedData.title}`;
          }
          if (clonedData.actividad) {
            clonedData.actividad = `(Clone) ${clonedData.actividad}`;
          }
          if (clonedData.descricao) {
            clonedData.descricao = `(Clone) ${clonedData.descricao}`;
          }
          setPermitToClone(clonedData as Permit);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [cloneFromId]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (isSantaFe) {
    return (
      <div className="flex w-full justify-center p-4 sm:p-6 lg:p-8">
        <PermitForm type="PT" permit={permitToClone} />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <PermitForm type="PT" permit={permitToClone} />
    </div>
  );
}

export default function CreatePermitPage() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <CreatePermitPageContent />
    </Suspense>
  );
}
