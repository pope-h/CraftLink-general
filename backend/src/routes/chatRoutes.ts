import express from 'express';
import {
  initializeConversation,
  sendMessage,
  getConversationMessages
} from '../controllers/chatController.js';
import { validateMessage } from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.post('/conversations/:databaseId', initializeConversation);
router.post('/conversations/:conversationId/messages', validateMessage, sendMessage);
router.get('/conversations/:conversationId/messages', getConversationMessages);

// // Get paginated messages
// await fetch('/api/conversations/456/messages?page=1&limit=50');

export default router;