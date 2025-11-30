import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { 
      createUser, 
      getUserById,
      getAllUsers,
      deleteUser,
      updateUser
} from './routes/userRoutes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();
const PORT = process.env.PORT || 3000;

app.post("/signup", createUser);
app.get("/users", getAllUsers);
app.get("/users/:id", getUserById);
app.delete("/users/:id", deleteUser);
app.put("/users/:id", updateUser); // Changed from app.update to app.put

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});