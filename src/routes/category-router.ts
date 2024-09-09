import express, { Request, Response, Router } from "express";
import CategoryController from "../controllers/category-controller";
import Authentication from "../middleware/authentication";
const router: Router = express.Router();

router.get("/getAll",CategoryController.getAllCategories);
router.post("/create",Authentication.authenticationToken,CategoryController.createCategory)
router.put("/update/:id",Authentication.authenticationToken,Authentication.authenticationRoles,CategoryController.updateCategory)
router.delete("/delete/:id",Authentication.authenticationRoles,CategoryController.deleteCategory)
router.get("/detail/:id",CategoryController.detailCategory)


export default router;