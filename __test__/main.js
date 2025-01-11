import { Parser } from "../parser.js";

const parser = new Parser();

console.log(JSON.stringify(parser.parse(`"adfa"`), null, 2));

console.log(/^\d+/.exec("124124123adfadfs"));
