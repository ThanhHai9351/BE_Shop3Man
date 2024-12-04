import express, { Router } from "express"
import CartControlller from "../controllers/cart.controller"
import Authentication from "../middleware/authentication"

const router: Router = express.Router()

router.post("/create", Authentication.authenticationToken, CartControlller.createCart)
router.get("/getAll", Authentication.authenticationToken, CartControlller.getAllCart)
router.get("/detail/:id", Authentication.authenticationToken, CartControlller.detailCart)
router.put("/update/:id", Authentication.authenticationToken, CartControlller.updateCart)
router.delete("/delete/:id", Authentication.authenticationToken, CartControlller.deleteCart)

export default router
