#!/usr/bin/env node

import fs from "fs";
import path from "path";
/**
 * Module to genereate sample ORM schema.
 */
const args = process.argv.slice(2);
if (args[0] === "init") {
  // Define the target directory and file path
  const ormFolderPath = path.join(process.cwd(), "schemas");
  const schemaFilePath = path.join(ormFolderPath, "schema.orm");

  try {
    // Check if the "orm" folder exists, create it if not
    if (!fs.existsSync(ormFolderPath)) {
      fs.mkdirSync(ormFolderPath, { recursive: true });
      console.log('Created "orm" folder.');
    }

    // Check if the schema file already exists
    if (fs.existsSync(schemaFilePath)) {
      console.log("schema.orm already exists. Initialization skipped.");
      process.exit(0);
    }

    // Create the schema file with basic content
    const schemaFileContent = `
table users {
  id serial primary_key,
  username varchar(50) not_null unique,
  email varchar(100) not_null unique,
  password varchar(255) not_null,
  created_at timestamp default current_timestamp
}
`;

    fs.writeFileSync(schemaFilePath, schemaFileContent);
    console.log("Initialized ORM schema at ./orm/schema.orm");
  } catch (error) {
    console.error("Error initializing ORM schema:", error.message);
  }
} else {
  console.log('Invalid command. Use "init" to initialize the ORM schema.');
}
