import express, { Router } from "express"
import UserController from "../controllers/user.controller"
import Authentication from "../../middleware/authentication"

const router: Router = express.Router()

router.get("/me", Authentication.authenticationToken, UserController.getUserFromToken)
router.get("/", Authentication.authenticationToken, UserController.getAllUsers)
router.put("/:id", Authentication.authenticationToken, UserController.updateUser)
router.delete("/:id", Authentication.authenticationRoles, UserController.deleteUser)

export default router
