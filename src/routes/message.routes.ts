import { Router } from "express";
import { MessageController } from "../controllers/MessageController.js";

const router = Router();
const controller = new MessageController();

// Rota para criar uma nova mensagem
router.post("/", controller.create);

// rota para obter o historico de mensagens
router.get("/", controller.findAll);

export default router;
