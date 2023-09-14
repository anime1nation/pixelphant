import express from "express";
import {createUser, deleteUser, getAllUser, getUser, getUserWithService, updateUser} from "../controllers/userController.js";
import { authenticateToken, login } from "../controllers/authController.js";

const userRouter = express.Router();

userRouter.post("/signup",createUser) // create user
userRouter.post("/login", login) // login user with email and password and resposne will be JWT token
userRouter.get("/users", authenticateToken, getAllUser) // get all users
userRouter.get("/users/:id", authenticateToken, getUser) // id is userID and fetch the user by userID
userRouter.get("/users/subscription:id", authenticateToken, getUserWithService) // id is username and fetch user detail with all assigned subscriptions
userRouter.put('/users/:id', authenticateToken, updateUser) // id is userID and update user detail
userRouter.patch('/users/:id', authenticateToken, updateUser) // id is userID and update user detail with patch request
userRouter.delete('/users/:id', authenticateToken, deleteUser) // id is userID and delete user 

export default userRouter;