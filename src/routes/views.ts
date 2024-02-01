import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

const jwt = require('jsonwebtoken');

dotenv.config();

const router = express.Router();

router.get('/login', (request: Request, response: Response) => {
    response.render('login');
});

router.get('/register', (request: Request, response: Response) => {
    response.render('register');
});

router.get('/', authenticateToken, (request: Request, response: Response) => {
    // Get user
    const user = request.body.user;

    // Get user's saving goals

    response.render('dashboard', {
        user: user
    });
});

router.get('/transactions', authenticateToken, (request: Request, response: Response) => {
    /**
     * GET /transactions
     * AUTH: Bearer <token>
     */
    // Get user
    const user = request.body.user;

    response.render('transactions', {
        user: user
    });
});

router.get('/logout', (request: Request, response: Response) => {
    response.clearCookie('token');
    response.redirect('/login');
});

// Create an authentication middleware to check if the token is set in httpOnly cookies and if it is valid
// If the token is not set or it is invalid, redirect the user to the login page
// If the token is valid, call the next() function
function authenticateToken(request: Request, response: Response, next: any) {
    const token = request.headers.cookie?.split('=')[1];

    if (!token) {
        response.redirect('/login');
    }

    else {
        // Decode the token and check if it is valid
        jwt.verify(token, process.env.JWT_SECRET, (error: any, user: any) => {
            if (error) {
                response
                    .status(403)
                    .json({
                        message: 'Forbidden',
                        status: 'failed'
                    });
            }

            request.body.user = user;

            next();
        })
    }
}

export default router;