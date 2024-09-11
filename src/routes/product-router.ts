import express, { Router } from "express";
import ProductController from "../controllers/product-controller";

const router: Router = express.Router();

router.post("/create", ProductController.createProduct);
router.put("/update/:id", ProductController.updateProduct);
router.get("/detail/:id", ProductController.detailProduct);
router.delete("/delete/:id",ProductController.deleteProduct);
export default router;
