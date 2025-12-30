import app from "./app.js";
import { createTables } from "./src/database/schema.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  await createTables();

  app.listen(PORT, () => {
    console.log(`🚀 Server rodando na porta ${PORT}`);
  });
}

startServer();
