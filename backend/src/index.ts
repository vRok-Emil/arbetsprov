import express, { Express, Request, Response, Router } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { createUser } from './routes/userRoutes';

dotenv.config();
const router = express.Router();
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();
const PORT = process.env.PORT;

router.get("/", createUser);



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
