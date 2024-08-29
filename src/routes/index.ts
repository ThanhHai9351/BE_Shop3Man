import { Application } from "express";
import UserRouter from "./user-router"; 

const routes = (app: Application): void => {
  app.use("/api/user", UserRouter);
};

export default routes;
