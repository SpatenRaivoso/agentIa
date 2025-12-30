import type { Request, Response } from "express";
import MessageService from "../services/MessageService.js";

export class MessageController {
  private messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  create = async (req: Request, res: Response) => {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Mensagem é obrigatória" });
    }

    const response = await this.messageService.handleUserMessage(content);
    return res.json(response);
  };

  findAll = async (_req: Request, res: Response) => {
    const messages = await this.messageService.getHistory();
    return res.json(messages);
  };
}
