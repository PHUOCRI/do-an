import {UserModel} from '../models/UserModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import expressAsyncHandler from 'express-async-handler'

const JWT_SECRET = 'your_jwt_secret' // Trong thực tế, nên đặt trong file .env

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select('-password')
        res.json(users)
    } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params
        const user = await UserModel.findById(userId).select('-password')
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' })
        }
        res.json(user)
    } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

export const registerUser = async (req, res) => {
    console.log('Đang xử lý đăng ký user:', req.body)
    try {
        const { name, email, password } = req.body

        // Kiểm tra email đã tồn tại
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
            console.log('Email đã tồn tại:', email)
            return res.status(400).json({ message: 'Email đã được sử dụng' })
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10)

        // Tạo người dùng mới
        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword
        })

        console.log('Đã tạo user mới:', user._id)

        // Tạo token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
            isAdmin: user.isAdmin,
            token
        })
    } catch (error) {
        console.error('Lỗi chi tiết khi đăng ký:', error)
        res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log('Login attempt:', { email, password })

        // Tìm người dùng theo email
        const user = await UserModel.findOne({ email })
        console.log('Found user:', user)
        
        if (!user) {
            console.log('User not found:', email)
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' })
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password)
        console.log('Password validation:', isPasswordValid)
        
        if (!isPasswordValid) {
            console.log('Invalid password for user:', user._id)
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' })
        }

        // Tạo token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params
        const { name, email, password, phone, address, city } = req.body

        const user = await UserModel.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' })
        }

        // Cập nhật thông tin
        if (name) user.name = name
        if (email) user.email = email
        if (password) {
            user.password = await bcrypt.hash(password, 10)
        }
        if (phone) user.phone = phone
        if (address) user.address = address
        if (city) user.city = city

        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            phone: updatedUser.phone,
            address: updatedUser.address,
            city: updatedUser.city
        })
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin người dùng:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

export const DeleteUser = expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findById({_id: req.params.id})

    if(user){
        await user.remove()
        res.send({message: 'user deleted'})
    }else{
        res.send({message: 'user not exists'})
    }
})

export const grantAdminPrivilege = async (req, res) => {
    try {
        const { email } = req.params
        console.log('Attempting to grant admin privileges to:', email)
        
        // Tìm user theo email
        const user = await UserModel.findOne({ email })
        console.log('Found user:', user)
        
        if (!user) {
            console.log('User not found:', email)
            return res.status(404).json({ message: 'Không tìm thấy người dùng với email này' })
        }

        // Cập nhật quyền admin
        user.isAdmin = true
        await user.save()
        console.log('Successfully granted admin privileges to:', email)

        res.json({
            message: 'Đã cấp quyền admin thành công',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        })
    } catch (error) {
        console.error('Lỗi khi cấp quyền admin:', error)
        res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body
        console.log('Attempting to reset password for:', email)
        
        // Tìm user theo email
        const user = await UserModel.findOne({ email })
        console.log('Found user:', user)
        
        if (!user) {
            console.log('User not found:', email)
            return res.status(404).json({ message: 'Không tìm thấy người dùng với email này' })
        }

        // Hash mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        
        // Cập nhật mật khẩu
        user.password = hashedPassword
        await user.save()
        console.log('Successfully reset password for:', email)

        res.json({
            message: 'Đã reset mật khẩu thành công',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        })
    } catch (error) {
        console.error('Lỗi khi reset mật khẩu:', error)
        res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
}