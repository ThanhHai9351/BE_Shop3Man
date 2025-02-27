import express, { Router } from "express"
import CartControlller from "../controllers/cart.controller"
import Authentication from "../../middleware/authentication"

const router: Router = express.Router()

router.post("/:productId", Authentication.authenticationToken, CartControlller.createCart)
router.get("/", Authentication.authenticationToken, CartControlller.getAllCart)
router.delete("/:productId", Authentication.authenticationToken, CartControlller.deleteCart)

// router.get("/detail/:id", Authentication.authenticationToken, CartControlller.detailCart)
// router.put("/update/:id", Authentication.authenticationToken, CartControlller.updateCart)

export default router
