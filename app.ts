import express, { Request, Response, NextFunction } from 'express';
const morgan = require ('morgan');
import eventRouter from './routes/eventRoutes'; // importação das rotas do evento
//import userRouter from './routes/userRoutes'; // This line wasnt implemented, chat
 
interface customRequest extends Request {
    requestTime?: string;
}

const app = express();

app.use(morgan('dev'))
app.use(express.json());

app.use((req: customRequest, res: Response, next: NextFunction) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/events', eventRouter);
 
export default app;

