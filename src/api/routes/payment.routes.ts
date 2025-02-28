import express, { Request, Response } from "express"
import moment from "moment"
import config from "config"
import crypto from "crypto"
import querystring from "qs"
import { EStatus } from "../../models/order.model"
import { handleChangeStatusOrder } from "../services/order.service"

const router = express.Router()

interface Config {
  vnp_TmnCode: string
  vnp_HashSecret: string
  vnp_Url: string
  vnp_ReturnUrl: string
  vnp_Api: string
}

// Create payment URL
router.post("/create_payment_url", (req: Request, res: Response) => {
  process.env.TZ = "Asia/Ho_Chi_Minh"

  const date = new Date()
  const createDate = moment(date).format("YYYYMMDDHHmmss")

  const ipAddr: any = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress

  const tmnCode = config.get<string>("vnp_TmnCode")
  const secretKey = config.get<string>("vnp_HashSecret")
  let vnpUrl = config.get<string>("vnp_Url")
  const returnUrl = config.get<string>("vnp_ReturnUrl")

  const { orderId, amount, language } = req.body

  // Validate required fields
  if (!orderId || !amount) {
    return res.status(400).json({
      error: "Missing required fields: orderId and amount are required",
    })
  }

  const locale = language || "vn"
  const currCode = "VND"
  const bankCode = "NCB"

  let vnp_Params: Record<string, string | number> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toan cho ma GD: ${orderId}`,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr || "",
    vnp_CreateDate: createDate,
  }

  if (bankCode) {
    vnp_Params.vnp_BankCode = bankCode
  }

  vnp_Params = sortObject(vnp_Params)

  const signData = querystring.stringify(vnp_Params, { encode: false })
  const hmac = crypto.createHmac("sha512", secretKey)
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex")
  vnp_Params.vnp_SecureHash = signed
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false })

  res.set("Content-Type", "text/html")
  res.send(JSON.stringify(vnpUrl))
})

function sortObject(obj: Record<string, any>): Record<string, any> {
  const sorted: Record<string, string> = {}
  const str: string[] = []
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key))
    }
  }
  str.sort()
  for (let key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+")
  }
  return sorted
}

router.get("/vnpay_ipn", async function (req, res, next) {
  let vnp_Params = req.query
  const secureHash = vnp_Params["vnp_SecureHash"]

  delete vnp_Params["vnp_SecureHash"]
  delete vnp_Params["vnp_SecureHashType"]

  vnp_Params = sortObject(vnp_Params)
  var config = require("config")
  var secretKey = config.get("vnp_HashSecret")
  var querystring = require("qs")
  var signData = querystring.stringify(vnp_Params, { encode: false })
  var crypto = require("crypto")
  var hmac = crypto.createHmac("sha512", secretKey)
  var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex")

  if (secureHash === signed) {
    const orderId = vnp_Params["vnp_TxnRef"]
    const rspCode = vnp_Params["vnp_ResponseCode"]

    // Check response code from VNPay
    if (rspCode !== "00") {
      await handleChangeStatusOrder(orderId as string, EStatus.CANCEL)
      return res.status(200).json({ RspCode: "97", Message: "Invalid signature" })
    }
    await handleChangeStatusOrder(orderId as string, EStatus.SUCCESS)
    return res.status(200).json({ RspCode: "00", Message: "success" })
  } else {
    res.status(200).json({ RspCode: "97", Message: "Invalid signature" })
  }
})

export default router
