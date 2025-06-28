import jwt from 'jsonwebtoken'
import { UserModel } from '../models/UserModel.js'

const JWT_SECRET = 'your_jwt_secret' // Trong thực tế, nên đặt trong file .env

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        
        if (!token) {
            return res.status(401).json({ message: 'Không tìm thấy token xác thực' })
        }

        const decoded = jwt.verify(token, JWT_SECRET)
        const user = await UserModel.findById(decoded.userId).select('-password')
        
        if (!user) {
            return res.status(401).json({ message: 'Token không hợp lệ' })
        }

        req.user = user
        next()
    } catch (error) {
        console.error('Lỗi xác thực:', error)
        res.status(401).json({ message: 'Token không hợp lệ' })
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Không có quyền truy cập' })
        }
        next()
    } catch (error) {
        console.error('Lỗi kiểm tra quyền admin:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
} 