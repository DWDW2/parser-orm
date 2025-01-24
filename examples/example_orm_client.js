import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Parser } from "../orm/parser.js";
import { OrmClient } from "../orm/client.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const syntaxFilePath = path.resolve(__dirname, "schemas/schema.orm");
const syntax = fs.readFileSync(syntaxFilePath, "utf-8");
const parser = new Parser();
const ast = parser.parse(syntax);

const dbFilePath = path.resolve(__dirname, "database.sqlite");
const config = {
  filename: dbFilePath,
};

const client = new OrmClient(config, ast);

(async () => {
  await client.connect();

  try {
    const newUser = await client.users.query({
      select: ["id", "username", "email", "created_at"],
    });
    console.log("Inserted user:", newUser);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT") {
      console.error("Error inserting user: Email must be unique");
    } else {
      console.error("Error inserting user:", error);
    }
  }

  //   const users = await client.users.query({
  //     select: ["id", "username", "email", "created_at"],
  //     where: { username: "john_doe" },
  //   });
  //   console.log("Queried users:", users);

  //   const updatedUser = await client.users.update(
  //     { id: users[0].id },
  //     { email: "john.doe@example.com" }
  //   );
  //   console.log("Updated user:", updatedUser);

  //   const deletedUser = await client.users.delete({ id: users[0].id });
  //   console.log("Deleted user:", deletedUser);

  await client.disconnect();
})();
