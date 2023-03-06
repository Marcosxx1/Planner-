import express, { Router } from 'express';
import {
    checkID,
    checkWeekDay,
    createEvent,
    deleteEventById,
    deleteEventsByWeekDay,
    getAllEvents,
    getEventById,
    getEventsByWeekDay
} from '../controllers/eventControllers';

const router: Router = express.Router();

router.param('id', checkID);

router
    .route('/')
    .get(getAllEvents)
    .post(createEvent);

const weekdayRouter: Router = express.Router({ mergeParams: true });

weekdayRouter.param('dayOfTheWeek', checkWeekDay);

weekdayRouter.get('/:dayOfTheWeek', getEventsByWeekDay);

router
    .route('/id/:id')
    .get(getEventById)
    .delete(deleteEventById);

router
    .route('/weekday/:dayOfTheWeek')
    .get(getEventsByWeekDay)
    .delete(deleteEventsByWeekDay);

router.use('/weekday', weekdayRouter);

export default router;
