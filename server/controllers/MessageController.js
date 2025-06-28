import { MessageModel } from '../models/MessageModel.js'
import { ConversationModel } from '../models/ConversationModel.js'

export const getAllMessages = async (req, res) => {
    try {
        const messages = await MessageModel.find()
            .populate('sender', 'name email')
            .populate('receiver', 'name email')
            .sort('-createdAt')
        res.json(messages)
    } catch (error) {
        console.error('Lỗi khi lấy tin nhắn:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

export const getMessagesByConversation = async (req, res) => {
    try {
        const { conversationId } = req.params
        const messages = await MessageModel.find({ conversation: conversationId })
            .populate('sender', 'name email')
            .populate('receiver', 'name email')
            .sort('createdAt')
        res.json(messages)
    } catch (error) {
        console.error('Lỗi khi lấy tin nhắn của cuộc trò chuyện:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

export const createMessage = async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body

        // Tìm hoặc tạo cuộc trò chuyện
        let conversation = await ConversationModel.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        if (!conversation) {
            conversation = await ConversationModel.create({
                participants: [senderId, receiverId]
            })
        }

        // Tạo tin nhắn mới
        const message = await MessageModel.create({
            sender: senderId,
            receiver: receiverId,
            content,
            conversation: conversation._id
        })

        // Cập nhật lastMessage của cuộc trò chuyện
        conversation.lastMessage = message._id
        conversation.unreadCount += 1
        await conversation.save()

        // Populate thông tin người gửi và người nhận
        await message.populate('sender', 'name email')
        await message.populate('receiver', 'name email')

        res.status(201).json(message)
    } catch (error) {
        console.error('Lỗi khi tạo tin nhắn:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

export const markMessageAsRead = async (req, res) => {
    try {
        const { messageId } = req.params
        const message = await MessageModel.findByIdAndUpdate(
            messageId,
            { isRead: true },
            { new: true }
        )
        res.json(message)
    } catch (error) {
        console.error('Lỗi khi đánh dấu tin nhắn đã đọc:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
} 