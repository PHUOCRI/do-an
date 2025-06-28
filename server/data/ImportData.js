import { ProductModel } from '../models/ProductModel.js'

const sampleProducts = [
    {
        name: "Áo thun nam basic",
        image: "https://example.com/images/ao-thun-nam.jpg",
        description: "Áo thun nam chất liệu cotton 100%, thoáng mát",
        price: 199000,
        countInStock: 50,
        rating: 4.5,
        numReviews: 10,
        category: "Áo"
    },
    {
        name: "Quần jean nam slim fit",
        image: "https://example.com/images/quan-jean-nam.jpg",
        description: "Quần jean nam form slim fit, co giãn thoải mái",
        price: 499000,
        countInStock: 30,
        rating: 4.8,
        numReviews: 15,
        category: "Quần"
    },
    {
        name: "Áo sơ mi nữ công sở",
        image: "https://example.com/images/ao-so-mi-nu.jpg",
        description: "Áo sơ mi nữ chất liệu lụa, phù hợp công sở",
        price: 299000,
        countInStock: 40,
        rating: 4.6,
        numReviews: 12,
        category: "Áo"
    }
]

export const importData = async () => {
    try {
        // Xóa tất cả dữ liệu cũ
        await ProductModel.deleteMany({})
        
        // Import dữ liệu mẫu
        await ProductModel.insertMany(sampleProducts)
        
        console.log('Import dữ liệu thành công')
    } catch (error) {
        console.error('Lỗi khi import dữ liệu:', error)
        throw error
    }
} 