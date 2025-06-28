import mongoose from 'mongoose'
import { data } from '../../data.js'
import { ProductModel } from '../../models/ProductModel.js'

const connectDB = async () => {
    try {
        // Kết nối MongoDB với database cụ thể
        const conn = await mongoose.connect('mongodb+srv://Phuocri:Ri123456@cluster0.h4lfdxq.mongodb.net/test', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log('Đã kết nối MongoDB thành công')

        // Kiểm tra collection products
        const collections = await mongoose.connection.db.listCollections().toArray()
        const hasProductsCollection = collections.some(col => col.name === 'products')

        if (!hasProductsCollection) {
            console.log('Collection products chưa tồn tại, đang tạo...')
            await mongoose.connection.db.createCollection('products')
        }

        // Kiểm tra và thêm dữ liệu
        const productsCount = await ProductModel.countDocuments()
        
        if (productsCount === 0) {
            console.log('Không có dữ liệu, đang thêm dữ liệu mẫu...')
            
            // Xóa dữ liệu cũ nếu có
            await ProductModel.deleteMany({})
            
            // Chuẩn bị dữ liệu
            const productsToInsert = data.products.map(product => {
                const { id, ...rest } = product
                return {
                    ...rest,
                    reviews: [{
                        name: "Admin",
                        comment: "Initial review",
                        star: 5
                    }]
                }
            })

            // Thêm dữ liệu mới
            await ProductModel.insertMany(productsToInsert)
            console.log('Đã thêm dữ liệu mẫu thành công')
            
            // Kiểm tra lại
            const count = await ProductModel.countDocuments()
            console.log(`Số lượng sản phẩm hiện tại: ${count}`)
        } else {
            console.log(`Đã có ${productsCount} sản phẩm trong database`)
        }

        return conn
    } catch (error) {
        console.error('Lỗi kết nối MongoDB:', error)
        process.exit(1)
    }
}

export default connectDB