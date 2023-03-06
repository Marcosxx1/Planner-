"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEventsByWeekDay = exports.getEventsByWeekDay = exports.deleteEventById = exports.getAllEvents = exports.getEventById = exports.createEvent = exports.checkWeekDay = exports.checkID = void 0;
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
function findById(id) {
    return events.find((event) => event.id === id);
}
function findByIdAndDelete(id) {
    const index = events.findIndex((event) => event.id === id);
    if (index !== -1) {
        return events.splice(index, 1)[0];
    }
    return undefined;
}
let events = JSON.parse(fs_1.default.readFileSync(`userData/events.json`).toString());
const checkID = (req, res, next, val) => {
    if (!req.params.id || req.params.id.trim() == '') {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid event ID'
        });
    }
    const id = req.params.id;
    const eventIndex = events.findIndex((el) => el.id === id);
    if (eventIndex === -1) {
        return res.status(400).json({
            status: 'fail',
            message: 'Event not found (Check ID)'
        });
    }
    next();
};
exports.checkID = checkID;
const checkWeekDay = (req, res, next, val) => {
    const dayOfTheWeek = req.params.dayOfTheWeek;
    if (!dayOfTheWeek || dayOfTheWeek.trim() === '') {
        return res.status(400).json({
            stauts: 'fail',
            message: 'Invalid day of the week'
        });
    }
    const eventsByWeekDay = events.filter((event) => {
        const date = new Date(event.dateTime);
        const eventWeekDay = date.toLocaleDateString('en-US', { weekday: 'long' });
        return eventWeekDay.toLowerCase() === dayOfTheWeek.toLowerCase();
    });
    if (eventsByWeekDay.length === 0) {
        return res.status(400).json({
            status: 'fail',
            message: 'no events foun with the specified day of the week',
        });
    }
    next();
};
exports.checkWeekDay = checkWeekDay;
const createEvent = (req, res) => {
    if (!req.body.description ||
        !req.body.dateTime ||
        !req.body.createdAt) {
        return res.status(400).json({
            status: 'fail',
            message: 'All fields are required'
        });
    }
    //const newEvent
    const newEvent = {
        id: (0, uuid_1.v4)(),
        createdAt: req.body.createdAt,
        dateTime: req.body.dateTime,
        description: req.body.description
    };
    //pushAR
    events.push(newEvent);
    console.log(newEvent);
    //escrever no arquivo
    fs_1.default.writeFile(`userData/events.json`, JSON.stringify(events, null, 2), err => {
        if (err) {
            console.error(err);
            res.status(500).json({
                status: 'error',
                message: 'error while saving the event'
            });
        }
        else {
            res.status(201).json({
                status: 'success',
                message: 'Event created',
                data: {
                    event: newEvent
                }
            });
        }
    });
};
exports.createEvent = createEvent;
const getEventById = (req, res) => {
    const eventId = req.params.id;
    const event = findById(eventId);
    if (event) {
        res.json(event);
    }
    else {
        res.status(404).json({
            status: 'fail',
            message: 'event not found (Get by ID)'
        });
    }
};
exports.getEventById = getEventById;
const getAllEvents = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: `${events.length} events`,
        data: {
            events,
        }
    });
};
exports.getAllEvents = getAllEvents;
const deleteEventById = (req, res) => {
    const resultEvent = findByIdAndDelete(req.params.id);
    if (!resultEvent) {
        res.status(404).json({
            status: 'fail',
            message: 'event not found (Delete by id)'
        });
    }
    else {
        fs_1.default.writeFileSync('userData/events.json', JSON.stringify(events, null, 2));
        res.status(200).json({
            status: 'success',
            message: 'Event deleted',
            data: {
                event: resultEvent
            }
        });
    }
};
exports.deleteEventById = deleteEventById;
const getEventsByWeekDay = (req, res) => {
    const dayOfTheWeek = req.params.dayOfTheWeek;
    const eventsByWeekday = [];
    events.forEach((event) => {
        const date = new Date(event.dateTime);
        const eventWeekday = date.toLocaleDateString('en-US', { weekday: 'long' });
        if (eventWeekday.toLowerCase() === dayOfTheWeek.toLowerCase()) {
            eventsByWeekday.push(event);
        }
    });
    return res.status(200).json({
        status: 'success',
        message: 'getEventsByWeekday',
        data: {
            events: eventsByWeekday,
        },
    });
};
exports.getEventsByWeekDay = getEventsByWeekDay;
const deleteEventsByWeekDay = (req, res) => {
    const dayOfTheWeek = req.params.dayOfTheWeek;
    const validDaysOfWeek = ['sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday'];
    if (!validDaysOfWeek.includes(dayOfTheWeek)) {
        console.log(dayOfTheWeek);
        res.status(400).json({ message: 'Invalid day of the week' });
        return;
    }
    let eventsToDelete = events.filter((event) => {
        console.log(events);
        const eventDate = new Date(event.dateTime);
        const eventWeekDay = eventDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        return eventWeekDay === dayOfTheWeek;
    });
    events = events.filter((event) => {
        const eventDate = new Date(event.dateTime);
        const eventWeekDay = eventDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        return eventWeekDay !== dayOfTheWeek;
    });
    fs_1.default.writeFile(`${__dirname}/../userData/events.json`, JSON.stringify(events, null, 4), err => {
        if (err) {
            return res.status(400).json({
                status: "fail",
                message: err,
            });
        }
        return res.status(204).json({
            message: "deleteEventByWeekDay",
            status: "success",
            data: {
                events: eventsToDelete,
            },
        });
    });
};
exports.deleteEventsByWeekDay = deleteEventsByWeekDay;
