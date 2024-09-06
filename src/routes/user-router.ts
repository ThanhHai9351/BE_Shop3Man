import express, { Router } from "express";
import UserController from "../controllers/user-controller";
import Authentication from "../middleware/authentication";

const router: Router = express.Router();

router.post("/register", UserController.createUser);
router.post("/login", UserController.login);
router.get("/me", UserController.getUserFromToken);
router.get("/getAll",Authentication.authenticationRoles ,UserController.getAllUsers);
router.put("/update/:id",UserController.updateUser);

export default router;
