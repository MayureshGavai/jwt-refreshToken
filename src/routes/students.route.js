import express from 'express'
import { createStudent, fetchAllStudents } from '../controller/student.controller.js'

const router = express.Router()

router.get('/all',fetchAllStudents)
router.post('/newStudent',createStudent)

export default router