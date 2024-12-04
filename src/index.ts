import express, { Application, Request, Response } from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cors from "cors"
import routes from "./routes"
import mongodbConnect from "./db/mongoDBConnect"
import {app,server} from "./socket/socket"
import redisClient from "./redis/connectRedis"
dotenv.config()

const port: string | number = process.env.PORT || 3001

app.get("/api/status", (req: Request, res: Response) => {
  return res.send("Port is active!")
})

app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ['*'],
    allowedHeaders: ['Content-Type'],
    credentials: true, 
  }),
)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
routes(app)

server.listen(port, () => {
  mongodbConnect();
  redisClient;
  console.log(`Server is running on port ${port}`)
})