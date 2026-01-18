
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




dotenv.config({ path: path.resolve(__dirname, '../.env') });
const pool = mysql.createPool(process.env.DATABASE_URL);
export default pool;