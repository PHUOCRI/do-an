import {ProductModel} from '../models/ProductModel.js'
import expressAsyncHandler from 'express-async-handler'
import { PinComment } from '../untils/until.js'
import cloudinary from 'cloudinary'
import {data} from '../data.js'

export const getAllProduct = expressAsyncHandler(async (req, res) => {
    try {
        console.log('Đang lấy danh sách sản phẩm...')
    const products = await ProductModel.find({})
        
        if (!products || products.length === 0) {
            console.log('Không có sản phẩm, tiến hành khởi tạo dữ liệu mẫu...')
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
                    }],
                    rating: 5,
                    numReviews: 1
                }
            })
            
            // Thêm dữ liệu mẫu
            await ProductModel.insertMany(productsToInsert)
            console.log('Đã thêm dữ liệu mẫu thành công')
            
            // Lấy lại danh sách sau khi thêm
            const newProducts = await ProductModel.find({})
            console.log(`Tìm thấy ${newProducts.length} sản phẩm`)
            return res.json(newProducts)
        }
        
        console.log(`Tìm thấy ${products.length} sản phẩm`)
        res.json(products)
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error)
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách sản phẩm',
            error: error.message
        })
    }
})

export const findProductById = expressAsyncHandler(async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
        }
        res.json(product)
    } catch (error) {
        console.error('Lỗi khi tìm sản phẩm:', error)
        res.status(500).json({
            message: 'Lỗi khi tìm sản phẩm',
            error: error.message
        })
    }
})

export const filterProductByType = expressAsyncHandler(async (req, res) => {
    try {
        const products = await ProductModel.find({ type: req.params.type })
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm thuộc loại này' })
        }
        res.json(products)
    } catch (error) {
        console.error('Lỗi khi lọc sản phẩm:', error)
        res.status(500).json({
            message: 'Lỗi khi lọc sản phẩm',
            error: error.message
        })
    }
})

export const filterProductByRandomField = expressAsyncHandler(async (req, res) => {
    const products = await ProductModel.find(req.body)
    if(products){
        res.send(products)
    }else{
        res.send({message: 'product not found'})
    }
})

export const AddProduct = expressAsyncHandler(async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "dev_setups",
  });

  const product = new ProductModel({
    name: req.body.name,
    price: req.body.price,
    salePrice: req.body.salePrice,
    amount: req.body.amount,
    type: req.body.type || 'iphone',
    image: result.secure_url,
    cloudinary_id: result.public_id,
    rating: 0,

    os: req.body.os,
    ram: req.body.ram,
    battery: req.body.battery,
    rom: req.body.rom,
    camera: req.body.camera,
    special: req.body.special,
    design: req.body.design,
    screen: req.body.screen,
  });
  const newProduct = await product.save();

  if (newProduct) {
    return res
      .status(201)
      .send({ message: "New Product Created", data: newProduct });
  } else {
    res.send("error add product");
  }
});

export const UpdateProduct = expressAsyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.body._id);

  await cloudinary.uploader.destroy(product.cloudinary_id);

  let result;
  if (req.file) {
    result = await cloudinary.uploader.upload(req.file.path);
  }

  if (product) {
    product.name = req.body.name;
    product.amount = req.body.amount;
    product.price = req.body.price;
    product.salePrice = req.body.salePrice;
    product.type = req.body.type;
    product.image = result?.secure_url || product.image;
    product.rating = 0;
    product.cloulinary_id = result?.public_id || product.cloudinary_id;

    product.os = req.body.os;
    product.ram = req.body.ram;
    product.battery = req.body.battery;
    product.rom = req.body.rom;
    product.camera = req.body.camera;
    product.special = req.body.special;
    product.design = req.body.design;
    product.screen = req.body.screen;

    const updateProduct = await product.save();
    if (updateProduct) {
      res.send("update success");
    }
  }

  return res.send("update fail");
});

export const DeleteProduct = expressAsyncHandler(async (req, res) => {
    const deleteProduct = await ProductModel.findById(req.params.id)

    // await cloudinary.uploader.destroy(deleteProduct.cloudinary_id);

    if(deleteProduct){
        await deleteProduct.remove()
        res.send({message: 'product deleted'})
    } else{
        res.send('error in deletetion')
    }
})

export const SearchProduct = expressAsyncHandler(async (req, res) => {
    try {
        const { name } = req.query
        if (!name) {
            return res.status(400).json({ message: 'Vui lòng nhập từ khóa tìm kiếm' })
        }
        
        const products = await ProductModel.find({
            name: { $regex: name, $options: 'i' }
        })
    
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
        }
        
        res.json(products)
    } catch (error) {
        console.error('Lỗi khi tìm kiếm sản phẩm:', error)
        res.status(500).json({
            message: 'Lỗi khi tìm kiếm sản phẩm',
            error: error.message
        })
    }
})

export const paginationProduct = expressAsyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1
        const perPage = 4
        
        const totalProducts = await ProductModel.countDocuments()
        const totalPages = Math.ceil(totalProducts / perPage)
        
        if (page > totalPages) {
            return res.status(400).json({ message: 'Trang không tồn tại' })
        }
        
        const products = await ProductModel.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        
        res.json({
            products,
                    current: page,
            pages: totalPages
        })
    } catch (error) {
        console.error('Lỗi khi phân trang:', error)
        res.status(500).json({
            message: 'Lỗi khi phân trang',
            error: error.message
                })
    }
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
