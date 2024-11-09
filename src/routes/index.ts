import { Application } from "express"
import UserRouter from "./user-router"
import CategoryRouter from "./category-router"
import ImageRouter from "./image-router"
import MailerRouter from "./mailer-router"
import ProductRouter from "./product-router"
import CartRouter from "./cart-router"
import OrderRouter from "./order-router"
import MomoRouter from "./MoMoRouter"
import VnPayRouter from "./PaymentRouter"

const routes = (app: Application): void => {
  app.use("/api/user", UserRouter)
  app.use("/api/product", ProductRouter)
  app.use("/api/category", CategoryRouter)
  app.use("/api/image", ImageRouter)
  app.use("/api/mail", MailerRouter)
  app.use("/api/cart", CartRouter)
  app.use("/api/order", OrderRouter)
  app.use("/api/momo", MomoRouter)
  app.use("/api/vnpay", VnPayRouter)
}

export default routes
