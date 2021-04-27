import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoutes'
import profileRouter from './routes/profileRoutes'
import timeOffRouter from './routes/timeoffRoutes'
import holidayTypesRoutes from './routes/holidayTypes'
import managerRoutes from './routes/managerRoutes'
import db from './models'

const app = express();

db.sequelize.sync();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(
  cors({
    origin:
       'http://localhost:3000',
      credentials: true
  })
);
if (process.env.NODE_ENVV === 'development') {
  app.use(morgan('dev'));
}
app.use(cookieParser());
app.use(helmet());
app.get('/', (req, res) => res.send({ message: 'WORKING' }));

app.use('/profile',profileRouter)
app.use('/auth',authRouter)
app.use('/timeoff',timeOffRouter)
app.use('/holidayTypes',holidayTypesRoutes)
app.use('/manager',managerRoutes)

export default app;
