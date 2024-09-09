import express, { Router } from "express";
import multer from "multer";
import ImageController from "../controllers/image-controller";

const router: Router = express.Router();
const upload = multer({ dest: "/" });

router.post("/upload",upload.single("file"),ImageController.uploadImage);
router.delete("/upload",ImageController.deleteImage);

export default router;
