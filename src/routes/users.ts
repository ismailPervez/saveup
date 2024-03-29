import express, { Express, Request, Response, Router } from 'express';
import dotenv from 'dotenv';
import pool from '../database';

dotenv.config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const router = Router();

/**
 * Registration endpoint for user
 */
router.post('/register', (request: Request, response: Response) => {
    /**
     * POST /users/register
     * DATA: {username: string, password: string}
     */
    const { firstName, lastName, email, password } = request.body;

    if (!email) {
        response
            .status(400)
            .json({
                message: 'Email is required',
                status: 'failed'
            });
    }

    else if (!firstName) {
        response
            .status(400)
            .json({
                message: 'First name is required',
                status: 'failed'
            });
    }

    else if (!lastName) {
        response
            .status(400)
            .json({
                message: 'Last name is required',
                status: 'failed'
            });
    }

    else if (!password) {
        response
            .status(400)
            .json({
                message: 'Password is required',
                status: 'failed'
            });
    }

    // Check if user with username already exists

    pool.query(`SELECT * FROM users WHERE email = '${email}'`, (error: any, result: any) => {
        if (error) {
            console.log(error);
        }

        // If user already exists
        if (result.length > 0) {
            return response
                .status(400)
                .json({
                    message: 'Email is already taken',
                    status: 'failed'
                });
        }
    });

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // Create user in the database

    pool.query(`INSERT INTO users (first_name, last_name, email, password) VALUES ('${firstName}', '${lastName}', '${email}', '${hashedPassword}')`, (error: any, result: any) => {
        if (error) {
            console.log(error);
        }
    });

    return response
        .status(200)
        .json({
            message: 'Registration successful',
            status: 'success'
        });
})

/**
 * Login endpoint for user
 */
router.post('/login', (request: Request, response: Response) => {
    /**
     * POST /users/login
     * DATA: {username: string, password: string}
     */
    const { email, password } = request.body;

    if (!email) {
        response
            .status(400)
            .json({
                message: 'Email is required',
                status: 'failed'
            });
    }

    else if (!password) {
        response
            .status(400)
            .json({
                message: 'Password is required',
                status: 'failed'
            });
    }

    // Check if user with user exists

    pool.query(`SELECT * FROM users WHERE email = '${email}'`, (error: any, result: any) => {
        if (error) {
            console.log(error);
        }

        // If user does not exist
        if (result.length === 0) {
            return response
                .status(400)
                .json({
                    message: 'User does not exist',
                    status: 'failed'
                });
        }

        // If user exists
        else {
            const user = result.rows[0];

            if (!user) {
                return response
                    .status(400)
                    .json({
                        message: 'User does not exist',
                        status: 'failed'
                    });
            }

            // Compare password
            const passwordMatch = bcrypt.compare(password.toString(), user.password);

            if (!passwordMatch) {
                return response
                    .status(400)
                    .json({
                        message: 'Password is incorrect',
                        status: 'failed'
                    });
            }

            // Create token
            const token = jwt.sign({ id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name }, process.env.JWT_SECRET);

            // Set token as httpOnly cookie
            response.cookie('token', token, {
                httpOnly: true,
                // secure: false,
                // maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
                // sameSite: 'none'
            });

            response
                .status(200)
                .json({
                    message: 'Login success',
                    token: token,
                    status: 'success'
                });
        }
    });
})

export default router;