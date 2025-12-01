import User from '../models/User';
import { Request, Response} from 'express';
import bcrypt from "bcrypt"
import express from 'express';
import { 
      createUser, 
      getUserById,
      getAllUsers,
      deleteUser,
      updateUser,
      loginUser
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';



const router = express.Router();
router.post("/login", loginUser);
router.post("/signup", createUser);
router.get("/users", getAllUsers);
router.get("/users/:id", authenticateToken, getUserById);
router.delete("/users/:id", authenticateToken, deleteUser);
router.put("/users/:id", authenticateToken, updateUser); 

export default router;