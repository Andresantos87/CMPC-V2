'use client';

import React from 'react';
import { OrdemServico } from '@/lib/definitions';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { ChevronLeft, ChevronRight, ChevronDown, CheckCircle2, Paperclip, Check } from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
  parseISO,
  isSameDay,
  addMonths,
  subMonths,
  addDays,
  subDays,
  getDay,
  getHours,
  getMinutes,
  addHours,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/contexts/order-context';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import Image from 'next/image';

type OrdensCalendarProps = {
  ordens: OrdemServico[];
};

type CalendarView = 'month' | 'week' | 'day';

const MAX_VISIBLE_ORDERS = 2;

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


// This is a self-contained component to show order details inside the calendar dialogs.
// It replicates the functionality of the original OrdemCard to avoid breaking this view.
function CalendarOrderDetails({ ordem }: { ordem: OrdemServico }) {
  const [isSelectionOpen, setIsSelectionOpen] = React.useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = React.useState(false);

  const [selectedOperations, setSelectedOperations] = React.useState<string[]>([]);
  const router = useRouter();
  const { setOrderData } = useOrder();
  const formattedDate = format(new Date(ordem.dataProgramada), 'dd.MM.yyyy', { locale: ptBR });

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
      <Card className="w-full shadow-none border-none">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-2">
                  <span className="font-bold text-lg whitespace-nowrap">{ordem.ordem}</span>
                  <Badge variant={getStatusVariant(ordem.status)}>{ordem.status}</Badge>
                  <Badge variant={getPriorityVariant(ordem.prioridade)}>Prioridade {ordem.prioridade}</Badge>
              </div>
              <CardTitle className="text-base font-semibold mt-1 sm:mt-0">{ordem.titulo}</CardTitle>
            </div>
            <div className="text-sm text-muted-foreground pt-2">
                <p><span className="font-medium text-card-foreground">Tag:</span> {ordem.tag}</p>
                <p><span className="font-medium text-card-foreground">Área:</span> {ordem.area}</p>
                <p><span className="font-medium text-card-foreground">Data:</span> {formattedDate}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
              <div>
                  <h4 className="font-semibold text-sm mb-1">Número da Nota:</h4>
                  <p className="text-muted-foreground text-sm">{ordem.notaNumero}</p>
              </div>
              <div>
                  <h4 className="font-semibold text-sm mb-1">Descrição do Problema:</h4>
                  <p className="text-muted-foreground text-sm">{ordem.descricaoProblema}</p>
              </div>
              <div>
                  <h4 className="font-semibold text-sm mb-1">Centro de Trabalho:</h4>
                  <p className="text-muted-foreground text-sm">{ordem.centroTrabalho}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Roteiro de Operações:</h4>
                <ul className="space-y-1 text-sm list-disc pl-5 text-muted-foreground">
                  {ordem.operacoes.map((op) => (
                    <li key={op.id}>
                      {op.descricao} ({op.duracao} H - {op.pessoas} {op.pessoas > 1 ? 'pessoas' : 'pessoa'})
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2 pt-4">
                {ordem.hasAttachment && (
                  <Button variant="outline" size="sm" onClick={() => setIsAttachmentOpen(true)}>
                    <Paperclip className="mr-2 h-4 w-4" />
                      Ver anexo
                  </Button>
                )}
                <Button size="sm" onClick={() => setIsSelectionOpen(true)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Selecionar
                </Button>
            </div>
          </CardContent>
      </Card>
      
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
                id={`modal-select-all-${ordem.id}`} 
                onCheckedChange={handleSelectAll}
                checked={selectedOperations.length === ordem.operacoes.length}
              />
              <Label htmlFor={`modal-select-all-${ordem.id}`} className="font-bold">Selecionar Todas</Label>
            </div>
            <div className="space-y-2">
              {ordem.operacoes.map((op) => (
                <div key={op.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`modal-op-${op.id}`}
                    checked={selectedOperations.includes(op.id)}
                    onCheckedChange={() => handleSelectOperation(op.id)}
                  />
                  <Label htmlFor={`modal-op-${op.id}`} className="flex-1">
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


export function OrdensCalendar({ ordens }: OrdensCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [calendarView, setCalendarView] = React.useState<CalendarView>('month');

  const handlePrev = () => {
    if (calendarView === 'month') {
      setCurrentDate((prev) => subMonths(prev, 1));
    } else if (calendarView === 'week') {
      setCurrentDate((prev) => subDays(prev, 7));
    } else {
      setCurrentDate((prev) => subDays(prev, 1));
    }
  };

  const handleNext = () => {
    if (calendarView === 'month') {
      setCurrentDate((prev) => addMonths(prev, 1));
    } else if (calendarView === 'week') {
      setCurrentDate((prev) => addDays(prev, 7));
    } else {
      setCurrentDate((prev) => addDays(prev, 1));
    }
  };

  const getTitle = () => {
    if (calendarView === 'month') {
      return format(currentDate, 'MMMM yyyy', { locale: ptBR });
    }
    if (calendarView === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      if (!isSameMonth(start, end)) {
        return `${format(start, 'MMM', { locale: ptBR })} - ${format(end, 'MMM yyyy', { locale: ptBR })}`;
      }
      return format(currentDate, 'MMMM yyyy', { locale: ptBR });
    }
    return format(currentDate, 'd MMMM, yyyy', { locale: ptBR });
  };

  const renderMonthView = () => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({
      start: startOfWeek(firstDayOfMonth, { weekStartsOn: 0 }),
      end: endOfWeek(lastDayOfMonth, { weekStartsOn: 0 }),
    });
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
      <div className="grid grid-cols-7 border-t border-l">
        {weekDays.map((day) => (
          <div key={day} className="border-r border-b p-2 text-center font-medium text-xs text-muted-foreground bg-muted/30">
            {day}
          </div>
        ))}
        {daysInMonth.map((day) => {
          const ordersForDay = ordens.filter(ordem => isSameDay(parseISO(ordem.dataProgramada), day));
          const visibleOrders = ordersForDay.slice(0, MAX_VISIBLE_ORDERS);
          const hiddenOrdersCount = ordersForDay.length - MAX_VISIBLE_ORDERS;

          return (
            <div
              key={day.toString()}
              className={cn(
                'border-r border-b min-h-[140px] p-1 flex flex-col',
                !isSameMonth(day, currentDate) && 'bg-muted/20'
              )}
            >
              <div className={cn(
                'flex items-center justify-center font-medium text-sm w-7 h-7 rounded-full',
                isToday(day) && 'bg-primary text-primary-foreground',
                !isSameMonth(day, currentDate) && 'text-muted-foreground'
              )}
              >
                {format(day, 'd')}
              </div>
              <ScrollArea className="flex-1 mt-1 -mr-1">
                <div className="space-y-1 pr-2 pb-1">
                  {visibleOrders.map(ordem => (
                    <Dialog key={ordem.id}>
                      <DialogTrigger asChild>
                        <button className="bg-primary/10 hover:bg-primary/20 w-full text-left cursor-pointer text-primary p-1.5 rounded-md text-xs">
                          <p className="font-semibold truncate">{format(parseISO(ordem.dataProgramada), 'HH:mm')} {ordem.titulo}</p>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <CalendarOrderDetails ordem={ordem} />
                      </DialogContent>
                    </Dialog>
                  ))}
                  {hiddenOrdersCount > 0 && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="bg-muted/50 hover:bg-muted w-full text-left cursor-pointer text-muted-foreground p-1.5 rounded-md text-xs">
                          <p className="font-semibold text-center">+{hiddenOrdersCount} a mais</p>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Ordens para {format(day, 'dd/MM/yyyy', { locale: ptBR })}</DialogTitle>
                          <DialogDescription>
                            Todas as ordens de serviço programadas para este dia.
                          </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-96 -mx-6 px-6">
                          <div className="space-y-2 py-4">
                            {ordersForDay.map(ordem => (
                              <Dialog key={`modal-${ordem.id}`}>
                                <DialogTrigger asChild>
                                  <button className="w-full text-left p-3 rounded-md border hover:bg-accent transition-colors">
                                    <p className="font-semibold truncate text-sm">{format(parseISO(ordem.dataProgramada), 'HH:mm')} - {ordem.titulo}</p>
                                    <p className="text-xs text-muted-foreground truncate">{ordem.ordem} | {ordem.tag}</p>
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                                  <CalendarOrderDetails ordem={ordem} />
                                </DialogContent>
                              </Dialog>
                            ))}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>
    );
  };

  const DayWeekView = ({ view }: { view: 'day' | 'week' }) => {
    const days = view === 'week'
      ? eachDayOfInterval({ start: startOfWeek(currentDate, { weekStartsOn: 0 }), end: endOfWeek(currentDate, { weekStartsOn: 0 }) })
      : [currentDate];

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const HOUR_HEIGHT = 60; // px

    return (
      <div className="flex flex-col">
        {/* Header */}
        <div className="grid border-t" style={{ gridTemplateColumns: '50px 1fr' }}>
          <div className="sticky top-0 z-10 bg-background border-b border-r">&nbsp;</div>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
            {days.map(day => (
              <div key={day.toString()} className="text-center p-2 border-b border-r">
                <p className="text-xs text-muted-foreground">{format(day, 'EEE', { locale: ptBR }).toUpperCase()}</p>
                <p className={cn("text-2xl font-bold", isToday(day) && "text-primary")}>{format(day, 'd')}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Body */}
        <ScrollArea className="flex-1" style={{ height: 'calc(100vh - 250px)' }}>
          <div className="grid relative" style={{ gridTemplateColumns: '50px 1fr' }}>
            {/* Time column */}
            <div className="border-r">
              {hours.map(hour => (
                <div key={hour} className="relative text-right pr-2 text-xs text-muted-foreground" style={{ height: `${HOUR_HEIGHT}px` }}>
                  <span className="relative -top-2">{format(new Date(0, 0, 0, hour), 'HH:mm')}</span>
                </div>
              ))}
            </div>

            {/* Events grid */}
            <div className="grid" style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
              {days.map((day) => (
                <div key={day.toString()} className="relative border-r">
                  {/* Hour lines */}
                  {hours.map(hour => (
                    <div key={hour} className="border-b" style={{ height: `${HOUR_HEIGHT}px` }} />
                  ))}

                  {/* Events */}
                  {ordens
                    .filter(ordem => isSameDay(parseISO(ordem.dataProgramada), day))
                    .map(ordem => {
                      const startDate = parseISO(ordem.dataProgramada);
                      const durationInHours = ordem.operacoes.reduce((acc, op) => acc + op.duracao, 0);

                      const top = (startDate.getHours() + startDate.getMinutes() / 60) * HOUR_HEIGHT;
                      const height = durationInHours * HOUR_HEIGHT;

                      return (
                        <Dialog key={ordem.id}>
                          <DialogTrigger asChild>
                            <button
                              className="absolute w-[95%] left-[2.5%] text-left cursor-pointer rounded-md text-xs z-10"
                              style={{ top: `${top}px`, height: `${Math.max(height, HOUR_HEIGHT / 2)}px` }}
                            >
                              <div className="bg-primary/80 hover:bg-primary text-primary-foreground h-full p-2 rounded-lg overflow-hidden shadow-md">
                                <p className="font-semibold">{ordem.titulo}</p>
                                <p>{format(startDate, 'HH:mm')} - {format(addHours(startDate, durationInHours), 'HH:mm')}</p>
                              </div>
                            </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                            <CalendarOrderDetails ordem={ordem} />
                          </DialogContent>
                        </Dialog>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Hoje</Button>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handlePrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <CardTitle className="text-xl md:text-2xl font-bold capitalize">
            {getTitle()}
          </CardTitle>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[120px]">
                <span>
                  {calendarView === 'day' ? 'Dia' : calendarView === 'week' ? 'Semana' : 'Mês'}
                </span>
                <ChevronDown className="ml-auto h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={calendarView} onValueChange={(v) => setCalendarView(v as CalendarView)}>
                <DropdownMenuRadioItem value="day">Dia</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="week">Semana</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="month">Mês</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0 md:p-2">
        {calendarView === 'month' && renderMonthView()}
        {calendarView === 'week' && <DayWeekView view="week" />}
        {calendarView === 'day' && <DayWeekView view="day" />}
      </CardContent>
    </Card>
  );
}
