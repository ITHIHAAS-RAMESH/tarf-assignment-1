import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Open a database connection
export async function getDB() {
  return open({
    filename: "./case_logs.db",
    driver: sqlite3.Database,
  });
}

// Initialize the table
export async function initDB() {
  const db = await getDB();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS case_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      caseNumber TEXT,
      caseType TEXT,
      caseYear TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      jsonResponse TEXT
    )
  `);
}

// Log a request + JSON response
export async function logQuery({
  caseNumber,
  caseType,
  caseYear,
  jsonResponse,
}) {
  const db = await getDB();
  await db.run(
    `INSERT INTO case_logs (caseNumber, caseType, caseYear, jsonResponse)
     VALUES (?, ?, ?, ?)`,
    [caseNumber, caseType, caseYear, JSON.stringify(jsonResponse)]
  );
}
