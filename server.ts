import "dotenv/config";
import app from "./app.js";
import { createTables } from "./src/database/schema.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  // Funcao para criar a tabela no banco de dados
  await createTables();

  app.listen(PORT, () => {
    console.log(`🚀 Server rodando na porta ${PORT}`);
  });
}

startServer();
