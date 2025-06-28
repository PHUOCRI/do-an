import express from 'express'
import {
    getAllMessages,
    getMessagesByConversation,
    createMessage,
    markMessageAsRead
} from '../controllers/MessageController.js'

const router = express.Router()

// Get all messages
router.get('/all', getAllMessages)

// Get messages by conversation
router.get('/conversation/:conversationId', getMessagesByConversation)

// Create new message
router.post('/create', createMessage)

// Mark message as read
router.put('/:messageId/read', markMessageAsRead)

export default router 