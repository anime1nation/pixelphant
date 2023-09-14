import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import {mongoURI} from './config.js'
import userRouter from './routers/userRouters.js';
import subsRoute from './routers/subsRouters.js';
import discordRouter from './routers/discordrouter.js';

const app = express();

// mongo connection
mongoose.connect(mongoURI).then(() => console.log('MongoDB connected')).catch(err => console.error(err));

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use(userRouter);//use user Router.
app.use(subsRoute);//use subscription Route.
app.use(discordRouter)//use discord Router.

const port = 3000;
app.listen(port, ()=>console.log(`Server is running on port ${port}`))