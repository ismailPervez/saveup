"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../database"));
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const router = (0, express_1.Router)();
router.post('/post', authenticateToken, (request, response) => {
    /**
     * POST /savings/add
     * DATA: {amount: number, goalId: number (id)}
     * AUTH: Bearer <token>
     */
    // Get user
    const user = request.body.user;
    // Validate the request body
    const { amount, goalId } = request.body;
    if (!amount) {
        response
            .status(400)
            .json({
            message: 'Amount is required',
            status: 'failed'
        });
    }
    else if (!goalId) {
        response
            .status(400)
            .json({
            message: 'Goal is required',
            status: 'failed'
        });
    }
    // Check if goal exists
    database_1.default.query(`SELECT * FROM saving_goal WHERE id = '${goalId}'`, (error, result) => {
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
                .status(404)
                .json({
                message: 'No saving goals found',
                status: 'failed'
            });
        }
        else {
            const goals = result.rows[0];
            // If user has goal, add savings for that goal, then update the goal's progress (amount_saved)
            database_1.default.query(`INSERT INTO saving (amount, goal_id, user_id) VALUES ('${amount}', '${goalId}', ${user.id})`, (error, result) => {
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
                    // Update goal's progress
                    database_1.default.query(`UPDATE saving_goal SET amount_saved = amount_saved + ${amount} WHERE id = '${goalId}'`, (error, result) => {
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
                                message: 'Savings added successfully',
                                status: 'success'
                            });
                        }
                    });
                }
            });
        }
    });
});
router.get('/get', authenticateToken, (request, response) => {
    /**
     * GET /savings/get
     * AUTH: Bearer <token>
     */
    // Get user
    const user = request.body.user;
    // Get user's saving goals
    database_1.default.query(`SELECT saving.*, saving_goal.name as goal_name FROM saving LEFT JOIN saving_goal ON saving_goal.id = saving.goal_id WHERE saving.user_id = '${user.id}'`, (error, result) => {
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
                message: 'User has no savings',
                status: 'success'
            });
        }
        // If user has saving goals
        else {
            const savings = result.rows;
            // If user has saving goals
            response
                .status(200)
                .json({
                message: 'User has savings',
                status: 'success',
                data: savings
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
