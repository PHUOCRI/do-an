import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    unreadCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    collection: 'conversations'
})

const ConversationModel = mongoose.model('Conversation', conversationSchema)

export { ConversationModel }
