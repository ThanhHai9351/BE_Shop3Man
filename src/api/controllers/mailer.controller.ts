import Joi from "joi"
import { Request, Response } from "express"
import MailerServices from "../services/mailer.service"

const sendMail = async (req: Request, res: Response): Promise<Response> => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
  })

  const { error } = schema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  try {
    const { email, title, message } = req.body
    const respon = await MailerServices.sendMailService(email, title, message)
    return res.status(200).json(respon)
  } catch (err) {
    return res.status(500).json({
      status: "ERROR",
      message: err instanceof Error ? err.message : "Unknown error occurred",
    })
  }
}

const MailerController = { sendMail }

export default MailerController
