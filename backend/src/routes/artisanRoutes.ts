import express from 'express';
import { createArtisanProfile, updateArtisanProfile, getArtisanProfile } from '../controllers/artisanController.ts';
import { validateArtisanCreation, validateArtisanUpdate } from '../middlewares/validationMiddleware.ts';

const router = express.Router();

router.post('/artisan-profile', validateArtisanCreation, createArtisanProfile);
router.put('/artisan-profile', validateArtisanUpdate, updateArtisanProfile);
router.get('/artisan-profile/:artisanId', getArtisanProfile);

export default router;