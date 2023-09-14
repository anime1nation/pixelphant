import express from "express";
import { createSubsByDiscord } from "../controllers/subscriptionController.js";
import { createUser, getUserWithService } from "../controllers/userController.js";

const discordRouter = express.Router();

discordRouter.post("/discord/signup",createUser)
discordRouter.get("/discord/users/:id",getUserWithService)
discordRouter.post('/discord/subscriptions', createSubsByDiscord)


export default discordRouter