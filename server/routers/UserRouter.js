import express from 'express'
import { getAllUsers, registerUser, loginUser, DeleteUser, updateUser, getUserById, grantAdminPrivilege, resetPassword } from '../controllers/UserController.js'
import { verifyToken, isAdmin } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/reset-password', resetPassword)
router.get('/grant-admin/:email', grantAdminPrivilege)

// Protected routes
router.get('/', verifyToken, getAllUsers)
router.get('/:userId', verifyToken, getUserById)
router.put('/:userId', verifyToken, updateUser)
router.delete('/:id', verifyToken, isAdmin, DeleteUser)

export default router
