import express from "express";
import { createSubsByDiscord } from "../controllers/subscriptionController.js";
import { createUser, getUserWithService } from "../controllers/userController.js";

const discordRouter = express.Router();

discordRouter.post("/discord/signup",createUser) //create a new user
discordRouter.get("/discord/users/:id",getUserWithService)//id is username and fetch user with subscriptions
discordRouter.post('/discord/subscriptions', createSubsByDiscord)// create a new subscription


export default discordRouter