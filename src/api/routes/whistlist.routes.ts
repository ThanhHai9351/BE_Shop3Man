import express, { Router } from "express"
import Authentication from "../../middleware/authentication"
import WhistlistController from "../controllers/whistlist.controller"

const router: Router = express.Router()

router.post("/", Authentication.authenticationToken, WhistlistController.addToWhistlist)
router.get("/", Authentication.authenticationToken, WhistlistController.getWhistlist)
router.delete("/", Authentication.authenticationToken, WhistlistController.removeToWhistlist)

export default router
