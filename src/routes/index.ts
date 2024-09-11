import { Application } from "express";
import UserRouter from "./user-router"; 
import CategoryRouter from './category-router';
import ImageRouter from './image-router'
import MailerRouter from './mailer-router'

const routes = (app: Application): void => {
  app.use("/api/user", UserRouter);
  app.use("/api/category", CategoryRouter);
  app.use("/api/image",ImageRouter);
  app.use("/api/mail",MailerRouter);
};

export default routes;
