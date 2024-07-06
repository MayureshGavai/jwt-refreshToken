import bcrypt from 'bcryptjs'
import { addNewUser, getAllUsers, getUser, loginNewUser } from "../model/auth.model.js";
import { verifyRefreshToken } from '../middleware/auth.middleware.js';
import { signAccessToken, signRefreshToken } from '../utils/generateToken.js';
import RedisClient from '../config/redis.js';

export const fetchAllUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users data' });
    }
}

export const fetchUser = async (req,res) => {
    try {
        const username = req.body.username
        const user = await getUser(username)
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({error : 'Failed to fetch users data'})
    }
}

export const addUser = async (req,res) => {
    try{
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const user = {
            username : req.body.username, 
            email : req.body.email,
            password : hashedPassword
        }
        console.log(user)
        // const rowAffected = await addNewUser(user)
        // res.status(201).json({message : 'User added successfully', rowAffected })
        res.redirect('/login')
    }catch(err){
        res.status(500).json({ error: 'Failed to add user data' });
    }
}


export const loginUser = async (req,res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        console.log(username, password)
        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }

        const { accessToken, refreshToken } = await loginNewUser(username, password);

        console.log('Tokens generated:', { accessToken, refreshToken });
        res.cookie('accessToken', accessToken,{
            httpOnly: false,
            secure : false,
            sameSite : false,
            path : '/'
        })
        // res.send({ accessToken, refreshToken });
        return res.redirect('/')
    } catch (err) {
        console.error('Error in loginUser:', err);
        res.status(500).json({ error: 'Failed to login user' });
    }
}

export const generateRefreshToken = async(req,res) => {
    try{
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).send('Bad Request: Refresh Token is required');
        }

        const username = await verifyRefreshToken(refreshToken);
        const newAccessToken = await signAccessToken(username);
        const newRefreshToken = await signRefreshToken(username);

        console.log('Tokens generated:', { newAccessToken, newRefreshToken });


        res.send({ newAccessToken, newRefreshToken });

    }catch(err){
        console.log(err)
        res.status(500).json({error : 'Failed to create refresh token'})
    }
}


export const logoutUser = async (req,res) => {
    try {
        const {refreshToken} = req.body
        if(!refreshToken){
            return res.status(400).send('Bad Request: Refresh Token is required');
        }
        const username = await verifyRefreshToken(refreshToken)
        RedisClient.del(username, (err,reply)=>{
            if(err){
                console.log('internal server error')
            }else{
                console.log(reply)
            }
        })
        res.status(200).json({message: 'User logout successfully'})

    } catch (err) {
        console.log(err)
        res.status(500).json({error : 'Failed to create refresh token'})        
    }
}