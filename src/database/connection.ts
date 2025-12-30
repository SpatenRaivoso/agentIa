import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const databaseConnection = open({
  filename: path.resolve(__dirname, "../../database.sqlite"),
  driver: sqlite3.Database
});
