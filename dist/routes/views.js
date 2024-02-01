"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const jwt = require('jsonwebtoken');
dotenv_1.default.config();
const router = express_1.default.Router();
router.get('/login', (request, response) => {
    response.render('login');
});
router.get('/register', (request, response) => {
    response.render('register');
});
router.get('/dashboard', authenticateToken, (request, response) => {
    // Get user
    const user = request.body.user;
    // Get user's saving goals
    response.render('dashboard', {
        user: user
    });
});
router.get('/transactions', authenticateToken, (request, response) => {
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
router.get('/logout', (request, response) => {
    response.clearCookie('token');
    response.redirect('/login');
});
// Create an authentication middleware to check if the token is set in httpOnly cookies and if it is valid
// If the token is not set or it is invalid, redirect the user to the login page
// If the token is valid, call the next() function
function authenticateToken(request, response, next) {
    var _a;
    const token = (_a = request.headers.cookie) === null || _a === void 0 ? void 0 : _a.split('=')[1];
    if (!token) {
        response.redirect('/login');
    }
    else {
        // Decode the token and check if it is valid
        jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
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
        });
    }
}
exports.default = router;
