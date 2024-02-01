"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_1 = __importDefault(require("./routes/users"));
const goals_1 = __importDefault(require("./routes/goals"));
const savings_1 = __importDefault(require("./routes/savings"));
const views_1 = __importDefault(require("./routes/views"));
const body_parser_1 = __importDefault(require("body-parser")); // For parsing incoming request bodies
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.set('views', '/views');
app.use(express_1.default.static('public'));
app.use(body_parser_1.default.json());
app.use('/', views_1.default);
app.use('/users', users_1.default);
app.use('/goals', goals_1.default);
app.use('/savings', savings_1.default);
// Start the server and listen for incoming connections
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
