import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import {
  getAllSelectLists,
  getSelectListById,
  createSelectList,
  updateSelectList,
  deleteSelectList,
  getUserSelectLists
} from "../controllers/SelectListController.js";

const router = express.Router();

// Public routes
router.get("/all", getAllSelectLists);
router.get("/:id", getSelectListById);

// Protected routes
router.use(verifyToken);
router.post("/", createSelectList);
router.get("/user/me", getUserSelectLists);
router.put("/:id", updateSelectList);
router.delete("/:id", deleteSelectList);

export default router;
