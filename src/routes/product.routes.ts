import express, { Router } from "express"
import ProductController from "../controllers/product.controller"
import Authentication from "../middleware/authentication"

const router: Router = express.Router()

router.post("/", Authentication.authenticationRoles, ProductController.createProduct)
router.put("/:id", Authentication.authenticationRoles, ProductController.updateProduct)
router.get("/:id", Authentication.authenticationToken, ProductController.detailProduct)
router.delete("/:id", Authentication.authenticationRoles, ProductController.deleteProduct)
router.get("/", ProductController.getAllProduct)

export default router
