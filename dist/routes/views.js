"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = (0, express_1.Router)();
router.get('/', authenticateToken, (request, response) => {
    // If the user is not logged in, reidrect them back to the login page
    response.render('index', { user: request.body.user });
});
router.get('/login', (request, response) => {
    // The login page will allow users to login to their account
    response.render('login');
});
router.get('/register', (request, response) => {
    // The login page will allow users to login to their account
    response.render('register');
});
router.get('/logout', (request, response) => {
    // Remove http only cookie
    response
        .clearCookie("token", {
        httpOnly: true,
        secure: false
    })
        .redirect('/login');
});
router.get('/transactions/view/:id', authenticateToken, (request, response) => {
    // Get the saving's Id from parameter
    const savingsId = request.params.id;
    response
        .render('transactions', { savingsId: savingsId, user: request.body.user });
});
// Middleware for handling JWT validation
function authenticateToken(request, response, next) {
    var _a;
    const authHeader = request.headers['authorization'];
    let headerToken = authHeader && authHeader.split(' ')[1];
    let cookieToken = (_a = request.headers.cookie) === null || _a === void 0 ? void 0 : _a.split('=')[1];
    let token = headerToken || cookieToken;
    if (token === null) {
        // Redirect to login page
        return response.redirect('/login');
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
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
exports.default = router;
