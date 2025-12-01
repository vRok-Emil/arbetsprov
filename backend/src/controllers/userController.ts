import User from '../models/User';
import { Request, Response} from 'express';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

// Helper functions för validering
function validateEmail(email: string): boolean {
    return email.includes("@");
}

function validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
        return { valid: false, message: 'Lösenordet måste vara minst 8 tecken långt' };
    }
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasNumber || !hasSpecialChar) {
        return { valid: false, message: 'Lösenordet måste innehålla minst en siffra och ett specialtecken' };
    }
    return { valid: true };
}

export async function createUser(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email och lösenord krävs' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Ogiltig e-postadress' });
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return res.status(400).json({ message: passwordValidation.message });
        }

        // Kolla om email redan finns
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email är redan registrerad' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const user = new User({ email, password: hashedPassword });
        await user.save();
        
        // Returnera utan lösenord
        res.status(201).json({ 
            message: 'Användare skapad',
            user: { id: user._id, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

export async function loginUser(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email och lösenord krävs" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            // Använd samma meddelande för säkerhet
            return res.status(401).json({ message: "Ogiltiga inloggningsuppgifter" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            // Samma meddelande som ovan
            return res.status(401).json({ message: "Ogiltiga inloggningsuppgifter" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        res.status(200).json({ 
            message: 'Inloggning lyckades',
            token,
            user: { id: user._id, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

export async function getUserById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        // Returnera utan lösenord
        const user = await User.findById(id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "Användare hittades inte" });
        }
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

export async function getAllUsers(req: Request, res: Response) {
    try {
        // Returnera utan lösenord
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: "AnvändarID krävs" });
        }
        
        const deletedUser = await User.findByIdAndDelete(id).select('-password');
        
        if (!deletedUser) {
            return res.status(404).json({ message: "Användare hittades inte" });
        }
        
        res.status(200).json({ 
            message: "Användare raderad", 
            user: deletedUser 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { email, password } = req.body;
        
        if (!id) {
            return res.status(400).json({ message: "AnvändarID krävs" });
        }
        
        const updateData: any = {};
        
        if (email) {
            if (!validateEmail(email)) {
                return res.status(400).json({ message: 'Ogiltig e-postadress' });
            }
            
            // Kolla om email redan används av annan användare
            const existingUser = await User.findOne({ email, _id: { $ne: id } });
            if (existingUser) {
                return res.status(409).json({ message: 'Email används redan av annan användare' });
            }
            
            updateData.email = email;
        }
        
        if (password) {
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.valid) {
                return res.status(400).json({ message: passwordValidation.message });
            }
            
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updateData.password = hashedPassword;
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        ).select('-password');
        
        if (!updatedUser) {
            return res.status(404).json({ message: "Användare hittades inte" });
        }
        
        res.status(200).json({ 
            message: "Användare uppdaterad", 
            user: updatedUser 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}