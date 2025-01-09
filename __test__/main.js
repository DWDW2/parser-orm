import { Parser } from "../parser.js";

const parser = new Parser();

console.log(JSON.stringify(parser.parse("42"), null, 2));
