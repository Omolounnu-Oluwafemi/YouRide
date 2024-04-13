import {config} from "dotenv"
import createError from 'http-errors';
import express, { Request, Response, NextFunction } from "express";
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { sequelize } from './config/config';
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./swagger.docs";
import session from 'express-session';

import driverRouter from './routes/drivers';
import usersRouter from './routes/usersRoute';
import adminRouter from './routes/admin';

sequelize
.sync()
.then(()=>{
  console.log("database synced sucessfully");
})
.catch((err)=>{
  console.log(err)
})

config()

const app = express();

app.use(
  session({
    secret: process.env.COOKIE_KEY as string,
    resave: false,
    saveUninitialized: false,
  }),
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/user', usersRouter);
app.use('/driver', driverRouter);
app.use('/admin', adminRouter);

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
