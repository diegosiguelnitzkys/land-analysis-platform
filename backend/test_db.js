const pool = require('./db');

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected at:', res.rows[0].now);
  } catch (err) {
    console.error('Database connection error', err);
  } finally {
    pool.end();
  }
}

testConnection();
