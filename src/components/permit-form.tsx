'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { useForm, FormProvider, useFormContext, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createPermitAction, updatePermitAction } from '@/lib/actions';
import type { Permit, OrdemServico } from '@/lib/definitions';
import { getOrdensServico, getPermits } from '@/lib/data';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Loader2, 
  Search, 
  ChevronRight, 
  AlertTriangle, 
  Plus, 
  FileText, 
  ChevronUp, 
  Trash2, 
  Save, 
  Filter, 
  X, 
  CheckCircle2, 
  Eye, 
  ArrowLeft, 
  Clock, 
  Zap,
  Flame,
  Split,
  ArrowUpToLine,
  ArrowUpRight,
  Droplets,
  Box,
  Radiation,
  ThermometerSun,
  Construction,
  FlaskConical,
  Ship,
  Mountain,
  Waves,
  Check,
  ShieldCheck,
  Home,
  Truck,
  Anchor,
  ShieldAlert,
  HardHat,
  Wind,
  Hand,
  Footprints,
  Shirt,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePlant } from '@/contexts/plant-context';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useOrder } from '@/contexts/order-context';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sharedFormSchema = z.object({
  paradaGeral: z.boolean().optional(),
  demandaTipo: z.string().optional(),
  outraAtividade: z.string().optional(),
  ast: z.string().optional(),
  ptNumero: z.string().optional(),
  dataProgramada: z.string().optional(),
  horaInicio: z.string().optional(),
  dataFim: z.string().optional(),
  horaFim: z.string().optional(),
  planta: z.string().optional(),
  area: z.string().optional(),
  tag: z.string().optional(),
  equipamento: z.string().optional(),
  os: z.string().optional(),
  om: z.string().optional(),
  ruta: z.string().optional(),
  empresaTipo: z.string().optional(),
  empresaNome: z.string().optional(),
  descricao: z.string().optional(),
  pontoAmbulancia: z.string().optional(),
  chuveiroEmergencia: z.string().optional(),
  riesgosCriticos: z.array(z.string()).default([]),
  alturaSubcategorias: z.array(z.string()).default([]),
  checklists: z.any().optional(),
  epis: z.record(z.array(z.string())).default({}),
  listaVerificacaoOperador: z.array(z.string()).default([]),
  verificacaoOperador: z.record(z.string()).default({}),
  listaVerificacaoOutros: z.array(z.string()).default([]),
  pasos: z.array(z.object({
    isCritico: z.boolean().default(false),
    descripcion: z.string().optional(),
    riesgos: z.array(z.object({
      categoria: z.string().optional(),
      riesgo: z.string().optional(),
      medida: z.string().optional(),
    })).default([]),
  })).optional(),
  accionOperativa: z.object({
    enabled: z.boolean().default(false),
    isCritico: z.boolean().default(false),
    descripcion: z.string().optional(),
    riesgos: z.array(z.object({
      categoria: z.string().optional(),
      riesgo: z.string().optional(),
      medida: z.string().optional(),
    })).default([]),
  }).optional(),
  imprevistos: z.object({
    enabled: z.boolean().default(false),
    isCritico: z.boolean().default(false),
    descripcion: z.string().optional(),
    riesgos: z.array(z.object({
      categoria: z.string().optional(),
      riesgo: z.string().optional(),
      medida: z.string().optional(),
    })).default([]),
  }).optional(),
}).passthrough();

type PermitFormProps = {
  permit?: Permit;
  type: 'AST' | 'PT';
};

const MandatoryLabel = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <FormLabel className={cn("text-black font-medium", className)}>
    {children}
    <span className="text-red-500 ml-1 font-bold">*</span>
  </FormLabel>
);

const RiskList = ({ name, isSantaFe }: { name: string, isSantaFe: boolean }) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${name}.riesgos`
  });

  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [newRisk, setNewRisk] = React.useState({ categoria: 'Seguridad', risco: '', medida: '' });
  const [wasAutoFilled, setWasAutoFilled] = React.useState(false);

  const riskDefaults: Record<string, string> = {
    'Asfixia o atmósfera peligrosa en espacios confinados': 'Permiso de entrada, medición de oxígeno y gases, vigía externo, ventilación, plan de rescate',
    'Caída a distinto nivel': 'Uso de arnés de segurança com duplo talabarte, pontos de ancoragem certificados, linhas de vida.',
    'Atrapamiento por partes móviles': 'Bloqueio de energias (LOTO), proteções de segurança, não usar roupas soltas ou joias.',
    'Contacto con energía elétrica': 'Uso de luvas dielétricas, ferramentas isoladas, bloqueio elétrico verificado.',
    'Exposición a sustancias peligrosas': 'Uso de traje Tyvek, luvas químicas, máscara com filtros específicos, chuveiro de emergência próximo.',
    'Atropello por maquinaria': 'Segregação de áreas, uso de colete refletivo, contato visual com o operador.',
  };

  const handleRiesgoChange = (val: string) => {
    const defaultMedida = riskDefaults[val] || '';
    setNewRisk(prev => ({ ...prev, risco: val, medida: defaultMedida }));
    setWasAutoFilled(!!defaultMedida);
  };

  const handleAddRisk = () => {
    append({ 
      categoria: newRisk.categoria,
      riesgo: newRisk.risco, 
      medida: newRisk.medida 
    });
    setNewRisk({ categoria: 'Seguridad', risco: '', medida: '' });
    setWasAutoFilled(false);
    setIsSheetOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-500">
          {isSantaFe 
            ? 'Riesgos asociados a la atividade descrita, junto a sus medidas de control correspondientes' 
            : 'Riscos associados à atividade descrita, junto às suas medidas de controle correspondentes'}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
            <Filter className="h-4 w-4" />
          </Button>
          <Button 
            type="button"
            size="sm"
            onClick={() => setIsSheetOpen(true)}
            className="bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-md text-xs h-8 px-3 font-bold"
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            {isSantaFe ? 'Nuevo riesgo' : 'Novo risco'}
          </Button>
        </div>
      </div>

      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50/50 rounded-md border border-gray-100">
          <div className="h-10 w-10 text-gray-200 mb-2">
             <FileText className="h-full w-full" />
          </div>
          <p className="text-sm font-bold text-black">{isSantaFe ? 'Sin dados disponíveis' : 'Sem dados disponíveis'}</p>
          <p className="text-xs text-gray-400">
            {isSantaFe 
              ? 'Los datos aparecerán aquí una vez se agreguen registros' 
              : 'Os dados aparecerão aqui assim que os registros forem adicionados'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md relative group bg-white">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute top-1 right-1 h-6 w-6 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-gray-400">{isSantaFe ? 'Categoría' : 'Categoria'}</p>
                <p className="text-sm font-medium">{(field as any).categoria || 'Seguridad'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-gray-400">{isSantaFe ? 'Riesgo' : 'Risco'}</p>
                <p className="text-sm font-medium">{(field as any).riesgo}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-gray-400">{isSantaFe ? 'Medida' : 'Medida'}</p>
                <p className="text-sm font-medium">{(field as any).medida}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="sm:max-w-md w-full">
          <SheetHeader className="border-b pb-4 mb-6">
            <SheetTitle className="text-xl font-bold">{isSantaFe ? 'Nuevo riesgo' : 'Novo risco'}</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-8 py-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-black">
                {isSantaFe ? 'Categoría' : 'Categoria'} <span className="text-red-500">*</span>
              </Label>
              <Select defaultValue="Seguridad" onValueChange={(val) => setNewRisk({...newRisk, categoria: val})}>
                <SelectTrigger className="h-11 rounded-[4px] border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Seguridad">{isSantaFe ? 'Seguridad' : 'Segurança'}</SelectItem>
                  <SelectItem value="Salud">{isSantaFe ? 'Salud' : 'Saúde'}</SelectItem>
                  <SelectItem value="Medio Ambiente">{isSantaFe ? 'Medio Ambiente' : 'Meio Ambiente'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-black">
                {isSantaFe ? 'Riesgo asociado a matriz de riesgo' : 'Risco associado à matriz de risco'} <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={handleRiesgoChange} value={newRisk.risco}>
                <SelectTrigger className="h-11 rounded-[4px] border-gray-200">
                  <SelectValue placeholder={isSantaFe ? "Selecciona una option" : "Selecione uma opção"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asfixia o atmósfera peligrosa en espacios confinados">{isSantaFe ? 'Asfixia o atmósfera peligrosa en espaços confinados' : 'Asfixia ou atmosfera perigosa em espaços confinados'}</SelectItem>
                  <SelectItem value="Caída a distinto nivel">{isSantaFe ? 'Caída a distinto nivel' : 'Queda em nível diferente'}</SelectItem>
                  <SelectItem value="Atrapamiento por partes móviles">{isSantaFe ? 'Atrapamiento por partes móviles' : 'Aprisionamento por partes móveis'}</SelectItem>
                  <SelectItem value="Contacto con energia elétrica">{isSantaFe ? 'Contacto con energia elétrica' : 'Contato com energia elétrica'}</SelectItem>
                  <SelectItem value="Exposición a sustancias peligrosas">{isSantaFe ? 'Exposición a sustancias peligrosas' : 'Exposição a substâncias perigosas'}</SelectItem>
                  <SelectItem value="Atropello por maquinaria">{isSantaFe ? 'Atropello por maquinaria' : 'Atropelamento por maquinário'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-black">
                {isSantaFe ? 'Medidas de control' : 'Medidas de controle'} <span className="text-red-500">*</span>
              </Label>
              <Textarea 
                className="min-h-[120px] rounded-[4px] border-gray-200 resize-none bg-gray-50/30" 
                placeholder={isSantaFe ? "Ingrese las medidas de control..." : "Digite as medidas de controle..."}
                value={newRisk.medida}
                onChange={(e) => {
                  setNewRisk({...newRisk, medida: e.target.value});
                  setWasAutoFilled(false);
                }}
              />
              {wasAutoFilled && (
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-green-600 mt-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {isSantaFe ? 'Valor asignado en base al riesgo seleccionado' : 'Valor atribuído com base no risco selecionado'}
                </p>
              )}
            </div>
          </div>

          <SheetFooter className="absolute bottom-0 left-0 w-full p-6 border-t bg-white flex flex-row gap-4 sm:justify-start">
            <Button 
              type="button" 
              onClick={handleAddRisk}
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-full px-10 h-11 font-bold transition-all active:scale-95"
            >
              {isSantaFe ? 'Guardar' : 'Salvar'}
            </Button>
            <SheetClose asChild>
              <Button variant="outline" className="rounded-full px-10 h-11 font-bold border-gray-300 text-gray-600 hover:bg-gray-50">
                {isSantaFe ? 'Cancelar' : 'Cancelar'}
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

const ChecklistQuestionTable = ({ 
  questions, 
  categoryId, 
  role, 
  isSantaFe, 
  disabled 
}: { 
  questions: any[], 
  categoryId: string, 
  role: 'EXECUTANTE' | 'EMITENTE', 
  isSantaFe: boolean, 
  disabled: boolean 
}) => {
  const { control } = useFormContext();
  
  if (questions.length === 0) return null;

  return (
    <Table className="border rounded-[4px] overflow-hidden bg-white table-fixed w-full">
      <TableHeader className="bg-gray-50/30">
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[75%] h-7 px-2 text-[9px] uppercase font-bold text-gray-400">{isSantaFe ? 'Pregunta' : 'Pergunta'}</TableHead>
          <TableHead className="text-center h-7 px-2 text-[9px] uppercase font-bold text-gray-400">{isSantaFe ? 'Resp.' : 'Resp.'}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map((q, idx) => (
          <TableRow key={`${categoryId}-${role}-${idx}`} className={cn("hover:bg-gray-50/30 transition-colors", disabled && "opacity-60 bg-gray-50/20")}>
            <TableCell className="text-[11px] font-medium text-gray-600 leading-tight py-1.5 px-2">
              {q.text}
            </TableCell>
            <TableCell className="text-center py-1.5 px-2">
              <FormField
                control={control}
                name={`checklists.${categoryId}.${role}.${idx}`}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={disabled}
                    className="flex items-center justify-center gap-1.5"
                  >
                    {['si', 'no', 'na'].map((opt) => (
                      <div key={opt} className="flex items-center">
                        <RadioGroupItem value={opt} id={`${categoryId}-${role}-${idx}-${opt}`} className="sr-only" />
                        <Label
                          htmlFor={`${categoryId}-${role}-${idx}-${opt}`}
                          className={cn(
                            "h-5 min-w-[26px] px-1 flex items-center justify-center rounded-[3px] border text-[9px] font-bold uppercase transition-all",
                            !disabled && "cursor-pointer",
                            field.value === opt
                              ? (role === 'EMITENTE' ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-orange-600 text-white border-orange-600 shadow-sm")
                              : "bg-white text-gray-300 border-gray-100"
                          )}
                        >
                          {opt}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const RoleCategoryAccordion = ({ 
  categoryId, 
  questions, 
  role, 
  isSantaFe, 
  disabled,
  imageUrl
}: { 
  categoryId: string, 
  questions: any[], 
  role: 'EXECUTANTE' | 'EMITENTE', 
  isSantaFe: boolean, 
  disabled: boolean,
  imageUrl?: string
}) => {
  const { watch } = useFormContext();
  const roleQuestions = questions.filter(q => q.resp === role);
  
  if (roleQuestions.length === 0) return null;

  const answers = watch(`checklists.${categoryId}.${role}`);
  const isComplete = React.useMemo(() => {
    if (!answers) return false;
    const answeredCount = Object.keys(answers).length;
    return answeredCount === roleQuestions.length && 
           Object.values(answers).every(val => val !== undefined && val !== null);
  }, [answers, roleQuestions]);

  return (
    <AccordionItem value={`${role}-${categoryId}`} className="border border-gray-100 rounded-lg overflow-hidden bg-white px-4">
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex items-center gap-3 w-full text-left">
          <h3 className="text-[10px] font-black text-[#4CAF50] uppercase tracking-widest bg-[#4CAF50]/5 px-3 py-1 rounded-full border border-[#4CAF50]/10">
            {categoryId.toUpperCase()}
          </h3>
          {isComplete && (
            <Badge variant="outline" className="ml-auto bg-green-50 text-green-600 border-green-200 gap-1.5 h-6 px-2 rounded-full font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {isSantaFe ? 'CONCLUÍDO' : 'CONCLUÍDO'}
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-6">
        <div className={cn(imageUrl ? "flex flex-col lg:flex-row gap-6 items-start" : "block")}>
           {imageUrl && (
             <div className="w-full lg:w-1/2 flex-shrink-0">
               <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center p-2 min-h-[250px]">
                 <img 
                   src={imageUrl} 
                   alt={`Referência ${categoryId}`} 
                   className="max-w-full h-auto object-contain rounded"
                 />
               </div>
             </div>
           )}
           <div className="w-full">
            <ChecklistQuestionTable 
              categoryId={categoryId}
              questions={roleQuestions}
              role={role}
              isSantaFe={isSantaFe}
              disabled={disabled}
            />
           </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};


const EpiSection = ({ isSantaFe }: { isSantaFe: boolean }) => {
  const { watch, setValue } = useFormContext();
  const episWatch = watch('epis') || {};

  const categories = [
    {
      id: 'tronco',
      label: isSantaFe ? 'Protección cuerpo' : 'Proteção do Corpo',
      description: isSantaFe ? 'Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list.' : 'Responda à pergunta frequente em uma frase simples, um parágrafo longo ou até mesmo em uma lista.',
      icon: Shirt,
      items: [
        'Camisa manga longa com refletivo',
        'Colete refletivo',
        'Conjunto de raspa',
        'Vestimenta anticorte / Hidrojato',
        'Conjunto impermeável (Tychem)',
        'Conjunto para poeiras (Tyvek)',
        'Conjunto Barreira química',
        'Colete salva-vidas'
      ]
    },
    {
      id: 'inferiores',
      label: isSantaFe ? 'Calzado' : 'Calçados',
      description: isSantaFe ? 'Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list.' : 'Responda à pergunta frequente em uma frase simples, um parágrafo longo ou até mesmo em uma lista.',
      icon: Footprints,
      items: [
        'Calçado com bico de Aço',
        'Calçado com bico Composite',
        'Bota PVC com bico',
        'Meias de malha anti corte'
      ]
    },
    {
      id: 'respiratoria',
      label: isSantaFe ? 'Protección respiratoria' : 'Proteção Respiratória',
      description: isSantaFe ? 'Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list.' : 'Responda à pergunta frequente em uma frase simples, um parágrafo longo ou até mesmo em uma lista.',
      icon: Wind,
      items: [
        'Máscara poeiras / Névoas / Fumos',
        'Máscara e filtro contra gases',
        'Máscara de fuga',
        'Linha com ar mandado',
        'Conjunto autônomo de ar respirável'
      ]
    },
    {
       id: 'medicion',
       label: isSantaFe ? 'Equipo de medición' : 'Equipamento de Medição',
       description: isSantaFe ? 'Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list.' : 'Responda à pergunta frequente em uma frase simples, um parágrafo longo ou até mesmo em uma lista.',
       icon: Zap,
       items: [
         'Explosímetro',
         'Oxímetro',
         'Medidor multigás',
         'Termômetro infravermelho'
       ]
    },
    {
      id: 'outros',
      label: isSantaFe ? 'Otros EPP' : 'Outros EPIs',
      description: isSantaFe ? 'Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list.' : 'Responda à pergunta frequente em uma frase simples, um parágrafo longo ou até mesmo em uma lista.',
      icon: Sparkles,
      items: [
        'Creme de proteção química',
        'Proteção solar',
        'Conjunto para mergulho',
        'Capacete com jugular',
        'Protetor auditivo',
        'Óculos de Impacto'
      ]
    }
  ];

  const handleToggle = (categoryId: string, item: string) => {
    const current = [...(episWatch[categoryId] || [])];
    const index = current.indexOf(item);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(item);
    }
    setValue(`epis.${categoryId}`, current, { shouldDirty: true });
  };

  const handleClear = (categoryId: string) => {
    setValue(`epis.${categoryId}`, [], { shouldDirty: true });
  };

  return (
    <div className="space-y-8 pt-10 border-t border-gray-100">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-black tracking-tight">
          {isSantaFe ? 'EPP - Equipamiento de protección personal' : 'EPI - Equipamento de Proteção Individual'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
        {categories.map((cat) => {
          const selectedItems = episWatch[cat.id] || [];
          return (
            <div key={cat.id} className="space-y-3">
              <h3 className="font-bold text-black text-lg">{cat.label}</h3>
              <p className="text-sm text-gray-500 leading-snug">
                {cat.description}
              </p>
              
              <div className="relative">
                <div className="min-h-[44px] w-full border border-gray-200 rounded-md bg-white p-1.5 pr-[85px] flex flex-wrap gap-1.5 transition-all focus-within:ring-1 focus-within:ring-gray-300">
                  {selectedItems.length === 0 && (
                    <span className="text-sm text-gray-300 py-1 px-2 italic">
                      {isSantaFe ? 'Seleccionar...' : 'Selecionar...'}
                    </span>
                  )}
                  {selectedItems.map((item: string) => (
                    <Badge 
                      key={item} 
                      variant="secondary" 
                      className="bg-[#E2E8F0] hover:bg-gray-300 text-[#475569] border-none text-[11px] font-medium py-0.5 pl-2 pr-1 gap-1 h-7 rounded-[4px] inline-flex items-center max-w-[calc(100%-8px)] truncate"
                    >
                      <span className="truncate">{item}</span>
                      <button 
                        type="button"
                        onClick={() => handleToggle(cat.id, item)}
                        className="hover:bg-gray-400/20 rounded-full p-0.5 shrink-0"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                
                {/* Floating UI Elements on the right - Fixed position within the relative container */}
                <div className="absolute right-2 top-1.5 bottom-1.5 flex items-center gap-1.5 bg-white pl-2">
                  {selectedItems.length > 0 && (
                    <span className="text-[11px] font-bold text-gray-400">+{selectedItems.length}</span>
                  )}
                  <button 
                    type="button"
                    onClick={() => handleClear(cat.id)}
                    className="text-gray-400 hover:text-red-500 rounded p-1 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <Separator orientation="vertical" className="h-4 bg-gray-200" />
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className="text-gray-400 hover:text-black p-1 transition-colors">
                        <ChevronRight className="h-4 w-4 rotate-90" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-2" align="end">
                      <div className="max-h-[300px] overflow-y-auto space-y-1">
                        {cat.items.map((item) => {
                          const isSelected = selectedItems.includes(item);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => handleToggle(cat.id, item)}
                              className={cn(
                                "w-full flex items-center gap-2 p-2 rounded-md text-xs font-medium transition-colors text-left",
                                isSelected ? "bg-gray-100 text-black" : "hover:bg-gray-50 text-gray-600"
                              )}
                            >
                              {isSelected ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : <div className="h-3.5 w-3.5" />}
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OperatorVerificationSection = ({ isSantaFe }: { isSantaFe: boolean }) => {
  const { control, watch } = useFormContext();
  const [openSections, setOpenSections] = React.useState<string[]>(['section-1']);

  const sections = [
    {
      id: 'section-1',
      title: isSantaFe ? '1. ENERGÍAS, BLOQUEOS Y FLUIDOS (LOTO & PROCESO)' : '1. ENERGIAS, BLOQUEIOS E FLUIDOS (LOTO & PROCESSO)',
      questions: [
        { 
          id: '1.1', 
          perigo: isSantaFe ? 'Equipo Energizado' : 'Equipamento Energizado',
          text: isSantaFe ? '¿Fuentes de energía bloqueadas (LOTO), probadas y señalizadas?' : 'Fontes de energia bloqueadas (LOTO), testadas e sinalizadas?' 
        },
        { 
          id: '1.2', 
          perigo: isSantaFe ? 'Fluido bajo Presión / Fuga' : 'Fluido sob Pressão / Vazamento',
          text: isSantaFe ? '¿El sistema está drenado, despresurizado, raqueteado o flangeado?' : 'Sistema está drenado, despressurizado, raqueteado ou flangeado?' 
        },
        { 
          id: '1.3', 
          perigo: isSantaFe ? 'Superficie Caliente / Térmico' : 'Superfície Quente / Térmico',
          text: isSantaFe ? '¿Equipos/túbulos aislados o enfriados para evitar el contacto?' : 'Equipamentos/tubulações isolados ou resfriados para evitar contato?' 
        },
        { 
          id: '1.4', 
          perigo: isSantaFe ? 'Gases, Vapores y Nieblas' : 'Gases, Vapores e Névoas',
          text: isSantaFe ? '¿Se realizó desgasificación, inertización, purga o lavado previo?' : 'Realizada desgaseificação, inertização, expurgo ou lavagem prévia?' 
        },
        { 
          id: '1.5', 
          perigo: isSantaFe ? 'Incendio y Explosión' : 'Incêndio e Explosão',
          text: isSantaFe ? '¿Área libre de combustibles y se realizó monitoreo atmosférico?' : 'Área livre de combustíveis e monitoramento atmosférico realizado?' 
        },
      ]
    },
    {
      id: 'section-2',
      title: isSantaFe ? '2. AMBIENTE DE TRABAJO Y ACCESOS (ENTORNO)' : '2. AMBIENTE DE TRABALHO E ACESSOS (ENTORNO)',
      questions: [
        {
          id: '2.1',
          perigo: isSantaFe ? 'Piso Irregular / Resbaladizo' : 'Piso Irregular / Escorregadio',
          text: isSantaFe ? '¿Área limpia, organizada y libre de aceite, grasa o residuos?' : 'Área limpa, organizada e livre de óleo, graxa ou resíduos?'
        },
        {
          id: '2.2',
          perigo: isSantaFe ? 'Obstrucción de Accesos' : 'Obstrução de Acessos',
          text: isSantaFe ? '¿Pasillos, salidas de emergencia y duchas están despejados?' : 'Passagens, saídas de emergência e chuveiros estão desobstruídos?'
        },
        {
          id: '2.3',
          perigo: isSantaFe ? 'Iluminación / Ventilación' : 'Iluminação / Ventilação',
          text: isSantaFe ? '¿Niveles de luz y renovación de aire adecuados?' : 'Níveis de luz e renovação de ar (exaustão/ventilação) adequados?'
        },
        {
          id: '2.4',
          perigo: isSantaFe ? 'Animales Ponzoñosos' : 'Animais Peçonhentos',
          text: isSantaFe ? '¿Inspección visual realizada y área libre de insectos/serpientes?' : 'Inspeção visual realizada e área livre de insetos/serpientes?'
        },
        {
          id: '2.5',
          perigo: isSantaFe ? 'Ruido y Vibración' : 'Ruído e Vibração',
          text: isSantaFe ? '¿Niveles de ruido permanente identificados y controlados?' : 'Níveis de ruído permanente identificados e controlados?'
        },
        {
          id: '2.6',
          perigo: isSantaFe ? 'Radiación Ionizante' : 'Radiação Ionizante',
          text: isSantaFe ? '¿Fuentes radiográficas o industriales identificadas y aisladas?' : 'Fontes radiográficas ou industriais identificadas e isoladas?'
        }
      ]
    }
  ];

  const verificacaoWatch = watch('verificacaoOperador') || {};

  React.useEffect(() => {
    sections.forEach(section => {
      const allAnswered = section.questions.every(q => verificacaoWatch[q.id]);
      if (allAnswered && openSections.includes(section.id)) {
        setOpenSections(prev => prev.filter(id => id !== section.id));
      }
    });
  }, [verificacaoWatch]);

  return (
    <div className="space-y-6 pt-6">
      <div className="space-y-2 mb-6">
        <h2 className="text-2xl font-bold text-black tracking-tight">
          {isSantaFe ? 'Evaluación del entorno' : 'Avaliação do Entorno'}
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full">
          <Accordion 
            type="multiple" 
            value={openSections} 
            onValueChange={setOpenSections}
            className="space-y-4"
          >
            {sections.map((section) => {
              const answeredCount = section.questions.filter(q => verificacaoWatch[q.id]).length;
              const isComplete = answeredCount === section.questions.length;

              return (
                <AccordionItem 
                  key={section.id} 
                  value={section.id} 
                  className="border border-gray-100 rounded-lg bg-white overflow-hidden shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline text-left">
                    <div className="flex items-center gap-4 w-full">
                      <h3 className={cn(
                        "text-xs font-black uppercase tracking-widest leading-none",
                        isComplete ? "text-green-600" : "text-[#5C8D3C]"
                      )}>
                        {section.title}
                      </h3>
                      {isComplete ? (
                        <Badge variant="outline" className="ml-auto bg-green-50 text-green-600 border-green-200 gap-1.5 h-6 px-2 rounded-full font-bold shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {isSantaFe ? 'COMPLETO' : 'COMPLETO'}
                        </Badge>
                      ) : (
                        <span className="ml-auto text-[10px] font-bold text-gray-400 shrink-0">
                          {answeredCount}/{section.questions.length}
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 pt-2 border-t border-gray-50">
                    <div className="space-y-8 max-w-3xl mt-4">
                      {section.questions.map((q) => (
                        <div key={q.id} className="space-y-3">
                          <div className="flex items-start gap-2">
                            <span className="text-sm font-bold text-[#5C8D3C] min-w-[24px]">{q.id}</span>
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-black uppercase leading-tight">
                                {q.perigo}
                              </p>
                              <p className="text-sm font-medium text-gray-600 leading-tight text-justify">
                                {q.text}
                              </p>
                            </div>
                          </div>
                          
                          <div className="pl-8">
                            <FormField
                              control={control}
                              name={`verificacaoOperador.${q.id}`}
                              render={({ field }) => (
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex items-center gap-6"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem 
                                      value="sim" 
                                      id={`${q.id}-sim`} 
                                      className="border-gray-300 text-[#5C8D3C] focus:ring-[#5C8D3C]" 
                                    />
                                    <Label htmlFor={`${q.id}-sim`} className="text-sm text-gray-600 font-medium cursor-pointer">
                                      {isSantaFe ? 'Si' : 'Sim'}
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem 
                                      value="na" 
                                      id={`${q.id}-na`} 
                                      className="border-gray-300 text-[#5C8D3C] focus:ring-[#5C8D3C]" 
                                    />
                                    <Label htmlFor={`${q.id}-na`} className="text-sm text-gray-600 font-medium cursor-pointer">
                                      N/A
                                    </Label>
                                  </div>
                                </RadioGroup>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        <div className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-8">
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-md bg-white p-2">
            <img 
              src="/Andaime.png" 
              alt="Referência de Andaime" 
              className="w-full h-auto rounded-lg object-contain"
            />
            <p className="text-[10px] text-gray-400 mt-2 text-center uppercase font-bold tracking-wider">
              {isSantaFe ? 'Referencia de seguridad' : 'Referência de Segurança'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3 mt-6 max-w-4xl">
        <ShieldAlert className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 font-medium">
          {isSantaFe 
            ? 'Esta sección debe ser completada por o en presencia del Operador Responsable del área.' 
            : 'Esta seção deve ser preenchida pelo ou na presença do Operador Responsável da área.'}
        </div>
      </div>
    </div>
  );
};

const PermitFormContent = ({
  permit,
  type,
  isSantaFe,
}: PermitFormProps & { isSantaFe: boolean }) => {
  const form = useFormContext();
  const { watch, control, setValue } = form;
  const [currentStep, setCurrentStep] = React.useState(0);
  const [ordensServico, setOrdensServico] = React.useState<OrdemServico[]>([]);
  const [isAstDialogOpen, setIsAstDialogOpen] = React.useState(false);
  const [allAstsForSelection, setAllAstsForSelection] = React.useState<Permit[]>([]);
  const [searchAstTerm, setSearchAstTerm] = React.useState('');
  
  const [astToPreview, setAstToPreview] = React.useState<Permit | null>(null);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "pasos"
  });

  const steps = isSantaFe
    ? ['Información general', 'Análisis de riesgos', 'Checklists e EPIs', 'Verificación Operador', 'Firmas']
    : ['Informações gerais', 'Análise de riscos', 'Checklists e EPIs', 'Verificação Operador', 'Assinaturas'];

  const isEditMode = !!permit?.id;
  const formAction = isEditMode ? updatePermitAction.bind(null, permit!.id) : createPermitAction;

  React.useEffect(() => {
    getOrdensServico().then(setOrdensServico);
  }, []);

  React.useEffect(() => {
    if (isAstDialogOpen) {
      getPermits().then(setAllAstsForSelection);
    }
  }, [isAstDialogOpen]);

  const demandaTipoWatch = watch('demandaTipo');
  const empresaTipoWatch = watch('empresaTipo');
  const descricaoWatch = watch('descricao') || '';
  const pasosWatch = watch('pasos') || [];
  const accionOperativaWatch = watch('accionOperativa');
  const imprevistosWatch = watch('imprevistos');
  const riesgosCriticosWatch = watch('riesgosCriticos') || [];
  const alturaSubcategoriasWatch = watch('alturaSubcategorias') || [];

  const totalRiesgos = (pasosWatch.reduce((acc: number, p: any) => acc + (p.riesgos?.length || 0), 0)) +
    (accionOperativaWatch?.enabled ? (accionOperativaWatch?.riesgos?.length || 0) : 0) +
    (imprevistosWatch?.enabled ? (imprevistosWatch?.riesgos?.length || 0) : 0);

  const handleOsSearch = (val: string) => {
    if (!val) return;
    const ordem = ordensServico.find(o => o.ordem === val);
    if (ordem) {
      setValue('os', ordem.ordem);
      setValue('tag', ordem.tag.split(' - ')[0]);
      setValue('equipamento', ordem.tag.split(' - ')[1] || '');
      setValue('area', ordem.area);
      setValue('descricao', ordem.titulo);
      setValue('dataProgramada', format(new Date(ordem.dataProgramada), 'yyyy-MM-dd'));
      setValue('pontoAmbulancia', 'proximo a bomba ABC');
      setValue('chuveiroEmergencia', 'chuveiro X');
    }
  };

  const handleAstSelect = async (ast: Permit) => {
    setValue('ast', ast.id);
    if (ast.pasos) setValue('pasos', ast.pasos);
    if (ast.title) setValue('descricao', ast.title);
    if (ast.location) setValue('area', ast.location);
    setIsAstDialogOpen(false);
    setAstToPreview(null);
  };

  const filteredAsts = searchAstTerm
    ? allAstsForSelection.filter(a => 
        (a.title && a.title.toLowerCase().includes(searchAstTerm.toLowerCase())) ||
        (a.id && a.id.toLowerCase().includes(searchAstTerm.toLowerCase()))
      )
    : allAstsForSelection;

  const toggleRiesgoCritico = (id: string) => {
    const current = [...riesgosCriticosWatch];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    setValue('riesgosCriticos', current);
  };

  const toggleAlturaSub = (id: string) => {
    const current = [...alturaSubcategoriasWatch];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    setValue('alturaSubcategorias', current);
  };

  const renderGeneralInfo = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-black uppercase tracking-tight">
          {isSantaFe ? 'Tipo de Actividad' : 'Tipo de Atividade'}
        </h2>
        <FormField
          control={control}
          name="demandaTipo"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-wrap gap-4"
                >
                  {[
                    { id: isSantaFe ? 'om' : 'ordem', label: isSantaFe ? 'Orden de mantención' : 'Ordem de manutenção' },
                    { id: 'urgente', label: isSantaFe ? 'Demanda urgente' : 'Demanda urgente' },
                    { id: 'outras', label: isSantaFe ? 'Otras actividades' : 'Outras atividades' }
                  ].map(opt => (
                    <div key={opt.id} className="flex items-center">
                      <RadioGroupItem 
                        value={opt.id} 
                        id={`demanda-${opt.id}`} 
                        className="sr-only" 
                      />
                      <FormLabel
                        htmlFor={`demanda-${opt.id}`}
                        className={cn(
                          "flex h-10 items-center gap-3 rounded-full border px-6 cursor-pointer text-sm transition-all font-bold uppercase",
                          field.value === opt.id 
                            ? "border-[#4CAF50] text-black ring-1 ring-[#4CAF50]" 
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        )}
                      >
                        <div className={cn(
                          "h-4 w-4 rounded-full border flex items-center justify-center",
                          field.value === opt.id ? "border-[#4CAF50]" : "border-gray-300"
                        )}>
                          {field.value === opt.id && <div className="h-2 w-2 rounded-full bg-[#4CAF50]" />}
                        </div>
                        {opt.label}
                      </FormLabel>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {demandaTipoWatch === 'outras' && (
          <div className="pt-2 max-w-md animate-in fade-in slide-in-from-top-1">
            <FormField
              control={control}
              name="outraAtividade"
              render={({ field }) => (
                <FormItem>
                  <MandatoryLabel className="text-sm">
                    {isSantaFe ? 'Seleccione la Actividad' : 'Selecione a Atividade'}
                  </MandatoryLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-[4px] border-border h-11 bg-gray-50/50">
                        <SelectValue placeholder={isSantaFe ? "Seleccione..." : "Selecione..."} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        { id: 'engenharia', label: isSantaFe ? 'Ingeniería / Proyectos' : 'Engenharia / Projetos' },
                        { id: 'operacoes', label: isSantaFe ? 'Operações / Processo' : 'Operações / Processo' },
                        { id: 'facilities', label: isSantaFe ? 'Facilities / Predial' : 'Facilities / Predial' },
                        { id: 'administrativas', label: isSantaFe ? 'Demandas Administrativas' : 'Demandas Administrativas' },
                        { id: 'testes', label: isSantaFe ? 'Testes / Comisionamiento' : 'Testes / Comissionamento' }
                      ].map(opt => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      <div className="space-y-6 pt-6 border-t">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-black uppercase tracking-tight">
              {isSantaFe ? 'Empresa' : 'Empresa'}
            </h2>
            <FormField
              control={control}
              name="empresaTipo"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-8">
                      {[
                        { id: 'cmpc', label: 'CMPC' },
                        { id: 'prestador', label: isSantaFe ? 'PRESTADOR / EPS' : 'PRESTADOR / EPS' }
                      ].map(opt => (
                        <div key={opt.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={opt.id} id={`empresa-${opt.id}`} className="text-[#4CAF50] border-[#D1D1D1] data-[state=checked]:bg-[#4CAF50]" />
                          <Label htmlFor={`empresa-${opt.id}`} className="text-sm font-bold uppercase cursor-pointer">{opt.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
             {empresaTipoWatch === 'prestador' && (
              <FormField
                control={control}
                name="empresaNome"
                render={({ field }) => (
                  <FormItem className="max-w-md pt-2">
                    <MandatoryLabel className="text-sm">{isSantaFe ? 'Nombre de la Empresa' : 'Nome da Empresa'}</MandatoryLabel>
                    <FormControl><Input {...field} placeholder={isSantaFe ? "Ingrese nombre..." : "Digite o nome..."} className="rounded-[4px] border-border" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="space-y-4">
             <h2 className="text-lg font-bold text-black uppercase tracking-tight">
              {isSantaFe ? 'Parada General' : 'Parada Geral'}
            </h2>
            <FormField
              control={control}
              name="paradaGeral"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3 bg-gray-50/50 p-3 rounded-md border border-gray-100 max-w-[200px]">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-bold text-black cursor-pointer uppercase text-xs tracking-wider">
                    {field.value ? (isSantaFe ? 'SÍ' : 'SIM') : 'NO'}
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
        <div className="text-sm text-orange-800">
          <span className="font-bold">{isSantaFe ? 'Atención en caso de emergencia: ' : 'Atenção em caso de emergência: '}</span>
          {isSantaFe 
            ? 'Llame al anexo 7777 o 0800 726 7333 o use el canal de radio Emergencia.' 
            : 'Ligue para o ramal 7777 ou 0800 726 7333 ou use a faixa de rádio Emergência.'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <FormField
          control={control}
          name="ast"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-medium text-sm">
                {isSantaFe ? 'Análisis de Segurança / AST' : 'Análise de Segurança / AST'}
              </FormLabel>
              <div className="relative">
                <FormControl>
                  <Input 
                    {...field} 
                    className="rounded-[4px] border-border pr-10" 
                    placeholder={isSantaFe ? "Buscar AST..." : "Buscar AST..."} 
                  />
                </FormControl>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-gray-400"
                  onClick={() => setIsAstDialogOpen(true)}
                >
                   <Search className="h-4 w-4" />
                </Button>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="os"
          render={({ field }) => (
            <FormItem>
              <MandatoryLabel className="text-sm">{isSantaFe ? 'N° de O.M.' : 'OS N°'}</MandatoryLabel>
              <div className="relative">
                <FormControl>
                  <Input 
                    {...field} 
                    onBlur={(e) => handleOsSearch(e.target.value)} 
                    disabled={demandaTipoWatch !== 'ordem'}
                    className="rounded-[4px] border-border pr-10"
                    placeholder={isSantaFe ? "Ingrese o número" : "Digite o número"}
                  />
                </FormControl>
                <Button asChild type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-gray-400">
                   <Link href="/ordens"><Search className="h-4 w-4" /></Link>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <MandatoryLabel className="text-sm">{isSantaFe ? 'TAG (Equipo)' : 'TAG (Equipamento)'}</MandatoryLabel>
              <FormControl><Input {...field} className="rounded-[4px] border-border" placeholder="Ex: 450-34-011" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="dataProgramada"
            render={({ field }) => (
              <FormItem>
                <MandatoryLabel className="text-sm">{isSantaFe ? 'Fecha Inicio' : 'Data Início'}</MandatoryLabel>
                <FormControl><Input type="date" {...field} className="rounded-[4px] border-border" /></FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="horaInicio"
            render={({ field }) => (
              <FormItem>
                <MandatoryLabel className="text-sm">{isSantaFe ? 'Hora Inicio' : 'Hora Início'}</MandatoryLabel>
                <FormControl><Input type="time" {...field} className="rounded-[4px] border-border" /></FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="planta"
          render={({ field }) => (
            <FormItem>
              <MandatoryLabel className="text-sm">{isSantaFe ? 'Planta / Unidad' : 'Planta / Unidade'}</MandatoryLabel>
              <FormControl>
                <Input {...field} readOnly className="rounded-[4px] border-border bg-gray-50" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <MandatoryLabel className="text-sm">{isSantaFe ? 'Área' : 'Área'}</MandatoryLabel>
              <FormControl><Input {...field} className="rounded-[4px] border-border" placeholder={isSantaFe ? "Lugar de trabalho" : "Local de trabalho"} /></FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="ruta"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-medium text-sm">{isSantaFe ? 'N° de Ruta' : 'N° de Rota'}</FormLabel>
              <FormControl><Input {...field} className="rounded-[4px] border-border" /></FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="pontoAmbulancia"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-medium text-sm">{isSantaFe ? 'Punto de Ambulancia' : 'Punto de Ambulância'}</FormLabel>
              <FormControl><Input {...field} className="rounded-[4px] border-border" /></FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="chuveiroEmergencia"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-medium text-sm">{isSantaFe ? 'Ducha de Emergencia' : 'Ducha de Emergencia'}</FormLabel>
              <FormControl><Input {...field} className="rounded-[4px] border-border" /></FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="pt-4 border-t relative">
        <FormField
          control={control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <MandatoryLabel className="text-sm">{isSantaFe ? 'Actividad Realizada' : 'Atividade Realizada'}</MandatoryLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  className="min-h-[140px] rounded-[4px] border-border resize-none" 
                  placeholder={isSantaFe ? "Descreva detalhadamente..." : "Descreva detalhadamente..."} 
                />
              </FormControl>
              <div className="text-[10px] text-gray-400 text-right mt-1 font-mono">
                {(descricaoWatch || '').length} caracteres
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Dialog open={isAstDialogOpen} onOpenChange={setIsAstDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 border-b">
            <DialogTitle>{isSantaFe ? 'Seleccionar AST' : 'Selecionar AST'}</DialogTitle>
          </DialogHeader>
          <div className="p-6 flex-1 overflow-hidden flex flex-col gap-4">
             {/* Content as defined in previous iterations */}
             <div className="relative">
               <Input 
                 placeholder={isSantaFe ? "Buscar por título o código..." : "Buscar por título ou código..."}
                 value={searchAstTerm}
                 onChange={(e) => setSearchAstTerm(e.target.value)}
                 className="pr-10"
               />
               <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             </div>
             <ScrollArea className="flex-1">
               <div className="space-y-2 pr-4">
                  {filteredAsts.map(ast => (
                    <button 
                      key={ast.id}
                      type="button"
                      onClick={() => handleAstSelect(ast)}
                      className="w-full text-left p-3 rounded-md border hover:border-primary/50 transition-all bg-white"
                    >
                      <p className="font-semibold truncate text-sm">{ast.title}</p>
                      <p className="text-xs text-muted-foreground">ID: {ast.id} | {ast.location}</p>
                    </button>
                  ))}
               </div>
             </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderRiskAnalysis = () => (
    <div className="space-y-6">
       <div className="flex items-start gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-blue-100 text-blue-600 font-bold text-sm">
          1
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-black">
              {isSantaFe ? 'Pasos principais' : 'Passos principais'}
            </h2>
          </div>
          <div className="space-y-6">
            {fields.map((field, index) => (
              <Card key={field.id} className="border border-gray-100 shadow-sm overflow-hidden">
                 <div className="bg-gray-50/50 px-4 py-3 border-b flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase text-gray-700">
                      {isSantaFe ? `Paso #${index + 1}` : `Passo #${index + 1}`}
                    </h3>
                    <Button type="button" variant="outline" size="sm" className="text-red-500 border-red-200" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                 </div>
                 <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                       <FormField
                          control={control}
                          name={`pasos.${index}.isCritico`}
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <MandatoryLabel className="text-xs uppercase tracking-wider">{isSantaFe ? '¿Paso crítico?' : 'Passo crítico?'}</MandatoryLabel>
                              <div className="flex items-center gap-3">
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                              </div>
                            </FormItem>
                          )}
                       />
                       <div className="md:col-span-3">
                          <FormField
                            control={control}
                            name={`pasos.${index}.descripcion`}
                            render={({ field }) => (
                              <FormItem>
                                <MandatoryLabel className="text-xs uppercase tracking-wider">{isSantaFe ? 'Descripción do paso' : 'Descrição do passo'}</MandatoryLabel>
                                <FormControl><Textarea {...field} className="min-h-[80px]" /></FormControl>
                              </FormItem>
                            )}
                          />
                       </div>
                    </div>
                    <RiskList name={`pasos.${index}`} isSantaFe={isSantaFe} />
                 </CardContent>
              </Card>
            ))}
            <Button 
              type="button" 
              onClick={() => append({ descripcion: '', isCritico: false, riesgos: [] })}
              className="bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-full px-8 h-11 font-bold"
            >
              <Plus className="mr-2 h-5 w-5" />
              {isSantaFe ? 'Nuevo paso' : 'Novo passo'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChecklistAndEpp = () => {
    const riscosCriticosList = [
      { id: 'quente', label: isSantaFe ? 'Trabajo en Caliente' : 'Trabalho a Quente', icon: Flame },
      { id: 'linha', label: isSantaFe ? 'Apertura de Línea / Equipo' : 'Abertura de Linha / Equipamento', icon: Split },
      { id: 'carga', label: isSantaFe ? 'Movimiento de Carga' : 'Movimentação de Carga', icon: ArrowUpToLine },
      { id: 'altura', label: isSantaFe ? 'Trabajo en Altura (>1,5m) o Andamio' : 'Trabalho em Altura (>1,5m) ou Andaime', icon: ArrowUpRight },
      { id: 'hidrojato', label: isSantaFe ? 'Hidrojet' : 'Hidrojato', icon: Droplets },
      { id: 'confinado', label: isSantaFe ? 'Trabajo en Espacio Confinado' : 'Trabalho em Espaço Confinado', icon: Box },
      { id: 'eletricidade', label: isSantaFe ? 'Electricidad' : 'Eletricidade', icon: Zap },
      { id: 'radioativa', label: isSantaFe ? 'Fuente Radioactiva' : 'Fonte Radioativa', icon: Radiation },
      { id: 'termica', label: isSantaFe ? 'Sobrecarga Térmica' : 'Sobrecarga Térmica', icon: ThermometerSun },
      { id: 'escavacao', label: isSantaFe ? 'Excavación / Sondaje' : 'Escavação / Sondagem', icon: Construction },
      { id: 'quimicos', label: isSantaFe ? 'Productos Químicos Peligrosos' : 'Produtos Químicos Perigosos', icon: FlaskConical },
      { id: 'embarcacoes', label: isSantaFe ? 'Trabajo con Embarcaciones' : 'Trabalho com Embarcações', icon: Ship },
      { id: 'alpinismo', label: isSantaFe ? 'Alpinismo' : 'Alpinismo', icon: Mountain },
      { id: 'mergulho', label: isSantaFe ? 'Buceo' : 'Mergulho', icon: Waves },
    ];

    const alturaCategorias = [
      { id: 'andaimes', label: isSantaFe ? 'Andamios' : 'Andaimes', icon: Construction },
      { id: 'escadas', label: isSantaFe ? 'Escaleras' : 'Escadas', icon: (props: any) => <StairsIcon {...props} /> },
      { id: 'telhados', label: isSantaFe ? 'Techos' : 'Telhados', icon: Home },
      { id: 'pta', label: isSantaFe ? 'PTA (Plataforma)' : 'PTA (Plataforma)', icon: Truck },
      { id: 'corda', label: isSantaFe ? 'Cuerda' : 'Trabalho com Corda', icon: Anchor },
    ];

    const questionsMap: Record<string, any[]> = {
      geral: [
        { text: 'AST APRESENTADA PELO EXECUTANTE', resp: 'EMITENTE' },
        { text: 'ÁREA ISOLADA AO REDOR DO ANDAIME/PTA, DEVIDAMENTE IDENTIFICADOS E SINALIZADOS', resp: 'EMITENTE' },
        { text: 'INSPECIONADOS OS CINTOS DE SEGURANÇA', resp: 'EMITENTE' },
      ],
      andaimes: [
        { text: 'ANDAIME COMPLETO E LIBERADO', resp: 'EXECUTANTE' },
        { text: 'ANDAIME, DOTADO DE PLACA DE IDENTIFICAÇÃO EM LOCAL VISÍVEL', resp: 'EXECUTANTE' },
        { text: 'TRABALHADORES APTOS E COM REGISTRO NO CRACHÁ', resp: 'EMITENTE' },
      ],
      // Add more as needed...
    };

    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-black uppercase tracking-tight">
              {isSantaFe ? 'RIESGOS CRÍTICOS' : 'RISCOS CRÍTICOS'}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
             {riscosCriticosList.map(item => {
               const Icon = item.icon;
               const isSelected = riesgosCriticosWatch.includes(item.id);
               return (
                 <button 
                   key={item.id} 
                   type="button" 
                   onClick={() => toggleRiesgoCritico(item.id)}
                   className={cn(
                     "flex items-center gap-3 p-3 rounded-md border text-left transition-all",
                     isSelected ? "border-[#4CAF50] bg-[#4CAF50]/5 ring-1 ring-[#4CAF50]" : "border-gray-200"
                   )}
                 >
                   <Icon className={cn("h-5 w-5", isSelected ? "text-[#4CAF50]" : "text-gray-400")} />
                   <span className="text-xs font-bold uppercase">{item.label}</span>
                 </button>
               );
             })}
          </div>
        </div>

        {riesgosCriticosWatch.includes('altura') && (
          <div className="space-y-6 pt-6 border-t">
            <div className="bg-[#4CAF50]/5 p-6 rounded-lg border border-[#4CAF50]/10">
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                {alturaCategorias.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleAlturaSub(cat.id)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-3 rounded-md border transition-all",
                      alturaSubcategoriasWatch.includes(cat.id) ? "bg-[#4CAF50] text-white border-[#4CAF50]" : "bg-white text-gray-500"
                    )}
                  >
                    <cat.icon className="h-5 w-5" />
                    <span className="text-[10px] font-bold uppercase">{cat.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                   <h3 className="text-xs font-black text-orange-600 uppercase">SESSÃO EXECUTANTE</h3>
                   <Accordion type="multiple" className="space-y-3">
                      <RoleCategoryAccordion categoryId="geral" questions={questionsMap.geral} role="EXECUTANTE" isSantaFe={isSantaFe} disabled={false} />
                      {alturaSubcategoriasWatch.map(sub => (
                        <RoleCategoryAccordion key={sub} categoryId={sub} questions={questionsMap[sub] || []} role="EXECUTANTE" isSantaFe={isSantaFe} disabled={false} imageUrl={sub === 'andaimes' ? '/Andaime.png' : undefined} />
                      ))}
                   </Accordion>
                </div>
                <div className="space-y-4">
                   <h3 className="text-xs font-black text-blue-600 uppercase">SESSÃO OPERADOR RESPONSÁVEL</h3>
                   <Accordion type="multiple" className="space-y-3">
                      <RoleCategoryAccordion categoryId="geral" questions={questionsMap.geral} role="EMITENTE" isSantaFe={isSantaFe} disabled={true} />
                      {alturaSubcategoriasWatch.map(sub => (
                        <RoleCategoryAccordion key={sub} categoryId={sub} questions={questionsMap[sub] || []} role="EMITENTE" isSantaFe={isSantaFe} disabled={true} imageUrl={sub === 'andaimes' ? '/Andaime.png' : undefined} />
                      ))}
                   </Accordion>
                </div>
              </div>
            </div>
          </div>
        )}

        <EpiSection isSantaFe={isSantaFe} />
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-8">
      <div className="mb-8">
        <h1 className="text-[26px] font-bold text-black uppercase tracking-tight">
          {type} - {isSantaFe ? 'Nuevo Permiso' : 'Nova Permissão'}
        </h1>
      </div>

      <Card className="rounded-[8px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-none bg-white overflow-hidden">
        <div className="flex w-full bg-white border-b border-gray-100">
          {steps.map((step, index) => (
            <button
              key={step}
              type="button"
              className={cn(
                "flex-1 py-5 text-xs font-bold transition-all uppercase tracking-wider",
                currentStep === index ? "text-[#4CAF50] border-b-[4px] border-[#4CAF50]" : "text-gray-400"
              )}
              onClick={() => setCurrentStep(index)}
            >
              {step}
            </button>
          ))}
        </div>

        <CardContent className="p-8 sm:p-10">
          <FormProvider {...form}>
            <form action={formAction} className="space-y-8">
              {currentStep === 0 && renderGeneralInfo()}
              {currentStep === 1 && renderRiskAnalysis()}
              {currentStep === 2 && renderChecklistAndEpp()}
              {currentStep === 3 && <OperatorVerificationSection isSantaFe={isSantaFe} />}
              
              <div className="flex justify-end items-center gap-6 pt-8 border-t">
                {currentStep > 0 && <Button type="button" variant="outline" onClick={() => setCurrentStep(prev => prev - 1)}>ANTERIOR</Button>}
                {currentStep < steps.length - 1 ? (
                  <Button type="button" onClick={() => setCurrentStep(prev => prev + 1)} className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-10 h-11 font-bold">PRÓXIMO</Button>
                ) : (
                  <SubmitButton isEditMode={isEditMode} isSantaFe={isSantaFe} />
                )}
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}

function SubmitButton({ isEditMode, isSantaFe }: { isEditMode: boolean, isSantaFe: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-12 h-11 font-bold">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isEditMode ? 'GUARDAR ALTERAÇÕES' : 'GUARDAR PERMISSÃO'}
    </Button>
  );
}

const StairsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 21h18" /><path d="M3 21v-4h4v-4h4v-4h4v-4h4v4" /></svg>
);

export function PermitForm({ permit, type }: PermitFormProps) {
  const { selectedPlantId } = usePlant();
  const { orderData, clearOrderData } = useOrder();
  const isSantaFe = selectedPlantId === 'cl-santafe';

  const defaultValues = React.useMemo(() => ({
    paradaGeral: permit?.paradaGeral ?? false,
    demandaTipo: permit?.demandaTipo ?? (isSantaFe ? 'om' : 'ordem'),
    planta: permit?.planta ?? (isSantaFe ? 'cl-santafe' : 'br-guaiba'),
    empresaTipo: permit?.empresaTipo ?? 'cmpc',
    pasos: permit?.pasos || [],
    riesgosCriticos: permit?.riesgosCriticos || [],
    alturaSubcategorias: permit?.alturaSubcategorias || [],
    checklists: permit?.checklists || {},
    epis: permit?.epis || {},
    verificacaoOperador: permit?.verificacaoOperador || {},
    ...permit
  }), [isSantaFe, permit]);

  const form = useForm({
    resolver: zodResolver(sharedFormSchema),
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <PermitFormContent permit={permit} type={type} isSantaFe={isSantaFe} />
    </FormProvider>
  )
}
