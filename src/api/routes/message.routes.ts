import express, { Router } from "express"
import MessageController from "../controllers/message.controller"
import Authentication from "../../middleware/authentication"

const router: Router = express.Router()

router.get("/:conversationId", Authentication.authenticationToken, MessageController.getMessages)

export default router
