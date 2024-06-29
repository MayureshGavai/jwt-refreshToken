import { addNewStudent, getAllStudents } from '../model/student.model.js';

export const fetchAllStudents = async (req, res) => {
    try {
        const students = await getAllStudents();
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch students data' });
    }
}

export const createStudent = async (req,res) => {
    try {
        const student = {
            fname : req.body.fname,
            lname : req.body.lname,
            phone : req.body.phone,
            address : req.body.address,
            course : req.body.course,
            div : req.body.div,
            aced_year : req.body.aced_year
        }        

        const rowsAffected = await addNewStudent(student);
        res.status(201).json({ message: 'Student added successfully', rowsAffected });

    } catch (err) {
        res.status(500).json({ error: 'Failed to add student data' });
    }
}
