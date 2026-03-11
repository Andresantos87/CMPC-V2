'use client'

import { getOrdensServico } from '@/lib/data';
import { OrdemCard } from '@/components/ordem-card';
import { Input } from '@/components/ui/input';
import { Search, List, LayoutGrid } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { OrdemServico } from '@/lib/definitions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { OrdensCalendar } from '@/components/ordens-calendar';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function OrdensPage() {
  const [allOrdens, setAllOrdens] = useState<OrdemServico[]>([]);
  const [filteredOrdens, setFilteredOrdens] = useState<OrdemServico[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCentro, setSelectedCentro] = useState('all');

  useEffect(() => {
    getOrdensServico().then(data => {
      setAllOrdens(data);
      setFilteredOrdens(data);
    });
  }, []);

  const areas = useMemo(() => {
    if (!allOrdens) return [];
    const uniqueAreas = new Set(allOrdens.map(ordem => ordem.area));
    return ['all', ...Array.from(uniqueAreas)];
  }, [allOrdens]);

  const priorities = useMemo(() => {
    if (!allOrdens) return [];
    const uniquePriorities = new Set(allOrdens.map(ordem => ordem.prioridade));
    return ['all', ...Array.from(uniquePriorities)];
  }, [allOrdens]);

  const centros = useMemo(() => {
    if (!allOrdens) return [];
    const uniqueCentros = new Set(allOrdens.map(ordem => ordem.centroTrabalho));
    return ['all', ...Array.from(uniqueCentros)];
  }, [allOrdens]);

  useEffect(() => {
    let result = allOrdens;

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(ordem => 
        ordem.titulo.toLowerCase().includes(lowercasedTerm) ||
        ordem.ordem.toLowerCase().includes(lowercasedTerm) ||
        ordem.tag.toLowerCase().includes(lowercasedTerm)
      );
    }

    if (selectedArea !== 'all') {
      result = result.filter(ordem => ordem.area === selectedArea);
    }

    if (selectedPriority !== 'all') {
      result = result.filter(ordem => ordem.prioridade === selectedPriority);
    }

    if (selectedCentro !== 'all') {
      result = result.filter(ordem => ordem.centroTrabalho === selectedCentro);
    }
    
    setFilteredOrdens(result);
  }, [searchTerm, selectedArea, selectedPriority, selectedCentro, allOrdens]);


  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/pt/create">Nova PT</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Selecionar Ordem de Serviço</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Ordens de Serviço</h1>
          <div className="flex items-center gap-1 rounded-md bg-muted p-1">
            <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" className="gap-1" onClick={() => setViewMode('list')}>
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Lista</span>
            </Button>
            <Button variant={viewMode === 'calendar' ? 'secondary' : 'ghost'} size="sm" className="gap-1" onClick={() => setViewMode('calendar')}>
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Calendário</span>
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 sm:flex-row">
            <div className="relative w-full sm:w-auto">
              <Input 
                placeholder="Buscar por ordem, título, tag..." 
                className="pr-10 sm:w-64" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por área" />
              </SelectTrigger>
              <SelectContent>
                {areas.map(area => (
                  <SelectItem key={area} value={area}>
                    {area === 'all' ? 'Todas as Áreas' : area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por prioridade" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map(priority => (
                  <SelectItem key={priority} value={priority}>
                    {priority === 'all' ? 'Todas as Prioridades' : `Prioridade ${priority}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
             <Select value={selectedCentro} onValueChange={setSelectedCentro}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Filtrar por centro" />
              </SelectTrigger>
              <SelectContent>
                {centros.map(centro => (
                  <SelectItem key={centro} value={centro}>
                    {centro === 'all' ? 'Todos os Centros' : centro}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>
      </div>
       {viewMode === 'list' ? (
         <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="h-auto py-3">Ordem</TableHead>
                  <TableHead className="h-auto py-3">Status</TableHead>
                  <TableHead className="h-auto py-3">Prioridade</TableHead>
                  <TableHead className="h-auto py-3">Título</TableHead>
                  <TableHead className="hidden h-auto py-3 lg:table-cell">Tag</TableHead>
                  <TableHead className="hidden h-auto py-3 md:table-cell">Data</TableHead>
                  <TableHead className="h-auto py-3">
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrdens.length > 0 ? (
                    filteredOrdens.map((ordem) => (
                        <OrdemCard key={ordem.id} ordem={ordem} />
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                            Nenhuma ordem de serviço encontrada.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
       ) : (
        <OrdensCalendar ordens={filteredOrdens} />
      )}
    </div>
  );
}
