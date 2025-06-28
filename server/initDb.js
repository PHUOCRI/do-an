import mongoose from 'mongoose'
import {data} from './data.js'
import {ProductModel} from './models/ProductModel.js'
import {UserModel} from './models/UserModel.js'
import {MessageModel} from './models/MessageModel.js'
import dotenv from 'dotenv'

dotenv.config()

const initDatabase = async () => {
    try {
        const url = 'mongodb+srv://Phuocri:Ri123456@cluster0.h4lfdxq.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0'
        
        console.log('Connecting to MongoDB...')
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connected to MongoDB')

        // Clear existing collections
        console.log('Clearing existing collections...')
        await Promise.all([
            ProductModel.deleteMany({}),
            UserModel.deleteMany({}),
            MessageModel.deleteMany({})
        ])
        console.log('Cleared existing collections')
        
        // Prepare product data
        const productsWithoutIds = data.products.map(product => {
            const { id, ...productWithoutId } = product
            return productWithoutId
        })
        
        // Insert test data
        console.log('Inserting test data...')
        
        // Insert products
        const products = await ProductModel.insertMany(productsWithoutIds)
        console.log('Inserted products:', products.length)
        
        // Insert test user
        const testUser = await UserModel.create({
            name: "Test User",
            email: "test@example.com",
            password: "123456",
            isAdmin: true
        })
        console.log('Inserted test user:', testUser._id)
        
        // Insert test message
        const testMessage = await MessageModel.create({
            sender: testUser._id,
            message: "Test message",
            createAt: Date.now()
        })
        console.log('Inserted test message:', testMessage._id)
        
        console.log('Database initialized successfully')

        // Log collection stats
        const productCount = await ProductModel.countDocuments()
        const userCount = await UserModel.countDocuments()
        const messageCount = await MessageModel.countDocuments()
        
        console.log('\nCollection counts:')
        console.log('Products:', productCount)
        console.log('Users:', userCount)
        console.log('Messages:', messageCount)
        
        process.exit(0)
    } catch (error) {
        console.error('\nError initializing database:')
        console.error('Error name:', error.name)
        console.error('Error message:', error.message)
        if (error.errors) {
            console.error('\nValidation errors:')
            Object.keys(error.errors).forEach(key => {
                console.error(`${key}:`, error.errors[key].message)
            })
        }
        process.exit(1)
    }
}

// Execute the initialization
initDatabase()