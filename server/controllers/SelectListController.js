import expressAsyncHandler from "express-async-handler";
import { SelectListModel } from "../models/SelectListModel.js";
import cloudinary from "cloudinary";
import SelectListrouter from "../routers/SelectListRouter.js";

export const createOptionByproperty = expressAsyncHandler(async (req, res) => {
  const SelectListItem = new SelectListModel({
    name: req.body.name,
    property: req.body.property,
    options: req.body.options,
  });
  await SelectListItem.save();
  res.send(SelectListItem);
});

export const getAllOptionByproperty = expressAsyncHandler(async (req, res) => {
  const SelectList = await SelectListModel.find({});
  if (SelectList) {
    res.send(SelectList);
  } else {
    res.send({ error: "no select list" });
  }
});

export const UpdateSelectOption = expressAsyncHandler(async (req, res) => {
  const UpdateSelect = await SelectListModel.findById({ _id: req.params.id });
  if (UpdateSelect) {
    UpdateSelect.name = req.body.name;
    UpdateSelect.property = req.body.property;
    UpdateSelect.options = req.body.options;
  }

  await UpdateSelect.save();
  res.send(UpdateSelect);
});

export const getSelectOptionById = expressAsyncHandler(async (req, res) => {
  const UpdateSelect = await SelectListModel.findById({ _id: req.params.id });
  if (UpdateSelect) {
    res.send(UpdateSelect);
  } else {
    res.send({ message: "no select " });
  }
});

export const deleteSelectOption = expressAsyncHandler(async (req, res) => {
  const UpdateSelect = await SelectListModel.findById({ _id: req.params.id });
  await UpdateSelect.remove();

  res.send({ msg: "deleted select" });
});

export const getAllSelectLists = async (req, res) => {
    try {
        const selectLists = await SelectListModel.find()
            .populate('user', 'name email')
            .populate('products', 'name price image')
        res.json(selectLists)
    } catch (error) {
        console.error('Lỗi khi lấy danh sách select list:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

export const getSelectListById = async (req, res) => {
    try {
        const selectList = await SelectListModel.findById(req.params.id)
            .populate('user', 'name email')
            .populate('products', 'name price image')
        
        if (!selectList) {
            return res.status(404).json({ message: 'Không tìm thấy select list' })
        }
        
        res.json(selectList)
    } catch (error) {
        console.error('Lỗi khi lấy select list:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

export const createSelectList = async (req, res) => {
    try {
        const { products } = req.body
        const selectList = await SelectListModel.create({
            user: req.user._id,
            products,
            status: 'pending'
        })
        
        await selectList.populate('user', 'name email')
        await selectList.populate('products', 'name price image')
        
        res.status(201).json(selectList)
    } catch (error) {
        console.error('Lỗi khi tạo select list:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

export const updateSelectList = async (req, res) => {
    try {
        const { products, status } = req.body
        const selectList = await SelectListModel.findById(req.params.id)
        
        if (!selectList) {
            return res.status(404).json({ message: 'Không tìm thấy select list' })
        }
        
        // Chỉ cho phép user sở hữu hoặc admin cập nhật
        if (selectList.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Không có quyền cập nhật' })
        }
        
        if (products) selectList.products = products
        if (status) selectList.status = status
        
        await selectList.save()
        await selectList.populate('user', 'name email')
        await selectList.populate('products', 'name price image')
        
        res.json(selectList)
    } catch (error) {
        console.error('Lỗi khi cập nhật select list:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

export const deleteSelectList = async (req, res) => {
    try {
        const selectList = await SelectListModel.findById(req.params.id)
        
        if (!selectList) {
            return res.status(404).json({ message: 'Không tìm thấy select list' })
        }
        
        // Chỉ cho phép user sở hữu hoặc admin xóa
        if (selectList.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Không có quyền xóa' })
        }
        
        await selectList.deleteOne()
        res.json({ message: 'Đã xóa select list' })
    } catch (error) {
        console.error('Lỗi khi xóa select list:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
}

export const getUserSelectLists = async (req, res) => {
    try {
        const selectLists = await SelectListModel.find({ user: req.user._id })
            .populate('user', 'name email')
            .populate('products', 'name price image')
        res.json(selectLists)
    } catch (error) {
        console.error('Lỗi khi lấy danh sách select list của user:', error)
        res.status(500).json({ message: 'Lỗi server' })
    }
}
