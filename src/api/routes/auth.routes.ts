import express, { Router } from "express"
import UserController from "../controllers/user.controller"

const router: Router = express.Router()

router.post("/register", UserController.createUser)
router.post("/login", UserController.login)

export default router
