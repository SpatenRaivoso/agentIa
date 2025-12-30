import { MessageRepository } from "../repositories/MessageRepository.js";
import { AgentService, type AgentResponse } from "./AgentService.js";

export default class MessageService {
  private agentService: AgentService;
  private messageRepository: MessageRepository;

  constructor() {
    this.agentService = new AgentService();
    this.messageRepository = new MessageRepository();
  }

  async handleUserMessage(content: string): Promise<AgentResponse> {
    // 1️⃣ Salva mensagem do usuário
    await this.messageRepository.create({
      role: "USER",
      content,
      sector: null,
      summary: null
    });

    // 2️⃣ Processa IA
    const agentResponse = await this.agentService.processMessage(content);

    // 3️⃣ Salva resposta do agente
    await this.messageRepository.create({
      role: "AGENT",
      content: agentResponse.reply,
      sector: agentResponse.sector ?? null,
      summary: agentResponse.summary ?? null
    });

    return agentResponse;
  }

  async getHistory() {
    return this.messageRepository.findAll();
  }
}
