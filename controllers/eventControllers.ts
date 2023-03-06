import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid'

interface Event {
    id: string;
    createdAt: string;
    dateTime: string;
    description: string;
}

function findById(id: string): Event | undefined {
    return events.find((event) => event.id === id)
}

function findByIdAndDelete(id: string): Event | undefined {
    const index = events.findIndex((event) => event.id === id);
    if (index !== -1) {
        return events.splice(index, 1)[0]
    }
    return undefined;
}

let events: Event[] = JSON.parse(
    fs.readFileSync(`userData/events.json`).toString()
);
export const checkID = (
    req: Request,
    res: Response,
    next: NextFunction,
    val: string
) => {
    if (!req.params.id || req.params.id.trim() == '') {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid event ID'
        })
    }
    const id: string = req.params.id;

    const eventIndex: number = events.findIndex((el) => el.id === id)

    if (eventIndex === -1) {
        return res.status(400).json({
            status: 'fail',
            message: 'Event not found (Check ID)'
        })
    }

    next();
}

export const checkWeekDay = (
    req: Request,
    res: Response,
    next: NextFunction,
    val: string
) => {
    const dayOfTheWeek = req.params.dayOfTheWeek;

    if (!dayOfTheWeek || dayOfTheWeek.trim() === '') {
        return res.status(400).json({
            stauts: 'fail',
            message: 'Invalid day of the week'
        })
    }

    const eventsByWeekDay = events.filter((event) => {
        const date = new Date(event.dateTime);
        const eventWeekDay = date.toLocaleDateString('en-US', { weekday: 'long' });

        return eventWeekDay.toLowerCase() === dayOfTheWeek.toLowerCase();
    })

    if (eventsByWeekDay.length === 0) {
        return res.status(400).json({
            status: 'fail',
            message: 'no events foun with the specified day of the week',
        })
    }
    next();
}

export const createEvent = (
    req: Request,
    res: Response
) => {
    if (
        !req.body.description ||
        !req.body.dateTime ||
        !req.body.createdAt
    ) {
        return res.status(400).json({
            status: 'fail',
            message: 'All fields are required'
        })
    }

    //const newEvent
    const newEvent = {
        id: uuidv4(),
        createdAt: req.body.createdAt,
        dateTime: req.body.dateTime,
        description: req.body.description
    }
    //pushAR
    events.push(newEvent);
    console.log(newEvent)
    //escrever no arquivo
    fs.writeFile(
        `userData/events.json`,
        JSON.stringify(events, null, 2),
        err => {
            if (err) {
                console.error(err)
                res.status(500).json({
                    status: 'error',
                    message: 'error while saving the event'
                })
            } else {
                res.status(201).json({
                    status: 'success',
                    message: 'Event created',
                    data: {
                        event: newEvent
                    }
                })
            }

        }
    )
}



export const getEventById = (
    req: Request,
    res: Response
) => {
    const eventId = req.params.id;
    const event = findById(eventId);

    if (event) { res.json(event) }
    else {
        res.status(404).json({
            status: 'fail',
            message: 'event not found (Get by ID)'
        })
    }
}

export const getAllEvents = (
    req: Request,
    res: Response
) => {
    res.status(200).json({
        status: 'success',
        message: `${events.length} events`,
        data: {
            events,
        }
    })
}


export const deleteEventById = (
    req: Request,
    res: Response
) => {
    const resultEvent = findByIdAndDelete(req.params.id);

    if (!resultEvent) {
        res.status(404).json({
            status: 'fail',
            message: 'event not found (Delete by id)'
        })
    } else {
        fs.writeFileSync('userData/events.json', JSON.stringify(events, null, 2));
        res.status(200).json({
            status: 'success',
            message: 'Event deleted',
            data: {
                event: resultEvent
            }
        })
    }
}
export const getEventsByWeekDay
    = (req: Request, res: Response) => {
        const dayOfTheWeek = req.params.dayOfTheWeek;
        const eventsByWeekday: any[] = [];

        events.forEach((event: any) => {
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

export const deleteEventsByWeekDay = (req: Request, res: Response) => {
    const dayOfTheWeek = req.params.dayOfTheWeek;
    const validDaysOfWeek = ['sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday'];

    if (!validDaysOfWeek.includes(dayOfTheWeek)) {
        console.log(dayOfTheWeek)

        res.status(400).json({ message: 'Invalid day of the week' });
        return;
    }

    let eventsToDelete = events.filter((event: Event) => {
        console.log(events)
        const eventDate = new Date(event.dateTime);
        const eventWeekDay = eventDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        return eventWeekDay === dayOfTheWeek;
    });

    events = events.filter((event: Event) => {
        const eventDate = new Date(event.dateTime);
        const eventWeekDay = eventDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        return eventWeekDay !== dayOfTheWeek;
    });

    fs.writeFile(
        `${__dirname}/../userData/events.json`,
        JSON.stringify(events, null, 4),
        err => {
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
        }
    );
};
