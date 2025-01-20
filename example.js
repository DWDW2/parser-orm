import { Parser } from './parser.js';
import { generateSQL } from './sqlGenerator.js';

const parser = new Parser();
const ast = parser.parse(`table users {
  id serial primary_key,
  username varchar(50) not_null unique,
  email varchar(100) not_null unique,
  password varchar(255) not_null,
  created_at timestamp default current_timestamp
}`);
const sql = generateSQL(ast);
console.log(sql); 