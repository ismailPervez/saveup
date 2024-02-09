import express, { Express, Request, Response, Router } from 'express';
import dotenv from 'dotenv';
import pool from '../database';

dotenv.config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const router = Router();


router.get('/', authenticateToken, (request: Request, response: Response) => {
    // If the user is not logged in, reidrect them back to the login page
    response.render('index', { user: request.body.user });
})

router.get('/login', (request: Request, response: Response) => {
    // The login page will allow users to login to their account
    response.render('login');
})

router.get('/register', (request: Request, response: Response) => {
    // The login page will allow users to login to their account
    response.render('register');
})

router.get('/logout', (request: Request, response: Response) => {
    // Remove http only cookie
    response
        .clearCookie("token", {
            httpOnly: true,
            secure: false
        })
        .redirect('/login');
})

router.get('/transactions/view/:id', authenticateToken, (request: Request, response: Response) => {
    // Get the saving's Id from parameter
    const savingsId = request.params.id;

    response
        .render('transactions', { savingsId: savingsId, user: request.body.user });
})

// Middleware for handling JWT validation
function authenticateToken(request: Request, response: Response, next: any) {
    const authHeader = request.headers['authorization'];
    let headerToken = authHeader && authHeader.split(' ')[1];
    let cookieToken = request.headers.cookie?.split('=')[1];

    let token = headerToken || cookieToken;

    if (token === null) {
        // Redirect to login page
        return response.redirect('/login');
    }

    jwt.verify(token, process.env.JWT_SECRET, (error: any, user: any) => {
        if (error || !user) {
            // return response
            //     .status(403)
            //     .json({
            //         message: 'Forbidden',
            //         status: 'failed'
            //     });
            return response.redirect('/login');
        }

        request.body.user = user;

        next();
    });
}

export default router;