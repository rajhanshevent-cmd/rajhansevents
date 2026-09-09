import { neon } from "@neondatabase/serverless";

/**
 * Neon PostgreSQL Serverless Client & Query Utilities
 * Zero hardcoded credentials: Uses DATABASE_URL exclusively.
 */
function getClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn(
      "[Neon DB] Notice: DATABASE_URL is not defined. Falling back to default static content."
    );
    return null;
  }
  return neon(databaseUrl);
}

// Whitelist of valid table names to prevent SQL injection in dynamic queries
const ALLOWED_TABLES = new Set([
  "home_content",
  "expertise",
  "featured",
  "contact_info",
  "about_us",
  "team",
  "services",
  "packages",
  "portfolio",
  "testimonials",
  "experiences",
  "smiles",
  "enquiries",
  "profiles",
]);

function validateTable(table) {
  if (!ALLOWED_TABLES.has(table)) {
    throw new Error(`Invalid table name: "${table}". Operation aborted for security.`);
  }
}

/**
 * Fetch a single record by its identifier.
 */
export async function getSingle(table, identifier) {
  validateTable(table);
  const sql = getClient();
  if (!sql) return null;

  try {
    const rows = await sql.query(
      `SELECT * FROM ${table} WHERE identifier = $1 LIMIT 1`,
      [identifier]
    );
    return rows[0] || null;
  } catch (error) {
    console.error(`[Neon DB Error] getSingle("${table}", "${identifier}"):`, error);
    return null;
  }
}

/**
 * Fetch all records from a table with ordering.
 */
export async function getAll(table, orderBy = "created_at ASC", limit = null) {
  validateTable(table);
  const sql = getClient();
  if (!sql) return [];

  // Sanitize orderBy
  const safeOrder = orderBy === "created_at DESC" ? "created_at DESC" : "created_at ASC";
  const limitClause = limit && Number.isInteger(limit) ? `LIMIT ${limit}` : "";

  try {
    const rows = await sql.query(
      `SELECT * FROM ${table} ORDER BY ${safeOrder} ${limitClause}`
    );
    return rows || [];
  } catch (error) {
    console.error(`[Neon DB Error] getAll("${table}"):`, error);
    return [];
  }
}

/**
 * Upsert a record based on a conflict column (default: identifier).
 */
export async function upsert(table, data, conflictKey = "identifier") {
  validateTable(table);
  const sql = getClient();
  if (!sql) throw new Error("DATABASE_URL is not configured.");

  const keys = Object.keys(data).filter((k) => data[k] !== undefined);
  if (keys.length === 0) throw new Error("No data provided for upsert.");

  const columns = keys.map((k) => `"${k}"`).join(", ");
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
  const values = keys.map((k) => data[k]);

  // Exclude conflict key from update list
  const updateKeys = keys.filter((k) => k !== conflictKey);
  const updateClause = updateKeys.length > 0
    ? `DO UPDATE SET ${updateKeys.map((k) => `"${k}" = EXCLUDED."${k}"`).join(", ")}`
    : `DO NOTHING`;

  const queryText = `
    INSERT INTO ${table} (${columns})
    VALUES (${placeholders})
    ON CONFLICT ("${conflictKey}")
    ${updateClause}
    RETURNING *;
  `;

  try {
    const result = await sql.query(queryText, values);
    return result[0] || null;
  } catch (error) {
    console.error(`[Neon DB Error] upsert("${table}"):`, error);
    throw error;
  }
}

/**
 * Insert a record into a table.
 */
export async function insert(table, data) {
  validateTable(table);
  const sql = getClient();
  if (!sql) throw new Error("DATABASE_URL is not configured.");

  const keys = Object.keys(data).filter((k) => data[k] !== undefined);
  if (keys.length === 0) throw new Error("No data provided for insert.");

  const columns = keys.map((k) => `"${k}"`).join(", ");
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
  const values = keys.map((k) => data[k]);

  const queryText = `
    INSERT INTO ${table} (${columns})
    VALUES (${placeholders})
    RETURNING *;
  `;

  try {
    const result = await sql.query(queryText, values);
    return result[0] || null;
  } catch (error) {
    console.error(`[Neon DB Error] insert("${table}"):`, error);
    throw error;
  }
}

/**
 * Delete a record from a table by an identifier column.
 */
export async function deleteRecord(table, identifier, idColumn = "identifier") {
  validateTable(table);
  const sql = getClient();
  if (!sql) throw new Error("DATABASE_URL is not configured.");

  const queryText = `DELETE FROM ${table} WHERE "${idColumn}" = $1 RETURNING *;`;

  try {
    const result = await sql.query(queryText, [identifier]);
    return result[0] || null;
  } catch (error) {
    console.error(`[Neon DB Error] deleteRecord("${table}", "${identifier}"):`, error);
    throw error;
  }
}

