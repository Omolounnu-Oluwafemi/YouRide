import express from 'express'; 
const router = express.Router();
import { GetRideOtions } from '../../controllers/Ride/rideOptions';

router.get('/options', GetRideOtions)