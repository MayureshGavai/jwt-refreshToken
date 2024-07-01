import bcrypt from 'bcryptjs'
import { addNewUser, getAllUsers, loginNewUser } from "../model/auth.model.js";
import { signAccessToken } from '../utils/jwt.js';

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
        // const token = await signAccessToken(user.email)
        // res.send({token})
        const rowAffected = await addNewUser(user)
        res.status(201).json({message : 'User added successfully', rowAffected })

    }catch(err){
        res.status(500).json({ error: 'Failed to add user data' });
    }
}


export const loginUser = async (req,res,next) => {
    try{
        const username = req.body.username
        const password = req.body.password
        

        if (!username || !password) {
            return res.status(400).send('Email and password are required');
        }

         const { token } = await loginNewUser(username, password);

        res.send({ "accessToken" : token });

    }catch(err){
        res.status(500).json({error : 'Failed to login user'})
    }
}