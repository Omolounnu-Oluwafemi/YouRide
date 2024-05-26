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
import { io, httpServer, driverSocketMap, userSocketMap } from './config/socket';
import { DriverSocketController } from "./controllers/Socket/driver";
import { UserSocketController } from "./controllers/Socket/user";

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
import paymentOptionsRoutes from './routes/Admin/paymentOptions';


const app = express();

app.use(nocache());
app.use(cors());

io.on('connection', (socket) => {
    const userType = socket.handshake.query.userType;
    const userId = socket.handshake.query.userId;
    const driverId = socket.handshake.query.driverId;

  if (userType === 'driver') {
    driverSocketMap.set(socket.id, userId);
    driverSocketMap.set(`${socket.id}-driverId`, driverId);
    
    socket.on('driverConnected', ({ driverId, latitude, longitude }) => {
      // driverSocketMap.set('socketId', socket.id);

      console.log("driverSocketMap:", driverSocketMap)
      console.log(driverSocketMap.get('driverId'))
      
      // Assuming you have a method to update the driver's status and location
      DriverSocketController.updateDriverStatusAndLocation(driverId, true, latitude, longitude);

      socket.emit('connectionSuccess', {
        message: 'You are successfully connected and your location is updated.',
        driverId: driverId,
        socketId: socket.id
      });
    });

        // Listen for acceptRide event from drivers
    socket.on('acceptRide', async ({ tripId }) => {
      // Check if tripId and driverId are strings before passing them to updateTripWithDriverDetails
      if (typeof tripId === 'string' && typeof driverId === 'string') {
        // Assuming you have a method to update the trip with the driver's details
        const response = await DriverSocketController.updateTripWithDriverDetails(tripId, driverId);

        if (response.status === 'success') {
          socket.emit('rideAccepted', response);
        } else {
          socket.emit('error', response);
        }
      } else {
        console.error('tripId or driverId is not a string');
      }
    });
        
  } else if (userType === 'user') {
        if (typeof userId === 'string') {
            userSocketMap.set(socket.id, userId);
            socket.on('confirmPickup', async (pickupDetails) => {
                const response = await UserSocketController.requestRide(
                    userId,
                    pickupDetails.pickupLocation,
                    pickupDetails.destination,
                    pickupDetails.paymentMethod,
                    pickupDetails.tripAmount,
                    pickupDetails.totalDistance,
                    pickupDetails.pickupLatitude,
                    pickupDetails.pickupLongitude,
                    pickupDetails.destinationLatitude,
                    pickupDetails.destinationLongitude,
                    socket.id
                );

                if (response.status === 'success') {
                    socket.emit('rideRequested', response);
                } else {
                    socket.emit('error', response);
                }
            });
        } else {
            console.error('userId is not defined or not a string');
        }
  
  }
  
      socket.on('disconnect', () => {
        if (userType === 'driver') {
        const driverId = driverSocketMap.get(`${socket.id}-driverId`); // Retrieve the driverId using the unique key
        DriverSocketController.updateDriverAvailability(driverId, false);
        console.log(`Driver ${driverId} disconnected.`);

        } else if (userType === 'user') {
            userSocketMap.delete(socket.id);
        }
        console.log(`${userType} ${userId} disconnected.`);
    });

});

httpServer.on('request', app);

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
app.use('/api/v1/admin', paymentOptionsRoutes);
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