import pkg from "pg";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
const { Client } = pkg;

class DatabaseConnector {
  constructor(config) {
    this.config = config;
    this.client = null;
    this.db = null;
  }

  async connect() {
    if (this.config.type === "postgres") {
      this.client = new Client(this.config);
      try {
        await this.client.connect();
        console.log("Connected to the PostgreSQL database");
      } catch (err) {
        console.error("Connection error", err.stack);
      }
    } else if (this.config.type === "sqlite") {
      try {
        if (!fs.existsSync(this.config.filename)) {
          fs.writeFileSync(this.config.filename, "");
        }
        this.db = await open({
          filename: this.config.filename,
          driver: sqlite3.Database,
        });
        console.log("Connected to the SQLite database");
      } catch (err) {
        console.error("Connection error", err.message);
      }
    }
  }

  async disconnect() {
    if (this.config.type === "postgres") {
      try {
        await this.client.end();
        console.log("Disconnected from the PostgreSQL database");
      } catch (err) {
        console.error("Disconnection error", err.stack);
      }
    } else if (this.config.type === "sqlite") {
      try {
        await this.db.close();
        console.log("Disconnected from the SQLite database");
      } catch (err) {
        console.error("Disconnection error", err.message);
      }
    }
  }

  async query(sql, params) {
    if (this.config.type === "postgres") {
      try {
        const res = await this.client.query(sql, params);
        return res.rows;
      } catch (err) {
        console.error("Query error", err.stack);
      }
    } else if (this.config.type === "sqlite") {
      try {
        const res = await this.db.all(sql, params);
        return res;
      } catch (err) {
        console.error("Query error", err.message);
      }
    }
  }
}

export { DatabaseConnector };
