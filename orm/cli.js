#!/usr/bin/env node

import fs from "fs";
import path from "path";

// Get the command arguments
const args = process.argv.slice(2);

// Check if the first argument is "init"
if (args[0] === "init") {
  // Define the target directory and file path
  const ormFolderPath = path.join(process.cwd(), "orm");
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
    const schemaFileContent = `# Basic ORM schema
# Example entity definition

entity User {
  id: Int @id @autoIncrement
  name: String
  email: String @unique
  createdAt: DateTime @default(now())
  updatedAt: DateTime @updatedAt
}

# You can define more entities here
`;

    fs.writeFileSync(schemaFilePath, schemaFileContent);
    console.log("Initialized ORM schema at ./orm/schema.orm");
  } catch (error) {
    console.error("Error initializing ORM schema:", error.message);
  }
} else {
  console.log('Invalid command. Use "init" to initialize the ORM schema.');
}
