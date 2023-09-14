import express from "express";
import {createSubs, deleteByUserIDservID, getSubsByUserIDServID, updateSubsByServID} from "../controllers/subscriptionController.js";
import { authenticateToken } from "../controllers/authController.js";

const subsRoute = express.Router();

subsRoute.post('/subscriptions', authenticateToken ,createSubs);// create a subscription
subsRoute.get('/subscriptions/:id', authenticateToken ,getSubsByUserIDServID);//id is (userID or serviceID) and fetch the subscription
subsRoute.put('/subscriptions/:id', authenticateToken ,updateSubsByServID);//id is serviceID and update the subscription
subsRoute.patch('/subscriptions/:id', authenticateToken ,updateSubsByServID);//id is serviceID and update the subscription by patch request
subsRoute.delete('/subscriptions/:id', authenticateToken, deleteByUserIDservID);//id is (serviceID or userID) and delete the subscription id userID then all associated subscriptions else seriveID subscriptions are deleted

export default  subsRoute;