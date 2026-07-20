const mysql = require('mysql2/promise');
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = require('./env');

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection on startup
pool.getConnection()
  .then((conn) => {
    console.log('✅ MySQL connected successfully');
    conn.release();
  })
  .catch((err) => {
<<<<<<< HEAD
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
=======
    console.error('❌ MySQL connection failed (continuing without DB):', err.message);
    // Do not exit the process here so the dev server can still run for frontend work.
    // Runtime DB errors will be surfaced when queries are executed.
>>>>>>> 1826be6 (Updated Phase 1 & 2)
  });

module.exports = pool;
