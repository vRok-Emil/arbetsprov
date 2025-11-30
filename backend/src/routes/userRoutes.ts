import User from '../models/User';
import { Request, Response} from 'express';
import bcrypt from "bcrypt"


export  async function createUser(req: Request, res:Response) {
try {
        const { email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({message: 'email and password are required'});
        }

        const emailIncludes = email.includes("@");
        if (!emailIncludes) {
            return res.status(400).json({message: 'Ogiltig e-postadress'});
        }
        //regex för att kolla om lösenordet innehåller minst en siffra och ett specialtecken
        if(password.length < 8){
            return res.status(400).json({message: 'Lösenordet måste vara minst 8 tecken långt'});
        }
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

export async function getAllUsers(req: Request, res:Response) {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
}

export async function deleteUser(req: Request, res:Response){
 try {
    const {id} = req.params;
    if(!id){
        return res.status(400).json({message: "AnvändarID krävs"});
    }
    
    const deletedUser = await User.findByIdAndDelete(id);
    
    if(!deletedUser){
        return res.status(404).json({message: "Användare hittades inte"});
    }
    
    res.status(200).json({message: "Användare raderad", user: deletedUser});
 } catch (error) {
    res.status(500).json({message: 'Server error', error});
 }
}

export async function updateUser(req: Request, res:Response){
    try {
        const {id} = req.params;
        const {email, password} = req.body;
        
        if(!id){
            return res.status(400).json({message: "AnvändarID krävs"});
        }
        
        // Skapa ett objekt med fält som ska uppdateras
        const updateData: any = {};
        
        // Om email finns, validera och lägg till
        if(email){
            const emailIncludes = email.includes("@");
            if (!emailIncludes) {
                return res.status(400).json({message: 'Ogiltig e-postadress'});
            }
            updateData.email = email;
        }
        
        // Om password finns, validera och hasha
        if(password){
            if(password.length < 8){
                return res.status(400).json({message: 'Lösenordet måste vara minst 8 tecken långt'});
            }
            const hasNumber = /\d/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            if (!hasNumber || !hasSpecialChar) {
                return res.status(400).json({message: 'Lösenordet måste innehålla minst en siffra och ett specialtecken'});
            }
            
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updateData.password = hashedPassword;
        }
        
        // Uppdatera användaren
        const updatedUser = await User.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true } // Returnerar den uppdaterade användaren
        );
        
        if(!updatedUser){
            return res.status(404).json({message: "Användare hittades inte"});
        }
        
        res.status(200).json({message: "Användare uppdaterad", user: updatedUser});
    } catch (error) {
        res.status(500).json({message: 'Server error', error});
    }
}