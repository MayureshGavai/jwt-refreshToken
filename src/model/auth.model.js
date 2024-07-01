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

export const addNewUser = async (user) => {
    try {
        
        const pool = await poolConnect;

        const checkUserResult = await pool.request()
            .input('email', sql.NVarChar, user.email)
            .query(`SELECT COUNT(*) AS count FROM Users WHERE email = @email`)

        if(checkUserResult.recordset[0].count > 0){
            throw new Error('User already registered')
        }

        const result = await pool.request()
            .input('username', sql.NVarChar, user.username)
            .input('email', sql.NVarChar, user.email)
            .input('password', sql.NVarChar, user.password)
            .query(`INSERT INTO Users (username, email, password) VALUES (@username, @email, @password)`);

        if (result && result.rowsAffected && result.rowsAffected.length > 0) {
            return result.rowsAffected[0];
        } else {
            throw new Error('Unexpected result format');
        }
    } catch (err) {
        console.error('Database query error:', err)
        throw err
    }
}