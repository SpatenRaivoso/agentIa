import { Router } from "express";
import { MessageController } from "../controllers/MessageController.js";

const router = Router();
const controller = new MessageController();

router.post("/", controller.create);
router.get("/", controller.findAll);

export default router;
