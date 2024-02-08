import express, { Express, Request, Response, Router } from 'express';
import dotenv from 'dotenv';
import pool from '../database';

dotenv.config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const router = Router();


router.get('/', (request: Request, response: Response) => {
    // If the user is not logged in, reidrect them back to the login page
    response.render('index');
})

router.get('/login', (request: Request, response: Response) => {
    // The login page will allow users to login to their account
    response.render('login');
})

router.get('/register', (request: Request, response: Response) => {
    // The login page will allow users to login to their account
    response.render('register');
})

export default router;