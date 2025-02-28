import express, { Router } from "express"
import OrderController from "../controllers/order.controller"
import Authentication from "../../middleware/authentication"

const router: Router = express.Router()

router.post("/:addressId", Authentication.authenticationToken, OrderController.createOrder)
router.get("/", Authentication.authenticationToken, OrderController.getAllOrders)
//get all order
export default router
