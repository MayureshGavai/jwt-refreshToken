import express from 'express'
import { addUser, fetchAllUsers, fetchUser, generateRefreshToken, loginUser, logoutUser } from '../controller/auth.controller.js'
import { verifyAccessToken } from '../middleware/auth.middleware.js'

const router = express.Router()


router.get('/all',fetchAllUsers)

router.post('/user', verifyAccessToken,fetchUser)

router.post('/adduser',addUser)

router.post('/login',loginUser)

router.post('/refreshtoken',generateRefreshToken)

router.delete('/logout',logoutUser)

export default router