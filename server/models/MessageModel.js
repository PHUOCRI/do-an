import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }
}, {
    timestamps: true,
    collection: 'messages'
})

// Add indexes for better query performance
messageSchema.index({ conversation: 1, createAt: -1 })
messageSchema.index({ sender: 1 })

const MessageModel = mongoose.model('Message', messageSchema)

export { MessageModel }
