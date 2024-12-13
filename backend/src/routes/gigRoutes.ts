import express from 'express';
import { createGig, getGig } from '../controllers/gigController';
import { validateGigCreation } from '../middlewares/validationMiddleware';

const router = express.Router();

router.post('/gigs', validateGigCreation, createGig);
router.get('/gigs/:gigId', getGig);

export default router;