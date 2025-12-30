import type { Request, Response } from "express";
import MessageService from "../services/MessageService.js";

export class MessageController {
  private messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  create = async (req: Request, res: Response) => {
    const { content, conversationId } = req.body;

    if (!content || !conversationId) {
      return res.status(400).json({ error: "Mensagem e conversationId são obrigatórios" });
    }

    const response = await this.messageService.handleUserMessage(content, conversationId);
    return res.json(response);
  };


  // funcao para obter o historico de mensagens devolvida pelo bot
  findAll = async (_req: Request, res: Response) => {
    const messages = await this.messageService.getHistory();
    return res.json(messages);
  };
}
