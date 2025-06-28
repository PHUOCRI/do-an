import mongoose from 'mongoose'
import { ProductModel } from './models/ProductModel.js'

const testConnection = async () => {
    try {
        // Kết nối MongoDB
        await mongoose.connect('mongodb+srv://Phuocri:Ri123456@cluster0.h4lfdxq.mongodb.net/shop', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Kết nối MongoDB thành công')

        // Kiểm tra collection products
        const products = await ProductModel.find({})
        console.log(`Số lượng sản phẩm trong database: ${products.length}`)
        
        if (products.length > 0) {
            console.log('Mẫu sản phẩm đầu tiên:', products[0])
        }

        // Kiểm tra kết nối
        const collections = await mongoose.connection.db.listCollections().toArray()
        console.log('\nDanh sách collections:', collections.map(c => c.name))

        process.exit(0)
    } catch (error) {
        console.error('Lỗi:', error)
        process.exit(1)
    }
}

testConnection() 