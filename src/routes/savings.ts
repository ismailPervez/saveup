import express, { Express, Request, Response, Router } from 'express';
import pool from "../database";

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const router = Router();

router.post('/post', authenticateToken, (request: Request, response: Response) => {
    /**
     * POST /savings/add
     * DATA: {amount: number, name: string, frequency: (daily | weekly | monthly)}
     * AUTH: Bearer <token>
     */

    // Get user
    const user = request.body.user;

    // Validate the request body
    const { amount, name, frequency } = request.body;

    if (!amount) {
        response
            .status(400)
            .json({
                message: 'Amount is required',
                status: 'failed'
            });
    }

    else if (!name) {
        response
            .status(400)
            .json({
                message: 'Name is required',
                status: 'failed'
            });
    }

    else if (!frequency) {
        response
            .status(400)
            .json({
                message: 'Frequency is required',
                status: 'failed'
            });
    }

    // Check if frequency is daily and if so, check if weekend is included or not
    if (frequency === 'daily' && !request.body.include_weekend) {
        response
            .status(400)
            .json({
                message: 'Please specify if weekend is included or not',
                status: 'failed'
            });

    }

    // Create saving goal for the user
    pool.query(`INSERT INTO saving_goal (user_id, amount, name, frequency, include_weekend) VALUES ('${user.id}', '${amount}', '${name}', '${frequency}', '${request.body.include_weekend}')`, (error: any, result: any) => {
        if (error) {
            console.log(error);
            response
                .status(500)
                .json({
                    message: 'An error occurred',
                    status: 'failed'
                });
        }

        else {
            response
                .status(200)
                .json({
                    message: 'Saving goal created successfully',
                    status: 'success'
                });
        }
    });
})

router.get('/get', authenticateToken, (request: Request, response: Response) => {
    /**
     * GET /savings/get
     * AUTH: Bearer <token>
     * ALLOWED PARAMS: {frequency: (daily | weekly | monthly), id: string, name: string}
     */

    // Get user
    const user = request.body.user;

    // Get user's saving goals
    pool.query(`SELECT * FROM saving_goal WHERE user_id = '${user.id}'`, (error: any, result: any) => {
        if (error) {
            console.log(error);
            response
                .status(500)
                .json({
                    message: 'An error occurred',
                    status: 'failed'
                });
        }

        // If user has no saving goals
        if (result.length === 0) {
            response
                .status(200)
                .json({
                    message: 'User has no saving goals',
                    status: 'success'
                });
        }

        // If user has saving goals
        else {
            const goals = result.rows;
            // If user has saving goals
            response
                .status(200)
                .json({
                    message: 'Saving goals retrieved successfully',
                    status: 'success',
                    data: goals
                });
        }
    });
})

// Middleware for handling JWT validation
function authenticateToken(request: Request, response: Response, next: any) {
    const authHeader = request.headers['authorization'];
    let headerToken = authHeader && authHeader.split(' ')[1];
    let cookieToken = request.headers.cookie?.split('=')[1];

    let token = headerToken || cookieToken;

    if (token === null) {
        // check token from cookies

        response
            .status(401)
            .json({
                message: 'Unauthorized',
                status: 'failed'
            });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error: any, user: any) => {
        if (error) {
            response
                .status(403)
                .json({
                    message: 'Forbidden',
                    status: 'failed'
                });
        }

        if (!user) {
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

export default router;