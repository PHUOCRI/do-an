import mongoose from 'mongoose'
import { ProductModel } from '../../models/ProductModel.js'
import { UserModel } from '../../models/UserModel.js'
import { MessageModel } from '../../models/MessageModel.js'
import { data } from '../../data.js'

const initMongoDB = async () => {
    try {
        // MongoDB Connection URL
        const MONGODB_URL = 'mongodb+srv://Phuocri:Ri123456@cluster0.h4lfdxq.mongodb.net/shop'
        
        console.log('Connecting to MongoDB...')
        
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        
        console.log('Connected to MongoDB successfully')
        
        // Drop existing collections
        console.log('Dropping existing collections...')
        await Promise.all([
            mongoose.connection.collection('products').drop().catch(() => console.log('No products collection to drop')),
            mongoose.connection.collection('users').drop().catch(() => console.log('No users collection to drop')),
            mongoose.connection.collection('messages').drop().catch(() => console.log('No messages collection to drop'))
        ])
        
        console.log('Dropped existing collections')
        
        // Create admin user
        console.log('Creating admin user...')
        const adminUser = await UserModel.create({
            name: 'Admin',
            email: 'admin@example.com',
            password: 'admin123',
            isAdmin: true,
            phone: '1234567890',
            address: 'Admin Address'
        })
        console.log('Admin user created:', adminUser._id)
        
        // Prepare and insert products
        console.log('Preparing product data...')
        const productsToInsert = data.products.map(product => {
            const { id, ...productWithoutId } = product
            return {
                ...productWithoutId,
                reviews: [{
                    name: "Admin",
                    comment: "Initial review",
                    star: 5
                }],
                rating: 5,
                numReviews: 1
            }
        })
        
        console.log('Inserting products...')
        const insertedProducts = await ProductModel.insertMany(productsToInsert)
        console.log(`Inserted ${insertedProducts.length} products`)
        
        // Create test message
        console.log('Creating test message...')
        const testMessage = await MessageModel.create({
            idConversation: new mongoose.Types.ObjectId(),
            sender: adminUser._id,
            message: 'Test message',
            createAt: Date.now()
        })
        console.log('Test message created:', testMessage._id)
        
        // Verify data
        const productsCount = await ProductModel.countDocuments()
        const usersCount = await UserModel.countDocuments()
        const messagesCount = await MessageModel.countDocuments()
        
        console.log('\nDatabase initialization complete!')
        console.log('Current collection counts:')
        console.log('Products:', productsCount)
        console.log('Users:', usersCount)
        console.log('Messages:', messagesCount)
        
        return true
    } catch (error) {
        console.error('Error in database initialization:', error)
        throw error
    }
}

export default initMongoDB 