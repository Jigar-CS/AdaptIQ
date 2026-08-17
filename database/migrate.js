/**
 * Database Migration Script
 * Runs schema.sql and seed.sql automatically
 * Usage: node database/migrate.js
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

async function migrate() {
  let connection;

  try {
    console.log('🔄 Connecting to MySQL...');
    // Connect without a database first (to create it if needed)
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD || '',
    });

    // Create database if it doesn't exist
    console.log(`📦 Creating database '${DB_NAME}' if not exists...`);
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.changeUser({ database: DB_NAME });

    // Read and execute schema.sql
    console.log('📝 Running schema.sql...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const schemaStatements = schemaSql
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt && !stmt.startsWith('--'));

    for (const statement of schemaStatements) {
      try {
        await connection.execute(statement);
      } catch (err) {
        if (!err.message.includes('already exists')) {
          console.warn(`⚠️  Warning: ${err.message}`);
        }
      }
    }

    // Read and execute seed.sql
    console.log('🌱 Running seed.sql...');
    const seedPath = path.join(__dirname, 'seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    const seedStatements = seedSql
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt && !stmt.startsWith('--'));

    for (const statement of seedStatements) {
      try {
        await connection.execute(statement);
      } catch (err) {
        console.warn(`⚠️  Warning: ${err.message}`);
      }
    }

    // Verify tables
    console.log('✅ Verifying tables...');
    const [tables] = await connection.execute(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA=?`,
      [DB_NAME]
    );

    const tableNames = tables.map((t) => t.TABLE_NAME).sort();
    const expected = [
      'activity_logs',
      'company_questions',
      'company_tests',
      'performance',
      'placement_score',
      'questions',
      'recommendations',
      'test_questions',
      'tests',
      'topics',
      'user_answers',
      'users',
    ];

    const missing = expected.filter((t) => !tableNames.includes(t));
    if (missing.length === 0) {
      console.log('✨ All 12 tables created successfully!');
      console.log(`   Tables: ${tableNames.join(', ')}`);
    } else {
      console.error('❌ Missing tables:', missing.join(', '));
      process.exit(1);
    }

    console.log('\n🎉 Database migration completed successfully!');
    console.log(`📍 Database: ${DB_NAME}`);
    console.log(`🚀 Next: Run backend with: cd backend && npm start`);

    await connection.end();
  } catch (err) {
    if (err && err.name === 'AggregateError' && Array.isArray(err.errors)) {
      console.error('❌ Migration failed - AggregateError with the following errors:');
      for (const e of err.errors) console.error(e && e.stack ? e.stack : e);
    } else {
      console.error('❌ Migration failed:', err && err.stack ? err.stack : err);
    }
    if (connection) await connection.end();
    process.exit(1);
  }
}

migrate();
