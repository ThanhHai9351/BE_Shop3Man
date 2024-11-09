import express, { Application, Request, Response } from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import cors from "cors"
import { createClient } from "redis"
import routes from "./routes"
dotenv.config()

const app: Application = express()
const port: string | number = process.env.PORT || 3001

const redisClient = createClient({
  password: process.env.REDIS_PW,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT as any,
  },
})

;(async () => {
  redisClient.on("error", (err) => {
    console.error("Redis client error!", err)
  })

  redisClient.on("ready", () => {
    console.log("Redis client started!")
  })

  await redisClient.connect().catch(console.error)

  await redisClient.ping()
})()

mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log("connect success")
  })
  .catch((err: Error) => {
    console.error(err)
  })

app.get("/api/status", (req: Request, res: Response) => {
  return res.send("Port is active!")
})

app.use(
  cors({
    origin: "http://localhost:3000", // Allow frontend origin
    credentials: true, // Allow cookies to be sent
  }),
)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
routes(app)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
