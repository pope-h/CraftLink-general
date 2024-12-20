import express from 'express';
import { createArtisanProfile, updateArtisanProfile, getArtisanProfile } from '../controllers/artisanController.js';
import { validateArtisanCreation, validateArtisanUpdate } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router
  .route('/artisan-profile')
  .post(
    // authenticateUser,  // If authentication gets to be implemented
    validateArtisanCreation,
    createArtisanProfile
  )
  .put(
    // authenticateUser,
    validateArtisanUpdate,
    updateArtisanProfile
  );
router.get('/artisan-profile/:artisanId', getArtisanProfile);

export default router;