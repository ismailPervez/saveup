"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../database"));
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const router = (0, express_1.Router)();
router.post('/post', authenticateToken, (request, response) => {
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
    database_1.default.query(`INSERT INTO saving_goal (user_id, amount, name, frequency, include_weekend) VALUES ('${user.id}', '${amount}', '${name}', '${frequency}', '${request.body.include_weekend}')`, (error, result) => {
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
});
router.get('/get', authenticateToken, (request, response) => {
    /**
     * GET /savings/get
     * AUTH: Bearer <token>
     * ALLOWED PARAMS: {frequency: (daily | weekly | monthly), id: string, name: string}
     */
    // Get user
    const user = request.body.user;
    // Get user's saving goals
    database_1.default.query(`SELECT * FROM saving_goal WHERE user_id = '${user.id}'`, (error, result) => {
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
});
// Middleware for handling JWT validation
function authenticateToken(request, response, next) {
    var _a;
    const authHeader = request.headers['authorization'];
    let headerToken = authHeader && authHeader.split(' ')[1];
    let cookieToken = (_a = request.headers.cookie) === null || _a === void 0 ? void 0 : _a.split('=')[1];
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
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
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
    });
}
exports.default = router;
