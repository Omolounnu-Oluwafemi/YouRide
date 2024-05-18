require('dotenv').config();
import { config } from "dotenv";
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
import { io, httpServer, driverSocketMap } from './config/socket';

import driversAuth from './routes/Driver/driversAuth';
import driverTrip from './routes/Driver/driversTrip';
import driversInfo from './routes/Driver/driversInfo';
import driverDashboard from './routes/Driver/dashboard';
import usersAuth from './routes/User/usersAuth';
import usersTrip from './routes/User/usersTrip';
import usersInfo from './routes/User/usersInfo';
import adminsAuth from './routes/Admin/admin';
import adminTrips from './routes/Admin/trip';
import voucherRoutes from './routes/Admin/voucher';
import vehicleRoutes from './routes/Vehicle/vehicle';
import countryRoutes from './routes/Admin/country';

const app = express();

app.use(nocache());
app.use(cors());

io.on('connection', (socket) => {
    socket.on('driverConnected', (driverId) => {
        driverSocketMap.set(driverId, socket.id);
    });
});

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

app.use('/api/v1/admin', adminsAuth);
app.use('/api/v1/admin', usersInfo);
app.use('/api/v1/admin', driversInfo);
app.use('/api/v1/admin', voucherRoutes);
app.use('/api/v1/admin', countryRoutes);
app.use('/api/v1/admin', adminTrips);
app.use('/api/v1/user', usersAuth);
app.use('/api/v1/user', usersTrip);
app.use('/api/v1/driver', driversAuth);
app.use('/api/v1/driver', driverTrip);
app.use('/api/v1/driver/dashboard', driverDashboard);
app.use('/api/v1/vehiclecategories', vehicleRoutes);

// SWAGGER
app.use('/api-docs', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

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