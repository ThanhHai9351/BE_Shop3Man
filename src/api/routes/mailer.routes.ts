import express, { Router } from "express"
import MailerController from "../controllers/mailer.controller"

const router: Router = express.Router()

router.post("/sendMail", MailerController.sendMail)

export default router
