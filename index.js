import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Parser } from "./orm/parser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const syntaxFilePath = path.resolve(__dirname, "orm/syntax.orm");
const syntax = fs.readFileSync(syntaxFilePath, "utf-8");
const parser = new Parser();
const ast = parser.parse(syntax);
console.log(JSON.stringify(ast, null, 2));
