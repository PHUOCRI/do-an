import { ConversationModel } from '../models/ConversationModel.js'

export const getAllConversations = async (req, res) => {
    try {
        const conversations = await ConversationModel.find()
            .populate('participants', 'name email')
            .populate('lastMessage')
            .sort('-updatedAt')
        res.json(conversations)
    } catch (error) {
        console.error('Lỗi khi lấy cuộc trò chuyện:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

export const getUserConversations = async (req, res) => {
    try {
        const { userId } = req.params
        const conversations = await ConversationModel.find({
            participants: userId
        })
            .populate('participants', 'name email')
            .populate('lastMessage')
            .sort('-updatedAt')
        res.json(conversations)
    } catch (error) {
        console.error('Lỗi khi lấy cuộc trò chuyện của người dùng:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

export const createConversation = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body

        // Kiểm tra xem cuộc trò chuyện đã tồn tại chưa
        const existingConversation = await ConversationModel.findOne({
            members: { $all: [senderId, receiverId] }
        })

        if (existingConversation) {
            return res.json(existingConversation)
        }

        // Tạo cuộc trò chuyện mới
        const newConversation = await ConversationModel.create({
            members: [senderId, receiverId]
        })

        res.status(201).json(newConversation)
    } catch (error) {
        console.error('Lỗi khi tạo cuộc trò chuyện:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

export const getConversations = async (req, res) => {
    try {
        const { userId } = req.params
        const conversations = await ConversationModel.find({
            members: { $in: [userId] }
        })
        res.json(conversations)
    } catch (error) {
        console.error('Lỗi khi lấy danh sách cuộc trò chuyện:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

export const getConversation = async (req, res) => {
    try {
        const { firstUserId, secondUserId } = req.params
        const conversation = await ConversationModel.findOne({
            members: { $all: [firstUserId, secondUserId] }
        })
        res.json(conversation)
    } catch (error) {
        console.error('Lỗi khi lấy cuộc trò chuyện:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

export const deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params
        await ConversationModel.findByIdAndDelete(conversationId)
        res.json({ message: 'Đã xóa cuộc trò chuyện' })
    } catch (error) {
        console.error('Lỗi khi xóa cuộc trò chuyện:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

export const markConversationAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params
        const conversation = await ConversationModel.findByIdAndUpdate(
            conversationId,
            { unreadCount: 0 },
            { new: true }
        )
        res.json(conversation)
    } catch (error) {
        console.error('Lỗi khi đánh dấu cuộc trò chuyện đã đọc:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
} 