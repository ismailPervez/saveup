import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/users';
import goalRouter from './routes/savings';
import savingRouter from './routes/transactions';
import viewsRouter from './routes/views';
import bodyParser from 'body-parser'; // For parsing incoming request bodies
const cors = require('cors');
const path = require('path');

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Set the view engine to ejs
app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(cors({
    origin: 'https://saveupapp.netlify.app'
}));
app.use('/', viewsRouter);
app.use('/users', userRouter);
app.use('/savings', goalRouter);
app.use('/transactions', savingRouter);

// Start the server and listen for incoming connections
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})