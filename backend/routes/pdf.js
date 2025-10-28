import express from "express";
import { getShoppingListPDF } from "../controllers/pdfController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/shopping-list/pdf", authMiddleware, getShoppingListPDF);

export default router;
