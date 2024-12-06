import { Application } from "express"
import UserRouter from "./user.routes"
import CategoryRouter from "./category.routes"
import ImageRouter from "./image.routes"
import MailerRouter from "./mailer.routes"
import ProductRouter from "./product.routes"
import CartRouter from "./cart.routes"
import OrderRouter from "./order.routes"
import MomoRouter from "./momo.routes"
import VnPayRouter from "./payment.routes"
import AuthRouter from "./auth.routes"

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
  app.use("/api/auth", AuthRouter)
}

export default routes
