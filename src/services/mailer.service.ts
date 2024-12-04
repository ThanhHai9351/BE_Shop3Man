import nodeMailer from "nodemailer"

const sendMailService = async (email: string, title: string, message: string) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })

  const info = await transporter.sendMail({
    from: `"FarmMarket 👻" <${process.env.EMAIL}>`,
    to: email,
    subject: title,
    text: message,
    html: `<b>${message}</b>`,
  })
  return info
}

const MailerServices = { sendMailService }

export default MailerServices
