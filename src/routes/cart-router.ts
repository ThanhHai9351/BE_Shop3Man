import express, { Router } from "express";
import CartControlller from "../controllers/cart-controller";

const router: Router = express.Router();

router.post("/create", CartControlller.createCart);
router.get("/getAll", CartControlller.getAllCart);
router.get("/detail/:id", CartControlller.detailCart);
router.put("/update/:id", CartControlller.updateCart);
router.delete("/delete/:id", CartControlller.deleteCart);

export default router;
