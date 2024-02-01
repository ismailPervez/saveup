import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/users';
import goalRouter from './routes/goals';
import savingRouter from './routes/savings';
import bodyParser from 'body-parser'; // For parsing incoming request bodies

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/users', userRouter);
app.use('/goals', goalRouter);
app.use('/savings', savingRouter);

// Start the server and listen for incoming connections
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})