'use client';

import Link from 'next/link';
import { PlusCircle, FileEdit, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getPermits } from '@/lib/data';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React from 'react';
import { Permit } from '@/lib/definitions';
import { usePlant } from '@/contexts/plant-context';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

function getStatusVariant(status: 'Pendente' | 'Aprovado' | 'Rejeitado'): 'default' | 'secondary' | 'destructive' {
  switch (status) {
    case 'Aprovado':
      return 'default';
    case 'Pendente':
      return 'secondary';
    case 'Rejeitado':
      return 'destructive';
  }
}

export default function AstPage() {
  const [permits, setPermits] = React.useState<Permit[]>([]);
  const { selectedPlantId } = usePlant();
  const isSantaFe = selectedPlantId === 'cl-santafe';

  const [isCloneDialogOpen, setIsCloneDialogOpen] = React.useState(false);
  const [allPermitsForClone, setAllPermitsForClone] = React.useState<Permit[]>([]);
  const [searchCloneTerm, setSearchCloneTerm] = React.useState('');
  const router = useRouter();

  React.useEffect(() => {
    async function fetchPermits() {
      const data = await getPermits();
      setPermits(data);
    }
    fetchPermits();
  }, []);

  React.useEffect(() => {
    if (isCloneDialogOpen) {
      getPermits().then(setAllPermitsForClone);
    }
  }, [isCloneDialogOpen]);

  const filteredPermitsForClone = searchCloneTerm
    ? allPermitsForClone.filter(p =>
        (p.title && p.title.toLowerCase().includes(searchCloneTerm.toLowerCase())) ||
        (p.id && p.id.toString().toLowerCase().includes(searchCloneTerm.toLowerCase()))
      )
    : allPermitsForClone;

  const handleCloneSelect = (permitId: string) => {
    setIsCloneDialogOpen(false);
    router.push(`/ast/create?cloneFrom=${permitId}`);
  };

  const containerClasses = cn('w-full p-4 sm:p-6 lg:p-8', {
    'flex justify-center': isSantaFe,
  });

  return (
    <div className={containerClasses}>
      <Card className={cn({'w-full max-w-6xl': isSantaFe})}>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Gestão de AST</CardTitle>
            <CardDescription>
              Consulte e gerencie todas as Análises de Segurança do Trabalho.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-1" onClick={() => setIsCloneDialogOpen(true)}>
              <Copy className="h-4 w-4" />
              Clonar AST
            </Button>
            <Button asChild size="sm" className="gap-1">
              <Link href="/ast/create">
                <PlusCircle className="h-4 w-4" />
                Nova AST
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead className="hidden md:table-cell">Solicitante</TableHead>
                <TableHead className="hidden lg:table-cell">Local</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Data Criação</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permits.map((permit) => (
                <TableRow key={permit.id}>
                  <TableCell className="font-medium">{permit.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{permit.requester}</TableCell>
                  <TableCell className="hidden lg:table-cell">{permit.location}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(permit.status)}>{permit.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {format(new Date(permit.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button asChild aria-label="Editar" size="icon" variant="ghost" className="h-7 w-7">
                        <Link href={`/ast/${permit.id}/edit`}>
                          <FileEdit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isCloneDialogOpen} onOpenChange={setIsCloneDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Clonar AST Existente</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              placeholder="Buscar AST por título ou ID..."
              value={searchCloneTerm}
              onChange={(e) => setSearchCloneTerm(e.target.value)}
              className="mb-4"
            />
            <ScrollArea className="h-72">
              <div className="space-y-2 pr-4">
                {filteredPermitsForClone.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => handleCloneSelect(p.id)}
                    className="w-full text-left p-3 rounded-md border hover:bg-accent transition-colors"
                  >
                    <p className="font-semibold truncate">{p.title}</p>
                    <p className="text-sm text-muted-foreground">ID: {p.id} | Criado em: {format(new Date(p.createdAt), "dd/MM/yyyy", { locale: ptBR })}</p>
                    <p className="text-sm text-muted-foreground truncate">Local: {p.location}</p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancelar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
