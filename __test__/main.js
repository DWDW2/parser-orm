import { Parser } from "../parser.js";

const parser = new Parser();

console.log(JSON.stringify(parser.parse(`"Hello world"`), null, 2));
