import { sql, poolConnect } from '../config/db.js';

export const getAllUsers = async () => {
    try {
        // Wait for the pool connection to be established
        const pool = await poolConnect;

        // Perform the query to get all students
        const result = await pool.request().query('SELECT * FROM Users');

        return result.recordset;
    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    }
}