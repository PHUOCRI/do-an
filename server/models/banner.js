import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    cloudinary_id: {
        type: String,
        required: false,
    },
});

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;