export type Permit = {
  id: string;
  title: string;
  requester: string;
  location: string;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
  createdAt: string;
  
  // Shared fields (Standardized)
  paradaGeral?: boolean;
  paradaGeneral?: boolean;
  demandaTipo?: 'ordem' | 'urgente' | 'outras' | 'om' | 'otras';
  outraAtividade?: string;
  ast?: string;
  ptNumero?: string;
  dataProgramada?: string; // Data Início
  horaInicio?: string;
  dataFim?: string;
  horaFim?: string;
  planta?: string;
  area?: string;
  tag?: string;
  equipamento?: string;
  os?: string; // OS/OM
  om?: string;
  ruta?: string;
  pontoAmbulancia?: string;
  chuveiroEmergencia?: string;
  descricao?: string; // Atividade Realizada
  actividad?: string;
  sistemasEquipos?: string;
  empresaTipo?: 'cmpc' | 'prestador';
  empresaNome?: string;

  // Guaíba specific (Steps 2+)
  perigosRiscos?: string[];
  necessidadeBloqueio?: 'sim' | 'nao';
  matrizBloqueio?: string;
  fonteEnergia?: string[];
  listaVerificacao?: string[];
  listaVerificacaoOperador?: string[];
  verificacaoOperador?: Record<string, 'sim' | 'na'>;
  listaVerificacaoOutros?: string[];
  listaVerificacaoOutros1?: string;
  checklistCategorias?: string[];
  checklists?: any;
  alturaSubcategorias?: string[];
  epis?: Record<string, string[]>;

  // Modern nested steps structure
  pasos?: {
    descripcion: string;
    isCritico: boolean;
    riesgos: {
      categoria: string;
      riesgo: string;
      medida: string;
    }[];
  }[];

  accionOperativa?: {
    enabled: boolean;
    descripcion: string;
    isCritico: boolean;
    riesgos: {
      categoria: string;
      riesgo: string;
      medida: string;
    }[];
  };

  imprevistos?: {
    enabled: boolean;
    descripcion: string;
    isCritico: boolean;
    riesgos: {
      categoria: string;
      riesgo: string;
      medida: string;
    }[];
  };

  // Legacy/Santa Fé specific (Backward compatibility)
  riesgosCriticos?: string[];
  checklistEspaciosConfinados?: {
    procedimientos?: {
      bloqueo?: 'si' | 'na' | null;
      purga?: 'si' | 'na' | null;
      ventilacion?: 'si' | 'na' | null;
      iluminacion?: 'si' | 'na' | null;
      comunicacion?: 'si' | 'na' | null;
      rescate?: 'si' | 'na' | null;
      planRescate?: 'si' | 'na' | null;
    };
    equipos?: {
      escaleras?: 'si' | 'na' | null;
      extintores?: 'si' | 'na' | null;
      epp?: 'si' | 'na' | null;
      monitoreoGases?: 'si' | 'na' | null;
      equiposElectronicos?: 'si' | 'na' | null;
    };
  };
};

export type OrdemServico = {
  id: string;
  ordem: string;
  titulo: string;
  tag: string;
  area: string;
  status: 'LIB' | 'ABERTA' | 'CONCLUIDA';
  prioridade: 'Alta' | 'Média' | 'Baixa';
  dataProgramada: string;
  notaNumero: string;
  descricaoProblema: string;
  centroTrabalho: string;
  operacoes: {
    id: string;
    descricao: string;
    duracao: number;
    pessoas: number;
  }[];
  hasAttachment?: boolean;
};
