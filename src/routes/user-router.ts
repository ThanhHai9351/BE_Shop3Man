import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

router.get("/me", (req: Request, res: Response) => {
  res.send("Hello");
});

export default router;
