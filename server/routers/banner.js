import express from 'express';
import Banner from '../models/banner.js';

const bannerRouter = express.Router();

// POST /banner
bannerRouter.post('/', async(req, res) => {
    try {
        const { id, image, name, cloudinary_id } = req.body;
        const banner = new Banner({ id, image, name, cloudinary_id });
        await banner.save();
        res.status(201).send(banner);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// GET /banner
bannerRouter.get('/', async(req, res) => {
    try {
        const banners = await Banner.find();
        res.status(200).json(banners);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default bannerRouter;