const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'yamanote.proxy.rlwy.net',
  port: 19582,
  user: 'root',
  password: 'beKyAYTgEaOflTwRdIyCDnafCkLGIqqX',
  database: 'railway',
});

connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL as ID', connection.threadId);
});

module.exports = connection;
