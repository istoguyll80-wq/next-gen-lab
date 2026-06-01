const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const DB_PATH = path.join(__dirname, "phishing_simulator.db");
const db = new sqlite3.Database(DB_PATH);

const schema = fs.readFileSync(path.join(__dirname, "database.sql"), "utf8");
const sample = fs.readFileSync(path.join(__dirname, "sample_data.sql"), "utf8");

db.serialize(() => {
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(schema, (schemaErr) => {
    if (schemaErr) {
      console.error("Schema error:", schemaErr.message);
      db.close();
      return;
    }

    db.exec(sample, (sampleErr) => {
      if (sampleErr) {
        console.error("Sample data error:", sampleErr.message);
      } else {
        console.log("Database ready at:", DB_PATH);
      }
      db.close();
    });
  });
});