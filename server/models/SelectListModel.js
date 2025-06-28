import mongoose from "mongoose";

const selectListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true,
    collection: 'selectlists'
})

// Ensure each user can only select a product once
selectListSchema.index({ user: 1, product: 1 }, { unique: true })

const SelectListModel = mongoose.model('SelectList', selectListSchema)

export { SelectListModel }
