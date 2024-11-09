import express, { Router } from "express"
import OrderController from "../controllers/order-controller"
import Authentication from "../middleware/authentication"

const router: Router = express.Router()

router.post("/create", Authentication.authenticationToken, OrderController.createOrder)
router.get("/getAll", Authentication.authenticationToken, OrderController.getAllOrder)
router.get("/detail/:id", Authentication.authenticationToken, OrderController.detailOrder)
router.put("/update/:id", Authentication.authenticationRoles, OrderController.updateOrder)
router.delete("/delete/:id", Authentication.authenticationRoles, OrderController.deleteOrder)

export default router
