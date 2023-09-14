import express from "express";
import {createSubs, deleteByServID, deleteManyByUserID, getAllSubs, getSubsByServID, updateSubsByServID} from "../controllers/subscriptionController.js";
import { authenticateToken } from "../controllers/authController.js";

const subsRoute = express.Router();

subsRoute.post('/subscriptions', authenticateToken ,createSubs);
subsRoute.get('/subscriptions', authenticateToken ,getAllSubs);
subsRoute.delete('/subscriptions', authenticateToken, deleteManyByUserID);
subsRoute.get('/subscriptions/:id', authenticateToken, getSubsByServID);
subsRoute.put('/subscriptions/:id', authenticateToken ,updateSubsByServID);
subsRoute.delete('/subscriptions/:id', authenticateToken, deleteByServID);

export default  subsRoute;