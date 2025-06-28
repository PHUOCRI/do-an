import express from 'express'
import {
  getAllProduct,
  filterProductByType,
  findProductById,
  AddProduct,
  DeleteProduct,
  CommentProduct,
  UpdateProduct,
  SearchProduct,
  paginationProduct,
  RateProduct,
  RepCommentProduct,
  BlogProduct,
  PinCommentProduct,
  filterProductByRandomField,
} from "../controllers/ProductController.js";
import { isAuth, isAdmin } from "../untils/until.js";
import { upload } from "../untils/until.js";

const ProductRouter = express.Router();

// Route chính để lấy tất cả sản phẩm
ProductRouter.get("/all", getAllProduct);

// Route tìm kiếm và lọc
ProductRouter.get("/search", SearchProduct);
ProductRouter.get("/type/:type", filterProductByType);
ProductRouter.post("/filter", filterProductByRandomField);

// Route cho sản phẩm cụ thể
ProductRouter.get("/detail/:id", findProductById);
ProductRouter.get("/page/:page", paginationProduct);

// Route cho đánh giá và bình luận
ProductRouter.post("/rate/:id", RateProduct);
ProductRouter.post("/comment/:id", CommentProduct);
ProductRouter.post("/comment/pin/:id", PinCommentProduct);
ProductRouter.post("/comment/reply/:id", RepCommentProduct);

// Route quản lý sản phẩm
ProductRouter.post("/create", AddProduct);
ProductRouter.put("/update", UpdateProduct);
ProductRouter.post("/blog/:id", BlogProduct);
ProductRouter.delete("/delete/:id", DeleteProduct);

export default ProductRouter