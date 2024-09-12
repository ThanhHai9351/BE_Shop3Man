import { Application } from "express";
import UserRouter from "./user-router"; 
import CategoryRouter from './category-router';
import ImageRouter from './image-router'
import MailerRouter from './mailer-router'
import ProductRouter from './product-router'
import CartRouter from './cart-router'

const routes = (app: Application): void => {
  app.use("/api/user", UserRouter);
  app.use("/api/category", CategoryRouter);
  app.use("/api/image",ImageRouter);
  app.use("/api/mail",MailerRouter);
  app.use("/api/cart",CartRouter);
};

export default routes;
