import { MessageRepository } from "../repositories/MessageRepository.js";
import { AgentService, type AgentResponse } from "./AgentService.js";

export default class MessageService {
  private agentService: AgentService;
  private messageRepository: MessageRepository;

  constructor() {
    this.agentService = new AgentService();
    this.messageRepository = new MessageRepository();
  }

  async handleUserMessage(content: string, conversationId: string): Promise<AgentResponse> {
    await this.messageRepository.create({
      role: "USER",
      content,
      sector: null,
      summary: null,
      conversationId
    });

    // Obter o setor atual da conversa
    const messages = await this.messageRepository.findByConversationId(conversationId);
    const lastAgentMessage = messages.filter(m => m.role === 'AGENT' && m.sector).pop();
    const currentSector = lastAgentMessage ? lastAgentMessage.sector : null;

    const agentResponse = await this.agentService.processMessage(content, currentSector);

    await this.messageRepository.create({
      role: "AGENT",
      content: agentResponse.reply,
      sector: agentResponse.sector ?? null,
      summary: agentResponse.summary ?? null,
      conversationId
    });

    return agentResponse;
  }

  async getHistory() {
    const messages = await this.messageRepository.findAll();
    const conversations: { [key: string]: any[] } = {};

    messages.forEach(msg => {
      if (msg.conversation_id) {
        if (!conversations[msg.conversation_id]) {
          conversations[msg.conversation_id] = [];
        }
        conversations[msg.conversation_id]!.push(msg);
      }
    });

    return Object.values(conversations);
  }
}
