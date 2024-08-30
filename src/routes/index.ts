import { Application } from "express";
import UserRouter from "./user-router"; 
import CategoryRouter from './category-router';

const routes = (app: Application): void => {
  app.use("/api/user", UserRouter);
  app.use("/api/category", CategoryRouter);
};

export default routes;
