import express from "express";
import {createUser, deleteUser, getAllUser, getUser, login, updateUser} from "../controllers/userController.js";
import { authenticateToken } from "../controllers/authController.js";

const userRouter = express.Router();
userRouter.post("/signup",createUser)
userRouter.post("/login", login)
userRouter.get("/users", authenticateToken, getAllUser)
userRouter.get("/users/:id", authenticateToken, getUser)
userRouter.put('/users', authenticateToken, updateUser)
userRouter.delete('/users', authenticateToken, deleteUser)
export default userRouter;