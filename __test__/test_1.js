import { Parser } from "../parser.js";

const parser = new Parser();

console.log(
  JSON.stringify(
    parser.parse(`table users {
  id serial primary_key,
  username varchar(50) not_null unique,
  email varchar(100) not_null unique,
  password varchar(255) not_null,
  created_at timestamp default current_timestamp
}`),
    null,
    2
  )
);
