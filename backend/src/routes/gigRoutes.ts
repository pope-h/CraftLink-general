import express from 'express';
import { createGig, getGig } from '../controllers/gigController.ts';
import { validateGigCreation } from '../middlewares/validationMiddleware.ts';

const router = express.Router();

router.post('/gigs', validateGigCreation, createGig);
router.get('/gigs/:gigId', getGig);

export default router;