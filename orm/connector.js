import pkg from "pg";
const { Client } = pkg;

class DatabaseConnector {
  constructor(config) {
    this.config = config;
    this.client = new Client(this.config);
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("Connected to the PostgreSQL database");
    } catch (err) {
      console.error("Connection error", err.stack);
    }
  }

  async disconnect() {
    try {
      await this.client.end();
      console.log("Disconnected from the PostgreSQL database");
    } catch (err) {
      console.error("Disconnection error", err.stack);
    }
  }

  async query(sql, params) {
    try {
      const res = await this.client.query(sql, params);
      return res.rows;
    } catch (err) {
      console.error("Query error", err.stack);
    }
  }
}

export { DatabaseConnector };
