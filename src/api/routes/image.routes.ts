import express, { Router } from "express"
import multer from "multer"
import ImageController from "../controllers/image.controller"
import Authentication from "../../middleware/authentication"

const router: Router = express.Router()
const upload = multer({ dest: "/" })

router.post("/upload", upload.single("file"), Authentication.authenticationToken, ImageController.uploadImage)
router.delete("/upload", Authentication.authenticationToken, ImageController.deleteImage)

export default router
