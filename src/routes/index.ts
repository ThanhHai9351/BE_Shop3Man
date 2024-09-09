import { Application } from "express";
import UserRouter from "./user-router"; 
import CategoryRouter from './category-router';
import ImageRouter from './image-router'

const routes = (app: Application): void => {
  app.use("/api/user", UserRouter);
  app.use("/api/category", CategoryRouter);
  app.use("/api/image",ImageRouter);
};

export default routes;
