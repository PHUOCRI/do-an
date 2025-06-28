import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import {
    createConversation,
    getConversations,
    getConversation,
    deleteConversation
} from '../controllers/ConversationController.js'

const router = express.Router()

router.post('/', verifyToken, createConversation)
router.get('/:userId', verifyToken, getConversations)
router.get('/find/:firstUserId/:secondUserId', verifyToken, getConversation)
router.delete('/:conversationId', verifyToken, deleteConversation)

export default router 