import sqlite3 from "sqlite3";
import { open } from "sqlite";

class OrmClient {
  constructor(config, ast) {
    this.config = config;
    this.db = null;
    this.ast = ast;
    this._generateMethods();
  }

  async connect() {
    this.db = await open({
      filename: this.config.filename,
      driver: sqlite3.Database,
    });
    console.log("Connected to the SQLite database");
  }

  _generateMethods() {
    if (!this.ast || this.ast.type !== "Program" || !this.ast.body) {
      throw new Error(
        "Invalid AST structure: 'Program' and 'body' are required"
      );
    }

    const tables = Array.isArray(this.ast.body)
      ? this.ast.body
      : [this.ast.body];

    tables.forEach((table) => {
      if (table.type !== "TableLiteral" || !table.name) {
        throw new Error("Invalid Table structure in AST");
      }

      const tableName = table.name;

      // Dynamically add CRUD methods for the table
      this[tableName] = {
        insert: (data) => this._insert(tableName, data),
        update: (where, data) => this._update(tableName, where, data),
        delete: (where) => this._delete(tableName, where),
        query: (options) => this._query(tableName, options),
      };

      console.log(`Methods generated for table: ${tableName}`);
    });
  }

  async _query(table, options = {}) {
    const { select, where, orderBy, limit, offset } = options;

    const fields = select?.length > 0 ? select.join(", ") : "*";
    let query = `SELECT ${fields} FROM ${table}`;

    if (where) {
      const conditions = Object.keys(where)
        .map((key) => `${key} = ?`)
        .join(" AND ");
      query += ` WHERE ${conditions}`;
    }

    if (orderBy) {
      const orderClauses = Object.entries(orderBy)
        .map(([key, direction]) => `${key} ${direction.toUpperCase()}`)
        .join(", ");
      query += ` ORDER BY ${orderClauses}`;
    }

    if (limit) query += ` LIMIT ${limit}`;
    if (offset) query += ` OFFSET ${offset}`;

    const values = where ? Object.values(where) : [];

    const res = await this.db.all(query, values);
    return res;
  }

  async _insert(table, data) {
    const fields = Object.keys(data).join(", ");
    const placeholders = Object.keys(data)
      .map(() => "?")
      .join(", ");
    const query = `INSERT INTO ${table} (${fields}) VALUES (${placeholders})`;

    const values = Object.values(data);
    await this.db.run(query, values);
    return { ...data, id: this.db.lastID };
  }

  async _update(table, where, data) {
    const updates = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");

    const conditions = Object.keys(where)
      .map((key) => `${key} = ?`)
      .join(" AND ");

    const query = `UPDATE ${table} SET ${updates} WHERE ${conditions}`;

    const values = [...Object.values(data), ...Object.values(where)];
    await this.db.run(query, values);
    return { ...data, ...where };
  }

  async _delete(table, where) {
    const conditions = Object.keys(where)
      .map((key) => `${key} = ?`)
      .join(" AND ");

    const query = `DELETE FROM ${table} WHERE ${conditions}`;

    const values = Object.values(where);
    await this.db.run(query, values);
    return where;
  }

  async disconnect() {
    await this.db.close();
    console.log("Disconnected from the SQLite database");
  }
}

export { OrmClient };
