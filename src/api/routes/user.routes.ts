import express, { Router } from "express"
import UserController from "../controllers/user.controller"
import Authentication from "../../middleware/authentication"
import UserAddressController from "../controllers/user-address.controller"
const router: Router = express.Router()

//Địa chỉ
router.post("/address", Authentication.authenticationToken, UserAddressController.createAddress)
router.get("/address", Authentication.authenticationToken, UserAddressController.getAllAddress)
router.delete("/address/:id", Authentication.authenticationToken, UserAddressController.deleteAddress)

router.get("/me", Authentication.authenticationToken, UserController.getUserFromToken)
router.get("/", Authentication.authenticationToken, UserController.getAllUsers)
router.put("/:id", Authentication.authenticationToken, UserController.updateUser)
router.delete("/:id", Authentication.authenticationRoles, UserController.deleteUser)
router.get("/:id", Authentication.authenticationToken, UserController.getUserById)

export default router
