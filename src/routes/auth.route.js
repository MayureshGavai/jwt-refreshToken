import express from 'express'
import { addUser, fetchAllUsers, generateRefreshToken, loginUser, logoutUser } from '../controller/auth.controller.js'

const router = express.Router()

// router.get('/all',async(req,res,next) => {
//     res.send(fetchAllUsers)
// })

router.get('/all',fetchAllUsers)

router.post('/adduser',addUser)


router.post('/login',loginUser)

router.post('/refreshtoken',generateRefreshToken)

router.delete('/logout',logoutUser)

export default router