import type { Permit, OrdemServico } from './definitions';

// In-memory store
let permits: Permit[] = [
  {
    id: 'AST-999',
    title: 'AST-999: Manutenção Preventiva em Bomba Centrífuga',
    requester: 'Template System',
    location: 'Área de Bombas',
    status: 'Aprovado',
    createdAt: new Date().toISOString(),
    pasos: [
      {
        descripcion: 'Realizar o bloqueio de energias (LOTO) no painel elétrico principal.',
        isCritico: true,
        riesgos: [
          {
            categoria: 'Seguridad',
            riesgo: 'Contato com energia elétrica',
            medida: 'Utilizar cadeado e etiqueta de bloqueio pessoal. Testar ausência de tensão antes de iniciar.'
          }
        ]
      },
      {
        descripcion: 'Abertura das válvulas de dreno e alívio de pressão do sistema.',
        isCritico: false,
        riesgos: [
          {
            categoria: 'Salud',
            riesgo: 'Exposición a sustancias peligrosas',
            medida: 'Uso obrigatório de óculos de ampla visão e luvas de nitrila. Verificar se o dreno está direcionado para a canaleta.'
          }
        ]
      },
      {
        descripcion: 'Desmontagem do acoplamento e remoção do motor para oficina.',
        isCritico: true,
        riesgos: [
          {
            categoria: 'Seguridad',
            riesgo: 'Atrapamiento por partes móviles',
            medida: 'Verificar se o motor está totalmente parado e bloqueado mecanicamente antes de retirar a proteção de acoplamento.'
          },
          {
            categoria: 'Seguridad',
            riesgo: 'Caída a distinto nivel',
            medida: 'Uso de cinto de segurança se o acesso for superior a 2 metros.'
          }
        ]
      }
    ]
  },
  {
    id: '1',
    title: 'Trabalho a quente na área de soldagem',
    requester: 'João Silva',
    location: 'Oficina Central',
    status: 'Aprovado',
    createdAt: new Date('2023-10-26T10:00:00Z').toISOString(),
  },
  {
    id: '2',
    title: 'Manutenção elétrica no painel P-01',
    requester: 'Maria Oliveira',
    location: 'Sala Elétrica 1',
    status: 'Pendente',
    createdAt: new Date('2023-10-27T11:30:00Z').toISOString(),
  },
  {
    id: '3',
    title: 'Içamento de carga com guindaste',
    requester: 'Carlos Pereira',
    location: 'Pátio Externo',
    status: 'Rejeitado',
    createdAt: new Date('2023-10-25T09:00:00Z').toISOString(),
  },
];

const ordensServico: OrdemServico[] = [
  {
    id: '1',
    ordem: '504050233554',
    titulo: '[05]REPARO MOLA AÉREA PORTAS',
    tag: '450-34-011 - BOMBA A DO POCO DE EFLUENTE ALCALINO',
    area: '450 - PLANTAS QUIMICAS',
    status: 'LIB',
    prioridade: 'Média',
    dataProgramada: new Date('2025-11-06T00:00:00Z').toISOString(),
    notaNumero: '90123456',
    descricaoProblema: 'Solicitação da Segurança do Trabalho (Turno Chile). Necessária manutenção urgente pois as portas estão sem mola aérea.',
    centroTrabalho: 'CTM118 (MECANICA)',
    operacoes: [
      { id: 'op1-1', descricao: 'ABRIR PT', duracao: 0.5,协议: 1 },
      { id: 'op1-2', descricao: 'REPARAR PUERTAS', duracao: 8.0, pessoas: 2 },
      { id: 'op1-3', descricao: 'FECHAR PT', duracao: 0.5, pessoas: 1 },
    ],
    hasAttachment: true,
  },
  {
    id: '2',
    ordem: '504050233555',
    titulo: '[03]MANUTENÇÃO CORRETIVA EM VÁLVULA',
    tag: '450-12-005 - VÁLVULA DE CONTROLE DE VAPOR',
    area: '450 - CALDEIRA DE RECUPERAÇÃO',
    status: 'ABERTA',
    prioridade: 'Alta',
    dataProgramada: new Date('2025-11-08T00:00:00Z').toISOString(),
    notaNumero: '90123457',
    descricaoProblema: 'Vazamento de vapor identificado na válvula. Requer reparo imediato para evitar parada de produção.',
    centroTrabalho: 'CTM115 (INSTRUMENTAÇÃO)',
    operacoes: [
      { id: 'op2-1', descricao: 'ISOLAR ÁREA', duracao: 1.0, pessoas: 2 },
      { id: 'op2-2', descricao: 'REPARAR VÁLVULA', duracao: 6.0, pessoas: 2 },
      { id: 'op2-3', descricao: 'TESTAR VÁLVULA', duracao: 1.0, pessoas: 1 },
    ],
    hasAttachment: false,
  },
];


// Simulate network latency
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getPermits(): Promise<Permit[]> {
  await delay(500);
  return permits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getPermitById(id: string): Promise<Permit | undefined> {
  await delay(200);
  return permits.find((p) => p.id === id || p.title.toLowerCase().includes(id.toLowerCase()));
}

export async function addPermit(data: Omit<Permit, 'id' | 'createdAt'>): Promise<Permit> {
  await delay(300);
  const newPermit: Permit = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  permits = [newPermit, ...permits];
  return newPermit;
}

export async function updatePermit(id: string, data: Partial<Omit<Permit, 'id'>>): Promise<Permit | undefined> {
  await delay(300);
  const permitIndex = permits.findIndex((p) => p.id === id);
  if (permitIndex > -1) {
    permits[permitIndex] = { ...permits[permitIndex], ...data };
    return permits[permitIndex];
  }
  return undefined;
}

export async function getOrdensServico(): Promise<OrdemServico[]> {
  await delay(500);
  return ordensServico;
}
