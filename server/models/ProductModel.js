import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
    name: { type: String },
    comment: { type: String },
    star: { type: Number }
})

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    type: { type: String, required: true },
    image: { type: String },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    os: String,
    ram: String,
    battery: String,
    rom: String,
    camera: String,
    special: String,
    design: String,
    screen: String
}, {
    timestamps: true,
    collection: 'products' // Chỉ định rõ tên collection
})

// Tạo index cho tìm kiếm
productSchema.index({ name: 'text' })

const ProductModel = mongoose.model('Product', productSchema)

export { ProductModel }