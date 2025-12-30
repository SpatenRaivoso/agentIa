type Sector = "VENDAS" | "SUPORTE" | "FINANCEIRO";

export interface AgentResponse {
  sector: Sector | null;
  reply: string;
  summary?: string;
  transfer: boolean;
}

export class AgentService {
  async processMessage(message: string): Promise<AgentResponse> {
    const lower = message.toLowerCase();

    if (this.isOutOfContext(lower)) {
      return {
        sector: null,
        transfer: false,
        reply:
          "Sinto muito, mas não tenho autorização para falar sobre esse assunto. Posso ajudar com vendas, suporte ou financeiro."
      };
    }

    if (this.isFinance(lower)) {
      return {
        sector: "FINANCEIRO",
        transfer: true,
        reply:
          "Entendi sua solicitação. Vou te transferir para o setor Financeiro para te ajudar melhor.",
        summary: "Cliente entrou em contato sobre pagamento/boleto."
      };
    }

    if (this.isSupport(lower)) {
      return {
        sector: "SUPORTE",
        transfer: true,
        reply:
          "Sinto muito pelo transtorno. Vou te transferir para o Suporte para resolvermos isso rapidamente.",
        summary: "Cliente relatou problema ou erro no serviço."
      };
    }

    if (this.isSales(lower)) {
      return {
        sector: "VENDAS",
        transfer: true,
        reply:
          "Perfeito! Vou te encaminhar para nosso time de Vendas para te ajudar com essa solicitação.",
        summary: "Cliente demonstrou interesse em compra ou negociação."
      };
    }

    return {
      sector: null,
      transfer: false,
      reply:
        "Pode me explicar um pouco melhor como posso te ajudar? É sobre vendas, suporte ou financeiro?"
    };
  }

  private isFinance(text: string) {
    return ["boleto", "pagamento", "pagar", "estorno", "nota fiscal"].some(
      word => text.includes(word)
    );
  }

  private isSupport(text: string) {
    return ["erro", "problema", "atraso", "bloqueado", "reclamação"].some(
      word => text.includes(word)
    );
  }

  private isSales(text: string) {
    return ["comprar", "preço", "desconto", "parcelar", "negociar"].some(
      word => text.includes(word)
    );
  }

  private isOutOfContext(text: string) {
    return ["clima", "tempo", "futebol", "política", "notícia"].some(
      word => text.includes(word)
    );
  }
}
