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
router.post('/register', (request, response) => {
    /**
     * POST /users/register
     * DATA: {username: string, password: string}
     */
    const { username, password } = request.body;
    if (!username) {
        response
            .status(400)
            .json({
            message: 'Username is required',
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
    database_1.default.query(`SELECT * FROM users WHERE username = '${username}'`, (error, result) => {
        if (error) {
            console.log(error);
        }
        // If user already exists
        if (result.length > 0) {
            return response
                .status(400)
                .json({
                message: 'Username is already taken',
                status: 'failed'
            });
        }
    });
    // Hash password
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    // Create user in the database
    database_1.default.query(`INSERT INTO users (username, password) VALUES ('${username}', '${hashedPassword}')`, (error, result) => {
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
router.post('/login', (request, response) => {
    /**
     * POST /users/login
     * DATA: {username: string, password: string}
     */
    const { username, password } = request.body;
    if (!username) {
        response
            .status(400)
            .json({
            message: 'Username is required',
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
    database_1.default.query(`SELECT * FROM users WHERE username = '${username}'`, (error, result) => {
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
            const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
            // Set token as httpOnly cookie
            response.cookie('token', token, {
                httpOnly: true,
                secure: false,
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
                sameSite: 'none'
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
exports.default = router;
