"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("../database"));
dotenv_1.default.config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = (0, express_1.Router)();
/**
 * Registration endpoint for user
 */
router.post('/register', (request, response) => {
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
    database_1.default.query(`SELECT * FROM users WHERE email = '${email}'`, (error, result) => {
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
    database_1.default.query(`INSERT INTO users (first_name, last_name, email, password) VALUES ('${firstName}', '${lastName}', '${email}', '${hashedPassword}')`, (error, result) => {
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
});
/**
 * Login endpoint for user
 */
router.post('/login', (request, response) => {
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
    database_1.default.query(`SELECT * FROM users WHERE email = '${email}'`, (error, result) => {
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
});
/**
 * Reset password endpoing for user
 */
router.post('/reset-password', (request, response) => {
    const { email } = request.body;
    if (!email) {
        response
            .status(404)
            .json({
            message: 'Email is required',
            status: 'failed'
        });
    }
    // Create a JWT with time limit of 1 hour for reset
    // const tokenExpiryTime = new Date() + time()
    const token = jwt.sign({ email: email, expires_at: 1 }, process.env.JWT_SECRET);
    // Send reset email
});
exports.default = router;
