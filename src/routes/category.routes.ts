import express, { Router } from "express"
import CategoryController from "../controllers/category.controller"
import Authentication from "../middleware/authentication"
const router: Router = express.Router()

router.get("/", CategoryController.getAllCategories)
router.post("/", Authentication.authenticationToken, CategoryController.createCategory)
router.put("/:id", Authentication.authenticationRoles, CategoryController.updateCategory)
router.delete("/:id", Authentication.authenticationRoles, CategoryController.deleteCategory)
router.get("/:id", CategoryController.detailCategory)

export default router
