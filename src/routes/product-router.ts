import express, { Router } from "express"
import ProductController from "../controllers/product-controller"
import Authentication from "../middleware/authentication"

const router: Router = express.Router()

router.post("/create", Authentication.authenticationRoles, ProductController.createProduct)
router.put("/update/:id", Authentication.authenticationRoles, ProductController.updateProduct)
router.get("/detail/:id", Authentication.authenticationToken, ProductController.detailProduct)
router.delete("/delete/:id", Authentication.authenticationRoles, ProductController.deleteProduct)
router.get("/getAll", ProductController.getAllProduct)

export default router
