import bcrypt from 'bcryptjs'
import { addNewUser, getAllUsers, loginNewUser } from "../model/auth.model.js";
import { verifyRefreshToken } from '../middleware/auth.middleware.js';
import { signAccessToken, signRefreshToken } from '../utils/generateToken.js';

export const fetchAllUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users data' });
    }
}


export const addUser = async (req,res,next) => {
    try{
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const user = {
            username : req.body.username, 
            email : req.body.email,
            password : hashedPassword
        }
        const rowAffected = await addNewUser(user)
        res.status(201).json({message : 'User added successfully', rowAffected })

    }catch(err){
        res.status(500).json({ error: 'Failed to add user data' });
    }
}


export const loginUser = async (req,res,next) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            return res.status(400).send('Email and password are required');
        }

        const { accessToken, refreshToken } = await loginNewUser(username, password);

        console.log('Tokens generated:', { accessToken, refreshToken });

        res.send({ accessToken, refreshToken });
    } catch (err) {
        console.error('Error in loginUser:', err);
        res.status(500).json({ error: 'Failed to login user' });
    }
}

export const generateRefreshToken = async(req,res,next) => {
    try{
        const { refreshToken } = req.body;
        console.log(refreshToken)
        if (!refreshToken) {
            return res.status(400).send('Bad Request: Refresh Token is required');
        }

        const username = await verifyRefreshToken(refreshToken);
        const newAccessToken = await signAccessToken(username);
        const newRefreshToken = await signRefreshToken(username);

        res.send({ newAccessToken, newRefreshToken });

    }catch(err){
        console.log(err)
        res.status(500).json({error : 'Failed to create refresh token'})
    }
}