import express, { Router } from "express"
import ConservationController from "../controllers/conservation.controller"
import Authentication from "../../middleware/authentication"

const router: Router = express.Router()

router.get("/", Authentication.authenticationToken, ConservationController.getConversation)
router.post("/:userId", Authentication.authenticationToken, ConservationController.createConversation)

export default router
