import {ProductModel} from '../models/ProductModel.js'
import expressAsyncHandler from 'express-async-handler'
import { PinComment } from '../untils/until.js'
import cloudinary from 'cloudinary'
import {data} from '../data.js'
import Banner from '../models/banner.js'

export const getAllBanner = expressAsyncHandler(async (req, res) => {
    const banners = await Banner.find({})
    res.send(banners)
})

export const findBannerById = expressAsyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id)
    if(banner){
        res.send(banner)
    }else{
        res.send({message: 'banner not found'})
    }
})

export const filterBannerByType =  expressAsyncHandler(async (req, res) => {
    const filterBannerByType = await Banner.find({type: req.params.type}).limit(5)
    res.send(filterBannerByType)
})

export const filterBannerByRandomField = expressAsyncHandler(async (req, res) => {
    const banners = await Banner.find(req.body)
    if(banners){
        res.send(banners)
    }else{
        res.send({message: 'banner not found'})
    }
})

export const AddBanner = expressAsyncHandler(async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "dev_setups",
  });

  const banner = new Banner({
    name: req.body.name,
    image: result.secure_url,
    cloudinary_id: result.public_id,
  });
  const newBanner = await banner.save();

  if (newBanner) {
    return res
      .status(201)
      .send({ message: "New Banner Created", data: newBanner });
  } else {
    res.send("error add banner");
  }
});

export const UpdateBanner= expressAsyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.body._id);

  await cloudinary.uploader.destroy(banner.cloudinary_id);

  let result;
  if (req.file) {
    result = await cloudinary.uploader.upload(req.file.path);
  }

  if (banner) {
    banner.name = req.body.name;
    banner.image = result?.secure_url || banner.image;
    banner.cloudinary_id = result?.public_id || banner.cloudinary_id;

    const updateBanner = await banner.save();
    if (updateBanner) {
      res.send("update success");
      return;
    }
  }

  return res.send("update fail");
});

export const deleteBanner = expressAsyncHandler(async (req, res) => {
    const deleteBanner = await Banner.findById(req.params.id)
    if(deleteBanner){
        await deleteBanner.remove()
        res.send({message: 'Banner deleted'})
    } else{
        res.send('error in deletion')
    }
})

export const SearchBanner = expressAsyncHandler(async (req, res) => {
    const name = req.query.name
    const banner = await Banner.find({name: {$regex: name, $options: 'i'}})
    banner.length > 0 ? res.send(banner) : res.send({message: 'khong tim thay banner'})
})

export const paginationBanner = expressAsyncHandler(async (req, res) => {
    var perPage = 4
    var page = req.params.page || 1
    ProductModel
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, products) {
            ProductModel.countDocuments().exec(function(err, count) {
                if (err) return next(err)
                res.send({
                    products: products,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
})

export const RateProduct = expressAsyncHandler(async (req, res) => {
    const product = await ProductModel.findById(req.params.id)
    if(product){
        const existsUser = product.reviews.find(x => x.name === req.body.name)
        if(existsUser){
            res.send({message: 'ban da danh gia san pham nay'})
        }else{
            product.reviews.push(req.body)
            const updateProduct = await product.save()
            res.send(updateProduct)
        }
        
    }else{
        res.status(400).send({message: 'product not found'})
    }

})

export const CommentProduct = expressAsyncHandler(async (req, res) => {
    const product = await ProductModel.findById(req.params.id)
    if(product){
        product.comments.push(req.body)
        const updateCommentProduct = await product.save()
        res.send(updateCommentProduct)
    }else{
        res.status(400).send({message: 'product not found'})
    }

})

export const RepCommentProduct = expressAsyncHandler(async (req, res) => {
    const product = await ProductModel.findById(req.params.id)
    if(product){
        const indexComment = product.comments.findIndex(item => item._id == req.body.idComment)
        product.comments[indexComment].replies.push(req.body)

        await product.save()
        res.send(product)
    }else{
        res.status(400).send({message: 'product not found'})
    }

})

export const PinCommentProduct = expressAsyncHandler(async (req, res) => {
    const product = await ProductModel.findById(req.params.id)
    if(product){
        const indexComment = product.comments.findIndex(item => item._id == req.body.idComment)
        product.comments[indexComment] = req.body
        PinComment(product.comments, indexComment, 0)

        await product.save()
        res.send(product)
    }else{
        res.status(400).send({message: 'product not found'})
    }
})

export const BlogProduct = expressAsyncHandler(async (req, res) => {
    const product = await ProductModel.findById({_id: req.params.id})
    
    if(product){
        product.blog = req.body.blogContent
        await product.save()
        res.send(product)
    }else{
        res.send({message: 'product not found'})
    }
})
