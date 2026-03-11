'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Eye, CheckCircle2, Paperclip } from 'lucide-react';
import type { OrdemServico } from '@/lib/definitions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/contexts/order-context';
import Image from 'next/image';


type OrdemCardProps = {
  ordem: OrdemServico;
};

function getStatusVariant(status: OrdemServico['status']): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'LIB':
      return 'default';
    case 'ABERTA':
      return 'secondary';
    case 'CONCLUIDA':
      return 'outline';
    default:
      return 'secondary';
  }
}

function getPriorityVariant(priority: OrdemServico['prioridade']): 'destructive' | 'secondary' | 'outline' {
    switch (priority) {
      case 'Alta':
        return 'destructive';
      case 'Média':
        return 'secondary';
      case 'Baixa':
        return 'outline';
      default:
        return 'secondary';
    }
  }

export function OrdemCard({ ordem }: OrdemCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = React.useState(false);
  const [isSelectionOpen, setIsSelectionOpen] = React.useState(false);

  const [selectedOperations, setSelectedOperations] = React.useState<string[]>([]);
  const router = useRouter();
  const { setOrderData } = useOrder();
  
  const [formattedDate, setFormattedDate] = React.useState('Carregando...');
  React.useEffect(() => {
    setFormattedDate(format(new Date(ordem.dataProgramada), 'dd/MM/yyyy HH:mm', { locale: ptBR }));
  }, [ordem.dataProgramada]);


  const handleSelectOperation = (operationId: string) => {
    setSelectedOperations(prev => 
      prev.includes(operationId) 
        ? prev.filter(id => id !== operationId)
        : [...prev, operationId]
    );
  };
  
  const handleSelectAll = (check: boolean | string) => {
    if (check) {
      setSelectedOperations(ordem.operacoes.map(op => op.id));
    } else {
      setSelectedOperations([]);
    }
  };

  const handleConfirmSelection = () => {
    const [tagNumber, equipmentName] = ordem.tag.split(' - ');

    setOrderData({
      os: ordem.ordem,
      tag: tagNumber.trim(),
      area: ordem.area,
      equipamento: equipmentName ? equipmentName.trim() : '',
      operacoes: ordem.operacoes.filter(op => selectedOperations.includes(op.id)).map(op => op.descricao),
      dataProgramada: ordem.dataProgramada,
    });
    setIsSelectionOpen(false);
    router.push('/pt/create');
  };


  return (
    <>
      <TableRow>
        <TableCell className="py-2 px-4 font-bold">{ordem.ordem}</TableCell>
        <TableCell className="py-2 px-4">
            <Badge variant={getStatusVariant(ordem.status)}>{ordem.status}</Badge>
        </TableCell>
        <TableCell className="py-2 px-4">
            <Badge variant={getPriorityVariant(ordem.prioridade)}>{ordem.prioridade}</Badge>
        </TableCell>
        <TableCell className="py-2 px-4">{ordem.titulo}</TableCell>
        <TableCell className="hidden py-2 px-4 lg:table-cell">{ordem.tag.split(' - ')[0]}</TableCell>
        <TableCell className="hidden py-2 px-4 md:table-cell">{formattedDate}</TableCell>
        <TableCell className="py-2 px-4 text-right">
            <div className="flex items-center justify-end gap-1">
                <div className='h-8 w-8'>
                  {ordem.hasAttachment && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsAttachmentOpen(true)}>
                          <Paperclip className="h-4 w-4" />
                          <span className="sr-only">Ver Anexo</span>
                      </Button>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsDetailsOpen(true)}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Ver Detalhes</span>
                </Button>
                <Button size="sm" onClick={() => setIsSelectionOpen(true)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Selecionar
                </Button>
            </div>
        </TableCell>
      </TableRow>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Ordem: {ordem.ordem}</DialogTitle>
            <DialogDescription>{ordem.titulo}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
                <div><span className="font-semibold">Tag:</span> {ordem.tag}</div>
                <div><span className="font-semibold">Área:</span> {ordem.area}</div>
                <div><span className="font-semibold">Status:</span> <Badge variant={getStatusVariant(ordem.status)}>{ordem.status}</Badge></div>
                <div><span className="font-semibold">Prioridade:</span> <Badge variant={getPriorityVariant(ordem.prioridade)}>{ordem.prioridade}</Badge></div>
                <div><span className="font-semibold">Data Programada:</span> {formattedDate}</div>
                <div><span className="font-semibold">Nº da Nota:</span> {ordem.notaNumero}</div>
            </div>
            <div className="space-y-2">
                <p className="font-semibold">Descrição do Problema:</p>
                <p className="text-muted-foreground">{ordem.descricaoProblema}</p>
            </div>
             <div className="space-y-2">
                <p className="font-semibold">Centro de Trabalho:</p>
                <p className="text-muted-foreground">{ordem.centroTrabalho}</p>
            </div>
             <div className="space-y-2">
                <p className="font-semibold">Roteiro de Operações:</p>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                  {ordem.operacoes.map((op) => (
                    <li key={op.id}>
                      {op.descricao} ({op.duracao} H - {op.pessoas} {op.pessoas > 1 ? 'pessoas' : 'pessoa'})
                    </li>
                  ))}
                </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Attachment Dialog */}
      <Dialog open={isAttachmentOpen} onOpenChange={setIsAttachmentOpen}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Anexo da Ordem: {ordem.ordem}</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center">
            <Image
                src="https://picsum.photos/seed/electric-engine/600/400"
                alt="Anexo de equipamento"
                width={600}
                height={400}
                data-ai-hint="electric motor"
                className="rounded-md object-cover"
            />
            </div>
        </DialogContent>
      </Dialog>
      
      {/* Selection Dialog */}
      <Dialog open={isSelectionOpen} onOpenChange={setIsSelectionOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Selecionar Operações da Ordem: {ordem.ordem}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="flex items-center space-x-2">
              <Checkbox 
                id={`select-all-${ordem.id}`}
                onCheckedChange={handleSelectAll}
                checked={selectedOperations.length === ordem.operacoes.length}
              />
              <Label htmlFor={`select-all-${ordem.id}`} className="font-bold">Selecionar Todas</Label>
            </div>
            <div className="space-y-2">
              {ordem.operacoes.map((op) => (
                <div key={op.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={op.id} 
                    checked={selectedOperations.includes(op.id)}
                    onCheckedChange={() => handleSelectOperation(op.id)}
                  />
                  <Label htmlFor={op.id} className="flex-1">
                    {op.descricao} ({op.duracao} H - {op.pessoas} {op.pessoas > 1 ? 'pessoas' : 'pessoa'})
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button type="button" onClick={handleConfirmSelection} disabled={selectedOperations.length === 0}>
              Confirmar Seleção
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
