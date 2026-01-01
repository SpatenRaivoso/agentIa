// typescript file: src/int/Allinterface.tsx

export type Sector = 
| 'VENDAS' 
| 'SUPORTE' 
| 'FINANCEIRO'
;


export interface AgentResponse {
  sector: Sector | null;
  reply: string;
  summary?: string;
  transfer: boolean;
}

