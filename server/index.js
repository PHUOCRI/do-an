import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import UserRouter from './routers/UserRouter.js'
import ProductRouter from './routers/ProductRouter.js'
import OrderRouter from './routers/OrderRouter.js'
import SelectListRouter from './routers/SelectListRouter.js'
import ConversationRouter from './routers/ConversationRouter.js'
import MessageRouter from './routers/MessageRouter.js'
import { config } from './config/config.js'

dotenv.config()

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(cors({
    origin: config.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')))
app.use('/images', express.static(path.join(__dirname, '../client/public/images')))

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
    next()
})

// API Routes with prefix
app.use('/api/users', UserRouter)
app.use('/api/products', ProductRouter)
app.use('/api/orders', OrderRouter)
app.use('/api/selectlists', SelectListRouter)
app.use('/api/conversations', ConversationRouter)
app.use('/api/messages', MessageRouter)

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.NODE_ENV
    })
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack)
    res.status(err.status || 500).json({ 
        message: err.message || 'Internal Server Error',
        error: config.NODE_ENV === 'development' ? err.message : {}
    })
})

// MongoDB connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`MongoDB Atlas connected: ${conn.connection.host}:${conn.connection.port}`)
    } catch (error) {
        console.error('MongoDB connection error:', error.message)
        process.exit(1)
    }
}

// Handle server shutdown gracefully
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close()
        console.log('MongoDB connection closed.')
        process.exit(0)
    } catch (err) {
        console.error('Error during shutdown:', err)
        process.exit(1)
    }
})

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await connectDB()
        
        app.listen(config.PORT, () => {
            console.log(`Server is running on http://localhost:${config.PORT}`)
            console.log('Environment:', config.NODE_ENV)
        })
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

startServer()