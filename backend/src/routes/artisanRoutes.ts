import express from 'express';
import { createArtisanProfile, updateArtisanProfile, getArtisanProfile } from '../controllers/artisanController.js';
import { validateArtisanCreation, validateArtisanUpdate, validatePortfolioItem } from '../middlewares/validationMiddleware.js';
import { 
  addPortfolioItem,
  updatePortfolioItem 
} from '../controllers/portfolioController.js';

const router = express.Router();

router.post('/artisans', validateArtisanCreation, createArtisanProfile);
router.put('/artisans/:walletAddress', validateArtisanUpdate, updateArtisanProfile);
router.get('/artisans/:walletAddress', getArtisanProfile);

// Portfolio-specific routes
router.post('/artisans/:walletAddress/portfolio', validatePortfolioItem, addPortfolioItem);
router.put('/artisans/:walletAddress/portfolio/:portfolioId', validatePortfolioItem, updatePortfolioItem);

export default router;