import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { UserModel } from './models/UserModel.js'
import { ProductModel } from './models/ProductModel.js'
import { OrderModel } from './models/OrderModel.js'
import { MessageModel } from './models/MessageModel.js'
import { ConversationModel } from './models/ConversationModel.js'
import { SelectListModel } from './models/SelectListModel.js'
import { data } from './data.js'

const initializeAllData = async () => {
    try {
        // Kết nối MongoDB
        await mongoose.connect('mongodb+srv://Phuocri:Ri123456@cluster0.h4lfdxq.mongodb.net/shop', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Đã kết nối MongoDB thành công')

        // Xóa dữ liệu cũ
        await Promise.all([
            UserModel.deleteMany({}),
            ProductModel.deleteMany({}),
            OrderModel.deleteMany({}),
            MessageModel.deleteMany({}),
            ConversationModel.deleteMany({}),
            SelectListModel.deleteMany({})
        ])
        console.log('Đã xóa dữ liệu cũ')

        // Tạo admin user
        const adminPassword = await bcrypt.hash('admin123', 10)
        const adminUser = await UserModel.create({
            name: 'Admin',
            email: 'admin123@example.com',
            password: adminPassword,
            isAdmin: true
        })
        console.log('Đã tạo admin user:', adminUser)

        // Thêm sản phẩm
        const products = data.products.map(product => {
            const { id, ...rest } = product
            return {
                ...rest,
                reviews: [{
                    name: "Admin",
                    comment: "Initial review",
                    star: 5
                }],
                rating: 5,
                numReviews: 1
            }
        })
        const insertedProducts = await ProductModel.insertMany(products)
        console.log(`Đã thêm ${insertedProducts.length} sản phẩm`)

        // Tạo đơn hàng mẫu
        const sampleOrder = await OrderModel.create({
            user: adminUser._id,
            orderItems: [{
                product: insertedProducts[0]._id,
                quantity: 1,
                price: insertedProducts[0].salePrice
            }],
            shippingAddress: {
                fullName: 'Admin',
                address: '123 Test St',
                city: 'Test City',
                phone: '1234567890'
            },
            paymentMethod: 'COD',
            totalPrice: insertedProducts[0].salePrice
        })
        console.log('Đã tạo đơn hàng mẫu')

        console.log('Hoàn tất khởi tạo dữ liệu')
        process.exit(0)
    } catch (error) {
        console.error('Lỗi:', error)
        process.exit(1)
    }
}

// Chạy script
initializeAllData() 