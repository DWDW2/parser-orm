import { Parser } from "../parser.js";

const parser = new Parser();

console.log(JSON.stringify(parser.parse(`32`), null, 2));
