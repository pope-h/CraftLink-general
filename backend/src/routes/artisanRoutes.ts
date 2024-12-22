import express from 'express';
import { createArtisanProfile, updateArtisanProfile, getArtisanProfile } from '../controllers/artisanController.js';
import { validateArtisanCreation, validateArtisanUpdate, validatePortfolioItem } from '../middlewares/validationMiddleware.js';
import { 
  addPortfolioItem,
  deletePortfolioItem,
  getPortfolioItem,
  getPortfolioItems,
  updatePortfolioItem 
} from '../controllers/portfolioController.js';

const router = express.Router();

router.post('/artisans', validateArtisanCreation, createArtisanProfile);
router.put('/artisans/:walletAddress', validateArtisanUpdate, updateArtisanProfile);
router.get('/artisans/:walletAddress', getArtisanProfile);

// Portfolio-specific routes
router.post('/artisans/:walletAddress/portfolio', validatePortfolioItem, addPortfolioItem);
router.put('/artisans/:walletAddress/portfolio/:portfolioId', validatePortfolioItem, updatePortfolioItem);
router.delete('/artisans/:walletAddress/portfolio/:portfolioId', deletePortfolioItem);
router.get('/artisans/:walletAddress/portfolio', getPortfolioItems);
router.get('/artisans/:walletAddress/portfolio/:portfolioId', getPortfolioItem);

export default router;