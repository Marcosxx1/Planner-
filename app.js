"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan = require('morgan');
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes")); // importação das rotas do evento
const app = (0, express_1.default)();
app.use(morgan('dev'));
app.use(express_1.default.json());
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
app.use('/api/v1/events', eventRoutes_1.default);
exports.default = app;
