import express, { Request, Response } from "express"
import request from "request"
import moment from "moment"
import config from "config"
import crypto from "crypto"
import querystring from "qs"

const router = express.Router()

interface Config {
  vnp_TmnCode: string
  vnp_HashSecret: string
  vnp_Url: string
  vnp_ReturnUrl: string
  vnp_Api: string
}

// Render pages
router.get("/", (req: Request, res: Response) => {
  res.render("orderlist", { title: "Danh sách đơn hàng" })
})

router.get("/create_payment_url", (req: Request, res: Response) => {
  res.render("order", { title: "Tạo mới đơn hàng", amount: 10000 })
})

router.get("/querydr", (req: Request, res: Response) => {
  console.log("jjaall")
  res.render("querydr", { title: "Truy vấn kết quả thanh toán" })
})

router.get("/refund", (req: Request, res: Response) => {
  res.render("refund", { title: "Hoàn tiền giao dịch thanh toán" })
})

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

  const { orderId, amount, bankCode, language } = req.body
  const locale = language || "vn"
  const currCode = "VND"

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

router.get("/vnpay_return", (req: Request, res: Response) => {
  let vnp_Params = req.query;
  const secureHash = vnp_Params["vnp_SecureHash"] as string;

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  const tmnCode = config.get<string>("vnp_TmnCode");
  const secretKey = config.get<string>("vnp_HashSecret");

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  // if (secureHash === signed) {
  //   const orderId = req.query.vnp_TxnRef as string;
  //   con.connect((err) => {
  //     if (err) throw err;
  //     const sql = "UPDATE `order` SET state = ? WHERE order_id = ?";
  //     con.query(sql, ["banked", orderId.toString()]);
  //     con.end();
  //   });

  //   res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
  // } else {
  //   res.render("success", { code: "97" });
  // }
});

router.get("/vnpay_ipn", (req: Request, res: Response) => {
  let vnp_Params = req.query
  const secureHash = vnp_Params["vnp_SecureHash"] as string

  const orderId = vnp_Params["vnp_TxnRef"] as string
  const rspCode = vnp_Params["vnp_ResponseCode"] as string

  delete vnp_Params["vnp_SecureHash"]
  delete vnp_Params["vnp_SecureHashType"]

  vnp_Params = sortObject(vnp_Params)
  const secretKey = config.get<string>("vnp_HashSecret")

  const signData = querystring.stringify(vnp_Params, { encode: false })
  const hmac = crypto.createHmac("sha512", secretKey)
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex")

  const paymentStatus = "0" // Initial payment status
  const checkOrderId = true // Simulate check for order ID in database
  const checkAmount = true // Simulate check for amount

  if (secureHash === signed) {
    if (checkOrderId && checkAmount) {
      if (paymentStatus === "0") {
        if (rspCode === "00") {
          console.log("Thanh cong")
        } else {
          console.log("That bai")
        }
        res.status(200).json({ RspCode: "00", Message: "Success" })
      } else {
        res.status(200).json({
          RspCode: "02",
          Message: "This order has been updated to the payment status",
        })
      }
    } else {
      res.status(200).json({ RspCode: "04", Message: "Amount invalid" })
    }
  } else {
    res.status(200).json({ RspCode: "97", Message: "Checksum failed" })
  }
})

router.post("/querydr", (req: Request, res: Response) => {
  process.env.TZ = "Asia/Ho_Chi_Minh"
  const date = new Date()

  const vnp_TmnCode = config.get<string>("vnp_TmnCode")
  const secretKey = config.get<string>("vnp_HashSecret")
  const vnp_Api = config.get<string>("vnp_Api")

  const { orderId: vnp_TxnRef, transDate: vnp_TransactionDate } = req.body

  const vnp_RequestId = moment(date).format("HHmmss")
  const vnp_Version = "2.1.0"
  const vnp_Command = "querydr"
  const vnp_OrderInfo = "Truy van GD ma:" + vnp_TxnRef

  const ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress

  const vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss")

  const data = [
    vnp_RequestId,
    vnp_Version,
    vnp_Command,
    vnp_TmnCode,
    vnp_TxnRef,
    vnp_TransactionDate,
    vnp_CreateDate,
    ipAddr,
    vnp_OrderInfo,
  ].join("|")

  const hmac = crypto.createHmac("sha512", secretKey)
  const vnp_SecureHash = hmac.update(Buffer.from(data, "utf-8")).digest("hex")

  const dataObj = {
    vnp_RequestId,
    vnp_Version,
    vnp_Command,
    vnp_TmnCode,
    vnp_TxnRef,
    vnp_OrderInfo,
    vnp_TransactionDate,
    vnp_CreateDate,
    vnp_IpAddr: ipAddr,
    vnp_SecureHash,
  }

  request(
    {
      url: vnp_Api,
      method: "POST",
      json: true,
      body: dataObj,
    },
    (error, response, body) => {
      if (error) {
        console.error("Error querying transaction:", error)
        res.status(500).json({ error: "Internal server error" })
      } else {
        console.log("Transaction query response:", response.body)
        res.json(response.body)
      }
    },
  )
})

router.post("/refund", (req: Request, res: Response) => {
  process.env.TZ = "Asia/Ho_Chi_Minh"
  const date = new Date()

  const vnp_TmnCode = config.get<string>("vnp_TmnCode")
  const secretKey = config.get<string>("vnp_HashSecret")
  const vnp_Api = config.get<string>("vnp_Api")

  const {
    orderId: vnp_TxnRef,
    transDate: vnp_TransactionDate,
    amount: vnp_Amount,
    transType: vnp_TransactionType,
    user: vnp_CreateBy,
  } = req.body

  const vnp_RequestId = moment(date).format("HHmmss")
  const vnp_Version = "2.1.0"
  const vnp_Command = "refund"
  const vnp_OrderInfo = "Hoan tien GD ma:" + vnp_TxnRef

  const ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress

  const vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss")
  const vnp_TransactionNo = "0"

  const data = [
    vnp_RequestId,
    vnp_Version,
    vnp_Command,
    vnp_TmnCode,
    vnp_TransactionType,
    vnp_TxnRef,
    vnp_Amount * 100,
    vnp_TransactionNo,
    vnp_TransactionDate,
    vnp_CreateBy,
    vnp_CreateDate,
    ipAddr,
    vnp_OrderInfo,
  ].join("|")

  const hmac = crypto.createHmac("sha512", secretKey)
  const vnp_SecureHash = hmac.update(Buffer.from(data, "utf-8")).digest("hex")

  const dataObj = {
    vnp_RequestId,
    vnp_Version,
    vnp_Command,
    vnp_TmnCode,
    vnp_TransactionType,
    vnp_TxnRef,
    vnp_Amount: vnp_Amount * 100,
    vnp_TransactionNo,
    vnp_CreateBy,
    vnp_OrderInfo,
    vnp_TransactionDate,
    vnp_CreateDate,
    vnp_IpAddr: ipAddr,
    vnp_SecureHash,
  }

  request(
    {
      url: vnp_Api,
      method: "POST",
      json: true,
      body: dataObj,
    },
    (error, response, body) => {
      if (error) {
        console.error("Error processing refund:", error)
        res.status(500).json({ error: "Internal server error" })
      } else {
        console.log("Refund response:", response.body)
        res.json(response.body)
      }
    },
  )
})

export default router
