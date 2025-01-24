# parser-orm

This is a project to genreate create sql schemas using custom defined syntax and
use javascript functions to query database.

## Installation

To install the dependencies, run:

```bash
npm install
```

## Usage

To generate SQL schemas, use the following command:

```bash
orm init
```

To query the database, use the provided JavaScript functions. Here is an
example:

```javascript
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

  await client.disconnect();
})();
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
