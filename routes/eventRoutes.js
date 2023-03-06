"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventControllers_1 = require("../controllers/eventControllers");
const router = express_1.default.Router();
router.param('id', eventControllers_1.checkID);
router
    .route('/')
    .get(eventControllers_1.getAllEvents)
    .post(eventControllers_1.createEvent);
const weekdayRouter = express_1.default.Router({ mergeParams: true });
weekdayRouter.param('dayOfTheWeek', eventControllers_1.checkWeekDay);
weekdayRouter.get('/:dayOfTheWeek', eventControllers_1.getEventsByWeekDay);
router
    .route('/id/:id')
    .get(eventControllers_1.getEventById)
    .delete(eventControllers_1.deleteEventById);
router
    .route('/weekday/:dayOfTheWeek')
    .get(eventControllers_1.getEventsByWeekDay)
    .delete(eventControllers_1.deleteEventsByWeekDay);
router.use('/weekday', weekdayRouter);
exports.default = router;
