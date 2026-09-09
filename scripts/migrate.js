const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const { neon } = require("@neondatabase/serverless");

async function runMigration() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("❌ ERROR: DATABASE_URL not found in .env.local");
    process.exit(1);
  }

  const schemaPath = path.resolve(process.cwd(), "scripts/schema.sql");
  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ ERROR: Schema file not found at ${schemaPath}`);
    process.exit(1);
  }

  const rawSql = fs.readFileSync(schemaPath, "utf-8");

  // Filter out line comments and split statements cleanly
  const cleanedSql = rawSql
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("--")) return "";
      return line;
    })
    .join("\n");

  const statements = cleanedSql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`⏳ Connecting to Neon database and executing ${statements.length} schema statements...`);
  const sql = neon(dbUrl);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await sql.query(stmt);
    } catch (err) {
      console.error(`❌ Error executing statement #${i + 1}:\n${stmt}\n`, err.message);
      process.exit(1);
    }
  }

  console.log("✅ All schema statements executed successfully!");

  // Verify created tables
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;

  console.log(`\n📋 Live tables in Neon public schema (${tables.length} tables found):`);
  tables.forEach((t, i) => console.log(`  ${i + 1}. ${t.table_name}`));
  console.log(`\n🎉 All ${tables.length} tables verified and ready in Neon!`);
}

runMigration();
