import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import type { AgentResponse, Sector } from '../int/Allinterface.js';


export class AgentService {
  private ollamaUrl: string;
  private instructions: any;

  constructor() {
    this.ollamaUrl = 'http://localhost:11434/api/generate';
    this.loadInstructions();
  }


  // Função para carregar as instruções do bot a partir do arquivo JSON
  private async loadInstructions() {
    try {
      const filePath = path.join(process.cwd(), 'src/services/botInstructions.json');
      const data = await fs.readFile(filePath, 'utf-8');
      this.instructions = JSON.parse(data);
    } catch (error) {
      console.error('Erro ao carregar instruções:', error);
      this.instructions = {};
    }
  }

  async processMessage(message: string, currentSector: Sector | null = null): Promise<AgentResponse> {
    if (currentSector) {
      const sectorKey = currentSector.toLowerCase();
      const reply = await this.generateReply(sectorKey, `O usuário disse: "${message}". Responda de forma apropriada para o setor ${currentSector}, mantendo o tom e oferecendo ajuda.`);
      return {
        sector: currentSector,
        transfer: false,
        reply
      };
    }

    const lower = message.toLowerCase().trim();

    if (lower === "1" || lower === "vendas") {
      const reply = await this.generateReply("vendas", "O usuário escolheu vendas. Responda de forma entusiasmada e motivadora, oferecendo opções e terminando com a transferência personalizada.");
      return {
        sector: "VENDAS",
        transfer: true,
        reply,
        summary: "Cliente escolheu o setor de Vendas."
      };
    }

    if (lower === "2" || lower === "suporte") {
      const reply = await this.generateReply("suporte", "O usuário escolheu suporte. Responda de forma empática e solidária, oferecendo ajuda e terminando com a transferência personalizada.");
      return {
        sector: "SUPORTE",
        transfer: true,
        reply,
        summary: "Cliente escolheu o setor de Suporte."
      };
    }

    if (lower === "3" || lower === "financeiro") {
      const reply = await this.generateReply("financeiro", "O usuário escolheu financeiro. Responda de forma prestativa, explicando brevemente e terminando com a transferência personalizada.");
      return {
        sector: "FINANCEIRO",
        transfer: true,
        reply,
        summary: "Cliente escolheu o setor Financeiro."
      };
    }

    const reply = "Olá! Em que setor posso te ajudar? Responda com: 1 para Vendas, 2 para Suporte, 3 para Financeiro.";
    return {
      sector: null,
      transfer: false,
      reply
    };
  }

  private async generateReply(sector: string, userPrompt: string): Promise<string> {
    try {
      const systemPrompt = this.instructions[sector] || "Você é um assistente útil.";
      const fullPrompt = `${systemPrompt}\n\n${userPrompt} Responda de forma concisa, em até 30 palavras.`;
      const response = await axios.post(this.ollamaUrl, {
        model: 'llama3.2',
        prompt: fullPrompt,
        stream: false
      });
      let reply = response.data.response.trim();
      const words = reply.split(' ');
      if (words.length > 50) {
        reply = words.slice(0, 50).join(' ') + '...';
      }
      return reply;
    } catch (error) {
      console.error('Erro ao gerar resposta com Ollama:', error);
      return "Desculpe, houve um erro. Tente novamente.";
    }
  }
}