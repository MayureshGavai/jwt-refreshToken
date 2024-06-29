import express from 'express'
import { fetchAllUsers } from '../controller/auth.controller.js'

const router = express.Router()

// router.get('/all',async(req,res,next) => {
//     res.send(fetchAllUsers)
// })

router.get('/all',fetchAllUsers)


router.post('/register',async(req,res,next)=>{
    res.send('register route')
})

router.post('/login',async(req,res,next)=>{
    res.send('login route')
})

router.post('/refresh-token',async(req,res,next)=>{
    res.send('refresh token route')
})

router.delete('/logout',async(req,res,next)=>{
    res.send('delete route')
})

export default router