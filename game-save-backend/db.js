
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("MYSQLHOST:", process.env.MYSQLHOST);
console.log("MYSQLUSER:", process.env.MYSQLUSER);
console.log("MYSQLDATABASE:", process.env.MYSQLDATABASE);
console.log("MYSQLPORT:", process.env.MYSQLPORT);



dotenv.config({ path: path.resolve(__dirname, '../.env') });
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password:
    process.env.MYSQL_ROOT_PASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  port: process.env.MYSQLPORT || process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
});
export default pool;