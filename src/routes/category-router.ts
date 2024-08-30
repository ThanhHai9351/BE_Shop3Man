import express, { Request, Response, Router } from "express";
import CategoryController from "../controllers/category-controller";
const router: Router = express.Router();

router.get("/getall",CategoryController.getAllCategories);

export default router;