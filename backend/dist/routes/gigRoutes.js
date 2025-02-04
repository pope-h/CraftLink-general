import express from 'express';
import { createGig, getAllGigs, getGig } from '../controllers/gigController.js';
import { validateGigCreation } from '../middlewares/validationMiddleware.js';
const router = express.Router();
router.post('/gigs', validateGigCreation, createGig);
router.get('/gigs/:databaseId', getGig);
router.get('/gigs', getAllGigs);
// Get all gigs
// fetch('/api/gigs')
// // With pagination
// fetch('/api/gigs?page=1&limit=10')
// // With filters
// fetch('/api/gigs?status=CREATED&experienceLevel=EXPERT&skillCategory=Web Development')
export default router;
//# sourceMappingURL=gigRoutes.js.map