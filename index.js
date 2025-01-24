import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Parser } from "./orm/parser.js";
import { generateSQL } from "./orm/sqlGenerator.js";
import { DatabaseConnector } from "./orm/connector.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const syntaxFilePath = path.resolve(__dirname, "schemas/schema.orm");
const syntax = fs.readFileSync(syntaxFilePath, "utf-8");
const parser = new Parser();
const ast = parser.parse(syntax);
const sql = generateSQL(ast);

const dbFilePath = path.resolve(__dirname, "database.sqlite");
const config = {
  type: "sqlite",
  filename: dbFilePath,
};
console.log(ast);
const connector = new DatabaseConnector(config);

(async () => {
  await connector.connect();
  await connector.query(sql);
  await connector.disconnect();
})();
