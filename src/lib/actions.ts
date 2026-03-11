'use server';

import { z } from 'zod';
import { addPermit, updatePermit as dbUpdatePermit } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const RiesgoSchema = z.object({
  categoria: z.string().optional(),
  riesgo: z.string().optional(),
  medida: z.string().optional(),
});

const PasoSchema = z.object({
  descripcion: z.string().optional(),
  isCritico: z.boolean().optional(),
  riesgos: z.array(RiesgoSchema).optional(),
});

const PermitSchema = z.object({
  paradaGeral: z.preprocess((val) => val === 'on' || val === true, z.boolean().optional()),
  demandaTipo: z.string().optional(),
  ast: z.string().optional(),
  dataProgramada: z.string().optional(),
  horaInicio: z.string().optional(),
  area: z.string().optional(),
  empresaTipo: z.string().optional(),
  tag: z.string().optional(),
  os: z.string().optional(),
  descricao: z.string().optional(),
  pasos: z.any().optional(),
  riesgosCriticos: z.any().optional(),
  alturaSubcategorias: z.any().optional(),
  checklists: z.any().optional(),
  epis: z.any().optional(),
  verificacaoOperador: z.any().optional(),
}).passthrough();

export type State = {
  errors?: { [key: string]: string[] | undefined };
  message?: string | null;
};

export async function createPermitAction(formData: FormData): Promise<State> {
  const rawData: any = {};
  formData.forEach((val, key) => {
    if (key.includes('.')) {
      const keys = key.split('.');
      let current = rawData;
      for (let i = 0; i < keys.length; i++) {
        if (i === keys.length - 1) {
          current[keys[i]] = val;
        } else {
          current[keys[i]] = current[keys[i]] || {};
          current = current[keys[i]];
        }
      }
    } else {
      rawData[key] = val;
    }
  });

  const validatedFields = PermitSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: 'Falha na validação.' };
  }

  const permitData = {
    ...validatedFields.data,
    status: 'Pendente' as const,
    requester: 'Andre Santos',
    location: validatedFields.data.area || 'N/A',
    title: validatedFields.data.descricao || 'Nova Permissão',
  };

  await addPermit(permitData as any);
  revalidatePath('/pt');
  redirect('/pt');
}

export async function updatePermitAction(id: string, formData: FormData): Promise<State> {
  // Similar logic for update
  revalidatePath('/pt');
  redirect('/pt');
}
