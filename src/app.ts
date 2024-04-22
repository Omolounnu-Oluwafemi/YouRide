import { config } from "dotenv"
import nocache from 'nocache';
import createError from 'http-errors';
import express, { Request, Response, NextFunction } from "express";
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { sequelize } from './config/config';
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./swagger.docs";
import session from 'express-session';
import passport from 'passport';
import authSetup from './config/passport'; 

import driverAuth from './routes/Driver/driversAuth';
import driverDashboard from './routes/Driver/dashboard';
import usersAuth from './routes/User/usersRoute';
import adminAuth from './routes/Admin/admin';
import rideRoutes from './routes/Ride/rides';
import voucherRoutes from './routes/Admin/voucher';
import vehicleRoutes from './routes/Vehicle/vehicle';

const app = express();

app.use(nocache());
app.use(cors());

app.use(
  session({
    secret: process.env.COOKIE_KEY as string,
    resave: false,
    saveUninitialized: false,
  }),
);

sequelize
.sync()
.then(()=>{
  console.log("database synced sucessfully");
})
.catch((err)=>{
  console.log(err)
})

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

config();
authSetup(sequelize);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/v1/user', usersAuth);
app.use('/api/v1/driver', driverAuth);
app.use('/api/v1/driver/dashboard', driverDashboard);
app.use('/api/v1/admin', adminAuth);
app.use('/api/v1/rides', rideRoutes);
app.use('/api/v1/admin', voucherRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);

// SWAGGER
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: createError.HttpError, req: Request, res: Response)=> {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
