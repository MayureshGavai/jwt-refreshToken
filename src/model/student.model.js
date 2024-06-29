import { sql, poolConnect } from '../config/db.js';

export const getAllStudents = async () => {
    try {
        // Wait for the pool connection to be established
        const pool = await poolConnect;

        // Perform the query to get all students
        const result = await pool.request().query('SELECT * FROM Students');

        return result.recordset;
    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    }
}


export const addNewStudent = async (student) => {
    try{
        const pool = await poolConnect

        const request  = pool.request()
        // request.input('id', sql.Int, student.id);
        request.input('fname', sql.NVarChar, student.fname);
        request.input('lname', sql.NVarChar, student.lname);
        request.input('phone', sql.NVarChar, student.phone);
        request.input('address', sql.NVarChar, student.address);
        request.input('course', sql.NVarChar, student.course);
        request.input('div', sql.NVarChar, student.div);
        request.input('acad_year', sql.Int, student.acad_year);

        const result = await request.query(`
            INSERT INTO Students ( fname, lname, phone, address, course, div, acad_year)
            VALUES ( @fname, @lname, @phone, @address, @course, @div, @acad_year)
        `);

        return result.rowsAffected[0];
    }catch(err){
        console.log(err.message)
    }
}