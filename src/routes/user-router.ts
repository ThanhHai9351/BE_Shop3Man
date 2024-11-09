import express, { Router } from "express"
import UserController from "../controllers/user-controller"
import Authentication from "../middleware/authentication"

const router: Router = express.Router()

router.post("/register", UserController.createUser)
router.post("/login", UserController.login)
router.get("/me", Authentication.authenticationToken, UserController.getUserFromToken)
router.get("/getAll", Authentication.authenticationToken, UserController.getAllUsers)
router.put("/update/:id", Authentication.authenticationToken, UserController.updateUser)
router.delete("/delete/:id", Authentication.authenticationRoles, UserController.deleteUser)

export default router
