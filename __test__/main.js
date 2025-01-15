import { Parser } from "../parser.js";

const parser = new Parser();

console.log(JSON.stringify(parser.parse(`        45`), null, 2));
