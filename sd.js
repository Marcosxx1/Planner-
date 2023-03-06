"use strict";
const express = require('express');
const eventsController = require('./../controllers/eventsController');
const router = express.Router();
router.param('id', eventsController.checkID);
router
    .route('/')
    .get(eventsController.getAllEvents)
    .post(eventsController.createEvent);
const weekdayRouter = express.Router({ mergeParams: true });
weekdayRouter.param('dayOfTheWeek', eventsController.checkWeekday);
weekdayRouter.get('/:dayOfTheWeek', eventsController.getEventsByWeekday);
router
    .route('/id/:id')
    .get(eventsController.getEventById)
    .delete(eventsController.deleteEventByID);
router
    .route('/weekday/:dayOfTheWeek')
    .get(eventsController.getEventsByWeekday)
    .delete(eventsController.deleteEventsByWeekDay);
module.exports = router;
