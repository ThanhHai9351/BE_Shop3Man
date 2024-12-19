import express, { Router } from "express"
import ProductController from "../controllers/product.controller"
import Authentication from "../middleware/authentication"
import ProductValirantController from "../controllers/product-valirant.controller"

const router: Router = express.Router()

//product
router.post("/", Authentication.authenticationRoles, ProductController.createProduct)
router.put("/:id", Authentication.authenticationRoles, ProductController.updateProduct)
router.get("/:slug", ProductController.detailProduct)
router.delete("/:id", Authentication.authenticationRoles, ProductController.deleteProduct)
router.get("/", ProductController.getAllProduct)

//product valirant
router.post("/:id", Authentication.authenticationRoles, ProductValirantController.createProductVariant)

export default router
