import User from '../models/User';
import { Request, Response} from 'express';
import bcrypt from "bcrypt"


export  async function createUser(req: Request, res:Response) {
try {
        const {username, email, password} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({message: 'Username, email and password are required'});
        }
        //regex för att kolla om lösenordet innehåller minst en siffra och ett specialtecken
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasNumber || !hasSpecialChar) {
            return res.status(400).json({message: 'Lösenordet måste innehålla minst en siffra och ett specialtecken'});
        }
        
        //lägger till hasning av lösenordet med bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password,saltRounds);
        
        const user = new User({ email, password: hashedPassword});
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
}

export async function getUserById(req: Request, res:Response) {
    try {
     const {id} = req.params;
     const user = await User.findById(id);
     if(!user){
        return res.status(404).json({message: "Användare hittades inte"});
     }
        res.status(200).json(user);
    } catch (error){
        res.status(500).json({message: 'Server error', error});
    }
}