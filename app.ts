import express from "express";
import cors from "cors";
import messageRoutes from "./src/routes/message.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/messages", messageRoutes);

export default app;
