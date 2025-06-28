import mongoose from 'mongoose'
import { data } from './data.js'
import { ProductModel } from './models/ProductModel.js'

const initializeData = async () => {
    try {
        // Kết nối MongoDB
        await mongoose.connect('mongodb+srv://Phuocri:Ri123456@cluster0.h4lfdxq.mongodb.net/test', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Đã kết nối MongoDB thành công')

        // Xóa dữ liệu cũ
        await ProductModel.deleteMany({})
        console.log('Đã xóa dữ liệu cũ')

        // Chuẩn bị dữ liệu mới
        const productsToInsert = data.products.map(product => {
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

        // Thêm dữ liệu mới
        const insertedProducts = await ProductModel.insertMany(productsToInsert)
        console.log(`Đã thêm ${insertedProducts.length} sản phẩm`)

        // Kiểm tra dữ liệu
        const products = await ProductModel.find({})
        console.log('Mẫu sản phẩm đầu tiên:', products[0])

        console.log('Hoàn tất khởi tạo dữ liệu')
        process.exit(0)
    } catch (error) {
        console.error('Lỗi:', error)
        process.exit(1)
    }
}

// Chạy script
initializeData() 